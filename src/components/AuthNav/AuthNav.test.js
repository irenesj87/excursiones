import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import AuthNav from "./index";
import { logoutUser } from "../../services/authService";
import { logout } from "../../slicers/loginSlice";

// Mock del servicio de autenticación para evitar llamadas reales a la API
jest.mock("../../services/authService");

// Hacemos un type cast de la función importada para que el editor de código
// sepa que es un mock de Jest y reconozca los métodos como `.mockResolvedValue`.
const mockedLogoutUser = /** @type {jest.MockedFunction<typeof logoutUser>} */ (
	logoutUser
);

// Mock de los componentes hijos para aislar AuthNav en las pruebas.
// Esto nos permite centrarnos en la lógica de AuthNav sin depender de la implementación
// interna de AuthNavSkeleton.
jest.mock("./AuthNavSkeleton", () => () => (
	<div data-testid="auth-nav-skeleton" />
));

// Configuración de un store falso de Redux para los tests
const mockStore = configureStore([]);

/**
 * Suite de pruebas para el componente AuthNav.
 */
describe("AuthNav Component", () => {
	// Test para el estado de carga
	test("muestra el esqueleto de carga cuando la comprobación de autenticación no ha finalizado", () => {
		render(
			<AuthNav
				isAuthCheckComplete={false}
				isLoggedIn={false}
				onCloseOffcanvas={() => {}}
			/>
		);

		// Verificamos que el esqueleto se renderiza
		expect(screen.getByTestId("auth-nav-skeleton")).toBeInTheDocument();

		// Verificamos que los enlaces de invitado o de usuario no se muestran
		expect(
			screen.queryByRole("link", { name: /regístrate/i })
		).not.toBeInTheDocument();
		expect(
			screen.queryByRole("link", { name: /inicia sesión/i })
		).not.toBeInTheDocument();
		expect(screen.queryByTestId("user-profile")).not.toBeInTheDocument();
	});

	// Test para el estado de "invitado" (no logueado)
	test("muestra los enlaces 'Regístrate' e 'Inicia sesión' cuando el usuario no está logueado", () => {
		const handleClose = jest.fn();
		render(
			<BrowserRouter>
				<AuthNav
					isAuthCheckComplete={true}
					isLoggedIn={false}
					onCloseOffcanvas={handleClose}
				/>
			</BrowserRouter>
		);

		const registerLink = screen.getByRole("link", { name: /regístrate/i });
		const loginLink = screen.getByRole("link", { name: /inicia sesión/i });

		expect(registerLink).toBeInTheDocument();
		expect(loginLink).toBeInTheDocument();
		expect(registerLink).toHaveAttribute("href", "/registerPage");
		expect(loginLink).toHaveAttribute("href", "/loginPage");

		fireEvent.click(registerLink);
		expect(handleClose).toHaveBeenCalledTimes(1);
	});

	// Test para el estado de "usuario logueado"
	test("muestra los enlaces 'Tu perfil' y 'Cierra sesión' cuando el usuario está logueado", async () => {
		const handleClose = jest.fn();
		// Configuramos un estado de Redux que simula un usuario logueado
		const store = mockStore({
			loginReducer: {
				isLoggedIn: true,
				user: { name: "Test User" },
				token: "fake-token",
			},
		});

		// Mockeamos la implementación de logoutUser para que la prueba no falle
		mockedLogoutUser.mockResolvedValue(undefined);

		// Creamos un "espía" para verificar que se llama a sessionStorage.removeItem
		const removeItemSpy = jest.spyOn(Storage.prototype, "removeItem");

		render(
			<Provider store={store}>
				<BrowserRouter>
					<AuthNav
						isAuthCheckComplete={true}
						isLoggedIn={true}
						onCloseOffcanvas={handleClose}
					/>
				</BrowserRouter>
			</Provider>
		);

		// Verificamos que se muestran el enlace al perfil y el botón de cerrar sesión
		const profileLink = screen.getByRole("link", { name: /tu perfil/i });
		const logoutButton = screen.getByRole("button", { name: /cierra sesión/i });

		expect(profileLink).toBeInTheDocument();
		expect(logoutButton).toBeInTheDocument();
		expect(profileLink).toHaveAttribute("href", "/userPage");

		// Verificamos que los enlaces de invitado no se muestran
		expect(
			screen.queryByRole("link", { name: /regístrate/i })
		).not.toBeInTheDocument();
		expect(
			screen.queryByRole("link", { name: /inicia sesión/i })
		).not.toBeInTheDocument();

		// Simulamos un clic en el botón de cerrar sesión
		fireEvent.click(logoutButton);

		// Verificamos que se llamó al servicio de logout y se limpió la sesión
		await waitFor(() =>
			expect(mockedLogoutUser).toHaveBeenCalledWith("fake-token")
		);
		expect(store.getActions()).toContainEqual(logout());
		expect(removeItemSpy).toHaveBeenCalledWith("token");

		// Restauramos el espía para no afectar a otros tests
		removeItemSpy.mockRestore();
	});
});

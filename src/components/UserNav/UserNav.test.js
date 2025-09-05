import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import "@testing-library/jest-dom";
import UserNav from "./index";
import { logoutUser } from "../../services/authService";
import { logout } from "../../slices/loginSlice";

// Mock del servicio de autenticación
jest.mock("../../services/authService");
const mockedLogoutUser = /** @type {jest.MockedFunction<typeof logoutUser>} */ (
	logoutUser
);

// Mock de la función `configureStore` de `redux-mock-store` para crear un store simulado.
// Permite probar componentes conectados a Redux sin necesidad de un store real.
const mockStore = configureStore([]);

describe("UserNav Component", () => {
	let store;
	const handleClose = jest.fn();

	beforeEach(() => {
		// Limpiar mocks antes de cada test
		handleClose.mockClear();
		mockedLogoutUser.mockClear();

		// Configurar un estado de Redux que simula un usuario logueado
		store = mockStore({
			loginReducer: {
				isLoggedIn: true,
				user: { name: "Test User" },
				token: "fake-token",
			},
		});
		// Mockear el dispatch para poder espiarlo
		store.dispatch = jest.fn();
	});

	/**
	 * Prueba que el componente UserNav muestra correctamente los enlaces "Tu perfil" y "Cierra sesión" y que el clic en "Tu perfil"
	 * invoca `onCloseOffcanvas`.
	 */
	test("muestra los enlaces 'Tu perfil' y 'Cierra sesión' y maneja los clics", () => {
		render(
			<Provider store={store}>
				<BrowserRouter>
					<UserNav onCloseOffcanvas={handleClose} />
				</BrowserRouter>
			</Provider>
		);

		const profileLink = screen.getByRole("link", { name: /tu perfil/i });
		const logoutButton = screen.getByRole("button", { name: /cierra sesión/i });

		// Verificar que los elementos se renderizan
		expect(profileLink).toBeInTheDocument();
		expect(logoutButton).toBeInTheDocument();
		expect(profileLink).toHaveAttribute("href", "/userPage");

		// Simular clic en el enlace de perfil
		fireEvent.click(profileLink);
		expect(handleClose).toHaveBeenCalledTimes(1);
	});

	/**
	 * Prueba el flujo de cierre de sesión exitoso.
	 */
	test("maneja el cierre de sesión correctamente en caso de éxito", async () => {
		// Mockeamos la implementación de logoutUser para que resuelva correctamente
		mockedLogoutUser.mockResolvedValue(undefined);

		// Creamos un "espía" para verificar que se llama a sessionStorage.removeItem
		const removeItemSpy = jest.spyOn(Storage.prototype, "removeItem");

		render(
			<Provider store={store}>
				<BrowserRouter>
					<UserNav onCloseOffcanvas={handleClose} />
				</BrowserRouter>
			</Provider>
		);

		const logoutButton = screen.getByRole("button", { name: /cierra sesión/i });
		fireEvent.click(logoutButton);

		// Verificar que se llamó a la función para cerrar el offcanvas
		expect(handleClose).toHaveBeenCalledTimes(1);

		// Esperar a que se resuelvan las promesas
		await waitFor(() => {
			// Verificar que se llamó al servicio de logout con el token correcto
			expect(mockedLogoutUser).toHaveBeenCalledWith("fake-token");
		});

		// Verificar que se despachó la acción de logout y se limpió la sesión
		expect(store.dispatch).toHaveBeenCalledWith(logout());
		expect(removeItemSpy).toHaveBeenCalledWith("token");

		// Restaurar el espía
		removeItemSpy.mockRestore();
	});

	/**
	 * Prueba que el cierre de sesión se maneja correctamente incluso si la llamada al servicio `logoutUser` falla.
	 */
	test("maneja el cierre de sesión incluso si la llamada al servicio falla", async () => {
		// Mockeamos la implementación de logoutUser para que falle
		mockedLogoutUser.mockRejectedValue(new Error("Server error"));
		const removeItemSpy = jest.spyOn(Storage.prototype, "removeItem");
		// Silenciamos el console.error esperado
		const consoleErrorSpy = jest
			.spyOn(console, "error")
			.mockImplementation(() => {});

		render(
			<Provider store={store}>
				<BrowserRouter>
					<UserNav onCloseOffcanvas={handleClose} />
				</BrowserRouter>
			</Provider>
		);

		const logoutButton = screen.getByRole("button", { name: /cierra sesión/i });
		fireEvent.click(logoutButton);

		// Esperar a que se resuelvan las promesas
		await waitFor(() => {
			expect(mockedLogoutUser).toHaveBeenCalledWith("fake-token");
		});

		// AUNQUE FALLE, la lógica del cliente debe continuar
		expect(store.dispatch).toHaveBeenCalledWith(logout());
		expect(removeItemSpy).toHaveBeenCalledWith("token");

		// Restaurar espías
		removeItemSpy.mockRestore();
		consoleErrorSpy.mockRestore();
	});
});

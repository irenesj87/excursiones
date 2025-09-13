import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import "@testing-library/jest-dom";
import UserNav from "./UserNav";
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
	 * invoca `onCloseMenu`.
	 */
	test("muestra los enlaces 'Tu perfil' y 'Cierra sesión' y maneja los clics", () => {
		render(
			<Provider store={store}>
				<BrowserRouter>
					<UserNav onCloseMenu={handleClose} />
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
	 * Prueba que el flujo de cierre de sesión funciona correctamente.
	 * Verifica que al hacer clic en "Cierra sesión", se llama a `logoutUser`,
	 * y se despacha la acción de Redux.
	 */
	test("maneja el cierre de sesión correctamente", () => {
		render(
			<Provider store={store}>
				<BrowserRouter>
					<UserNav onCloseMenu={handleClose} />
				</BrowserRouter>
			</Provider>
		);

		const logoutButton = screen.getByRole("button", { name: /cierra sesión/i });
		fireEvent.click(logoutButton);

		// Se debe llamar a la función para cerrar el menú
		expect(handleClose).toHaveBeenCalledTimes(1);

		// Se debe llamar al servicio de logout (que ahora es síncrono y no toma argumentos)
		expect(mockedLogoutUser).toHaveBeenCalledTimes(1);

		// Se debe despachar la acción de logout
		expect(store.dispatch).toHaveBeenCalledWith(logout());
	});
});

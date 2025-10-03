import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import React from "react";
import { Provider } from "react-redux";
import { configureStore, createSlice } from "@reduxjs/toolkit";
import { jest } from "@jest/globals";
import AuthNav from "./AuthNav";
import UserNav from "../UserNav";
import GuestNav from "../GuestNav";
import { AuthContext } from "../../context/AuthContext";

// Mock de los componentes esqueleto y de navegación para aislar AuthNav en las pruebas.
jest.mock(
	"../UserNav/UserNavSkeleton",
	() =>
		function MockUserNavSkeleton() {
			return <div data-testid="user-nav-skeleton">Cargando usuario...</div>;
		}
);
jest.mock(
	"../GuestNav/GuestNavSkeleton",
	() =>
		function MockGuestNavSkeleton() {
			return <div data-testid="guest-nav-skeleton">Cargando invitado...</div>;
		}
);

// Mockeamos los componentes que se cargan con React.lazy como funciones de jest.
// Esto nos permite cambiar su comportamiento en cada test (ej. simular un renderizado exitoso o un error).
jest.mock("../UserNav");
jest.mock("../GuestNav");

// Creamos un slice de Redux simulado para los tests.
// Esto nos da un reducer simple y bien tipado para usar en nuestro store de prueba.
const mockLoginSlice = createSlice({
	name: "login",
	initialState: { login: false },
	reducers: {},
});
const loginReducer = mockLoginSlice.reducer;

/**
 * Función de utilidad para renderizar componentes que dependen de Redux y AuthContext.
 * @param {React.ReactElement} ui - El componente a renderizar.
 * @param {object} options - Opciones de configuración.
 * @param {{isAuthCheckComplete: boolean}} [options.authContextValue] - Valor para el AuthContext.
 * @param {object} [options.preloadedState] - Estado inicial para el store de Redux.
 * @returns {import("@testing-library/react").RenderResult} El resultado de la función `render` de Testing Library.
 */
const renderWithProviders = (
	ui,
	{
		authContextValue = { isAuthCheckComplete: true },
		preloadedState = { loginReducer: { login: false } },
		...renderOptions
	} = {}
) => {
	const store = configureStore({
		reducer: { loginReducer },
		preloadedState,
	});

	const Wrapper = ({ children }) => (
		<Provider store={store}>
			<AuthContext.Provider value={authContextValue}>
				{children}
			</AuthContext.Provider>
		</Provider>
	);

	return render(ui, { wrapper: Wrapper, ...renderOptions });
};

/**
 * Suite de pruebas para el componente AuthNav.
 */
describe("AuthNav Component", () => {
	const mockOnClose = jest.fn();

	beforeEach(() => {
		// Limpiamos los mocks antes de cada test para asegurar un estado limpio.
		/** @type {jest.Mock} */
		(UserNav).mockClear();
		/** @type {jest.Mock} */
		(GuestNav).mockClear();
		// Proporcionamos una implementación por defecto para los componentes lazy y ErrorBoundary.
		/** @type {jest.Mock} */
		(UserNav).mockImplementation(({ onCloseMenu }) => (
			<button type="button" data-testid="user-nav" onClick={onCloseMenu} />
		));
		/** @type {jest.Mock} */ (GuestNav).mockImplementation(
			({ onCloseMenu }) => (
				<button type="button" data-testid="guest-nav" onClick={onCloseMenu} />
			)
		);
		mockOnClose.mockClear();
	});

	// Tests para el estado de carga (cuando isAuthCheckComplete es false)
	describe("cuando la comprobación de autenticación no ha finalizado", () => {
		let getItemSpy;

		beforeEach(() => {
			// Mockeamos sessionStorage para controlar el estado "likelyLoggedIn"
			getItemSpy = jest.spyOn(Storage.prototype, "getItem");
		});

		afterEach(() => {
			getItemSpy.mockRestore();
		});

		test("muestra GuestNavSkeleton si no hay token en sessionStorage", () => {
			getItemSpy.mockReturnValue(null);
			renderWithProviders(<AuthNav onCloseMenu={mockOnClose} />, {
				authContextValue: { isAuthCheckComplete: false },
			});

			// Verificamos que se renderiza el esqueleto de invitado
			expect(screen.getByTestId("guest-nav-skeleton")).toBeInTheDocument();
			expect(screen.queryByTestId("user-nav-skeleton")).not.toBeInTheDocument();
		});

		test("muestra UserNavSkeleton si hay un token en sessionStorage", () => {
			getItemSpy.mockReturnValue("fake-token");
			renderWithProviders(<AuthNav onCloseMenu={mockOnClose} />, {
				authContextValue: { isAuthCheckComplete: false },
			});

			// Verificamos que se renderiza el esqueleto de usuario
			expect(screen.getByTestId("user-nav-skeleton")).toBeInTheDocument();
			expect(
				screen.queryByTestId("guest-nav-skeleton")
			).not.toBeInTheDocument();
		});
	});

	// Test para el estado de "invitado" (no logueado)
	test("muestra GuestNav cuando el usuario no está logueado", async () => {
		renderWithProviders(<AuthNav onCloseMenu={mockOnClose} />, {
			authContextValue: { isAuthCheckComplete: true },
			preloadedState: { loginReducer: { login: false } },
		});

		// Verificamos que se renderiza el fallback de Suspense inicialmente.
		expect(screen.getByTestId("guest-nav-skeleton")).toBeInTheDocument();

		// Esperamos a que el componente lazy GuestNav se cargue y renderice.
		const guestNav = await screen.findByTestId("guest-nav");
		expect(guestNav).toBeInTheDocument();

		// Una vez cargado, el esqueleto ya no debería estar.
		expect(screen.queryByTestId("guest-nav-skeleton")).not.toBeInTheDocument();

		// Verificamos que los componentes de usuario no se renderizan.
		expect(screen.queryByTestId("user-nav")).not.toBeInTheDocument();
		expect(screen.queryByTestId("user-nav-skeleton")).not.toBeInTheDocument();
	});

	// Test para el estado de "usuario logueado"
	test("muestra UserNav cuando el usuario está logueado", async () => {
		renderWithProviders(<AuthNav onCloseMenu={mockOnClose} />, {
			authContextValue: { isAuthCheckComplete: true },
			preloadedState: { loginReducer: { login: true } },
		});

		// Verificamos que se renderiza el fallback de Suspense inicialmente.
		expect(screen.getByTestId("user-nav-skeleton")).toBeInTheDocument();

		// Esperamos a que el componente lazy UserNav se cargue y renderice.
		const userNav = await screen.findByTestId("user-nav");
		expect(userNav).toBeInTheDocument();

		// Una vez cargado, el esqueleto ya no debería estar.
		expect(screen.queryByTestId("user-nav-skeleton")).not.toBeInTheDocument();

		// Verificamos que los componentes de invitado no se renderizan.
		expect(screen.queryByTestId("guest-nav")).not.toBeInTheDocument();
		expect(screen.queryByTestId("guest-nav-skeleton")).not.toBeInTheDocument();
	});

	// Tests para el ErrorBoundary
	describe("cuando la carga del componente dinámico falla", () => {
		let consoleErrorSpy;

		beforeEach(() => {
			// Silenciamos el console.error que React y nuestro ErrorBoundary generan,
			// ya que es un comportamiento esperado en este test.
			consoleErrorSpy = jest
				.spyOn(console, "error")
				.mockImplementation(() => {});
		});

		afterEach(() => {
			consoleErrorSpy.mockRestore();
		});

		test("muestra el fallback del ErrorBoundary en lugar de romper la app", async () => {
			// Forzamos que el componente UserNav falle al renderizar.
			/** @type {jest.Mock} */
			(UserNav).mockImplementation(() => {
				throw new Error("Simulated network error");
			});

			renderWithProviders(<AuthNav />, {
				authContextValue: { isAuthCheckComplete: true },
				preloadedState: { loginReducer: { login: true } },
			});

			// El ErrorBoundary debería capturar el error y renderizar su fallback (GuestNavSkeleton).
			expect(
				await screen.findByTestId("guest-nav-skeleton")
			).toBeInTheDocument();
			expect(screen.queryByTestId("user-nav")).not.toBeInTheDocument();
		});
	});
});

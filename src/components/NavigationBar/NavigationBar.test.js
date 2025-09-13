import {
	render,
	screen,
	fireEvent,
	waitForElementToBeRemoved,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import NavigationBar from "./NavigationBar";
import themeSliceReducer from "../../slices/themeSlice";
import loginSliceReducer from "../../slices/loginSlice";
import filterSliceReducer from "../../slices/filterSlice";

/**
 * Función de ayuda para renderizar componentes que dependen de Redux y React Router.
 * Crea un store de Redux de prueba y envuelve el componente en Provider y MemoryRouter.
 * @param {React.ReactElement} ui - El componente a renderizar.
 * @param {object} [options] - Opciones adicionales.
 * @param {object} [options.preloadedState] - Estado inicial para el store de Redux.
 * @param {string} [options.route='/'] - Ruta inicial para MemoryRouter.
 * @param {import('@reduxjs/toolkit').Store} [options.store] - Instancia de store de Redux para usar. Si no se proporciona, se crea una nueva.
 * @returns El resultado de la función `render` de Testing Library.
 */
const renderWithProviders = (
	ui,
	{
		preloadedState = {},
		route = "/",
		store, // Se elimina el valor por defecto complejo para que el tipado funcione correctamente.
		...renderOptions
	} = {}
) => {
	// Si no se proporciona un 'store' en las opciones, se crea uno por defecto.
	// Esto permite pasar un 'store' personalizado para tests específicos.
	const storeToUse =
		store ||
		configureStore({
			reducer: combineReducers({
				loginReducer: loginSliceReducer,
				filterReducer: filterSliceReducer,
				themeReducer: themeSliceReducer,
			}),
			preloadedState,
		});

	return render(ui, {
		wrapper: ({ children }) => (
			<Provider store={storeToUse}>
				<MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
			</Provider>
		),
		...renderOptions,
	});
};

/**
 * Grupo de tests para el componente NavigationBar.
 */
describe("NavigationBar Component", () => {
	// Mock de las props de NavigationBar, ya que no son relevantes para estos tests específicos
	// pero el componente las requiere.
	const mockNavigationBarProps = {
		onFetchSuccess: () => {},
		isAuthCheckComplete: true,
		onExcursionsFetchStart: () => {},
		onExcursionsFetchEnd: () => {},
	};

	/**
	 * Test para verificar que el tema se alterna correctamente de claro a oscuro y viceversa.
	 */
	test("pasa el tema de claro a oscuro y de oscuro a claro", () => {
		// Estado inicial: modo claro
		const initialThemeState = {
			themeReducer: { mode: "light" }, // Estado para el tema
			loginReducer: { login: false, user: null, token: null }, // Estado completo para loginReducer
			filterReducer: { area: [], difficulty: [], time: [] }, // Estado completo para filterReducer
		};
		const store = configureStore({
			reducer: combineReducers({
				loginReducer: loginSliceReducer,
				filterReducer: filterSliceReducer,
				themeReducer: themeSliceReducer,
			}),
			preloadedState: initialThemeState,
		});

		renderWithProviders(<NavigationBar {...mockNavigationBarProps} />, {
			store,
		});

		// Verifica el estado inicial: modo claro, icono de luna visible
		const themeToggleButton = screen.getByLabelText(/activa el modo oscuro/i);
		expect(themeToggleButton).toBeInTheDocument();
		expect(screen.getByTestId("fa-moon-icon")).toBeInTheDocument();

		// Haz clic para cambiar a modo oscuro
		fireEvent.click(themeToggleButton);

		// Verifica el estado después del clic: modo oscuro, icono de sol visible
		expect(screen.getByLabelText(/activa el modo claro/i)).toBeInTheDocument();
		expect(screen.getByTestId("fa-sun-icon")).toBeInTheDocument();
		expect(store.getState().themeReducer.mode).toBe("dark");

		// Haz clic para cambiar de nuevo a modo claro
		fireEvent.click(screen.getByLabelText(/activa el modo claro/i));

		// Verifica el estado después del segundo clic: modo claro, icono de luna visible
		expect(screen.getByLabelText(/activa el modo oscuro/i)).toBeInTheDocument();
		expect(screen.getByTestId("fa-moon-icon")).toBeInTheDocument();
		expect(store.getState().themeReducer.mode).toBe("light");
	});

	/**
	 * Test para verificar que el menú Offcanvas se abre y se cierra correctamente.
	 */
	test("abre y cierra el menú Offcanvas", async () => {
		const store = configureStore({
			reducer: combineReducers({
				loginReducer: loginSliceReducer,
				filterReducer: filterSliceReducer,
				themeReducer: themeSliceReducer,
			}),
			preloadedState: {
				themeReducer: { mode: "light" }, // Estado para el tema
				loginReducer: { login: false, user: null, token: null }, // Estado completo para loginReducer
				filterReducer: { area: [], difficulty: [], time: [] }, // Estado completo para filterReducer
			},
		});

		renderWithProviders(<NavigationBar {...mockNavigationBarProps} />, {
			store,
		});

		// El Offcanvas debería estar inicialmente cerrado y no presente en el DOM.
		// Usamos queryByRole porque esperamos que no encuentre el elemento.
		const offcanvasMenu = screen.queryByRole("dialog", { name: /menú/i });
		// La aserción correcta es verificar que no está en el documento, ya que .toBeVisible() no puede usarse en un elemento nulo.
		expect(offcanvasMenu).not.toBeInTheDocument();

		// Haz clic en el botón de alternar la barra de navegación para abrir el Offcanvas
		const navbarToggleButton = screen.getByLabelText(
			/abrir menú de navegación/i
		);
		fireEvent.click(navbarToggleButton);

		// El Offcanvas debería estar abierto ahora
		const openedOffcanvasMenu = await screen.findByRole("dialog", {
			name: /menú/i,
		});
		expect(openedOffcanvasMenu).toBeVisible();

		// Haz clic en el botón de cerrar dentro del Offcanvas
		const closeButton = screen.getByLabelText(/cerrar menú/i);
		fireEvent.click(closeButton);

		// El Offcanvas debería estar cerrado de nuevo
		// Se espera a que el Offcanvas sea eliminado del DOM, ya que tiene una animación de cierre.
		await waitForElementToBeRemoved(openedOffcanvasMenu);
	});
});

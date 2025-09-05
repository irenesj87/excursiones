import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import App from "./App";
import loginSliceReducer from "./slices/loginSlice";
import filterSliceReducer from "./slices/filterSlice";
import themeSliceReducer from "./slices/themeSlice";

/**
 * Función de ayuda para renderizar componentes que dependen de Redux y React Router.
 * Crea un store de Redux de prueba y envuelve el componente en Provider y MemoryRouter.
 * @param {React.ReactElement} ui - El componente a renderizar.
 * @param {object} [options] - Opciones adicionales.
 * @param {object} [options.preloadedState] - Estado inicial para el store de Redux.
 * @param {string} [options.route='/'] - Ruta inicial para MemoryRouter.
 * @returns El resultado de la función `render` de Testing Library.
 */
const renderWithProviders = (
	ui,
	{ preloadedState = {}, route = "/", ...renderOptions } = {}
) => {
	// Crea el reducer raíz combinando los reducers de los slices,
	// igual que se haría en el store principal de la aplicación.
	const rootReducer = combineReducers({
		loginReducer: loginSliceReducer,
		filterReducer: filterSliceReducer,
		themeReducer: themeSliceReducer,
	});

	const store = configureStore({
		reducer: rootReducer,
		preloadedState,
	});
	return render(ui, {
		wrapper: ({ children }) => (
			<Provider store={store}>
				<MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
			</Provider>
		),
		...renderOptions,
	});
};

test("renders main title", () => {
	renderWithProviders(<App />);
	const titleElement = screen.getByText(/Próximas excursiones/i);
	expect(titleElement).toBeInTheDocument();
});

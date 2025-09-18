import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import Filters from "./Filters";
import { clearAllFilters } from "../../slices/filterSlice";

// 1. Mock del componente hijo para aislar la lógica de Filters.
// Esto nos permite verificar que Filters renderiza las secciones correctas
// sin depender de la implementación interna de FiltersList.
jest.mock("../FiltersList", () => ({ filterName }) => (
	<div data-testid={`filters-list-${filterName}`}>{filterName}</div>
));

// 2. Configuración del mock store de Redux.
const mockStore = configureStore([]);

/**
 * Suite de pruebas para el componente Filters.
 */
describe("Filters Component", () => {
	let store;

	// Función de ayuda para renderizar el componente con un store de Redux simulado.
	const renderComponent = (props, initialState) => {
		store = mockStore(initialState);
		// Creamos un espía (spy) en el dispatch para verificar qué acciones se llaman.
		store.dispatch = jest.fn();
		return render(
			<Provider store={store}>
				<Filters {...props} />
			</Provider>
		);
	};

	const initialStateWithoutFilters = {
		filterReducer: { area: [], difficulty: [], time: [] },
	};

	const initialStateWithFilters = {
		filterReducer: { area: ["Centro"], difficulty: [], time: [] },
	};

	test("renderiza correctamente con el título y las secciones de filtros por defecto", () => {
		renderComponent({}, initialStateWithoutFilters);

		// Verifica el título principal (visible en escritorio por defecto)
		expect(
			screen.getByRole("heading", { name: /filtros/i, level: 2 })
		).toBeInTheDocument();

		// Verifica los títulos de las secciones
		expect(
			screen.getByRole("heading", { name: /zona/i, level: 3 })
		).toBeInTheDocument();
		expect(
			screen.getByRole("heading", { name: /dificultad/i, level: 3 })
		).toBeInTheDocument();
		expect(
			screen.getByRole("heading", { name: /tiempo estimado/i, level: 3 })
		).toBeInTheDocument();

		// Verifica que se renderiza una lista de filtros para cada sección (usando el mock)
		expect(screen.getByTestId("filters-list-area")).toBeInTheDocument();
		expect(screen.getByTestId("filters-list-difficulty")).toBeInTheDocument();
		expect(screen.getByTestId("filters-list-time")).toBeInTheDocument();
	});

	test("no renderiza el título principal cuando la prop showTitle es false", () => {
		renderComponent({ showTitle: false }, initialStateWithoutFilters);

		// El título principal no debe estar en el documento
		expect(
			screen.queryByRole("heading", { name: /filtros/i, level: 2 })
		).not.toBeInTheDocument();

		// Las secciones de filtros sí deben estar
		expect(
			screen.getByRole("heading", { name: /zona/i, level: 3 })
		).toBeInTheDocument();
	});

	describe("Botón 'Limpiar Filtros'", () => {
		test("está deshabilitado cuando no hay filtros activos", () => {
			renderComponent({}, initialStateWithoutFilters);
			const clearButton = screen.getByRole("button", {
				name: /limpiar todos los filtros/i,
			});
			expect(clearButton).toHaveAttribute("aria-disabled", "true");
		});

		test("está habilitado cuando hay al menos un filtro activo", () => {
			renderComponent({}, initialStateWithFilters);
			const clearButton = screen.getByRole("button", {
				name: /limpiar todos los filtros/i,
			});
			expect(clearButton).toHaveAttribute("aria-disabled", "false");
		});

		test("despacha la acción clearAllFilters al hacer clic cuando está habilitado", () => {
			renderComponent({}, initialStateWithFilters);
			const clearButton = screen.getByRole("button", {
				name: /limpiar todos los filtros/i,
			});
			fireEvent.click(clearButton);
			expect(store.dispatch).toHaveBeenCalledTimes(1);
			expect(store.dispatch).toHaveBeenCalledWith(clearAllFilters());
		});

		test("no despacha la acción clearAllFilters al hacer clic cuando está deshabilitado", () => {
			renderComponent({}, initialStateWithoutFilters);
			const clearButton = screen.getByRole("button", {
				name: /limpiar todos los filtros/i,
			});
			fireEvent.click(clearButton);
			expect(store.dispatch).not.toHaveBeenCalled();
		});
	});
});

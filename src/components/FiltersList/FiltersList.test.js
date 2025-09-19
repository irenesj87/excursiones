import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import FiltersList from "./FilterList";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import * as useFiltersHook from "../../hooks/useFilters";

// 1. Mock de los componentes hijos para aislar la lógica de FiltersList.
/**
 * Mock del componente FiltersListCheckbox.
 * @param {object} props - Las propiedades del componente.
 * @param {string} props.filterName - El nombre del filtro.
 * @param {string} props.filter - El valor del filtro.
 * @returns {JSX.Element} Un div de prueba.
 */
jest.mock("../FiltersListCheckbox/FilterListCheckbox", () => {
	const MockFiltersListCheckbox = ({ filterName, filter }) => (
		<div data-testid="filters-list-checkbox">{`${filterName}: ${filter}`}</div>
	);
	return MockFiltersListCheckbox;
});

/**
 * Mock del componente FilterPillSkeleton.
 * @returns {JSX.Element} Un div de prueba.
 */
jest.mock("./FilterPillSkeleton", () => {
	const MockFilterPillSkeleton = () => (
		<div data-testid="filter-pill-skeleton" />
	);
	MockFilterPillSkeleton.displayName = "MockFilterPillSkeleton";
	return MockFilterPillSkeleton;
});

/**
 * Mock del componente FilterError.
 * @param {object} props - Las propiedades del componente.
 * @param {Error} props.error - El objeto de error.
 * @returns {JSX.Element} Un div de prueba con el mensaje de error.
 */
jest.mock("../FilterError", () => {
	const MockFilterError = ({ error }) => (
		<div data-testid="filter-error">{error.message}</div>
	);
	MockFilterError.displayName = "MockFilterError";
	return MockFilterError;
});

// 2. Mock del hook `useSkeletonTheme` ya que su lógica no es relevante para este test.
/**
 * Mock del hook useSkeletonTheme.
 * @returns {object} Un objeto con propiedades de tema de esqueleto.
 */
jest.mock("../../hooks/useSkeletonTheme", () => ({
	useSkeletonTheme: () => ({
		baseColor: "#e0e0e0",
		highlightColor: "#f5f5f5",
	}),
}));

const mockStore = configureStore([]);

/**
 * Suite de pruebas para el componente FiltersList.
 */
describe("FiltersList Component", () => {
	let useFiltersSpy;

	// Antes de cada test, creamos un "espía" en el hook `useFilters` para controlar su retorno.
	beforeEach(() => {
		useFiltersSpy = jest.spyOn(useFiltersHook, "useFilters");
	});

	// Después de cada test, restauramos el hook a su implementación original.
	afterEach(() => {
		jest.restoreAllMocks();
	});

	/**
	 * Prueba que el componente muestra los esqueletos de carga cuando `isLoading` es `true`.
	 */
	test("muestra los esqueletos de carga cuando isLoading es true", () => {
		// Simulamos el estado de carga del hook.
		useFiltersSpy.mockReturnValue({
			data: [],
			isLoading: true,
			error: null,
		});

		render(<FiltersList filterName="area" />);

		// Verificamos el mensaje de carga para lectores de pantalla.
		expect(screen.getByText("Cargando filtros de area...")).toBeInTheDocument();
		// Verificamos que se renderizan los 4 esqueletos.
		const skeletons = screen.getAllByTestId("filter-pill-skeleton");
		expect(skeletons).toHaveLength(4);

		// Nos aseguramos de que no se rendericen otros estados.
		expect(
			screen.queryByTestId("filters-list-checkbox")
		).not.toBeInTheDocument();
		expect(screen.queryByTestId("filter-error")).not.toBeInTheDocument();
	});

	/**
	 * Prueba que el componente muestra el mensaje de error cuando la carga de filtros falla.
	 */
	test("muestra el componente de error cuando la carga falla", () => {
		const mockError = new Error("Fallo al cargar los filtros");
		// Simulamos un estado de error.
		useFiltersSpy.mockReturnValue({
			data: [],
			isLoading: false,
			error: mockError,
		});

		render(<FiltersList filterName="difficulty" />);

		// Verificamos que el componente de error se muestra con el mensaje correcto.
		const errorComponent = screen.getByTestId("filter-error");
		expect(errorComponent).toBeInTheDocument();
		expect(errorComponent).toHaveTextContent("Fallo al cargar los filtros");
	});

	/**
	 * Prueba que el componente muestra la lista de filtros cuando la carga es exitosa.
	 */
	test("muestra la lista de filtros cuando la carga es exitosa", () => {
		const mockFilters = ["Centro", "Este", "Oeste"];
		// Simulamos un estado de éxito con datos.
		useFiltersSpy.mockReturnValue({
			data: mockFilters,
			isLoading: false,
			error: null,
		});

		const store = mockStore({
			filterReducer: {
				area: [],
				difficulty: [],
				time: [],
			},
		});

		render(
			<Provider store={store}>
				<FiltersList filterName="area" />
			</Provider>
		);

		// Verificamos que se renderiza el número correcto de filtros.
		const filterItems = screen.getAllByTestId("filters-list-checkbox");
		expect(filterItems).toHaveLength(3);

		// Verificamos que las props se pasan correctamente a los hijos.
		expect(screen.getByText("area: Centro")).toBeInTheDocument();
		expect(screen.getByText("area: Este")).toBeInTheDocument();
		expect(screen.getByText("area: Oeste")).toBeInTheDocument();
	});

	/**
	 * Prueba que el componente muestra una lista vacía si no hay filtros para mostrar.
	 */
	test("muestra una lista vacía si no hay filtros para mostrar", () => {
		// Simulamos un estado de éxito con un array vacío.
		useFiltersSpy.mockReturnValue({
			data: [],
			isLoading: false,
			error: null,
		});

		render(<FiltersList filterName="time" />);

		// La lista (ul) debe existir pero estar vacía.
		const list = screen.getByRole("list");
		expect(list).toBeInTheDocument();
		expect(list).toBeEmptyDOMElement();
	});
});

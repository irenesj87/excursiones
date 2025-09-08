import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import FiltersListCheckbox from "./index";
import { toggleFilter } from "../../slices/filterSlice";
import styles from "./FiltersListCheckbox.module.css";

// 1. Configuración del mock store de Redux
const mockStore = configureStore([]);

/**
 * Suite de pruebas para el componente FiltersListCheckbox.
 */
describe("FiltersListCheckbox Component", () => {
	let store;
	const mockFilterName = "area";
	const mockFilterValue = "Centro";

	// 2. Función de ayuda para renderizar el componente con un estado de Redux específico
	const renderWithProvider = (initialState) => {
		store = mockStore(initialState);
		// Hacemos un mock del dispatch para poder verificar si se llama
		store.dispatch = jest.fn();

		return render(
			<Provider store={store}>
				<FiltersListCheckbox
					filterName={mockFilterName}
					filter={mockFilterValue}
				/>
			</Provider>
		);
	};

	test("debe renderizarse como no seleccionado si el filtro no está en el estado de Redux", () => {
		// Estado inicial: el filtro 'Centro' no está seleccionado en 'area'
		const initialState = {
			filterReducer: { area: [], difficulty: [], time: [] },
		};
		renderWithProvider(initialState);

		// Buscamos el input por su rol y nombre accesible (el texto de la etiqueta)
		const checkbox = screen.getByRole("checkbox", { name: mockFilterValue });
		const label = screen.getByText(mockFilterValue);

		expect(checkbox).not.toBeChecked();
		expect(label).not.toHaveClass(styles.checked);
	});

	test("debe renderizarse como seleccionado si el filtro está en el estado de Redux", () => {
		// Estado inicial: el filtro 'Centro' SÍ está seleccionado en 'area'
		const initialState = {
			filterReducer: { area: [mockFilterValue], difficulty: [], time: [] },
		};
		renderWithProvider(initialState);

		const checkbox = screen.getByRole("checkbox", { name: mockFilterValue });
		const label = screen.getByText(mockFilterValue);

		expect(checkbox).toBeChecked();
		expect(label).toHaveClass(styles.checked);
	});

	test("debe despachar la acción toggleFilter con el payload correcto al hacer clic", () => {
		const initialState = {
			filterReducer: { area: [], difficulty: [], time: [] },
		};
		renderWithProvider(initialState);

		// El usuario interactúa con la etiqueta, que está asociada al checkbox
		const label = screen.getByText(mockFilterValue);
		fireEvent.click(label);

		// Verificamos que la acción correcta fue despachada al store
		expect(store.dispatch).toHaveBeenCalledTimes(1);
		expect(store.dispatch).toHaveBeenCalledWith(
			toggleFilter({ filterType: mockFilterName, value: mockFilterValue })
		);
	});

	test("debe generar un ID de input y un htmlFor de etiqueta correctos", () => {
		const filterWithSpaces = "Picos de Europa";
		const initialState = {
			filterReducer: { area: [], difficulty: [], time: [] },
		};
		renderWithProvider(initialState);

		// Renderizamos un segundo componente con un valor de filtro diferente para el test
		render(
			<Provider store={store}>
				<FiltersListCheckbox filterName="area" filter={filterWithSpaces} />
			</Provider>
		);

		const checkbox = screen.getByRole("checkbox", { name: filterWithSpaces });
		const label = screen.getByText(filterWithSpaces);

		// El ID debe ser el mismo que el atributo 'for' de la etiqueta, y los espacios deben ser reemplazados
		const expectedId = "filter-area-Picos-de-Europa";
		expect(checkbox).toHaveAttribute("id", expectedId);
		expect(label).toHaveAttribute("for", expectedId);
	});
});

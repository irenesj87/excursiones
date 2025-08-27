import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import SearchBar from "./index";
import { searchExcursions } from "../../services/excursionService";

// 1. Mock del servicio de búsqueda
// Le decimos a Jest que reemplace el módulo real con nuestra versión mock.
jest.mock("../../services/excursionService");

// Hacemos un type cast de la función importada para que el editor de código (y TypeScript)
// sepa que es un mock de Jest y reconozca los métodos como `.mockResolvedValue`.
const mockedSearchExcursions =
	/** @type {jest.MockedFunction<typeof searchExcursions>} */ (
		searchExcursions
	);

// 2. Configuración del mock de Redux
// Creamos una función para configurar un store falso para nuestros tests.
const mockStore = configureStore([]);

describe("SearchBar Component", () => {
	let store;
	// Props mockeadas que pasaremos al componente
	const mockProps = {
		onFetchSuccess: jest.fn(),
		onFetchStart: jest.fn(),
		onFetchEnd: jest.fn(),
		id: "test-search-bar",
		searchValue: "",
		onSearchChange: jest.fn(),
	};

	// Antes de cada test, reiniciamos el store y los mocks
	beforeEach(() => {
		store = mockStore({
			filterReducer: {
				area: "",
				difficulty: "",
				time: "",
			},
		});
		// Limpiamos el historial de llamadas de las funciones mock
		jest.clearAllMocks();
	});

	// Test 1: Renderizado inicial
	test("renderiza correctamente y el botón de limpiar no está visible", () => {
		render(
			<Provider store={store}>
				<SearchBar {...mockProps} />
			</Provider>
		);

		// El input de búsqueda debe estar en el documento
		expect(
			screen.getByPlaceholderText("Busca excursiones...")
		).toBeInTheDocument();

		// El botón de limpiar no debe ser visible si no hay texto
		expect(
			screen.queryByRole("button", { name: /limpiar búsqueda/i })
		).toBeNull();
	});

	// Test 2: Interacción del usuario al escribir
	test("muestra el botón de limpieza cuando la prop searchValue no está vacía", () => {
		render(
			<Provider store={store}>
				<SearchBar {...mockProps} searchValue="Picos" />
			</Provider>
		);

		const input = screen.getByPlaceholderText("Busca excursiones...");

		// El valor del input debe ser el que le pasamos por props
		expect(input).toHaveValue("Picos");

		// El botón de limpiar ahora sí debe ser visible
		expect(
			screen.getByRole("button", { name: /limpiar búsqueda/i })
		).toBeInTheDocument();
	});

	// Test 3: Limpiar la búsqueda
	test("limpia el campo de búsqueda y se centra and en el click del botón de limpieza", () => {
		// Renderizamos con un valor inicial para que el botón de limpiar aparezca
		render(
			<Provider store={store}>
				<SearchBar {...mockProps} searchValue="Picos" />
			</Provider>
		);

		const clearButton = screen.getByRole("button", {
			name: /limpiar búsqueda/i,
		});
		fireEvent.click(clearButton);

		// Verificamos que se llamó a la función para cambiar el valor a ""
		expect(mockProps.onSearchChange).toHaveBeenCalledWith("");

		// Verificamos que el input recibe el foco después de limpiarse
		const input = screen.getByPlaceholderText("Busca excursiones...");
		expect(input).toHaveFocus();
	});

	// Test 4: Debouncing y llamada a la API (caso de éxito)
	test("hace un debounce del input y hace un fetch exitoso a la API de excursiones", async () => {
		// Usamos timers falsos para controlar el setTimeout del debounce
		jest.useFakeTimers();

		const mockExcursions = [{ id: 1, name: "Excursión a Picos" }];
		// Configuramos el mock del servicio para que retorne un resultado exitoso
		mockedSearchExcursions.mockResolvedValue(mockExcursions);

		render(
			<Provider store={store}>
				<SearchBar {...mockProps} searchValue="Picos" />
			</Provider>
		);

		// Avanzamos el tiempo para que se ejecute el debounce (500ms en el componente)
		jest.advanceTimersByTime(500);

		// Esperamos a que la llamada a la API se haya realizado.
		// Esta es la aserción clave que necesita la espera para cumplir la regla
		// `testing-library/no-wait-for-multiple-assertions`.
		await waitFor(() => {
			// Verificamos que el servicio fue llamado con los argumentos correctos
			expect(mockedSearchExcursions).toHaveBeenCalledWith("Picos", "", "", "");
		});

		// Una vez que la llamada a la API ha ocurrido, las otras llamadas a las props
		// deberían haber ocurrido de forma síncrona dentro del mismo ciclo de eventos.
		expect(mockProps.onFetchStart).toHaveBeenCalledTimes(1);
		expect(mockProps.onFetchSuccess).toHaveBeenCalledWith(mockExcursions);
		expect(mockProps.onFetchEnd).toHaveBeenCalledWith(null);

		// Restauramos los timers reales
		jest.useRealTimers();
	});

	// Test 5: Manejo de errores de la API
	test("maneja los errores de la API", async () => {
		jest.useFakeTimers();
		// Creamos un "espía" para console.error y lo reemplazamos con una función
		// que no hace nada. Esto evita que el error esperado se imprima en la
		// consola durante la ejecución del test, manteniendo la salida limpia.
		const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

		const errorMessage = "Network Error";
		const mockError = new Error(errorMessage);
		// Configuramos el mock del servicio para que lance un error
		mockedSearchExcursions.mockRejectedValue(mockError);

		render(
			<Provider store={store}>
				<SearchBar {...mockProps} searchValue="Error" />
			</Provider>
		);

		jest.advanceTimersByTime(500);

		// Esperamos a que la llamada a la API se haya realizado.
		await waitFor(() => {
			expect(mockedSearchExcursions).toHaveBeenCalledWith("Error", "", "", "");
		});

		// Verificamos que el resto de las funciones se llamaron correctamente.
		expect(mockProps.onFetchStart).toHaveBeenCalledTimes(1);
		expect(mockProps.onFetchSuccess).toHaveBeenCalledWith([]);
		expect(mockProps.onFetchEnd).toHaveBeenCalledWith(expect.any(Error));
		expect(mockProps.onFetchEnd.mock.calls[0][0].message).toBe(errorMessage);

		// Restauramos la implementación original de console.error para no afectar a otros tests.
		consoleErrorSpy.mockRestore();
		jest.useRealTimers();
	});
});

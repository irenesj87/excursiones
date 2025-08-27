import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import Excursions from "./index";
import { joinExcursion as joinExcursionService } from "../../services/excursionService";
import { updateUser } from "../../slicers/loginSlice";

// 1. Mock del servicio para unirse a una excursión
jest.mock("../../services/excursionService");
const mockedJoinExcursionService =
	/** @type {jest.MockedFunction<typeof joinExcursionService>} */ (
		joinExcursionService
	);

// 2. Mock del componente hijo ExcursionCard
// Esto nos permite aislar el test al componente Excursions y simular
// interacciones que ocurren en el hijo, como hacer clic en "Apuntarse".
jest.mock("../ExcursionCard", () => ({
	__esModule: true,
	default: ({ name, onJoin, id }) => (
		<div>
			<h3>{name}</h3>
			<button type="button" onClick={() => onJoin(id)}>
				Apuntarse
			</button>
		</div>
	),
}));

// 3. Configuración del mock de Redux
const mockStore = configureStore([]);

describe("Excursions Component", () => {
	let store;
	const mockExcursionData = [
		{ id: "1", name: "Ruta del Cares" },
		{ id: "2", name: "Picos de Europa" },
	];
	const mockUser = {
		mail: "test@example.com",
		name: "Test User",
		excursions: [],
	};
	const mockToken = "fake-token";

	// Función para renderizar el componente con un store y props específicas
	const renderComponent = (props, initialState) => {
		store = mockStore(initialState);
		// Hacemos un mock del dispatch para poder verificar si se llama
		store.dispatch = jest.fn();
		return render(
			<Provider store={store}>
				<Excursions {...props} />
			</Provider>
		);
	};

	// Test 1: Estado de carga (loading)
	test("renderiza los skeletons cuando isLoading es true", () => {
		renderComponent(
			{ isLoading: true, excursionData: [], error: null },
			{
				loginReducer: { login: false, user: null, token: null },
				themeReducer: { mode: "light" },
			}
		);

		// Buscamos el texto accesible que anuncia la carga
		expect(screen.getByText("Cargando excursiones...")).toBeInTheDocument();
	});

	// Test 2: Estado de error
	test("renderiza un mensaje de error cuando se le da un error", () => {
		const mockError = new Error("Fallo al cargar");
		renderComponent(
			{ isLoading: false, excursionData: [], error: mockError },
			{
				loginReducer: { login: false, user: null, token: null },
				themeReducer: { mode: "light" },
			}
		);

		// El componente de error debe tener un rol 'alert' por accesibilidad
		expect(screen.getByRole("alert")).toBeInTheDocument();
		expect(screen.getByText("Fallo al cargar")).toBeInTheDocument();
	});

	// Test 3: Estado sin resultados
	test("renderiza el mensaje 'no se encontraron excursiones con estas características' cuando no hay datos", () => {
		renderComponent(
			{ isLoading: false, excursionData: [], error: null },
			{
				loginReducer: { login: false, user: null, token: null },
				themeReducer: { mode: "light" },
			}
		);

		expect(
			screen.getByText(
				"No se encontraron excursiones con esas características."
			)
		).toBeInTheDocument();
	});

	// Test 4: Estado de éxito (con datos)
	test("renderiza una lista de excursiones cuando hay datos", () => {
		renderComponent(
			{ isLoading: false, excursionData: mockExcursionData, error: null },
			{
				loginReducer: { login: false, user: null, token: null },
				themeReducer: { mode: "light" },
			}
		);

		// Verificamos que los nombres de las excursiones están en el documento
		expect(screen.getByText("Ruta del Cares")).toBeInTheDocument();
		expect(screen.getByText("Picos de Europa")).toBeInTheDocument();
		// Verificamos que se renderizan los botones para apuntarse (gracias a nuestro mock)
		expect(screen.getAllByRole("button", { name: /apuntarse/i })).toHaveLength(
			2
		);
	});

	// Test 5: Interacción para unirse a una excursión (caso de éxito)
	test("llama al servicio join excursion y hace un dispatch de updateUser cuando hay éxito", async () => {
		const updatedUser = { ...mockUser, excursions: ["1"] };
		mockedJoinExcursionService.mockResolvedValue(updatedUser);

		renderComponent(
			{ isLoading: false, excursionData: mockExcursionData, error: null },
			{
				loginReducer: { login: true, user: mockUser, token: mockToken },
				themeReducer: { mode: "light" },
			}
		);

		// Buscamos el botón "Apuntarse" de la primera excursión y hacemos clic
		const joinButtons = screen.getAllByRole("button", { name: /apuntarse/i });
		fireEvent.click(joinButtons[0]);

		// Esperamos a que el servicio sea llamado
		await waitFor(() => {
			expect(mockedJoinExcursionService).toHaveBeenCalledWith(
				mockUser.mail,
				mockExcursionData[0].id, // "1"
				mockToken
			);
		});

		// Verificamos que se despachó la acción de Redux para actualizar el usuario
		expect(store.dispatch).toHaveBeenCalledWith(
			updateUser({ user: updatedUser })
		);
	});
});

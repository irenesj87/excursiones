import { renderHook, act } from "@testing-library/react";
import { useJoinExcursion } from "./useJoinExcursion";

describe("useJoinExcursion Hook", () => {
	// Test 1: Verificar el estado inicial del hook.
	test("debe tener un estado inicial correcto", () => {
		const { result } = renderHook(() => useJoinExcursion(jest.fn()));

		expect(result.current.isJoining).toBe(false);
		expect(result.current.joinError).toBeNull();
	});

	// Test 2: Simular un caso de éxito al unirse a una excursión.
	test("debe manejar correctamente un 'join' exitoso", async () => {
		// Creamos una función mock para simular la llamada a la API.
		const mockOnJoin = jest.fn().mockResolvedValue(undefined);
		const { result } = renderHook(() => useJoinExcursion(mockOnJoin));

		// Usamos `await act` para asegurar que todas las actualizaciones de estado,
		// tanto síncronas como asíncronas, se completen antes de continuar.
		// Este es el patrón recomendado por React para probar hooks asíncronos.
		await act(async () => {
			await result.current.handleJoin("excursion-1");
		});

		expect(mockOnJoin).toHaveBeenCalledWith("excursion-1");
		expect(result.current.isJoining).toBe(true);
		expect(result.current.joinError).toBeNull();
	});

	// Test 3: Simular un caso de fallo al unirse.
	test("debe manejar correctamente un 'join' fallido", async () => {
		const errorMessage = "El servidor no responde";
		// Simulamos que la llamada a la API falla.
		const mockOnJoin = jest.fn().mockRejectedValue(new Error(errorMessage));
		const { result } = renderHook(() => useJoinExcursion(mockOnJoin));

		await act(async () => {
			await result.current.handleJoin("excursion-2");
		});

		expect(mockOnJoin).toHaveBeenCalledWith("excursion-2");
		expect(result.current.isJoining).toBe(false);
		expect(result.current.joinError).toBe(errorMessage);
	});

	// Test 4: Verificar que la función `clearError` funciona.
	test("debe limpiar el error cuando se llama a clearError", async () => {
		const mockOnJoin = jest
			.fn()
			.mockRejectedValue(new Error("Error inicial"));
		const { result } = renderHook(() => useJoinExcursion(mockOnJoin));

		// Primero, provocamos un error.
		await act(async () => {
			await result.current.handleJoin("excursion-3");
		});

		// Verificamos que el error está presente.
		expect(result.current.joinError).not.toBeNull();

		// Luego, llamamos a la función para limpiar el error.
		act(() => {
			result.current.clearError();
		});

		// Verificamos que el error se ha limpiado.
		expect(result.current.joinError).toBeNull();
	});

	// Test 5: Verificar que no se puede iniciar un nuevo 'join' si ya hay uno en progreso.
	test("no debe ejecutar un nuevo 'join' si ya hay uno en progreso", async () => {
		// Creamos una promesa que no se resuelve para simular una operación en curso.
		const mockOnJoin = jest.fn(() => new Promise(() => {}));
		const { result } = renderHook(() => useJoinExcursion(mockOnJoin));

		// Iniciamos la primera llamada. No usamos `await` porque la promesa no se resolverá.
		act(() => {
			result.current.handleJoin("excursion-4");
		});

		// Verificamos que el estado de carga es `true`.
		expect(result.current.isJoining).toBe(true);
		expect(mockOnJoin).toHaveBeenCalledTimes(1);

		// Intentamos iniciar una segunda llamada mientras la primera está en progreso.
		// No es necesario `act` aquí porque la función retornará inmediatamente sin causar una actualización de estado.
		await result.current.handleJoin("excursion-4");

		// La función `onJoin` no debería haber sido llamada de nuevo.
		expect(mockOnJoin).toHaveBeenCalledTimes(1);
	});
});
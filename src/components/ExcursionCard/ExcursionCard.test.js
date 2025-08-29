import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import ExcursionCard from "./index";
import styles from "./ExcursionCard.module.css";

// Mock data para una excursión
const mockExcursion = {
	id: "1",
	name: "Ruta del Cares",
	area: "Centro",
	difficulty: "Media",
	time: "4 horas",
};

describe("ExcursionCard Component", () => {
	// Silenciamos los console.error esperados en los tests de fallo para mantener la salida limpia.
	let consoleErrorSpy;
	beforeEach(() => {
		consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
	});
	afterEach(() => {
		consoleErrorSpy.mockRestore();
	});

	test("renderiza la información para un usuario no logueado", () => {
		// Para un usuario no logueado, isJoined es siempre false.
		render(
			<ExcursionCard {...mockExcursion} isLoggedIn={false} isJoined={false} />
		);

		expect(
			screen.getByRole("heading", { name: /ruta del cares/i })
		).toBeInTheDocument();
		expect(screen.getByText("Centro")).toBeInTheDocument();
		expect(screen.getByText("Media")).toBeInTheDocument();
		expect(screen.getByText("4 horas")).toBeInTheDocument();

		// El botón para apuntarse NO debe ser visible
		expect(
			screen.queryByRole("button", { name: /apuntarse/i })
		).not.toBeInTheDocument();
	});

	test("muestra el botón 'Apuntarse' para un usuario logueado que no se ha apuntado", () => {
		render(
			<ExcursionCard
				{...mockExcursion}
				isLoggedIn={true}
				isJoined={false}
				onJoin={jest.fn()}
			/>
		);

		const joinButton = screen.getByRole("button", { name: /apuntarse/i });
		expect(joinButton).toBeInTheDocument();
		expect(joinButton).toBeEnabled();
	});

	test("muestra el estado 'Apuntado/a' si el usuario ya se ha apuntado", () => {
		render(
			<ExcursionCard
				{...mockExcursion}
				isLoggedIn={true}
				isJoined={true}
				onJoin={jest.fn()}
			/>
		);

		expect(screen.getByText(/apuntado\/a/i)).toBeInTheDocument();
		expect(
			screen.queryByRole("button", { name: /apuntarse/i })
		).not.toBeInTheDocument();
	});

	test("llama a onJoin y muestra el estado de carga al hacer clic en 'Apuntarse'", async () => {
		const handleJoin = jest.fn().mockResolvedValue(); // Simula una llamada a API exitosa

		render(
			<ExcursionCard
				{...mockExcursion}
				isLoggedIn={true}
				isJoined={false}
				onJoin={handleJoin}
			/>
		);

		const joinButton = screen.getByRole("button", { name: /apuntarse/i });
		fireEvent.click(joinButton);

		// Inmediatamente después del clic, el botón debe mostrar el estado de carga
		expect(screen.getByRole("button", { name: /apuntando/i })).toBeDisabled();

		// Esperamos a que la operación asíncrona termine
		await waitFor(() => {
			expect(handleJoin).toHaveBeenCalledWith(mockExcursion.id);
		});
	});

	test("muestra un mensaje de error si la función onJoin falla", async () => {
		const handleJoin = jest.fn().mockRejectedValue(new Error("Fallo de red"));

		render(
			<ExcursionCard
				{...mockExcursion}
				isLoggedIn={true}
				isJoined={false}
				onJoin={handleJoin}
			/>
		);

		fireEvent.click(screen.getByRole("button", { name: /apuntarse/i }));

		// Esperamos a que aparezca la alerta de error
		const alert = await screen.findByRole("alert");
		expect(alert).toBeInTheDocument();
		// El componente muestra un mensaje genérico al usuario
		expect(screen.getByText(/fallo de red/i)).toBeInTheDocument();

		// El botón debe volver a estar habilitado para que el usuario pueda reintentar
		expect(screen.getByRole("button", { name: /apuntarse/i })).toBeEnabled();
	});

	test("el usuario puede cerrar el mensaje de error", async () => {
		const handleJoin = jest.fn().mockRejectedValue(new Error("Fallo de red"));
		render(
			<ExcursionCard
				{...mockExcursion}
				isLoggedIn={true}
				isJoined={false}
				onJoin={handleJoin}
			/>
		);

		fireEvent.click(screen.getByRole("button", { name: /apuntarse/i }));

		// Esperamos a que aparezca la alerta y encontramos su botón de cierre
		await screen.findByRole("alert");
		const closeButton = screen.getByRole("button", { name: /close/i });

		fireEvent.click(closeButton);

		// La alerta debería desaparecer del DOM
		await waitFor(() => {
			expect(screen.queryByRole("alert")).not.toBeInTheDocument();
		});
	});

	// Test para la corrección de los badges de dificultad
	test.each([
		["Baja", styles.difficultyLow],
		["Media", styles.difficultyMedium],
		["Alta", styles.difficultyHigh],
	])(
		"aplica la clase correcta '%s' para la dificultad",
		(difficulty, expectedClass) => {
			render(
				<ExcursionCard
					{...mockExcursion}
					difficulty={difficulty}
					isLoggedIn={false}
					isJoined={false}
				/>
			);
			const badge = screen.getByText(difficulty);
			expect(badge).toHaveClass(styles.difficultyBadge, expectedClass);
		}
	);
});

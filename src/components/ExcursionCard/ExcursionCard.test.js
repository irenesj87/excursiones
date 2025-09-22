import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import ExcursionCard from "./ExcursionCard";
import styles from "./ExcursionCard.module.css";
import { useJoinExcursion } from "../../hooks/useJoinExcursion";
import { GENERIC_ERROR_MESSAGE } from "../../constants";

// Mock del hook personalizado.
// Esto nos permite controlar los valores que el hook retorna en cada test
// para verificar que el componente reacciona correctamente.
jest.mock("../../hooks/useJoinExcursion");
const mockedUseJoinExcursion = /** @type {jest.Mock<any, any>} */ (
	useJoinExcursion
);
// Mock data para una excursión
const mockExcursion = {
	id: "1",
	name: "Ruta del Cares",
	area: "Centro",
	difficulty: "Media",
	time: "4 horas",
};

describe("ExcursionCard Component", () => {
	// Definimos un ID predecible que retornará el mock de `useId`.
	const MOCK_ID = "mock-id-12345";

	beforeEach(() => {
		// Limpiamos los mocks antes de cada test para asegurar que los tests son independientes.
		mockedUseJoinExcursion.mockClear();
		// Mockeamos React.useId para que retorne un valor constante y predecible.
		// Esto es crucial para poder probar la relación de accesibilidad.
		jest.spyOn(React, "useId").mockReturnValue(MOCK_ID);
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	test("renderiza la información para un usuario no logueado", () => {
		// El hook se llama incondicionalmente, por lo que debemos simular su retorno
		// incluso si sus valores no se usan directamente en este test.
		mockedUseJoinExcursion.mockReturnValue({
			isJoining: false,
			joinError: null,
			handleJoin: jest.fn(),
			clearError: jest.fn(),
		});
		render(
			<ExcursionCard {...mockExcursion} isLoggedIn={false} isJoined={false} />
		);

		// El título se renderiza como una <legend> dentro de un <fieldset>,
		// por lo que no tiene el rol "heading". Lo buscamos por su texto,
		// que es una forma robusta de encontrar el elemento.
		expect(screen.getByText(/ruta del cares/i)).toBeInTheDocument();
		expect(screen.getByText("Centro")).toBeInTheDocument();
		expect(screen.getByText("Media")).toBeInTheDocument();
		expect(screen.getByText("4 horas")).toBeInTheDocument();

		// El botón para apuntarse NO debe ser visible
		expect(
			screen.queryByRole("button", { name: /apuntarse/i })
		).not.toBeInTheDocument();
	});

	test("muestra el botón 'Apuntarse' para un usuario logueado que no se ha apuntado", () => {
		// Configuramos el estado por defecto del hook para este test.
		mockedUseJoinExcursion.mockReturnValue({
			isJoining: false,
			joinError: null,
			handleJoin: jest.fn(),
			clearError: jest.fn(),
		});
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

	test("asigna correctamente los IDs para accesibilidad usando useId", () => {
		mockedUseJoinExcursion.mockReturnValue({
			isJoining: false,
			joinError: null,
			handleJoin: jest.fn(),
			clearError: jest.fn(),
		});
		render(
			<ExcursionCard {...mockExcursion} isLoggedIn={false} isJoined={false} />
		);

		// El título (renderizado como <legend>) debe tener el ID mockeado.
		const title = screen.getByText(mockExcursion.name);
		expect(title).toHaveAttribute("id", MOCK_ID);

		// La tarjeta (renderizada como <fieldset>) debe estar etiquetada por el título.
		// La forma más robusta de verificarlo es buscando el elemento por su "accessible name",
		// que gracias a `aria-labelledby` será el texto del título.
		const card = screen.getByRole("group", { name: mockExcursion.name });
		expect(card).toBeInTheDocument();
		expect(card).toHaveAttribute("aria-labelledby", MOCK_ID);
	});

	test("muestra el estado 'Apuntado/a' si el usuario ya se ha apuntado", () => {
		// El hook `useJoinExcursion` se llama incondicionalmente al renderizar la tarjeta.
		// Por ello, debemos simular su retorno para evitar un error, aunque sus valores no se usen en este test específico.
		mockedUseJoinExcursion.mockReturnValue({
			isJoining: false,
			joinError: null,
			handleJoin: jest.fn(),
			clearError: jest.fn(),
		});
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

	test("llama a la función handleJoin del hook al hacer clic en 'Apuntarse'", () => {
		const mockHandleJoin = jest.fn();
		mockedUseJoinExcursion.mockReturnValue({
			isJoining: false,
			joinError: null,
			handleJoin: mockHandleJoin,
			clearError: jest.fn(),
		});

		render(
			<ExcursionCard
				{...mockExcursion}
				isLoggedIn={true}
				isJoined={false}
				onJoin={jest.fn()} // La prop onJoin ahora la consume el hook, no el componente directamente.
			/>
		);

		const joinButton = screen.getByRole("button", { name: /apuntarse/i });
		fireEvent.click(joinButton);

		// Verificamos que la función del hook fue llamada con el ID correcto.
		expect(mockHandleJoin).toHaveBeenCalledWith(mockExcursion.id);
	});

	test("muestra el estado de carga cuando el hook retorne isJoining: true", () => {
		mockedUseJoinExcursion.mockReturnValue({
			isJoining: true, // Simulamos el estado de carga
			joinError: null,
			handleJoin: jest.fn(),
			clearError: jest.fn(),
		});

		render(
			<ExcursionCard
				{...mockExcursion}
				isLoggedIn={true}
				isJoined={false}
				onJoin={jest.fn()}
			/>
		);

		// Verificamos que el botón muestra el spinner y está deshabilitado.
		expect(screen.getByRole("button", { name: /apuntando/i })).toBeDisabled();
	});

	test("muestra un mensaje de error cuando el hook retorna un error", () => {
		const errorMessage = "Fallo de red";
		mockedUseJoinExcursion.mockReturnValue({
			isJoining: false,
			joinError: errorMessage, // Simulamos un error
			handleJoin: jest.fn(),
			clearError: jest.fn(),
		});

		render(
			<ExcursionCard
				{...mockExcursion}
				isLoggedIn={true}
				isJoined={false}
				onJoin={jest.fn()}
			/>
		);

		// La alerta de error debe ser visible con el mensaje correcto.
		expect(screen.getByRole("alert")).toBeInTheDocument();
		expect(screen.getByText(errorMessage)).toBeInTheDocument();
	});

	test("muestra un mensaje de error genérico si el hook retorna un error que no es un string", () => {
		// Simulamos que el hook retorna un elemento React malicioso en lugar de un string.
		const maliciousError = <span>Contenido malicioso</span>;
		mockedUseJoinExcursion.mockReturnValue({
			isJoining: false,
			joinError: maliciousError,
			handleJoin: jest.fn(),
			clearError: jest.fn(),
		});

		render(
			<ExcursionCard
				{...mockExcursion}
				isLoggedIn={true}
				isJoined={false}
				onJoin={jest.fn()}
			/>
		);

		// VERIFICAR: El contenido malicioso NO debe renderizarse.
		expect(screen.queryByText("Contenido malicioso")).not.toBeInTheDocument();

		// VERIFICAR: Se debe mostrar el mensaje de respaldo seguro.
		expect(screen.getByText(GENERIC_ERROR_MESSAGE)).toBeInTheDocument();
	});

	test("llama a clearError del hook cuando el usuario cierra el mensaje de error", () => {
		const mockClearError = jest.fn();
		mockedUseJoinExcursion.mockReturnValue({
			isJoining: false,
			joinError: "Un error ocurrió",
			handleJoin: jest.fn(),
			clearError: mockClearError, // Pasamos la función mockeada.
		});

		render(
			<ExcursionCard
				{...mockExcursion}
				isLoggedIn={true}
				isJoined={false}
				onJoin={jest.fn()}
			/>
		);

		const closeButton = screen.getByRole("button", { name: /close/i });
		fireEvent.click(closeButton);

		// Verificamos que la función del hook fue llamada.
		expect(mockClearError).toHaveBeenCalledTimes(1);
	});

	// Test para la corrección de los badges de dificultad
	test.each([
		["Baja", styles.difficultyLow],
		["Media", styles.difficultyMedium],
		["Alta", styles.difficultyHigh],
	])(
		"aplica la clase correcta '%s' para la dificultad",
		(difficulty, expectedClass) => {
			mockedUseJoinExcursion.mockReturnValue({
				isJoining: false,
				joinError: null,
				handleJoin: jest.fn(),
				clearError: jest.fn(),
			});

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

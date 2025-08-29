import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import ErrorMessageAlert from "./index";

describe("ErrorMessageAlert Component", () => {
	// Preparamos las props que usaremos en los tests.
	const mockMessage = "Este es un mensaje de error de prueba.";
	const mockOnClose = jest.fn();

	// Antes de cada test, limpiamos el historial de llamadas de la función mock
	// para que los tests no interfieran entre sí.
	beforeEach(() => {
		mockOnClose.mockClear();
	});

	test("renderiza el mensaje de error y el título correctamente", () => {
		render(<ErrorMessageAlert message={mockMessage} onClose={mockOnClose} />);

		// Verifica que el título "Error" está presente.
		// Buscamos por el rol de "heading" que es semánticamente correcto para un título.
		expect(screen.getByRole("heading", { name: /error/i })).toBeInTheDocument();

		// Verifica que el mensaje de error que pasamos por props se muestra.
		expect(screen.getByText(mockMessage)).toBeInTheDocument();

		// Verifica que el botón de cierre está presente.
		// La alerta de react-bootstrap con `dismissible` renderiza un botón con el aria-label "Close".
		expect(screen.getByRole("button", { name: /close/i })).toBeInTheDocument();
	});

	test("llama a la función onClose cuando se hace clic en el botón de cierre", () => {
		render(<ErrorMessageAlert message={mockMessage} onClose={mockOnClose} />);

		// Encuentra el botón de cierre por su rol y nombre accesible.
		const closeButton = screen.getByRole("button", { name: /close/i });

		// Simula un clic en el botón.
		fireEvent.click(closeButton);

		// Verifica que la función mock `onClose` fue llamada exactamente una vez.
		expect(mockOnClose).toHaveBeenCalledTimes(1);
	});
});

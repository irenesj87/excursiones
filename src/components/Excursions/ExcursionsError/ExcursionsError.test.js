import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import ExcursionsError from "./index";

// Describe el conjunto de pruebas para el componente ExcursionsError.
describe("ExcursionsError Component", () => {
	// Prueba que el componente renderiza el mensaje de error por defecto
	// cuando no se proporciona un objeto de error o es nulo.
	test("renderiza el mensaje de error por defecto si no se proporciona un error", () => {
		render(<ExcursionsError error={null} />);
		expect(
			screen.getByText(
				"Lo sentimos, ha ocurrido un error al cargar las excursiones."
			)
		).toBeInTheDocument();
	});

	test("renderiza el mensaje de error primario desde el objeto de error", () => {
		const mockError = new Error("Fallo en la carga");
		render(<ExcursionsError error={mockError} />);
		expect(screen.getByText("Fallo en la carga")).toBeInTheDocument();
	});

	test("renderiza el mensaje de error secundario si se proporciona", () => {
		// Creamos un error real y le añadimos la propiedad extra para cumplir con el tipo esperado.
		const mockError = new Error("Fallo en la carga");
		/** @type {Error & {secondaryMessage?: string}} */ (
			mockError
		).secondaryMessage = "Inténtalo de nuevo más tarde.";
		render(<ExcursionsError error={mockError} />);
		expect(
			screen.getByText("Inténtalo de nuevo más tarde.")
		).toBeInTheDocument();
	});

	test("no renderiza el párrafo del mensaje secundario si no se proporciona", () => {
		const mockError = new Error("Fallo en la carga");
		render(<ExcursionsError error={mockError} />);

		// El mensaje secundario no debe existir en el DOM
		const secondaryMessage = screen.queryByText(
			/Inténtalo de nuevo más tarde/i
		);
		expect(secondaryMessage).not.toBeInTheDocument();
	});

	test("tiene el rol 'alert' para accesibilidad", () => {
		render(<ExcursionsError error={null} />);
		expect(screen.getByRole("alert")).toBeInTheDocument();
	});

	test("renderiza el icono de alerta", () => {
		render(<ExcursionsError error={null} />);
		// Usamos getByTestId como "escape hatch" recomendado por Testing Library
		// para elementos no semánticos o decorativos (como iconos con aria-hidden).
		const icon = screen.getByTestId("alert-icon");
		expect(icon).toBeInTheDocument();
		expect(icon).toHaveClass("messageIcon");
	});
});

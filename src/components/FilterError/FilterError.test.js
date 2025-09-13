import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import FilterError from "./FilterError";

describe("FilterError Component", () => {
	/**
	 * Prueba que el componente renderiza el mensaje de error por defecto cuando no se proporciona la prop 'error'.
	 */
	test("debe renderizar el mensaje de error por defecto cuando no se proporciona la prop 'error'", () => {
		render(<FilterError />);

		// Verifica que el contenedor principal tenga el rol 'alert' para la accesibilidad.
		const alertContainer = screen.getByRole("alert");
		expect(alertContainer).toBeInTheDocument();

		// Verifica que se renderice el mensaje de error por defecto.
		// El texto "Error:" está visualmente oculto pero es parte del contenido accesible.
		// Usamos una expresión regular para asegurar que el contenido de texto sea exacto y no incluya un mensaje secundario.
		expect(alertContainer).toHaveTextContent(
			/^Error: No se pudieron cargar los filtros\. Inténtalo de nuevo\.$/
		);

		// Verifica que el icono de alerta esté presente y oculto para los lectores de pantalla.
		// Usamos getByTestId como "escape hatch" para encontrar un elemento decorativo sin rol.
		const icon = screen.getByTestId("alert-icon");
		expect(icon).toBeInTheDocument();
		expect(icon).toHaveAttribute("aria-hidden", "true");
	});

	/**
	 * Prueba que el componente renderiza un mensaje de error personalizado desde el objeto de error.
	 */
	test("debe renderizar un mensaje de error personalizado desde el objeto de error", () => {
		const customError = new Error("Error de carga personalizado.");
		render(<FilterError error={customError} />);

		// Verifica que se muestre el mensaje de error personalizado.
		const alertContainer = screen.getByRole("alert");

		// Usamos una expresión regular para asegurar que el contenido de texto sea exacto.
		// Escapamos el mensaje por si contiene caracteres especiales de regex.
		const expectedTextRegex = new RegExp(
			`^Error: ${customError.message.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`
		);
		expect(alertContainer).toHaveTextContent(expectedTextRegex);

		// Verificamos también que el icono esté presente.
		const icon = screen.getByTestId("alert-icon");
		expect(icon).toBeInTheDocument();
	});

	/**
	 * Prueba que el componente renderiza un mensaje de error personalizado y un mensaje secundario.
	 */
	test("debe renderizar un mensaje de error personalizado y un mensaje secundario", () => {
		/** @type {Error & {secondaryMessage?: string}} */
		const customError = new Error("Fallo la conexión.");
		customError.secondaryMessage = "Revisa tu conexión a internet.";
		render(<FilterError error={customError} />);

		// Verifica que se muestre el mensaje de error principal.
		// Usamos toHaveTextContent en el contenedor para ser más flexibles.
		const alertContainer = screen.getByRole("alert");
		expect(alertContainer).toHaveTextContent(`Error: ${customError.message}`);

		// Verifica que se muestre el mensaje secundario.
		expect(alertContainer).toHaveTextContent(customError.secondaryMessage);

		// Verificamos también que el icono esté presente.
		const icon = screen.getByTestId("alert-icon");
		expect(icon).toBeInTheDocument();
	});

	/**
	 * Prueba que el componente incluye el texto "Error:" oculto visualmente para lectores de pantalla.
	 */
	test("debe incluir texto 'Error:' oculto visualmente para lectores de pantalla", () => {
		render(<FilterError />);

		// El texto "Error:" debe estar presente para los lectores de pantalla.
		const hiddenErrorText = screen.getByText("Error:");
		expect(hiddenErrorText).toBeInTheDocument();

		// La clase 'visually-hidden' de Bootstrap lo oculta visualmente.
		expect(hiddenErrorText).toHaveClass("visually-hidden");
	});
});

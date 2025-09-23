import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { FiClock } from "react-icons/fi";
import ExcursionDetailItem from ".";

describe("ExcursionDetailItem Component", () => {
	const MOCK_ID = "mock-tooltip-id";

	beforeEach(() => {
		// Mockeamos React.useId para que devuelva un valor constante y predecible.
		jest.spyOn(React, "useId").mockReturnValue(MOCK_ID);
	});

	afterEach(() => {
		// Restauramos los mocks después de cada test.
		jest.restoreAllMocks();
	});

	test("renderiza el texto y la etiqueta accesible correctamente", () => {
		render(<ExcursionDetailItem text="4 horas" label="Tiempo" />);

		// El texto principal debe ser visible
		expect(screen.getByText("4 horas")).toBeInTheDocument();

		// La etiqueta debe estar presente para lectores de pantalla
		const accessibleLabel = screen.getByText("Tiempo:");
		expect(accessibleLabel).toBeInTheDocument();
		expect(accessibleLabel).toHaveClass("visually-hidden");
	});

	test("renderiza un icono cuando se proporciona", () => {
		render(
			<ExcursionDetailItem
				text="4 horas"
				label="Tiempo"
				IconComponent={FiClock}
			/>
		);

		// Para evitar el acceso directo al DOM (no-node-access), buscamos el icono
		// por su `data-testid`. Esto hace el test más robusto y declarativo.
		expect(screen.getByTestId("detail-item-icon")).toBeInTheDocument();
	});

	test("muestra el tooltip con el formato 'label: text' al pasar el ratón", async () => {
		render(<ExcursionDetailItem text="4 horas" label="Tiempo" />);

		// Simulamos que el usuario pasa el ratón por encima
		fireEvent.mouseOver(screen.getByText("4 horas"));

		// Esperamos a que el tooltip aparezca (es asíncrono)
		const tooltip = await screen.findByRole("tooltip");
		expect(tooltip).toHaveAttribute("id", MOCK_ID);
		expect(tooltip).toBeInTheDocument();
		expect(tooltip).toHaveTextContent("Tiempo: 4 horas");
	});

	test("muestra el tooltip con solo el texto cuando no hay etiqueta", async () => {
		render(<ExcursionDetailItem text="Solo texto" />);

		// Simulamos que el usuario pasa el ratón por encima
		fireEvent.mouseOver(screen.getByText("Solo texto"));

		// Esperamos a que el tooltip aparezca (es asíncrono)
		const tooltip = await screen.findByRole("tooltip");
		expect(tooltip).toHaveAttribute("id", MOCK_ID);
		expect(tooltip).toBeInTheDocument();
		expect(tooltip).toHaveTextContent("Solo texto");
	});

	test("no renderiza nada si no se proporciona 'text'", () => {
		// Envolvemos el componente en un div con data-testid para poder verificar que no renderiza hijos.
		// Esto evita usar `container`, que está desaconsejado por la regla `testing-library/no-container`.
		render(
			<div data-testid="wrapper">
				<ExcursionDetailItem label="Dato Vacío" />
			</div>
		);

		// El componente retorna null, por lo que su contenedor wrapper debería estar vacío.
		expect(screen.getByTestId("wrapper")).toBeEmptyDOMElement();
	});

	test("renderiza como un <button> interactivo cuando tiene texto y etiqueta", () => {
		render(<ExcursionDetailItem text="4 horas" label="Tiempo" />);

		// El elemento contenedor debe ser un botón para la accesibilidad.
		const button = screen.getByRole("button", { name: "Tiempo: 4 horas" });
		expect(button).toBeInTheDocument();
	});

	test("renderiza como un <button> interactivo cuando solo tiene texto", () => {
		render(<ExcursionDetailItem text="Solo texto" />);

		// El texto debe estar presente.
		const textElement = screen.getByText("Solo texto");
		expect(textElement).toBeInTheDocument();
		// Debe renderizar un botón, ya que ahora es interactivo.
		const button = screen.getByRole("button", { name: "Solo texto" });
		expect(button).toBeInTheDocument();
	});
});

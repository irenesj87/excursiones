import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { FiClock } from "react-icons/fi";
import ExcursionDetailItem from "./index";

describe("ExcursionDetailItem Component", () => {
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

	test("renderiza el contenido 'children' en lugar del texto", () => {
		const childContent = (
			<span data-testid="custom-child">Contenido personalizado</span>
		);
		render(
			<ExcursionDetailItem label="Dato" text="Texto que no debe aparecer">
				{childContent}
			</ExcursionDetailItem>
		);

		// El contenido personalizado debe estar visible
		expect(screen.getByTestId("custom-child")).toBeInTheDocument();
		expect(screen.getByText("Contenido personalizado")).toBeInTheDocument();

		// El texto original no debe renderizarse
		expect(
			screen.queryByText("Texto que no debe aparecer")
		).not.toBeInTheDocument();
	});

	test("muestra el tooltip con el formato 'label: text' al pasar el ratón", async () => {
		render(<ExcursionDetailItem text="4 horas" label="Tiempo" />);

		// Simulamos que el usuario pasa el ratón por encima
		fireEvent.mouseOver(screen.getByText("4 horas"));

		// Esperamos a que el tooltip aparezca (es asíncrono)
		const tooltip = await screen.findByRole("tooltip");
		expect(tooltip).toBeInTheDocument();
		expect(tooltip).toHaveTextContent("Tiempo: 4 horas");
	});

	test("no renderiza nada si no se proporcionan ni 'text' ni 'children'", () => {
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
});

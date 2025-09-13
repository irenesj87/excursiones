import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import NoExcursionsFound from "./NoExcursionsFound";

/**
 * Grupo de pruebas para el componente `NoExcursionsFound`.
 */
describe("NoExcursionsFound Component", () => {
	test("renderiza el mensaje primario correctamente", () => {
		render(<NoExcursionsFound />);
		expect(
			screen.getByText(
				"No se encontraron excursiones con esas características."
			)
		).toBeInTheDocument();
	});

	test("renderiza el mensaje secundario correctamente", () => {
		render(<NoExcursionsFound />);
		expect(
			screen.getByText("Prueba a cambiar los filtros para refinar tu búsqueda.")
		).toBeInTheDocument();
	});

	test("tiene el rol 'status' para accesibilidad", () => {
		render(<NoExcursionsFound />);
		expect(screen.getByRole("status")).toBeInTheDocument();
	});

	test("renderiza el icono de búsqueda", () => {
		// Usamos getByTestId como "escape hatch" recomendado por Testing Library
		// para elementos no semánticos o decorativos (como iconos con aria-hidden).
		render(<NoExcursionsFound />);
		const icon = screen.getByTestId("search-icon");
		expect(icon).toBeInTheDocument();
		expect(icon).toHaveClass("messageIcon");
	});
});

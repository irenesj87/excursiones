import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import Logo from "./index";

/**
 * Describe el conjunto de pruebas para el componente Logo.
 */
describe("Logo Component", () => {
	/**
	 * Función de ayuda para renderizar un componente dentro de un `MemoryRouter`
	 * para simular el enrutamiento de React Router en las pruebas.
	 * @param {React.ReactElement} ui - El componente React a renderizar.
	 * @param {object} [options] - Opciones para la renderización.
	 * @param {string} [options.route="/"] - La ruta inicial para el `MemoryRouter`.
	 * @returns {ReturnType<typeof render>} El resultado de la función `render` de `@testing-library/react`.
	 */
	const renderWithRouter = (ui, { route = "/" } = {}) => {
		window.history.pushState({}, "Test page", route);
		return render(ui, { wrapper: MemoryRouter });
	};

	/**
	 * Prueba que el componente Logo renderiza correctamente el texto "Excursiones Juntos".
	 */
	test("renderiza correctamente el texto del logo", () => {
		renderWithRouter(<Logo />);

		// Busca el texto del logo (insensible a mayúsculas/minúsculas)
		const logoText = screen.getByText(/Excursiones Juntos/i);
		// Verifica que el texto esté en el documento
		expect(logoText).toBeInTheDocument();
	});

	/**
	 * Prueba que el logo es un enlace y que apunta a la página de inicio ("/").
	 */
	test("el logo es un enlace que apunta a la página de inicio", () => {
		renderWithRouter(<Logo />);
		// Busca un elemento de enlace con el texto del logo
		const logoLink = screen.getByRole("link", { name: /Excursiones Juntos/i }); 
		// Verifica que el enlace esté en el documento
		expect(logoLink).toBeInTheDocument(); 
		// Verifica que el atributo 'href' del enlace sea "/"
		expect(logoLink).toHaveAttribute("href", "/"); 
	});
});

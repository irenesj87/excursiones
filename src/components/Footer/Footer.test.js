import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Footer from "./index";

// Se agrupan los tests relacionados con este componente en un bloque describe para mantener el código organizado
describe("Footer Component", () => {
	// Test 1: Verificar que el componente se renderiza correctamente con sus elementos principales.
	test("renderiza correctamente el texto del copyright y el enlace de correo", () => {
		// Renderizamos el componente Footer en un DOM virtual.
		render(<Footer />);

		// Comprobamos que el texto de copyright está presente.
		// Usamos una expresión regular para que el test no falle cuando cambie el año.
		const currentYear = new Date().getFullYear();
		const copyrightText = screen.getByText(
			`© Excursiones Juntos 2021 - ${currentYear}. Todos los derechos reservados.`
		);
		// Comprobamos que el texto del copyright está presente en la página
		expect(copyrightText).toBeInTheDocument();

		// Comprobamos que el enlace de correo existe y tiene el atributo `href` correcto.
		// Lo buscamos por su `aria-label` para asegurar la accesibilidad.
		const mailLink = screen.getByRole("link", {
			name: /enviar correo electrónico/i,
		});
		expect(mailLink).toBeInTheDocument();
		expect(mailLink).toHaveAttribute(
			"href",
			"mailto:excursionesjuntos@gmail.com"
		);
	});

	// Test 2: Simular la interacción del usuario (hover) para verificar que el tooltip aparece.
	test("muestra el tooltip cuando se pasa el ratón por encima del icono de correo", async () => {
		// Se renderiza el Footer en el DOM virtual
		render(<Footer />);
		// Buscamos un elemento que esté asociado a una etiqueta <label> o, como en este caso, que tenga un atributo de 
		// accesibilidad aria-label 
		const mailLink = screen.getByLabelText(/enviar correo electrónico/i);
		// Simulamos que el usuario pasa el ratón por encima del icono.
		fireEvent.mouseOver(mailLink);
		// El tooltip aparece de forma asíncrona, por lo que usamos `findByText`.
		const tooltip = await screen.findByText(/envíanos un correo/i);
		expect(tooltip).toBeInTheDocument();
	});
});

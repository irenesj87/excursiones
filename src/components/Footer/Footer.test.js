import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Footer from "./index";

const CONTACT_EMAIL = "excursionesjuntos@gmail.com";
const COMPANY_NAME = "Excursiones Juntos";
const START_YEAR = 2021;

// Se agrupan los tests relacionados con este componente en un bloque describe para mantener el código organizado
describe("Footer Component", () => {
	// Test 1: Verificar que el componente se renderiza correctamente con sus elementos principales.
	test("renderiza correctamente el texto del copyright y el enlace de correo", () => {
		render(<Footer />);

		// Comprobamos que el texto de copyright está presente.
		// Construimos el texto esperado usando las constantes, igual que en el componente.
		const CURRENT_YEAR = new Date().getFullYear();
		const expectedCopyrightText = `© ${COMPANY_NAME} ${START_YEAR} - ${CURRENT_YEAR}. Todos los derechos reservados.`;
		const copyrightText = screen.getByText(expectedCopyrightText);
		expect(copyrightText).toBeInTheDocument();

		// Comprobamos que el enlace de correo existe y tiene el atributo `href` correcto.
		// Lo buscamos por su `aria-label` para asegurar la accesibilidad.
		const mailLink = screen.getByRole("link", {
			name: /enviar correo electrónico/i,
		});
		expect(mailLink).toBeInTheDocument();
		expect(mailLink).toHaveAttribute("href", `mailto:${CONTACT_EMAIL}`);
	});

	// Test 2: Simular la interacción del usuario (hover) para verificar que el tooltip aparece.
	test("muestra el tooltip cuando se pasa el ratón por encima del icono de correo", async () => {
		render(<Footer />);
		// Buscamos un elemento que esté asociado a una etiqueta <label> o, como en este caso, que tenga un atributo de
		// accesibilidad aria-label
		const mailLink = screen.getByLabelText(/enviar correo electrónico/i);
		fireEvent.mouseOver(mailLink);
		// El tooltip aparece de forma asíncrona, por lo que usamos `findByText`.
		const tooltip = await screen.findByText(/envíanos un correo/i);
		expect(tooltip).toBeInTheDocument();
	});
});

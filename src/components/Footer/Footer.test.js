import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Footer from "./Footer";
import { CONTACT_EMAIL, COMPANY_NAME, START_YEAR } from "../../constants";

// Se agrupan los tests relacionados con este componente en un bloque describe para mantener el código organizado
describe("Footer Component", () => {
	// Test 1: Verificar que el componente se renderiza correctamente con sus elementos principales.
	test("renderiza correctamente el texto del copyright y el enlace de correo", () => {
		render(<Footer />);

		// Replicamos la lógica del componente para generar el texto de copyright esperado.
		// Esto hace que el test sea más robusto ante futuros cambios.
		const CURRENT_YEAR = new Date().getFullYear();
		const yearDisplay =
			START_YEAR === CURRENT_YEAR
				? START_YEAR
				: `${START_YEAR} - ${CURRENT_YEAR}`;
		const expectedCopyrightText = `© ${COMPANY_NAME} ${yearDisplay}. Todos los derechos reservados.`;
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
});

import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import FormPageLayout from "./index";

// El componente <Link> necesita estar dentro de un Router, por lo que creamos un wrapper.
const renderWithRouter = (ui, { route = "/" } = {}) => {
	window.history.pushState({}, "Test page", route);
	return render(ui, { wrapper: BrowserRouter });
};

describe("FormPageLayout", () => {
	it("debe renderizar el título, subtítulo y el contenido hijo", () => {
		renderWithRouter(
			<FormPageLayout title="Test Title" subtitle="Test Subtitle">
				<div>Contenido hijo</div>
			</FormPageLayout>
		);

		// Comprueba que el título (un h2) es accesible y está en el documento.
		expect(
			screen.getByRole("heading", { name: /test title/i })
		).toBeInTheDocument();

		// Comprueba el subtítulo
		expect(screen.getByText(/test subtitle/i)).toBeInTheDocument();

		// Comprueba el contenido hijo
		expect(screen.getByText(/contenido hijo/i)).toBeInTheDocument();
	});

	it("debe renderizar el enlace de cambio de página cuando se proporcionan las props", () => {
		renderWithRouter(
			<FormPageLayout
				title="Login"
				switcherPrompt="¿No tienes cuenta?"
				switcherLinkText="Regístrate"
				switcherLinkTo="/register"
			>
				<div />
			</FormPageLayout>
		);

		expect(screen.getByText(/¿no tienes cuenta?/i)).toBeInTheDocument();
		const link = screen.getByRole("link", { name: /regístrate/i });
		expect(link).toBeInTheDocument();
		expect(link).toHaveAttribute("href", "/register");
	});

	it("no debe renderizar el enlace de cambio de página si faltan las props", () => {
		renderWithRouter(
			<FormPageLayout title="Test Title">
				<div />
			</FormPageLayout>
		);

		// queryBy* se usa para comprobar la ausencia de un elemento, ya que no lanza un error si no lo encuentra.
		expect(screen.queryByText(/¿no tienes cuenta?/i)).not.toBeInTheDocument();
		expect(
			screen.queryByRole("link", { name: /regístrate/i })
		).not.toBeInTheDocument();
	});

	it("debe aplicar los atributos de accesibilidad correctamente", () => {
		renderWithRouter(
			<FormPageLayout title="Accesibilidad Test">
				<div />
			</FormPageLayout>
		);

		const section = screen.getByRole("region");
		const title = screen.getByRole("heading", { name: /accesibilidad test/i });

		expect(section).toHaveAttribute("aria-labelledby", title.id);
	});
});

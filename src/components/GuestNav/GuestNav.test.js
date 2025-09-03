import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import GuestNav from "./index";

/**
 * Suite de pruebas para el componente GuestNav.
 */
describe("GuestNav Component", () => {
	test("muestra los enlaces 'Regístrate' e 'Inicia sesión' y maneja los clics", () => {
		const handleClose = jest.fn();
		render(
			<BrowserRouter>
				<GuestNav onCloseOffcanvas={handleClose} />
			</BrowserRouter>
		);

		const registerLink = screen.getByRole("link", { name: /regístrate/i });
		const loginLink = screen.getByRole("link", { name: /inicia sesión/i });

		// Verificar que los enlaces se renderizan con los href correctos
		expect(registerLink).toBeInTheDocument();
		expect(loginLink).toBeInTheDocument();
		expect(registerLink).toHaveAttribute("href", "/registerPage");
		expect(loginLink).toHaveAttribute("href", "/loginPage");

		// Simular clic en el enlace de registro
		fireEvent.click(registerLink);
		expect(handleClose).toHaveBeenCalledTimes(1);

		// Simular clic en el enlace de inicio de sesión
		fireEvent.click(loginLink);
		expect(handleClose).toHaveBeenCalledTimes(2);
	});
});

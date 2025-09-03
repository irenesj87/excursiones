import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import AuthNav from "./index";

// Mock de los componentes hijos para aislar AuthNav en las pruebas.
jest.mock("./AuthNavSkeleton", () => () => (
	<div data-testid="auth-nav-skeleton" />
));
jest.mock("../UserNav", () => ({ onCloseOffcanvas }) => (
	<button type="button" data-testid="user-nav" onClick={onCloseOffcanvas} />
));
jest.mock("../GuestNav", () => ({ onCloseOffcanvas }) => (
	<button type="button" data-testid="guest-nav" onClick={onCloseOffcanvas} />
));

/**
 * Suite de pruebas para el componente AuthNav.
 */
describe("AuthNav Component", () => {
	const mockOnClose = jest.fn();

	beforeEach(() => {
		mockOnClose.mockClear();
	});

	// Test para el estado de carga
	test("muestra el esqueleto de carga cuando la comprobación de autenticación no ha finalizado", () => {
		render(
			<AuthNav
				isAuthCheckComplete={false}
				isLoggedIn={false}
				onCloseOffcanvas={mockOnClose}
			/>
		);

		// Verificamos que el esqueleto se renderiza
		expect(screen.getByTestId("auth-nav-skeleton")).toBeInTheDocument();

		// Verificamos que los componentes de navegación no se muestran
		expect(screen.queryByTestId("guest-nav")).not.toBeInTheDocument();
		expect(screen.queryByTestId("user-nav")).not.toBeInTheDocument();
	});

	// Test para el estado de "invitado" (no logueado)
	test("muestra GuestNav cuando el usuario no está logueado", () => {
		render(
			<AuthNav
				isAuthCheckComplete={true}
				isLoggedIn={false}
				onCloseOffcanvas={mockOnClose}
			/>
		);

		// Verificamos que se renderiza GuestNav y se le pasan las props correctas
		const guestNav = screen.getByTestId("guest-nav");
		expect(guestNav).toBeInTheDocument();

		// Verificamos que no se renderizan los otros componentes
		expect(screen.queryByTestId("user-nav")).not.toBeInTheDocument();
		expect(screen.queryByTestId("auth-nav-skeleton")).not.toBeInTheDocument();
	});

	// Test para el estado de "usuario logueado"
	test("muestra UserNav cuando el usuario está logueado", () => {
		render(
			<AuthNav
				isAuthCheckComplete={true}
				isLoggedIn={true}
				onCloseOffcanvas={mockOnClose}
			/>
		);

		// Verificamos que se renderiza UserNav y se le pasan las props correctas
		const userNav = screen.getByTestId("user-nav");
		expect(userNav).toBeInTheDocument();

		// Verificamos que no se renderizan los otros componentes
		expect(screen.queryByTestId("guest-nav")).not.toBeInTheDocument();
		expect(screen.queryByTestId("auth-nav-skeleton")).not.toBeInTheDocument();
	});
});

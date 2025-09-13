import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import AuthNav from "./AuthNav";

// Mock de los componentes esqueleto y de navegación para aislar AuthNav en las pruebas.
jest.mock(
	"../UserNav/UserNavSkeleton",
	() =>
		function MockUserNavSkeleton() {
			return <div data-testid="user-nav-skeleton" />;
		}
);
jest.mock(
	"../GuestNav/GuestNavSkeleton",
	() =>
		function MockGuestNavSkeleton() {
			return <div data-testid="guest-nav-skeleton" />;
		}
);
jest.mock(
	"../UserNav",
	() =>
		function MockUserNav({ onCloseMenu }) {
			return (
				<button type="button" data-testid="user-nav" onClick={onCloseMenu} />
			);
		}
);
jest.mock(
	"../GuestNav",
	() =>
		function MockGuestNav({ onCloseMenu }) {
			return (
				<button type="button" data-testid="guest-nav" onClick={onCloseMenu} />
			);
		}
);

/**
 * Suite de pruebas para el componente AuthNav.
 */
describe("AuthNav Component", () => {
	const mockOnClose = jest.fn();

	beforeEach(() => {
		mockOnClose.mockClear();
	});

	// Tests para el estado de carga (cuando isAuthCheckComplete es false)
	describe("cuando la comprobación de autenticación no ha finalizado", () => {
		let getItemSpy;

		beforeEach(() => {
			// Mockeamos sessionStorage para controlar el estado "likelyLoggedIn"
			getItemSpy = jest.spyOn(Storage.prototype, "getItem");
		});

		afterEach(() => {
			getItemSpy.mockRestore();
		});

		test("muestra GuestNavSkeleton si no hay token en sessionStorage", () => {
			getItemSpy.mockReturnValue(null);
			render(
				<AuthNav
					isAuthCheckComplete={false}
					isLoggedIn={false}
					onCloseMenu={mockOnClose}
				/>
			);

			// Verificamos que se renderiza el esqueleto de invitado
			expect(screen.getByTestId("guest-nav-skeleton")).toBeInTheDocument();
			expect(screen.queryByTestId("user-nav-skeleton")).not.toBeInTheDocument();
		});

		test("muestra UserNavSkeleton si hay un token en sessionStorage", () => {
			getItemSpy.mockReturnValue("fake-token");
			render(
				<AuthNav
					isAuthCheckComplete={false}
					isLoggedIn={false}
					onCloseMenu={mockOnClose}
				/>
			);

			// Verificamos que se renderiza el esqueleto de usuario
			expect(screen.getByTestId("user-nav-skeleton")).toBeInTheDocument();
			expect(
				screen.queryByTestId("guest-nav-skeleton")
			).not.toBeInTheDocument();
		});
	});

	// Test para el estado de "invitado" (no logueado)
	test("muestra GuestNav cuando el usuario no está logueado", () => {
		render(
			<AuthNav
				isAuthCheckComplete={true}
				isLoggedIn={false}
				onCloseMenu={mockOnClose}
			/>
		);

		// Verificamos que se renderiza GuestNav y se le pasan las props correctas
		const guestNav = screen.getByTestId("guest-nav");
		expect(guestNav).toBeInTheDocument();

		// Verificamos que no se renderizan los otros componentes
		expect(screen.queryByTestId("user-nav")).not.toBeInTheDocument();
		expect(screen.queryByTestId("guest-nav-skeleton")).not.toBeInTheDocument();
		expect(screen.queryByTestId("user-nav-skeleton")).not.toBeInTheDocument();
	});

	// Test para el estado de "usuario logueado"
	test("muestra UserNav cuando el usuario está logueado", () => {
		render(
			<AuthNav
				isAuthCheckComplete={true}
				isLoggedIn={true}
				onCloseMenu={mockOnClose}
			/>
		);

		// Verificamos que se renderiza UserNav y se le pasan las props correctas
		const userNav = screen.getByTestId("user-nav");
		expect(userNav).toBeInTheDocument();

		// Verificamos que no se renderizan los otros componentes
		expect(screen.queryByTestId("guest-nav")).not.toBeInTheDocument();
		expect(screen.queryByTestId("guest-nav-skeleton")).not.toBeInTheDocument();
		expect(screen.queryByTestId("user-nav-skeleton")).not.toBeInTheDocument();
	});
});

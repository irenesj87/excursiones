import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import AuthNav from "./AuthNav";
import UserNav from "../UserNav";
import GuestNav from "../GuestNav";
// Importamos la implementación real del ErrorBoundary directamente desde su fichero.
// Esto es necesario para poder usarlo en el test de error, ya que el import normal ("../ErrorBoundary") está mockeado.
import RealErrorBoundary from "../ErrorBoundary/ErrorBoundary";

// Mock de los componentes esqueleto y de navegación para aislar AuthNav en las pruebas.
jest.mock(
	"../UserNav/UserNavSkeleton",
	() =>
		function MockUserNavSkeleton() {
			return <div data-testid="user-nav-skeleton">Cargando usuario...</div>;
		}
);
jest.mock(
	"../GuestNav/GuestNavSkeleton",
	() =>
		function MockGuestNavSkeleton() {
			return <div data-testid="guest-nav-skeleton">Cargando invitado...</div>;
		}
);

// Mockeamos los componentes que se cargan con React.lazy como funciones de jest.
// Esto nos permite cambiar su comportamiento en cada test (ej. simular un renderizado exitoso o un error).
jest.mock("../UserNav", () => jest.fn());
jest.mock("../GuestNav", () => jest.fn());

// Mock del ErrorBoundary como una función de jest, para poder cambiar su implementación en tests específicos.
// Por defecto, actúa como un Fragment que no hace nada.
jest.mock("../ErrorBoundary", () =>
	jest.fn().mockImplementation(({ children }) => <>{children}</>)
);
// Importamos el mock después de definirlo.
import ErrorBoundary from "../ErrorBoundary";

/**
 * Suite de pruebas para el componente AuthNav.
 */
describe("AuthNav Component", () => {
	const mockOnClose = jest.fn();

	beforeEach(() => {
		// Limpiamos los mocks antes de cada test para asegurar un estado limpio.
		/** @type {jest.Mock} */
		(UserNav).mockClear();
		/** @type {jest.Mock} */
		(GuestNav).mockClear();
		/** @type {jest.Mock} */
		(/** @type {unknown} */ (ErrorBoundary)).mockClear();
		// Proporcionamos una implementación por defecto para los componentes lazy.
		/** @type {jest.Mock} */
		(UserNav).mockImplementation(({ onCloseMenu }) => (
			<button type="button" data-testid="user-nav" onClick={onCloseMenu} />
		));
		/** @type {jest.Mock} */
		(GuestNav).mockImplementation(({ onCloseMenu }) => (
			<button type="button" data-testid="guest-nav" onClick={onCloseMenu} />
		));
		// Restauramos la implementación por defecto del ErrorBoundary
		/** @type {jest.Mock} */
		(/** @type {unknown} */ (ErrorBoundary)).mockImplementation(
			({ children }) => <>{children}</>
		);
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
	test("muestra GuestNav cuando el usuario no está logueado", async () => {
		render(
			<AuthNav
				isAuthCheckComplete={true}
				isLoggedIn={false}
				onCloseMenu={mockOnClose}
			/>
		);

		// Verificamos que se renderiza el fallback de Suspense inicialmente.
		expect(screen.getByTestId("guest-nav-skeleton")).toBeInTheDocument();

		// Esperamos a que el componente lazy GuestNav se cargue y renderice.
		const guestNav = await screen.findByTestId("guest-nav");
		expect(guestNav).toBeInTheDocument();

		// Una vez cargado, el esqueleto ya no debería estar.
		expect(screen.queryByTestId("guest-nav-skeleton")).not.toBeInTheDocument();

		// Verificamos que los componentes de usuario no se renderizan.
		expect(screen.queryByTestId("user-nav")).not.toBeInTheDocument();
		expect(screen.queryByTestId("user-nav-skeleton")).not.toBeInTheDocument();
	});

	// Test para el estado de "usuario logueado"
	test("muestra UserNav cuando el usuario está logueado", async () => {
		render(
			<AuthNav
				isAuthCheckComplete={true}
				isLoggedIn={true}
				onCloseMenu={mockOnClose}
			/>
		);

		// Verificamos que se renderiza el fallback de Suspense inicialmente.
		expect(screen.getByTestId("user-nav-skeleton")).toBeInTheDocument();

		// Esperamos a que el componente lazy UserNav se cargue y renderice.
		const userNav = await screen.findByTestId("user-nav");
		expect(userNav).toBeInTheDocument();

		// Una vez cargado, el esqueleto ya no debería estar.
		expect(screen.queryByTestId("user-nav-skeleton")).not.toBeInTheDocument();

		// Verificamos que los componentes de invitado no se renderizan.
		expect(screen.queryByTestId("guest-nav")).not.toBeInTheDocument();
		expect(screen.queryByTestId("guest-nav-skeleton")).not.toBeInTheDocument();
	});

	// Tests para el ErrorBoundary
	describe("cuando la carga del componente dinámico falla", () => {
		let consoleErrorSpy;

		beforeEach(() => {
			// Silenciamos el console.error que React y nuestro ErrorBoundary generan,
			// ya que es un comportamiento esperado en este test.
			consoleErrorSpy = jest
				.spyOn(console, "error")
				.mockImplementation(() => {});
		});

		afterEach(() => {
			consoleErrorSpy.mockRestore();
		});

		test("muestra el fallback del ErrorBoundary en lugar de romper la app", async () => {
			// Para este test, usamos la implementación real del ErrorBoundary.
			/** @type {jest.Mock} */
			(/** @type {unknown} */ (ErrorBoundary)).mockImplementation((props) => (
				<RealErrorBoundary {...props} />
			));

			// Forzamos que el componente UserNav falle al renderizar.
			/** @type {jest.Mock} */
			(UserNav).mockImplementation(() => {
				throw new Error("Simulated network error");
			});

			render(<AuthNav isAuthCheckComplete={true} isLoggedIn={true} />);

			// El ErrorBoundary debería capturar el error y renderizar su fallback (GuestNavSkeleton).
			expect(
				await screen.findByTestId("guest-nav-skeleton")
			).toBeInTheDocument();
			expect(screen.queryByTestId("user-nav")).not.toBeInTheDocument();
		});
	});
});

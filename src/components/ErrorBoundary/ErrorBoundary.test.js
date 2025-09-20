import { render, screen } from "@testing-library/react";
import ErrorBoundary from "./ErrorBoundary";

describe("ErrorBoundary", () => {
	// Suprimimos el error esperado en la consola para no ensuciar la salida del test.
	// @type {jest.SpyInstance}
	// Guarda una referencia al espía de console.error para poder restaurarlo después de cada test.
	let consoleErrorSpy;

	// Antes de cada test, se espía `console.error` y se mockea su implementación
	// para evitar que los errores de los componentes de prueba se muestren en la consola.
	beforeEach(() => {
		consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
	});

	afterEach(() => {
		consoleErrorSpy.mockRestore();
	});

	it("debe renderizar los componentes hijos cuando no hay ningún error", () => {
		render(
			<ErrorBoundary fallback={<p>Hubo un error</p>}>
				<div>Contenido normal</div>
			</ErrorBoundary>
		);

		// Verificamos que el contenido normal se muestra
		expect(screen.getByText("Contenido normal")).toBeInTheDocument();
		// Verificamos que el fallback NO se muestra
		expect(screen.queryByText("Hubo un error")).not.toBeInTheDocument();
	});

	it("debe renderizar la UI de fallback y registrar el error cuando un componente hijo falla", () => {
		// Componente que siempre lanza un error
		const testError = new Error("Test Error");
		const ProblematicComponent = () => {
			throw testError;
		};

		render(
			<ErrorBoundary fallback={<p>Hubo un error</p>}>
				<ProblematicComponent />
			</ErrorBoundary>
		);

		// Verificamos que la UI de fallback se muestra
		expect(screen.getByText("Hubo un error")).toBeInTheDocument();
		// Verificamos que console.error fue llamado por componentDidCatch con los argumentos correctos
		expect(consoleErrorSpy).toHaveBeenCalledWith(
			"Error capturado por ErrorBoundary:",
			testError,
			expect.objectContaining({
				componentStack: expect.any(String),
			})
		);
	});
});

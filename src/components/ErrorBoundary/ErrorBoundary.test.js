import { render, screen } from "@testing-library/react";
import ErrorBoundary from "./ErrorBoundary";

describe("ErrorBoundary", () => {
	// Suprimimos el error esperado en la consola para no ensuciar la salida del test.
	// Guardamos la implementación original para restaurarla después.
	let consoleErrorSpy;

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

	it("debe renderizar la UI de fallback cuando un componente hijo lanza un error", () => {
		// Componente que siempre lanza un error
		const ProblematicComponent = () => {
			throw new Error("Test Error");
		};

		render(
			<ErrorBoundary fallback={<p>Hubo un error</p>}>
				<ProblematicComponent />
			</ErrorBoundary>
		);

		// Verificamos que la UI de fallback se muestra
		expect(screen.getByText("Hubo un error")).toBeInTheDocument();
		// Verificamos que console.error fue llamado por componentDidCatch
		expect(consoleErrorSpy).toHaveBeenCalled();
	});
});

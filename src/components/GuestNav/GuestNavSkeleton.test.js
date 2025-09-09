import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import GuestNavSkeleton from "./GuestNavSkeleton";

// Mock del hook para desacoplar el test de su implementación real
// y asegurar que los colores del esqueleto son consistentes.
jest.mock("../../hooks/useSkeletonTheme", () => ({
	useSkeletonTheme: () => ({
		baseColor: "#ebebeb",
		highlightColor: "#f5f5f5",
	}),
}));

/**
 * Suite de pruebas para el componente GuestNavSkeleton.
 */
describe("GuestNavSkeleton Component", () => {
	test("se renderiza correctamente y es inaccesible para lectores de pantalla", () => {
		// Renderizamos el componente y obtenemos el 'container' para poder buscar elementos por clase.
		const { container } = render(<GuestNavSkeleton />);

		// 1. Verificar que el contenedor principal tiene aria-hidden="true".
		// Esto es crucial para la accesibilidad, ya que los esqueletos no deben ser leídos.
		const skeletonContainer = container.querySelector(
			".d-flex.align-items-center"
		);
		expect(skeletonContainer).toBeInTheDocument();
		expect(skeletonContainer).toHaveAttribute("aria-hidden", "true");

		// 2. Verificar que se renderizan los dos elementos de esqueleto.
		// La librería `react-loading-skeleton` añade la clase 'react-loading-skeleton' a sus elementos.
		const skeletonElements = container.querySelectorAll(
			".react-loading-skeleton"
		);
		expect(skeletonElements).toHaveLength(2);

		// 3. Verificamos que los esqueletos tienen las dimensiones y clases correctas.
		// Esto confirma que las constantes de tamaño se están aplicando.
		expect(skeletonElements[0]).toHaveStyle("width: 91.8px");
		expect(skeletonElements[0]).toHaveStyle("height: 38px");
		expect(skeletonElements[0]).toHaveClass("me-3");

		expect(skeletonElements[1]).toHaveStyle("width: 104.38px");
		expect(skeletonElements[1]).toHaveStyle("height: 38px");
	});
});

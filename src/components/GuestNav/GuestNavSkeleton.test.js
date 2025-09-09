import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import GuestNavSkeleton, { GUEST_NAV_SKELETON_SIZES } from "./GuestNavSkeleton";

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
		// Renderizamos el componente y obtenemos el 'container' para poder buscar elementos por su clase.
		const { container } = render(<GuestNavSkeleton />);

		// 1. Verificar que el contenedor principal tiene aria-hidden="true".
		// Usamos getByTestId para una selección más robusta y desacoplada del CSS.
		const skeletonContainer = screen.getByTestId("guest-nav-skeleton");
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
		expect(skeletonElements[0]).toHaveStyle(
			`width: ${GUEST_NAV_SKELETON_SIZES.REGISTER_LINK_WIDTH}px`
		);
		expect(skeletonElements[0]).toHaveStyle(
			`height: ${GUEST_NAV_SKELETON_SIZES.HEIGHT}px`
		);
		expect(skeletonElements[0]).toHaveClass("me-3");

		expect(skeletonElements[1]).toHaveStyle(
			`width: ${GUEST_NAV_SKELETON_SIZES.LOGIN_LINK_WIDTH}px`
		);
		expect(skeletonElements[1]).toHaveStyle(
			`height: ${GUEST_NAV_SKELETON_SIZES.HEIGHT}px`
		);
	});
});

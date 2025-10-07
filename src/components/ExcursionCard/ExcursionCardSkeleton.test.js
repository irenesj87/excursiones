import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import ExcursionCardSkeleton, { TEST_IDS } from "./ExcursionCardSkeleton";

// Mock del hook useSkeletonTheme para aislar el componente y evitar
// dependencias externas en el test.
jest.mock("../../hooks/useSkeletonTheme", () => ({
	useSkeletonTheme: () => ({
		baseColor: "#e0e0e0",
		highlightColor: "#f5f5f5",
	}),
}));

describe("ExcursionCardSkeleton Component", () => {
	test("renderiza correctamente y está oculto para lectores de pantalla", () => {
		render(<ExcursionCardSkeleton />);

		// La tarjeta principal debe tener el atributo aria-hidden="true"
		// para ser ignorada por tecnologías de asistencia.
		// Usamos `getByTestId` para seleccionar de forma única el contenedor principal
		// del esqueleto y verificar que tiene el atributo `aria-hidden`.
		const cardElement = screen.getByTestId(TEST_IDS.SKELETON_CARD);
		expect(cardElement).toBeInTheDocument();
		expect(cardElement).toHaveAttribute("aria-hidden", "true");
	});

	test("no muestra el esqueleto del botón cuando isLoggedIn es false", () => {
		render(<ExcursionCardSkeleton isLoggedIn={false} />);

		// Verificamos que el contenedor del esqueleto del botón no existe en el DOM.
		expect(
			screen.queryByTestId(TEST_IDS.BUTTON_CONTAINER)
		).not.toBeInTheDocument();
	});

	test("muestra el esqueleto del botón cuando isLoggedIn es true", () => {
		render(<ExcursionCardSkeleton isLoggedIn={true} />);

		// Verificamos que el contenedor del esqueleto del botón sí existe en el DOM.
		expect(screen.getByTestId(TEST_IDS.BUTTON_CONTAINER)).toBeInTheDocument();
	});
});

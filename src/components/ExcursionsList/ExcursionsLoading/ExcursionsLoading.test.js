import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
// El error de TypeScript ocurre porque se estaba importando el componente `ExcursionCard`
// en lugar de `ExcursionsLoading`. La solución es corregir la ruta de importación para
// que apunte al componente correcto que se está probando (`./index.js` en la misma carpeta).
import ExcursionsLoading from "./ExcursionsLoading";

// Mock del hook useSkeletonTheme, ya que no es relevante para la lógica de este componente.
// Su propio test ya se encarga de verificar su funcionamiento.
jest.mock("../../../hooks/useSkeletonTheme", () => ({
	useSkeletonTheme: () => ({
		baseColor: "#e0e0e0",
		highlightColor: "#f5f5f5",
	}),
}));

// Mock del componente hijo para aislar el test y verificar que recibe las props correctas.
jest.mock("../../ExcursionCard/ExcursionCardSkeleton", () => {
	// eslint-disable-next-line react/prop-types
	const MockedSkeleton = ({ isLoggedIn }) => (
		<div data-testid="skeleton-card">isLoggedIn: {isLoggedIn.toString()}</div>
	);
	MockedSkeleton.displayName = "ExcursionCardSkeleton";
	return MockedSkeleton;
});

describe("ExcursionsLoading", () => {
	test("renderiza el título y el mensaje de estado accesible", () => {
		render(<ExcursionsLoading isLoggedIn={false} />);

		expect(
			screen.getByRole("heading", { name: /próximas excursiones/i })
		).toBeInTheDocument();

		// Este texto es para lectores de pantalla y es importante para la accesibilidad.
		expect(screen.getByText("Cargando excursiones...")).toBeInTheDocument();
	});

	test("renderiza 8 skeletons de tarjetas de excursión", () => {
		render(<ExcursionsLoading isLoggedIn={false} />);
		const skeletonCards = screen.getAllByTestId("skeleton-card");
		expect(skeletonCards).toHaveLength(8);
	});

	test("pasa la prop 'isLoggedIn' correctamente a los skeletons", () => {
		// Renderiza con isLoggedIn={true}
		const { rerender } = render(<ExcursionsLoading isLoggedIn={true} />);
		let skeletonCards = screen.getAllByTestId("skeleton-card");
		for (const card of skeletonCards) {
			expect(card).toHaveTextContent("isLoggedIn: true");
		}

		// Re-renderiza con isLoggedIn={false} para asegurar que el cambio se refleja
		rerender(<ExcursionsLoading isLoggedIn={false} />);
		skeletonCards = screen.getAllByTestId("skeleton-card");
		for (const card of skeletonCards) {
			expect(card).toHaveTextContent("isLoggedIn: false");
		}
	});
});

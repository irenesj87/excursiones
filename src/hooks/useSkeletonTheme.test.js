import { renderHook } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { useSkeletonTheme } from "./useSkeletonTheme";

// Configuración del mock store de Redux.
const mockStore = configureStore([]);

// Definición de los colores esperados para facilitar las aserciones.
const SKELETON_COLORS = {
	light: {
		baseColor: "#e0e0e0",
		highlightColor: "#f5f5f5",
	},
	dark: {
		baseColor: "#202020",
		highlightColor: "#444",
	},
};

/**
 * Suite de pruebas para el hook `useSkeletonTheme`.
 */
describe("useSkeletonTheme Hook", () => {
	/**
	 * Función de ayuda para renderizar el hook con un estado de Redux específico.
	 * @param {object} state - El estado inicial para el mock store de Redux.
	 * @returns {import('@testing-library/react').RenderHookResult<ReturnType<typeof useSkeletonTheme>, unknown>}
	 */
	const renderHookWithProvider = (state) => {
		const store = mockStore(state);
		// El 'wrapper' envuelve el hook en el Provider de Redux, dándole acceso al store.
		const wrapper = ({ children }) => (
			<Provider store={store}>{children}</Provider>
		);
		return renderHook(() => useSkeletonTheme(), { wrapper });
	};

	test("debe retornar los colores del tema claro cuando el modo es 'light'", () => {
		// Simulamos el estado de Redux para el tema claro.
		const { result } = renderHookWithProvider({
			themeReducer: { mode: "light" },
		});

		// Verificamos que el hook devuelve el objeto de colores correcto.
		expect(result.current).toEqual(SKELETON_COLORS.light);
	});

	test("debe retornar los colores del tema oscuro cuando el modo es 'dark'", () => {
		// Simulamos el estado de Redux para el tema oscuro.
		const { result } = renderHookWithProvider({
			themeReducer: { mode: "dark" },
		});

		// Verificamos que el hook devuelve el objeto de colores correcto.
		expect(result.current).toEqual(SKELETON_COLORS.dark);
	});

	test("debe retornar los colores del tema claro como valor por defecto si el modo no es válido o no existe", () => {
		// Simulamos un estado con un modo de tema inesperado.
		const { result } = renderHookWithProvider({
			themeReducer: { mode: "invalid-mode" },
		});

		// El hook debe recurrir a los colores del tema claro por defecto.
		expect(result.current).toEqual(SKELETON_COLORS.light);
	});
});

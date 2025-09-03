import { useSelector } from "react-redux";

/** @typedef {import('../types').RootState} RootState */

// Define los colores del esqueleto en un objeto centralizado para facilitar el mantenimiento.
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
 * Hook personalizado para obtener las props de tema para `react-loading-skeleton`.
 * Encapsula la lógica para seleccionar los colores del esqueleto según el modo de tema actual.
 * @returns {{baseColor: string, highlightColor: string}} Un objeto con los colores para el SkeletonTheme.
 */
export const useSkeletonTheme = () => {
	const mode = useSelector(
		/** @param {RootState} state */
		(state) => state.themeReducer.mode
	);

	return SKELETON_COLORS[mode] || SKELETON_COLORS.light;
};

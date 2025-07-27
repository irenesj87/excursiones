import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { useSelector } from "react-redux";
import "react-loading-skeleton/dist/skeleton.css";

/** @typedef {import("../types").RootState} RootState */

/**
 * Componente que muestra un esqueleto de carga para los botones de autenticación en la barra de navegación.
 * Se utiliza para reservar espacio y evitar saltos de layout (layout shift) mientras se verifica el estado de autenticación del usuario.
 * @returns {React.ReactElement}
 */
function AuthNavSkeleton() {
	const mode = useSelector(
		/** @param {RootState} state */
		(state) => state.themeReducer.mode
	);

	// Define los colores del esqueleto según el tema para una experiencia visual consistente.
	const baseColor = mode === "dark" ? "#202020" : "#e0e0e0";
	const highlightColor = mode === "dark" ? "#444" : "#f5f5f5";

	return (
		<SkeletonTheme baseColor={baseColor} highlightColor={highlightColor}>
			<div className="d-flex align-items-center" aria-hidden="true">
				{/* Placeholder para el enlace "Regístrate" */}
				<Skeleton width={111} height={38} className="me-3" />
				{/* Placeholder para el enlace "Inicia sesión" */}
				<Skeleton width={110} height={36} />
			</div>
		</SkeletonTheme>
	);
}

export default AuthNavSkeleton;

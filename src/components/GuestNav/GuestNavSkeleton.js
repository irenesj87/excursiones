import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useSkeletonTheme } from "../../hooks/useSkeletonTheme";

// Define placeholder dimensions as constants to avoid magic numbers and improve maintainability.
const GUEST_NAV_SKELETON_SIZES = {
	REGISTER_LINK_WIDTH: 91.8,
	LOGIN_LINK_WIDTH: 104.38,
	HEIGHT: 38,
};

/**
 * Componente que muestra un esqueleto de carga para los botones de navegación de un usuario invitado.
 * @returns {React.ReactElement}
 */
function GuestNavSkeleton() {
	// Obtiene los colores del esqueleto de forma centralizada a través del hook.
	const { baseColor, highlightColor } = useSkeletonTheme();

	return (
		<SkeletonTheme baseColor={baseColor} highlightColor={highlightColor}>
			<div className="d-flex align-items-center" aria-hidden="true">
				{/* Placeholder para el enlace "Regístrate" */}
				<Skeleton
					width={GUEST_NAV_SKELETON_SIZES.REGISTER_LINK_WIDTH}
					height={GUEST_NAV_SKELETON_SIZES.HEIGHT}
					className="me-3"
				/>
				{/* Placeholder para el enlace "Inicia sesión" */}
				<Skeleton
					width={GUEST_NAV_SKELETON_SIZES.LOGIN_LINK_WIDTH}
					height={GUEST_NAV_SKELETON_SIZES.HEIGHT}
				/>
			</div>
		</SkeletonTheme>
	);
}

export default GuestNavSkeleton;

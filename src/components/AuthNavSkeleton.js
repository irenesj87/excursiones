import { useState } from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { useSelector } from "react-redux";
import "react-loading-skeleton/dist/skeleton.css";

/** @typedef {import("../types").RootState} RootState */

/**
 * Componente que muestra un esqueleto de carga para los botones de autenticación en la barra de navegación.
 * Se utiliza para reservar espacio y evitar saltos de layout (layout shift) mientras se verifica el estado de autenticación del 
 * usuario.
 * @returns {React.ReactElement}
 */
function AuthNavSkeleton() {
	const mode = useSelector(
		/** @param {RootState} state */
		(state) => state.themeReducer.mode
	);

	// Para evitar el "salto" del esqueleto, no reaccionamos al estado de Redux que cambia
	// durante la comprobación. En su lugar, tomamos una "pista" inicial de sessionStorage.
	// Si hay un token, es muy probable que el usuario esté logueado, por lo que mostramos
	// el esqueleto correspondiente desde el principio. Esto estabiliza el layout.
	const [likelyLoggedIn] = useState(!!sessionStorage.getItem("token"));

	// Define los colores del esqueleto según el tema para una experiencia visual consistente.
	const baseColor = mode === "dark" ? "#202020" : "#e0e0e0";
	const highlightColor = mode === "dark" ? "#444" : "#f5f5f5";

	return (
		<SkeletonTheme baseColor={baseColor} highlightColor={highlightColor}>
			{/* La elección del esqueleto se basa en la "pista" inicial para que no cambie
			    durante la verificación de autenticación. */}
			{likelyLoggedIn ? (
				<div
					className="d-flex justify-content-end align-items-center"
					aria-hidden="true"
				>
					{/* Placeholder para el enlace "Perfil" */}
					<Skeleton width={77.25} height={38} className="me-3" />
					{/* Placeholder para el botón "Cerrar sesión" */}
					<Skeleton width={120.79} height={38} />
				</div>
			) : (
				/* Contenedor para los enlaces de registro e inicio de sesión */
				<div className="d-flex align-items-center" aria-hidden="true">
					{/* Placeholder para el enlace "Regístrate" */}
					<Skeleton width={91.8} height={38} className="me-3" />
					{/* Placeholder para el enlace "Inicia sesión" */}
					<Skeleton width={104.38} height={38} />
				</div>
			)}
		</SkeletonTheme>
	);
}

export default AuthNavSkeleton;

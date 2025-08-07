import React from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

/** @typedef {import("../types").RootState} RootState */

/**
 * Componente que protege rutas, redirigiendo a la página de login si el usuario no está autenticado.
 * @param {object} props
 * @param {React.ReactNode} props.children - El componente a renderizar si el usuario está autenticado.
 * @param {boolean} props.isAuthCheckComplete - Indica si la comprobación de autenticación inicial ha finalizado.
 * @returns {React.ReactNode}
 */
const ProtectedRoute = ({ children, isAuthCheckComplete }) => {
	const { login: isLoggedIn } = useSelector(
		/** @param {RootState} state */
		(state) => state.loginReducer
	);
	const location = useLocation();

	// Si la comprobación de autenticación ha finalizado y el usuario no está logueado,
	// se le redirige a la página de login.
	// Se guarda la ubicación actual (`from: location`) para que, después de iniciar sesión,
	// se pueda redirigir al usuario de vuelta a la página que intentaba visitar.
	if (isAuthCheckComplete && !isLoggedIn) {
		return <Navigate to="/loginPage" state={{ from: location }} replace />;
	}

	// En los demás casos (la comprobación está en curso, o ha finalizado y el usuario está logueado),
	// se renderiza el contenido hijo. El componente `LazyRouteWrapper` (que es el hijo) se encargará
	// de mostrar el esqueleto de carga mientras el componente de la página se carga.
	return children;
};

export default ProtectedRoute;

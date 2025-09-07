import React from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

/** @typedef {import("../../types").RootState} RootState */

/** @typedef {object} ProtectedRouteProps
 * @property {React.ReactNode} children - El componente a renderizar si el usuario está autenticado.
 * @property {boolean} isAuthCheckComplete - Indica si la comprobación de autenticación inicial ha finalizado.
 */

/**
 * Componente que protege rutas, redirigiendo a la página de login si el usuario no está autenticado.
 * @param {ProtectedRouteProps} props
 * @returns {React.ReactNode}
 */
const ProtectedRoute = ({ children, isAuthCheckComplete }) => {
	const { login: isLoggedIn } = useSelector(
		/** @param {RootState} state */
		(state) => state.loginReducer
	);
	// Se obtiene la ubicación actual para redirigir al usuario después de iniciar sesión.
	const location = useLocation();

	// Si la comprobación de autenticación ha finalizado y el usuario no está logueado, se le redirige a la página de login.
	// Se guarda la ubicación actual (`from: location`) para que, después de iniciar sesión, se pueda redirigir al usuario de vuelta
	// a la página que intentaba visitar.
	if (isAuthCheckComplete && !isLoggedIn) {
		return <Navigate to="/loginPage" state={{ from: location }} replace />;
	}

	// Si la comprobación de autenticación aún no ha finalizado, o si ha finalizado y el usuario está autenticado, se renderiza el
	// contenido hijo.
	// Mientras la comprobación está en curso, el componente hijo (`LazyRouteWrapper`) mostrará un esqueleto de carga, evitando una
	// pantalla en blanco.
	return children;
};

ProtectedRoute.propTypes = {
	children: PropTypes.node.isRequired,
	isAuthCheckComplete: PropTypes.bool.isRequired,
};

export default ProtectedRoute;

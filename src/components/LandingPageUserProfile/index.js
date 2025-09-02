import React, { useCallback } from "react";
import { Nav, Button } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { logoutUser } from "../../services/authService";
import { logout } from "../../slicers/loginSlice";
import "bootstrap/dist/css/bootstrap.css";
import styles from "./LandingPageUserProfile.module.css";

/** @typedef {import('types.js').RootState} RootState */

/**
 * Componente que muestra los enlaces de navegación para un usuario logueado, incluyendo un enlace al perfil y un botón para cerrar 
 * sesión.
 * Permite cerrar un menú colapsable (Offcanvas) si se proporciona la función `onClickCloseCollapsible`.
 * @param {object} props - Las propiedades del componente.
 * @param {() => void} [props.onClickCloseCollapsible] - Función para cerrar el menú colapsable (Offcanvas) en breakpoints pequeños.
 * @returns {React.ReactElement} Un elemento JSX que representa los enlaces de navegación del usuario.
 */
function LandingPageUserProfile({ onClickCloseCollapsible }) {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { token } = useSelector(
		/** @param {RootState} state */
		(state) => state.loginReducer
	);

	/**
	 * Maneja el proceso de cierre de sesión del usuario.
	 * Llama al servicio para invalidar el token en el servidor y luego limpia el estado local (Redux y sessionStorage) 
	 * independientemente del resultado del servidor para garantizar que el usuario sea deslogueado en el cliente.
	 */
	const handleLogout = useCallback(async () => {
		onClickCloseCollapsible?.();
		try {
			// Solo intenta invalidar el token en el servidor si realmente existe.
			if (token) {
				await logoutUser(token);
			}
		} catch (error) {
			// Capturamos errores de red o del servidor, pero aún así deslogueamos en el cliente.
			// Esto asegura que el usuario no quede en un estado inconsistente.
			console.error(
				"Falló el logout en el servidor, se procede al logout en el lado del cliente:",
				error
			);
		} finally {
			// La limpieza del lado del cliente se ejecuta siempre.
			dispatch(logout());
			sessionStorage.removeItem("token");
			navigate("/");
		}
	}, [dispatch, navigate, onClickCloseCollapsible, token]);

	return (
		<>
			<Nav.Link
				className={`${styles.profileLink} me-lg-3`}
				as={NavLink}
				to="/userPage"
				onClick={onClickCloseCollapsible}
			>
				Tu perfil
			</Nav.Link>
			<Button
				variant="secondary"
				onClick={handleLogout}
				className="logoutLink"
			>
				Cierra sesión
			</Button>
		</>
	);
}

export default LandingPageUserProfile;

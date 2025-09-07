import React, { useCallback } from "react";
import PropTypes from "prop-types";
import { Nav, Button } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { logoutUser } from "../../services/authService";
import { logout } from "../../slices/loginSlice";
import "bootstrap/dist/css/bootstrap.css";
import styles from "./UserNav.module.css";

/** @typedef {import('types.js').RootState} RootState */

/** @typedef {object} UserNavProps
 * @property {() => void} [onCloseMenu] - Función para cerrar el menú contenedor en breakpoints pequeños.
 */

/**
 * Componente que muestra los enlaces de navegación para un usuario logueado, incluyendo un enlace al perfil y un botón para cerrar
 * sesión.
 * Permite cerrar un menú contenedor (como un Offcanvas o un Dropdown) si se proporciona la función `onCloseMenu`.
 * @param {UserNavProps} props - Las propiedades del componente.
 */
function UserNav({ onCloseMenu }) {
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
		onCloseMenu?.();
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
	}, [dispatch, navigate, onCloseMenu, token]);

	return (
		<>
			<Nav.Link
				className={`${styles.profileLink} me-lg-3`}
				as={NavLink}
				to="/userPage"
				onClick={onCloseMenu}
			>
				Tu perfil
			</Nav.Link>
			<Button variant="secondary" onClick={handleLogout} className="logoutLink">
				Cierra sesión
			</Button>
		</>
	);
}

UserNav.propTypes = {
	onCloseMenu: PropTypes.func,
};

UserNav.defaultProps = {
	onCloseMenu: null,
};

export default UserNav;

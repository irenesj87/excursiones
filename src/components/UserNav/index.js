import React, { useCallback } from "react";
import { Nav, Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
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

	/**
	 * Maneja el proceso de cierre de sesión del usuario.
	 * Llama al servicio de logout para limpiar el token, limpia el estado de Redux y redirige al usuario.
	 */
	const handleLogout = useCallback(() => {
		onCloseMenu?.();

		// 1. Llama a la función de logout del servicio. Esta función es síncrona y ya no necesita 'await'.
		logoutUser();

		// 2. Limpia el estado de Redux.
		dispatch(logout());

		// 3. Redirige al usuario.
		navigate("/");
	}, [dispatch, navigate, onCloseMenu]);

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

export default UserNav;

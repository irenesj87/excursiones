import React from "react";
import { Nav } from "react-bootstrap";
import { Link, NavLink } from "react-router-dom";
import styles from "../AuthNav/AuthNav.module.css";
import { ROUTES } from "../../constants";
import { FiUserPlus, FiLogIn } from "react-icons/fi";

/**
 * @typedef {object} GuestNavProps
 * @property {() => void} [onCloseMenu] - Función para cerrar el menú contenedor en breakpoints pequeños.
 */

/**
 * Muestra los enlaces de navegación para un usuario invitado (no logueado). Permite cerrar un menú contenedor (como un Offcanvas)
 * si se proporciona la función `onCloseMenu`.
 * @param {GuestNavProps} props - Las propiedades del componente.
 * @returns {React.ReactElement} - El componente de navegación para invitados.
 */
const GuestNav = ({ onCloseMenu = () => {} }) => (
	<>
		<Nav.Link
			className={`${styles.registerLink} me-lg-3`}
			as={NavLink}
			to={ROUTES.REGISTER}
			onClick={onCloseMenu}
		>
			<FiUserPlus /> Regístrate
		</Nav.Link>
		<Nav.Link
			as={Link}
			to={ROUTES.LOGIN}
			onClick={onCloseMenu}
			className={`${styles.navButton} loginLink`}
		>
			<FiLogIn /> Inicia sesión
		</Nav.Link>
	</>
);

export default GuestNav;

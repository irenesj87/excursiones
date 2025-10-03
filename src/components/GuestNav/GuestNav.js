import React from "react";
import { Nav, Button } from "react-bootstrap";
import { Link, NavLink } from "react-router-dom";
import styles from "./GuestNav.module.css";
import { ROUTES } from "../../constants";

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
			as={NavLink}
			to={ROUTES.REGISTER}
			href={ROUTES.REGISTER} // Añadimos href para ayudar a TypeScript
			onClick={onCloseMenu}
			className={`${styles.registerLink} btn-outline me-lg-3`}
		>
			Regístrate
		</Nav.Link>
		{/* Envolvemos el Button con Link para evitar conflictos de tipos con la prop 'as' */}
		<Link to={ROUTES.LOGIN} onClick={onCloseMenu}>
			<Button
				variant="" // <-- Añadimos esto para anular los estilos por defecto de React-Bootstrap
				// La clase 'btn-login' es para nuestros estilos personalizados.
				className="btn-login w-100"
			>
				Inicia sesión
			</Button>
		</Link>
	</>
);

export default GuestNav;

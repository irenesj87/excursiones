import { Nav } from "react-bootstrap";
import { Link, NavLink } from "react-router-dom";
import styles from "./GuestNav.module.css";

/**
 * Muestra los enlaces de navegación para un usuario invitado (no logueado). Permite cerrar un menú contenedor (como un Offcanvas)
 * si se proporciona la función `onCloseMenu`.
 * @param {object} props - Las propiedades del componente.
 * @param {() => void} [props.onCloseMenu] - Función para cerrar el menú contenedor en breakpoints pequeños.
 */
const GuestNav = ({ onCloseMenu }) => (
	<>
		<Nav.Link
			className={`${styles.navLink} ${styles.registerLink} me-lg-3`}
			as={NavLink}
			to="/registerPage"
			onClick={onCloseMenu}
		>
			Regístrate
		</Nav.Link>
		<Nav.Link
			as={Link}
			to="/loginPage"
			onClick={onCloseMenu}
			className={`btn ${styles.navButton} loginLink`}
		>
			Inicia sesión
		</Nav.Link>
	</>
);

export default GuestNav;

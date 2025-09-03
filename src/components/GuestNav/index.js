import { Nav } from "react-bootstrap";
import { Link, NavLink } from "react-router-dom";
import styles from "./GuestNav.module.css";

/**
 * Muestra los enlaces de navegación para un usuario invitado (no logueado).
 * @param {{ onCloseOffcanvas: () => void }} props
 */
const GuestNav = ({ onCloseOffcanvas }) => (
	<>
		<Nav.Link
			className={`${styles.navLink} ${styles.registerLink} me-lg-3`}
			as={NavLink}
			to="/registerPage"
			onClick={onCloseOffcanvas}
		>
			Regístrate
		</Nav.Link>
		<Nav.Link
			as={Link}
			to="/loginPage"
			onClick={onCloseOffcanvas}
			className={`btn ${styles.navButton} loginLink`}
		>
			Inicia sesión
		</Nav.Link>
	</>
);

export default GuestNav;

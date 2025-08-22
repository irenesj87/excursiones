import { Nav } from "react-bootstrap";
import { Link, NavLink } from "react-router-dom";
import LandingPageUserProfile from "../LandingPageUserProfile";
import AuthNavSkeleton from "../skeletons/AuthNavSkeleton";
import styles from "./AuthNav.module.css";

/**
 * Muestra el contenido de navegación de autenticación apropiado.
 * Renderiza un esqueleto de carga, los enlaces de usuario autenticado o los de invitado.
 * @param {object} props
 * @param {boolean} props.isAuthCheckComplete - Si la comprobación de autenticación ha finalizado.
 * @param {boolean} props.isLoggedIn - Si el usuario está logueado.
 * @param {() => void} props.onCloseOffcanvas - Función para cerrar el menú Offcanvas al hacer clic en un enlace.
 */
const AuthNav = ({ isAuthCheckComplete, isLoggedIn, onCloseOffcanvas }) => {
	if (!isAuthCheckComplete) {
		return <AuthNavSkeleton />;
	}

	if (isLoggedIn) {
		return (
			<LandingPageUserProfile onClickCloseCollapsible={onCloseOffcanvas} />
		);
	}

	return (
		<>
			<Nav.Link
				className={`${styles.navLink} ${styles.registerLink} me-3`}
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
};

export default AuthNav;

import { Nav } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { logout } from "../slicers/loginSlice";
import "bootstrap/dist/css/bootstrap.css";
import styles from "../css/LandingPageUserProfile.module.css";

/**
 * Componente que muestra los enlaces de navegación para un usuario logueado (Perfil y Cerrar sesión).
 * @param {function} props.onClickCloseCollapsible - Función para cerrar el menú colapsable (Offcanvas) en breakpoints pequeños.
 */
function LandingPageUserProfile({ onClickCloseCollapsible }) {
	const logoutDispatch = useDispatch();
	const { token } = useSelector((state) => state.loginReducer);
	const url = "http://localhost:3001/login";
	const options = {
		method: "DELETE",
		mode: "cors",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
	};

	/** La función para desloguearse es una petición DELETE. Normalmente una petición de DELETE a un endpoint de login
	 * se utiliza para invalidar la sesión o el token en el lado del servidor. En muchos casos, puede que el servidor no
	 * vuelva a mandar ningún dato importante en el cuerpo de una petición DELETE exitosa. Puede que mande un código de estado
	 * (como 204 No Content) para indicar el éxito.
	 *
	 * Maneja el proceso de cierre de sesión del usuario.
	 * Realiza una petición DELETE al servidor para invalidar el token y luego actualiza el estado de Redux y sessionStorage.
	 */
	const logOut = async () => {
		if (onClickCloseCollapsible) {
			onClickCloseCollapsible();
		}
		try {
			const response = await fetch(url, options);
			if (!response.ok) {
				throw new Error("HTTP error " + response.status);
			}
			// El usuario se desloguea...
			logoutDispatch(logout());
			// ...y su token se elimina
			delete sessionStorage["token"];
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<>
			<Nav.Link
				className={`${styles.profileLink} me-3`}
				as={Link}
				to="/UserPage"
				onClick={onClickCloseCollapsible}
			>
				Perfil
			</Nav.Link>
			<Nav.Link className={styles.logoutLink} onClick={logOut}>
				Cerrar sesión
			</Nav.Link>
		</>
	);
}

export default LandingPageUserProfile;

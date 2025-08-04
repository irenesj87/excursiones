import React from "react";
import { Nav, Button } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { logout } from "../slicers/loginSlice";
import "bootstrap/dist/css/bootstrap.css";
import styles from "../css/LandingPageUserProfile.module.css";

/** @typedef {import('types.js').RootState} RootState */

/**
 * Componente que muestra los enlaces de navegación para un usuario logueado, incluyendo un enlace al perfil y un botón para cerrar sesión.
 * Permite cerrar un menú colapsable (Offcanvas) si se proporciona la función `onClickCloseCollapsible`.
 * @param {object} props - Las propiedades del componente.
 * @param {() => void} [props.onClickCloseCollapsible] - Función para cerrar el menú colapsable (Offcanvas) en breakpoints pequeños.
 * @returns {React.ReactElement} Un elemento JSX que representa los enlaces de navegación del usuario.
 */
function LandingPageUserProfile({ onClickCloseCollapsible }) {
	const logoutDispatch = useDispatch();
	const { token } = useSelector(
		/** @param {RootState} state */
		(state) => state.loginReducer
	);
	const url = "http://localhost:3001/login";
	/** @type {RequestInit} */
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
				// A pesar del error, procedemos a desloguear al usuario en el cliente.
				// Es importante registrar el error para depuración.
				console.error("El logout en el servidor falló:", response.status);
			}
		} catch (error) {
			// Capturamos errores de red y otros problemas, pero aún así deslogueamos en el cliente.
			console.error("Error durante la petición de logout:", error);
		} finally {
			// El usuario se desloguea...
			logoutDispatch(logout());
			// ...y su token se elimina
			delete sessionStorage["token"];
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
				Tu perfil
			</Nav.Link>
			<Button
				variant="secondary"
				onClick={logOut}
				className={styles.logoutButton}
			>
				Cierra sesión
			</Button>
		</>
	);
}

export default LandingPageUserProfile;

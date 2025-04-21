import React from "react";
import { Nav } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { logout } from "../slicers/loginSlice";
import "bootstrap/dist/css/bootstrap.css";
import styles from "../css/LandingPageUserProfile.module.css";

function LandingPageUserProfile(props) {
	const logoutDispatch = useDispatch();
	// Variable que tiene el token guardado en la store
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

	/* La función para desloguearse es una petición DELETE. Normalmente una petición de DELETE a un endpoint de login 
	se utiliza para invalidar la sesión o el token en el lado del servidor. En muchos casos, puede que el servidor no vuelva 
	a mandar ningún dato importante en el cuerpo de una petición DELETE exitosa. Puede que mande un código de status 
	(como 204 No Content) para indicar el éxito. */
	const logOut = async () => {
		if (props.onClickCloseCollapsible) {
			props.onClickCloseCollapsible();
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
				className={`${styles.profileLink} me-2`}
				as={Link}
				to="/UserPage"
				onClick={props.onClickCloseCollapsible}
			>
				Perfil
			</Nav.Link>
			<Nav.Link onClick={logOut}>Cerrar sesión</Nav.Link>
		</>
	);
}

export default LandingPageUserProfile;

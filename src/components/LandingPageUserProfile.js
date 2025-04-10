import React from "react";
import { Nav, Button } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { logout } from "../slicers/loginSlice";
import { FaCircleUser } from "react-icons/fa6";
import "bootstrap/dist/css/bootstrap.css";
import styles from "../css/LandingPageUserProfile.module.css";

function LandingPageUserProfile(props) {
	// Variable que se necesita para utilizar los dispatcher
	const logoutDispatch = useDispatch();
	// Variable que tiene el token guardado en la store
	const { token } = useSelector((state) => state.loginReducer);
	// Variable que tiene la url que se necesita para el fetch
	const url = "http://localhost:3001/login";
	// Opciones para el fetch
	const options = {
		method: "DELETE",
		mode: "cors",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
	};

	/*The function for loggin out is a DELETE request to http://localhost:3001/login. 
	Typically, a DELETE request to a login endpoint is used to invalidate a session or token on the server-side. 
	In many cases, the server might not send back any meaningful data in the response body for a successful DELETE 
	request. It might just send back a status code (like 204 No Content) to indicate success.*/
	const logOut = async () => {
		try {
			const response = await fetch(url, options);
			if (!response.ok) {
				throw new Error("HTTP error " + response.status);
			}
			// The user logs out...
			logoutDispatch(logout());
			// ...and his/her token is deleted
			delete sessionStorage["token"];
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<>
			<Nav.Link className={`${styles.dropdownText} me-3`} as={Link} to="UserPage">
				<FaCircleUser />
				Perfil
			</Nav.Link>
			<Button className={styles.dropdownText} variant="outline-danger" onClick={logOut}>
				Cerrar sesión
			</Button>
		</>
	);
}

export default LandingPageUserProfile;

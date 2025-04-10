import React from "react";
import { SplitButton, Dropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import "bootstrap/dist/css/bootstrap.css";
import styles from "../css/LandingPageUserProfile.module.css";
import { logout } from "../slicers/loginSlice";

function LandingPageUserProfile(props) {
	// Variable that we need to be able to use dispatchers
	const logoutDispatch = useDispatch();
	// This useSelector variable has the token that it is saved in the store
	const { token } = useSelector((state) => state.loginReducer);
	// Variable that has the url that is needed for the fetch
	const url = "http://localhost:3001/login";
	// Variable that saves the options that the fetch needs
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
			<SplitButton
				title={<div>Hola, {props.name}</div>}
				align="end"
			>
				<Dropdown.Item className={styles.dropdownText} as={Link} to="UserPage">
					Tu perfil
				</Dropdown.Item>
				<Dropdown.Divider />
				<Dropdown.Item
					className={styles.dropdownText}
					as={Link}
					to="/"
					onClick={logOut}
				>
					Cerrar sesión
				</Dropdown.Item>
			</SplitButton>
		</>
	);
}

export default LandingPageUserProfile;

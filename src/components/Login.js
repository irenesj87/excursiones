import React, { useEffect, useState } from "react";
import { Button, Dropdown, DropdownButton, Form } from "react-bootstrap";
import { validateMail, validatePassword } from "../validation/validations.js";
import ValidatedFormGroup from "./ValidatedFormGroup";
import { login } from "../slicers/loginSlice";
import { useDispatch } from "react-redux";
import { userLogin } from "../helpers/helpers.js";
import "bootstrap/dist/css/bootstrap.css";
import styles from "../css/Login.module.css";

export function Login() {
	// Variable that we need to be able to use dispatchers
	const loginDispatch = useDispatch();
	// Variable that saves if the login button is disabled or not
	const [disabled, setDisabled] = useState(true);
	// Variable that receive and change the mail that we received from the login form inputs
	const [mail, setMail] = useState("");
	// Variable that receive and change the password that we received from the login form inputs
	const [password, setPassword] = useState("");

	// Function that submits the information for the login form, saves the user and the token in the store and in the case of the token saves it in the sessionStorage too
	const submit = async (e) => {
		e.preventDefault();
		try {
			const data = await userLogin(mail, password);
			//The user logs in and we store his/her info and his/her token in the store
			loginDispatch(
				login({
					user: data.user,
					token: data.token,
				})
			);
			//...and then we save his/her token in the browser sessionStorage
			window.sessionStorage["token"] = data.token;
		} catch (error) {
			alert(error);
		}
	};

	// This useEffect disables the button to log until all the information in the login inputs is correct
	useEffect(() => {
		if (validateMail(mail) && validatePassword(password)) {
			setDisabled(false);
		} else {
			setDisabled(true);
		}
	}, [mail, password]);

	return (
		<DropdownButton
			className={styles.loginDropdownButton}
			title="Inicia sesión"
			autoClose={"outside"}
		>
			<Dropdown.Item as="div" className={styles.loginDropdownButtonItem}>
				<Form id="loginForm" noValidate onSubmit={submit} className={styles.formText}>
					<ValidatedFormGroup
						id="formLoginDropdownEmail"
						name="Correo electrónico"
						inputType="email"
						inputToChange={setMail}
						validationFunction={validateMail}
						value={mail}
						message={false}
						autocomplete="email"
						
					/>
					<ValidatedFormGroup
						id="formLoginDropdownPassword"
						inputType="password"
						name="Contraseña"
						inputToChange={setPassword}
						validationFunction={validatePassword}
						value={password}
						message={false}
						autocomplete="current-password"
					/>
					<Button
						className={`${styles.sendBtn} mt-3`}
						variant={disabled ? "secondary" : "success"} // Dynamic color
						type="submit"
						disabled={disabled}
					>
						Enviar
					</Button>
				</Form>
			</Dropdown.Item>
		</DropdownButton>
	);
}

export default Login;

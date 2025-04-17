import React, { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router";
import { validateMail, validatePassword } from "../validation/validations.js";
import ValidatedFormGroup from "./ValidatedFormGroup";
import { login } from "../slicers/loginSlice";
import { useDispatch } from "react-redux";
import { userLogin } from "../helpers/helpers.js";
import styles from "../css/LoginForm.module.css";

// Component that validates the input info and disables the "Enviar" button until that info is correct
export function LoginForm() {
	const loginDispatch = useDispatch();
	const navigate = useNavigate();

	const [mail, setMail] = useState("");
	const [password, setPassword] = useState("");

	// Variable that saves if the login button is disabled or not
	const [disabled, setDisabled] = useState(true);

	/* Function that sends the login form info to the server. It saves the user in the store and the token in the store and 
	in sessionStorage */
	const submit = async (e) => {
		e.preventDefault();
		try {
			const data = await userLogin(mail, password);
			// The user logs in and we save his info and his token in the store...
			loginDispatch(
				login({
					user: data.user,
					token: data.token,
				})
			);
			// ...and after that we save the token in sessionStorage
			window.sessionStorage["token"] = data.token;

			// When the user logs in we send him to his user page
			navigate("/UserPage");
		} catch (error) {
			console.error("Login failed:", error);
			alert("Error al iniciar sesión.");
		}
	};

	// useEffect that disables the button "Enviar" until the user writes the correct info in the inputs
	useEffect(() => {
		if (validateMail(mail) && validatePassword(password)) {
			setDisabled(false);
		} else {
			setDisabled(true);
		}
	}, [mail, password]);

	return (
		<Form
			id="loginForm"
			noValidate
			onSubmit={submit}
			className={styles.formText}
		>
			<ValidatedFormGroup
				id="formLoginEmail"
				name="Correo electrónico"
				inputType="email"
				inputToChange={setMail}
				validationFunction={validateMail}
				value={mail}
				message={false}
				autocomplete="email"
			/>
			<ValidatedFormGroup
				id="formLoginPassword"
				inputType="password"
				name="Contraseña"
				inputToChange={setPassword}
				validationFunction={validatePassword}
				value={password}
				message={false}
				autocomplete="current-password"
			/>
			<div className="text-center">
				<Button
					className="mt-3"
					variant={disabled ? "secondary" : "success"}
					type="submit"
					disabled={disabled}
				>
					Enviar
				</Button>
			</div>
		</Form>
	);
}

export default LoginForm;

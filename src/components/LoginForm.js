import React, { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router";
import { validateMail, validatePassword } from "../validation/validations.js";
import ValidatedFormGroup from "./ValidatedFormGroup";
import { login } from "../slicers/loginSlice";
import { useDispatch } from "react-redux";
import { userLogin } from "../helpers/helpers.js";
import styles from "../css/LoginForm.module.css";

// Recibe una prop 'onLoginSuccess' para notificar cuando el login es exitoso (útil para cerrar el modal)
export function LoginForm({ onLoginSuccess }) {
	const loginDispatch = useDispatch();
	const navigate = useNavigate();
	// Variable que guarda si el botón de login está deshabilitado o no
	const [disabled, setDisabled] = useState(true);
	// Variable que guarda el correo que recibimos del input
	const [mail, setMail] = useState("");
	// Variable que guarda la contraseña que recibimos del input
	const [password, setPassword] = useState("");

	/* Función que manda al servidor la info que nos llega del formulario del login. Guarda el usuario en la store
    y el token tanto en la store como en sessionStorage*/
	const submit = async (e) => {
		e.preventDefault();
		try {
			const data = await userLogin(mail, password);
			// El usuario se loguea y guardamos su info y su token en la store...
			loginDispatch(
				login({
					user: data.user,
					token: data.token,
				})
			);
			// ...después guardamos su token en sessionStorage
			window.sessionStorage["token"] = data.token;

			// Cuando el usuario inicia sesión se le manda a su página de usuario
			navigate("UserPage");

			// Notifica al componente padre que el login fue exitoso
			if (onLoginSuccess) {
				onLoginSuccess();
			}
		} catch (error) {
			console.error("Login failed:", error);
			alert("Error al iniciar sesión.");
		}
	};

	// Este useEffect deshabilita el botón de "Enviar" hasta que se haya puesto la info correcta en los inputs
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

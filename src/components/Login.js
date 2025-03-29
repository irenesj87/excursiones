import React, { useEffect, useState } from "react";
import { Button, Dropdown, DropdownButton } from "react-bootstrap";
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
	const submit = () => {
		userLogin(mail, password)
			.then((data) => {
				// The user logs in and we store his/her info and his/her token in the store...
				loginDispatch(
					login({
						user: data.user,
						token: data.token,
					})
				);
				// ...and then we save his/her token in the navigator sessionStorage
				window.sessionStorage["token"] = data.token;
			})
			.catch((error) => alert(error));
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
			variant="success"
			title="Inicia sesión"
			autoClose={false}
		>
<<<<<<< HEAD
			<Dropdown.Item className={styles.loginDropdownButtonText}>
=======
			<Dropdown.ItemText className={styles.loginDropdownButtonText}>
>>>>>>> 5525838f8f767505d321a791e1b4940e8dfe9b30
				<div className={styles.formText}>
					<ValidatedFormGroup
						control="formBasicEmail"
						name="Correo electrónico"
						inputToChange={setMail}
						validationFunction={validateMail}
						value={mail}
						message={false}
					/>
				</div>
				<p>Nunca compartiremos tus datos con nadie</p>
<<<<<<< HEAD
			</Dropdown.Item>
			<Dropdown.Item className={styles.loginDropdownButtonItem}>
=======
			</Dropdown.ItemText>
			<Dropdown.ItemText>
>>>>>>> 5525838f8f767505d321a791e1b4940e8dfe9b30
				<div className={styles.formText}>
					<ValidatedFormGroup
						control="formBasicPassword"
						inputType="password"
						name="Contraseña"
						inputToChange={setPassword}
						validationFunction={validatePassword}
						value={password}
						message={false}
					/>
				</div>
<<<<<<< HEAD
			</Dropdown.Item>
			<Dropdown.Item className={styles.loginDropdownButtonItem}>
=======
			</Dropdown.ItemText>
			<Dropdown.ItemText>
>>>>>>> 5525838f8f767505d321a791e1b4940e8dfe9b30
				{disabled && (
					<Button
						className={styles.sendBtn}
						variant="secondary"
						type="submit"
						onClick={submit}
						disabled={disabled}
					>
						Enviar
					</Button>
				)}
				{!disabled && (
					<Button
						className={styles.sendBtn}
						variant="success"
						type="submit"
						onClick={submit}
						disabled={disabled}
					>
						Enviar
					</Button>
				)}
<<<<<<< HEAD
			</Dropdown.Item>
=======
			</Dropdown.ItemText>
>>>>>>> 5525838f8f767505d321a791e1b4940e8dfe9b30
		</DropdownButton>
	);
}

export default Login;

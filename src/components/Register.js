import React, { useState, useEffect } from "react";
import { Row, Col, Form, Button, Container } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../slicers/loginSlice";
import ValidatedFormGroup from "./ValidatedFormGroup";
import {
	validateName,
	validateSurname,
	validatePhone,
	validateMail,
	validatePassword,
	validSamePassword,
} from "../validation/validations.js";
import { userLogin, registerUser } from "../helpers/helpers";
import "bootstrap/dist/css/bootstrap.css";
import styles from "../css/Register.module.css";

function Register() {
	// Variable that we need to be able to use dispatchers
	const loginDispatch = useDispatch();
	// Variable that we need to be able to use navigate
	const navigate = useNavigate();
	// Variable that saves if the register button is disabled or not
	const [disabled, setDisabled] = useState(true);
	// Variable that receive and change the name that we received from the login form inputs
	const [name, setName] = useState("");
	// Variable that receive and change the surname that we received from the login form inputs
	const [surname, setSurname] = useState("");
	// Variable that receive and change the phone that we received from the login form inputs
	const [phone, setPhone] = useState("");
	// Variable that receive and change the mail that we received from the login form inputs
	const [mail, setMail] = useState("");
	// Variable that receive and change the password that we received from the login form inputs
	const [password, setPassword] = useState("");
	// Variable that receive and change the password that we received from the login form inputs
	const [samePassword, setSamePassword] = useState("");

	// Function that allows register an user sending a POST request
	const submit = async (e) => {
		// Prevenir el comportamiento por defecto del formulario
		e.preventDefault();
		try {
			/* We use the function for register an user from the helpers. This function sends a POST request to your 
			server to create a new user. In many cases, the server might not send back any meaningful data in the 
			response body for a successful registration. It might just send back a status code (like 201 Created) to 
			indicate success.*/
			await registerUser(name, surname, phone, mail, password);
			// Log in the user automatically after registration
			const loginData = await userLogin(mail, password);

			// Dispatch the login action to update the Redux store
			loginDispatch(
				login({
					user: loginData.user,
					token: loginData.token,
				})
			);
			// Save the token in sessionStorage
			window.sessionStorage["token"] = loginData.token;
			// Navigate to the home page
			navigate("/");
		} catch (error) {
			alert(error);
		}
	};

	// This useEffect disables the button to register until all the information in the register inputs is correct
	useEffect(() => {
		if (
			validateName(name) &&
			validateSurname(surname) &&
			validatePhone(phone) &&
			validateMail(mail) &&
			validatePassword(password) &&
			validSamePassword(password, samePassword)
		) {
			setDisabled(false);
		} else {
			setDisabled(true);
		}
	}, [name, surname, phone, mail, password, samePassword]);

	return (
		<Container className={styles.container}>
			<Row>
				<Col xs="12">
					<h2 className={styles.title}>Bienvenido/a</h2>
				</Col>
			</Row>
			<Col>
				<Form id="registerForm" className={styles.form} onSubmit={submit}>
					<Row className="mb-3">
						<ValidatedFormGroup
							id="formGridName"
							name="Nombre"
							inputToChange={setName}
							validationFunction={validateName}
							value={name}
							message={true}
						/>
						<ValidatedFormGroup
							id="formGridSurname"
							name="Apellidos"
							inputToChange={setSurname}
							validationFunction={validateSurname}
							value={surname}
							message={true}
						/>
					</Row>
					<Row className="mb-3">
						<ValidatedFormGroup
							id="formGridPhone"
							name="Teléfono"
							inputType="tel"
							inputToChange={setPhone}
							validationFunction={validatePhone}
							value={phone}
							message={true}
						/>
						<ValidatedFormGroup
							id="formGridEmail"
							name="Correo electrónico"
							inputType="email"
							inputToChange={setMail}
							validationFunction={validateMail}
							value={mail}
							message={true}
							autocomplete="email"
						/>
					</Row>
					<Row>
						<ValidatedFormGroup
							id="password"
							name="Contraseña"
							inputType="password"
							inputToChange={setPassword}
							validationFunction={validatePassword}
							value={password}
							message={true}
							autocomplete="new-password"
						/>
						<ValidatedFormGroup
							id="confirm-password"
							name="Repite la contraseña"
							inputType="password"
							inputToChange={setSamePassword}
							validationFunction={validatePassword}
							value={samePassword}
							message={true}
							autocomplete="new-password"
						/>
					</Row>
					<Row>
						<ul className={styles.list}>
							<li>
								Tu contraseña debe tener al menos 8 caracteres, una letra y un
								número
							</li>
							<li>
								Debes registrarte para poder apuntarte a las excursiones
							</li>
						</ul>
					</Row>
					<div className={styles.btn}>
						{disabled && (
							<Button variant="secondary" type="submit" disabled={disabled}>
								Enviar
							</Button>
						)}
						{!disabled && (
							<Button variant="success" type="submit" disabled={disabled}>
								Enviar
							</Button>
						)}
					</div>
				</Form>
			</Col>
		</Container>
	);
}

export default Register;

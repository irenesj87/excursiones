import React, { useState, useEffect } from "react";
import { Row, Col, Form, Button, Container, Card } from "react-bootstrap";
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
import ErrorMessagesAlert from "./ErrorMessagesAlert.js";
import "bootstrap/dist/css/bootstrap.css";
import styles from "../css/Register.module.css";

function Register() {
	const loginDispatch = useDispatch();
	const navigate = useNavigate();
	const [disabled, setDisabled] = useState(true);
	const [name, setName] = useState("");
	const [surname, setSurname] = useState("");
	const [phone, setPhone] = useState("");
	const [mail, setMail] = useState("");
	const [password, setPassword] = useState("");
	const [samePassword, setSamePassword] = useState("");
	const [registerError, setRegisterError] = useState(null);
	const [showErrorAlert, setShowErrorAlert] = useState(false);

	const submit = async (e) => {
		e.preventDefault();
		setRegisterError(null);
		setShowErrorAlert(false);

		try {
			await registerUser(name, surname, phone, mail, password);
			const loginData = await userLogin(mail, password);

			loginDispatch(
				login({
					user: loginData.user,
					token: loginData.token,
				})
			);
			window.sessionStorage["token"] = loginData.token;
			navigate("/");
		} catch (error) {
			// Consider more specific error handling/user feedback
			console.error("Registration or login failed:", error);
			setRegisterError(error.message || "Error al registrarse.");
			setShowErrorAlert(true);
		}
	};

	useEffect(() => {
		const isValid =
			validateName(name) &&
			validateSurname(surname) &&
			validatePhone(phone) &&
			validateMail(mail) &&
			validatePassword(password) &&
			validSamePassword(password, samePassword);
		setDisabled(!isValid);
	}, [name, surname, phone, mail, password, samePassword]);

	return (
		// Use fluid container for full width or remove fluid for fixed width
		<Container fluid className={styles.container}>
			<>
				<Row>
					<Col xs="12">
						<h2 className={styles.title}>Bienvenido/a</h2>
					</Col>
				</Row>
				<Row className="justify-content-center align-items-center">
					{/* Adjust column sizing for responsiveness */}
					<Col xs={11} sm={10} md={8} lg={7} xl={5}>
						<Card className={styles.registerCard}>
							{/* Add a class for specific card styling */}
							<Card.Body>
								{showErrorAlert && registerError && (
									<ErrorMessagesAlert
										show={showErrorAlert}
										message={registerError}
										onClose={() => {
											setShowErrorAlert(false);
											setRegisterError(null);
										}}
									/>
								)}
								<Form id="registerForm" onSubmit={submit}>
									{/* Use Rows inside Card.Body for form layout */}
									<Row className="mb-3">
										<ValidatedFormGroup
											as={Col} // Pass Col props directly if needed
											xs={12}
											md={6}
											id="formGridName"
											name="Nombre"
											inputToChange={setName}
											validationFunction={validateName}
											value={name}
											message={true}
											autocomplete="given-name" // More specific autocomplete
										/>
										<ValidatedFormGroup
											as={Col}
											xs={12}
											md={6}
											id="formGridSurname"
											name="Apellidos"
											inputToChange={setSurname}
											validationFunction={validateSurname}
											value={surname}
											message={true}
											autocomplete="family-name" // More specific autocomplete
										/>
									</Row>
									<Row className="mb-3">
										<ValidatedFormGroup
											as={Col}
											xs={12}
											md={6}
											id="formGridPhone"
											name="Teléfono"
											inputType="tel"
											inputToChange={setPhone}
											validationFunction={validatePhone}
											value={phone}
											message={true}
											autocomplete="tel" // More specific autocomplete
										/>
										<ValidatedFormGroup
											as={Col}
											xs={12}
											md={6}
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
									<Row className="mb-3">
										<ValidatedFormGroup
											as={Col}
											xs={12}
											md={6}
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
											as={Col}
											xs={12}
											md={6}
											id="confirm-password"
											name="Repite la contraseña"
											inputType="password"
											inputToChange={setSamePassword}
											// Use validSamePassword directly here if ValidatedFormGroup doesn't support comparing two fields
											// Or adjust ValidatedFormGroup to handle this case
											validationFunction={(value) =>
												validSamePassword(password, value)
											}
											value={samePassword}
											message={true}
											autocomplete="new-password"
										/>
									</Row>
									<ul className={`${styles.infoMessages} mb-3`}>
										<li>
											Tu contraseña debe tener al menos 8 caracteres, una letra
											y un número.
										</li>
									</ul>
									<div className="text-center mt-4">
										<Button
											variant={disabled ? "secondary" : "success"}
											type="submit"
											disabled={disabled}
										>
											Enviar
										</Button>
									</div>
								</Form>
							</Card.Body>
						</Card>
					</Col>
				</Row>
			</>
		</Container>
	);
}

export default Register;

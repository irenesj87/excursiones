import React, { useState, useEffect } from "react";
import { Row, Col, Form, Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../slicers/loginSlice.js";
import ValidatedFormGroup from "./ValidatedFormGroup.js";
import {
	validateName,
	validateSurname,
	validatePhone,
	validateMail,
	validatePassword,
	validSamePassword,
} from "../validation/validations.js";
import { userLogin, registerUser } from "../helpers/helpers.js";
import ErrorMessageAlert from "./ErrorMessageAlert.js";
import "bootstrap/dist/css/bootstrap.css";
import styles from "../css/RegisterForm.module.css";

function RegisterForm() {
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
		<>
			{showErrorAlert && registerError && (
				<ErrorMessageAlert
					show={showErrorAlert}
					message={registerError}
					onClose={() => {
						setShowErrorAlert(false);
						setRegisterError(null);
					}}
				/>
			)}
			<Form id="registerForm" className={`${styles.formLabel} mb-3 fw-bold`} onSubmit={submit}>
				<Row>
					<ValidatedFormGroup
						as={Col}
						xs={12}
						md={6}
						id="formGridName"
						name="Nombre"
						inputToChange={setName}
						validationFunction={validateName}
						value={name}
						message={true}
						autocomplete="given-name"
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
						autocomplete="family-name"
					/>
				</Row>
				<Row>
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
						autocomplete="tel"
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
				<Row>
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
						validationFunction={(value) => validSamePassword(password, value)}
						value={samePassword}
						message={true}
						autocomplete="new-password"
					/>
				</Row>
				<ul className={`${styles.infoMessage} mb-3`}>
					<li>
						Tu contraseña debe tener al menos 8 caracteres, una letra y un
						número.
					</li>
				</ul>
				{/* Modificamos el contenedor del botón para usar Row y Col */}
				{/* mt-5 pt-3 border-top se mantiene para los estilos visuales */}
				<div className="mt-5 pt-3 border-top">					
					{/* justify-content-sm-end alineará la Col a la derecha en breakpoints sm y mayores */}
					<Row className="justify-content-sm-end">
						{/* xs={12} hace que la Col ocupe el ancho en pantallas extra pequeñas */}
						{/* sm="auto" hace que la Col se ajuste al contenido en pantallas sm y mayores */}
						<Col xs={12} sm="auto">
							<Button
								variant={disabled ? "secondary" : "success"}
								type="submit"
								disabled={disabled}
								className="w-100" // w-100 hace que el botón ocupe el ancho de su Col padre
							>
								Enviar
							</Button>
						</Col>
					</Row>
				</div>
			</Form>
		</>
	);
}

export default RegisterForm;

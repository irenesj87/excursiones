import { useState, useEffect } from "react";
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

// Componente que contiene la lógica del formulario de registro
function RegisterForm() {
	// Hook para despachar acciones de Redux.
	const loginDispatch = useDispatch();
	// Hook para la navegación programática.
	const navigate = useNavigate();

	// Estados locales para los campos del formulario y el control de la UI.
	// Estado para controlar si el botón de envío está deshabilitado.
	const [disabled, setDisabled] = useState(true);
	// Estado para el nombre del usuario.
	const [name, setName] = useState("");
	// Estado para los apellidos del usuario.
	const [surname, setSurname] = useState("");
	// Estado para el teléfono del usuario.
	const [phone, setPhone] = useState("");
	// Estado para el correo electrónico del usuario.
	const [mail, setMail] = useState("");
	// Estado para la contraseña del usuario.
	const [password, setPassword] = useState("");
	// Estado para la confirmación de la contraseña.
	const [samePassword, setSamePassword] = useState("");
	// Estado para almacenar mensajes de error de registro.
	const [registerError, setRegisterError] = useState(null);
	// Estado para controlar la visibilidad de la alerta de error.
	const [showErrorAlert, setShowErrorAlert] = useState(false);

	/**
	 * Maneja el envío del formulario de registro. Realiza el registro del usuario, lo loguea automáticamente y lo redirige a
	 * la página principal.
	 */
	const submit = async (e) => {
		e.preventDefault();
		setRegisterError(null);
		setShowErrorAlert(false);

		try {
			// Intenta registrar al nuevo usuario con los datos proporcionados.
			await registerUser(name, surname, phone, mail, password);
			// Si el registro es exitoso, intenta loguear al usuario automáticamente.
			const loginData = await userLogin(mail, password);

			// Despacha la acción de login para actualizar el estado de Redux con la información del usuario y el token.
			loginDispatch(
				login({
					user: loginData.user,
					token: loginData.token,
				})
			);
			// Guarda el token en sessionStorage para persistencia de la sesión.
			window.sessionStorage["token"] = loginData.token;
			// Redirige al usuario a la página principal.
			navigate("/");
		} catch (error) {
			console.error("Registration or login failed:", error);
			setRegisterError(error.message || "Error al registrarse.");
			setShowErrorAlert(true);
		}
	};

	/**
	 * Efecto que habilita o deshabilita el botón de envío del formulario.El botón se habilita solo si todos los campos del
	 * formulario cumplen con las validaciones.
	 */
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
			{/* Muestra la alerta de error si showErrorAlert es true y hay un mensaje de error. */}
			{showErrorAlert && registerError && (
				<ErrorMessageAlert
					message={registerError}
					onClose={() => {
						setShowErrorAlert(false);
						setRegisterError(null);
					}}
				/>
			)}
			{/* Formulario de registro */}
			<Form
				id="registerForm"
				className={`${styles.formLabel} fw-bold`}
				onSubmit={submit}
			>
				<Row>
					{/* Campo para el nombre */}
					<Col xs={12} md={6}>
						<ValidatedFormGroup
							id="formGridName"
							name="Nombre"
							inputToChange={setName}
							validationFunction={validateName}
							value={name}
							message={true}
							autocomplete="given-name"
						/>
					</Col>
					{/* Campo para los apellidos */}
					<Col xs={12} md={6}>
						<ValidatedFormGroup
							id="formGridSurname"
							name="Apellidos"
							inputToChange={setSurname}
							validationFunction={validateSurname}
							value={surname}
							message={true}
							autocomplete="family-name"
						/>
					</Col>
				</Row>
				<Row>
					{/* Campo para el teléfono */}
					<Col xs={12} md={6}>
						<ValidatedFormGroup
							id="formGridPhone"
							name="Teléfono"
							inputType="tel"
							inputToChange={setPhone}
							validationFunction={validatePhone}
							value={phone}
							message={true}
							autocomplete="tel"
						/>
					</Col>
					{/* Campo para el correo electrónico */}
					<Col xs={12} md={6}>
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
					</Col>
				</Row>
				<Row>
					{/* Campo para la contraseña */}
					<Col xs={12} md={6}>
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
					</Col>
					{/* Campo para la confirmación de contraseña */}
					<Col xs={12} md={6}>
						<ValidatedFormGroup
							id="confirm-password" // ID para el campo de confirmación de contraseña.
							name="Repite la contraseña"
							inputType="password"
							inputToChange={setSamePassword}
							validationFunction={(value) => validSamePassword(password, value)}
							value={samePassword}
							message={true}
							autocomplete="new-password"
						/>
					</Col>
				</Row>
				{/* Mensaje informativo sobre los requisitos de la contraseña. */}
				<ul className={`${styles.infoMessage} mb-3`}>
					<li>
						Tu contraseña debe tener al menos 8 caracteres, una letra y un
						número.
					</li>
				</ul>

				<div className="mt-5 pt-3">
					{/* justify-content-sm-end alineará la Col a la derecha en breakpoints 'sm' y mayores */}
					<Row className="justify-content-sm-end">
						{/* sm="auto" hace que la Col se ajuste al contenido en breakpoints 'sm' y mayores */}
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

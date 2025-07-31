import { useState, useEffect, useReducer, useRef } from "react";
import { Row, Col, Form, Button, Spinner } from "react-bootstrap";
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

// Estado inicial para el reducer del formulario.
const initialState = {
	isLoading: false,
	error: null,
	isButtonDisabled: true,
};

/**
 * Reducer para gestionar el estado del formulario de registro.
 * @param {object} state - El estado actual del formulario.
 * @param {object} action - La acción a despachar.
 */
function registerReducer(state, action) {
	switch (action.type) {
		case "REGISTER_START":
			return { ...state, isLoading: true, error: null };
		case "REGISTER_SUCCESS":
			return { ...state, isLoading: false };
		case "REGISTER_FAILURE":
			return { ...state, isLoading: false, error: action.payload };
		case "SET_VALIDITY":
			return { ...state, isButtonDisabled: !action.payload };
		case "CLEAR_ERROR":
			return { ...state, error: null };
		default:
			throw new Error(`Acción no soportada: ${action.type}`);
	}
}
/**
 * Componente que contiene la lógica del formulario de registro.
 */
function RegisterForm() {
	// Hook para despachar acciones de Redux.
	const loginDispatch = useDispatch();
	// Hook para la navegación programática.
	const navigate = useNavigate();

	// Estados locales para los campos del formulario y el control de la UI.
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
	// Usamos useReducer para gestionar el estado del formulario.
	const [formState, formDispatch] = useReducer(registerReducer, initialState);
	// Ref para la alerta de error, para poder mover el foco a ella.
	const errorAlertRef = useRef(null);

	/**
	 * Maneja el envío del formulario de registro. Realiza el registro del usuario, lo loguea automáticamente y lo redirige a
	 * la página principal.
	 * @param {React.FormEvent<HTMLFormElement>} e - El evento de envío del formulario.
	 */
	const submit = async (e) => {
		e.preventDefault();
		// Inicia el estado de carga y limpia errores previos.
		formDispatch({ type: "REGISTER_START" });
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
			// Indica que el proceso ha finalizado con éxito.
			formDispatch({ type: "REGISTER_SUCCESS" });
			// Redirige al usuario a la página principal.
			navigate("/");
		} catch (error) {
			console.error("Registration or login failed:", error);
			formDispatch({
				type: "REGISTER_FAILURE",
				payload: error.message || "Error al registrarse.",
			});
		}
	};

	/**
	 * Efecto que habilita o deshabilita el botón de envío del formulario basado en la validez de todos los campos. El botón se habilita solo si todos los campos del
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
		formDispatch({ type: "SET_VALIDITY", payload: isValid });
	}, [name, surname, phone, mail, password, samePassword]);

	/**
	 * Efecto para mover el foco a la alerta de error cuando esta aparece.
	 */
	useEffect(() => {
		if (formState.error && errorAlertRef.current) {
			errorAlertRef.current.focus();
		}
	}, [formState.error]);

	return (
		<>
			{/* Muestra la alerta de error si showErrorAlert es true y hay un mensaje de error. */}
			{formState.error && (
				<div ref={errorAlertRef} tabIndex={-1}>
					<ErrorMessageAlert
						message={formState.error}
						onClose={() => formDispatch({ type: "CLEAR_ERROR" })}
					/>
				</div>
			)}
			{/* Formulario de registro */}
			<Form
				id="registerForm"
				className={`${styles.formLabel} fw-bold`}
				aria-busy={formState.isLoading}
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
							ariaDescribedBy="password-requirements"
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
				<ul id="password-requirements" className={`${styles.infoMessage} mb-3`}>
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
								variant={formState.isButtonDisabled ? "secondary" : "success"}
								type="submit"
								disabled={formState.isButtonDisabled || formState.isLoading}
								className="w-100" // w-100 hace que el botón ocupe el ancho de su Col padre
							>
								{formState.isLoading ? (
									<>
										<Spinner
											as="span"
											animation="border"
											size="sm"
											role="status"
											aria-hidden="true"
										/>
										<span className="visually-hidden">Cargando...</span>
									</>
								) : (
									"Enviar"
								)}
							</Button>
						</Col>
					</Row>
				</div>
			</Form>
		</>
	);
}

export default RegisterForm;

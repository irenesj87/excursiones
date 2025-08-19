import { useEffect, useState, useReducer, useRef } from "react";
import { Row, Col, Button, Form, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router";
import { validateMail, validateName } from "../validation/validations.js";
import ValidatedFormGroup from "./ValidatedFormGroup";
import ErrorMessageAlert from "./ErrorMessageAlert.js";
import { login } from "../slicers/loginSlice";
import { useDispatch } from "react-redux";
import { loginUser } from "../services/authService.js";
import "bootstrap/dist/css/bootstrap.css";
import styles from "../css/LoginForm.module.css";

// Estado inicial para el reducer del formulario.
const initialState = {
	isLoading: false,
	error: null,
	isButtonDisabled: true,
};

/**
 * Reducer para gestionar el estado del formulario de inicio de sesión.
 * @param {object} state - El estado actual del formulario.
 * @param {object} action - La acción a despachar.
 */
// El reducer centraliza toda la lógica de actualización del estado del formulario.
function loginReducer(state, action) {
	switch (action.type) {
		/**
		 * Esta acción se despacha justo cuando el usuariopulsa el botón 'Enviar'. Su propósito es poner la interfaz en modo carga.
		 * isLoading: true: Le dice al componente que ha empezado una operación asíncrona (la llamada a la API de login). Esto hace
		 * que el botón de envío muestre un spinner y se desactive para prevenir múltiples envíos.
		 * error: null: Limpia cualquier mensaje de error que pudiera existir de un intento de login anterior. Así, si el usuario
		 * se equivocó, corrigió los datos y vuelve a intentarlo, no verá el mensaje de error anterior.
		 */
		case "LOGIN_START":
			return { ...state, isLoading: true, error: null };
		/**
		 * Se despacha cuando la llamada a la API(loginUser) ha terminado con éxito y los datos de usuario ya se han guardado en Redux
		 * y sessionStorage.
		 * isLoading: false: Detiene el estado de carga. Indica que la operación asíncrona ha finalizado.
		 */
		case "LOGIN_SUCCESS":
			return { ...state, isLoading: false };
		/**
		 * Se despacha si la llamada a la API falla (por ejemplo, por credenciales incorrectas, un error del servidor o un problema de red).
		 * isLoading: false: Detiene el estado de carga, ya que la operación ha finalizado.
		 * error: action.payload: Guarda el mensaje de error en el estado. El payload es el mensaje que se ha preparado en el bloque
		 * catch del submit. Esto provoca que el componente <ErrorMessageAlert> se renderice y muestre el error al usuario.
		 */
		case "LOGIN_FAILURE":
			return { ...state, isLoading: false, error: action.payload };
		/**
		 * Se despacha cada vez que el usuario escribe en los campos de correo o contraseña, gracias al useEffect que vigila esos
		 * cambios.
		 * isButtonDisabled: !action.payload: El payload de esta acción es un booleano(isValid) que indica si ambos campos son válidos.
		 * La acción actualiza isButtonDisabled al valor contrario. Si los campos son válidos (isValid es true), el botón se habilita
		 * (isButtonDisabled se pone a false). Si no lo son, se deshabilita (isButtonDisabled se pone a true).
		 */
		case "SET_VALIDITY":
			return { ...state, isButtonDisabled: !action.payload };
		/**
		 * Se despacha cuando el usuario cierra manualmente la alerta de error haciendo click en la "x".
		 * error: null: Limpia el mensaje de error del estado, lo que hace que el componente <ErrorMessageAlert> deje de
		 * renderizarse.
		 */
		case "CLEAR_ERROR":
			return { ...state, error: null };
		default:
			throw new Error(`Acción no soportada: ${action.type}`);
	}
}

/**
 * Componente que representa el formulario de inicio de sesión.
 */
export function LoginForm() {
	const loginDispatch = useDispatch();
	const navigate = useNavigate();
	const [mail, setMail] = useState("");
	const [password, setPassword] = useState("");
	// Usamos useReducer para gestionar el estado del formulario.
	const [formState, formDispatch] = useReducer(loginReducer, initialState);
	// Ref para la alerta de error, para poder mover el foco a ella.
	const errorAlertRef = useRef(null);

	/**
	 * Maneja el envío del formulario de inicio de sesión. Realiza una petición al servidor para autenticar al usuario y, si
	 * es exitosa, guarda la información del usuario y el token en Redux y sessionStorage.
	 */
	const submit = async (e) => {
		e.preventDefault();
		// Guarda para prevenir envíos múltiples si el botón está deshabilitado o ya se está cargando.
		if (formState.isButtonDisabled || formState.isLoading) {
			return;
		}
		formDispatch({ type: "LOGIN_START" });
		try {
			const data = await loginUser(mail, password);
			loginDispatch(
				login({
					user: data.user,
					token: data.token,
				})
			);
			// Guarda el token en sessionStorage para persistencia de la sesión.
			window.sessionStorage["token"] = data.token;
			formDispatch({ type: "LOGIN_SUCCESS" });
			// Redirige al usuario a la página de usuario después de un inicio de sesión exitoso.
			navigate("/UserPage");
		} catch (error) {
			console.error("Login failed:", error);
			let errorMessage;
			// Si es un error de red, mostramos un mensaje específico.
			if (error instanceof TypeError && error.message === "Failed to fetch") {
				errorMessage =
					"No se pudo conectar con el servidor. Por favor, comprueba tu conexión e inténtalo de nuevo.";
			} else {
				// Para otros errores (ej. 401 Unauthorized), usamos el mensaje del servidor.
				errorMessage =
					error.message || "Ocurrió un error inesperado. Inténtalo de nuevo.";
			}
			formDispatch({
				type: "LOGIN_FAILURE",
				payload: errorMessage,
			});
		}
	};

	/**
	 * Efecto que habilita o deshabilita el botón de envío del formulario.
	 * El botón se habilita solo si el correo electrónico y la contraseña cumplen con las validaciones.
	 */
	useEffect(() => {
		// Para el login, solo validamos que los campos no estén vacíos. La validación de la contraseña la realiza el servidor.
		// Reutilizamos `validateName` para la contraseña, ya que su única función es comprobar que el campo no esté vacío.
		const isValid =
			validateMail(mail) === true && validateName(password) === true;
		formDispatch({ type: "SET_VALIDITY", payload: isValid });
	}, [mail, password]);

	// Efecto para mover el foco a la alerta de error cuando aparece.
	useEffect(() => {
		if (formState.error && errorAlertRef.current) {
			errorAlertRef.current.focus();
		}
	}, [formState.error]);

	return (
		<>
			{formState.error && (
				// El div wrapper permite que la alerta sea programáticamente enfocable.
				// tabIndex="-1" lo hace enfocable vía JS sin añadirlo al orden de tabulación.
				<div ref={errorAlertRef} tabIndex={-1}>
					<ErrorMessageAlert
						message={formState.error}
						onClose={() => formDispatch({ type: "CLEAR_ERROR" })}
					/>
				</div>
			)}
			<Form
				id="loginForm"
				noValidate
				aria-busy={formState.isLoading}
				onSubmit={submit}
				className={`${styles.formLabel} fw-bold`}
			>
				<ValidatedFormGroup
					id="formLoginEmail"
					name="Correo electrónico"
					inputType="email"
					inputToChange={setMail}
					validationFunction={validateMail}
					value={mail}
					message={true}
					autocomplete="email"
					errorMessage="El formato del correo electrónico no es válido."
				/>
				<ValidatedFormGroup
					id="formLoginPassword"
					inputType="password"
					name="Contraseña"
					inputToChange={setPassword}
					validationFunction={validateName}
					value={password}
					message={true}
					autocomplete="current-password"
					errorMessage="La contraseña no puede estar vacía."
				/>
				<div className="mt-5 pt-3">
					<Row className="justify-content-sm-end">
						<Col xs={12} sm="auto">
							<Button
								variant={
									formState.isButtonDisabled || formState.isLoading
										? "secondary"
										: "success"
								}
								type="submit"
								aria-disabled={
									formState.isButtonDisabled || formState.isLoading
								}
								className="w-100"
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

export default LoginForm;

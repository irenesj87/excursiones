import { useEffect, useReducer, useRef, useMemo } from "react";
import { Row, Col, Form, Button, Spinner } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../../slicers/loginSlice.js";
import ValidatedFormGroup from "../ValidatedFormGroup/index.js";
import {
	validateName,
	validateSurname,
	validatePhone,
	validateMail,
	validatePassword,
	validateSamePassword,
} from "../../validation/validations.js";
import { registerUser } from "../../services/authService.js";
import ErrorMessageAlert from "../ErrorMessageAlert/index.js";
import "bootstrap/dist/css/bootstrap.css";
import styles from "./RegisterForm.module.css";

// Estado inicial para el reducer del formulario.
const initialState = {
	// Objeto que almacena el valor de cada campo del formulario
	values: {
		name: "",
		surname: "",
		phone: "",
		mail: "",
		password: "",
		samePassword: "",
	},
	// Indica si se está mandando una petición al servidor. Se usa para mostrar un Spinner de carga.
	isLoading: false,
	// Almacena un mensaje de error si algo falla o null si no hay errores.
	error: null,
	// Booleano que controla si el botón de "Enviar" está habilitado o no. Se inicializa en tru porque el formulario está vacío, y
	// por tanto, no es válido.
	isButtonDisabled: true,
};

/**
 * Reducer para gestionar el estado del formulario de registro.
 * @param {object} state - El estado actual del formulario.
 * @param {object} action - La acción a despachar.
 */
function registerReducer(state, action) {
	switch (action.type) {
		// Se activa al pulsar "Enviar". Pone isLoading a true y limpia errores anteriores.
		case "REGISTER_START":
			return { ...state, isLoading: true, error: null };
		// Se activa si el registro y el login son exitosos. Pone isLoading a false.
		case "REGISTER_SUCCESS":
			return { ...state, isLoading: false };
		// Se activa si algo falla. Pone isLoading a false y guarda el mensaje de error en el estado.
		case "REGISTER_FAILURE":
			return { ...state, isLoading: false, error: action.payload };
		// Se activa cada vez que el usuario escribe en un campo. Actualiza el valor del campo correspondiente en el objeto values.
		case "UPDATE_FIELD":
			return {
				...state,
				values: {
					...state.values,
					[action.payload.field]: action.payload.value,
				},
			};
		// Se activa después de cada cabio en los campos. Habilita o deshabilita el botón de envío según si el formulario es válido
		// o no.
		case "SET_VALIDITY":
			return { ...state, isButtonDisabled: !action.payload };
		// Se activa cuando el usuario cierra la alerta de error. Limpia el mensaje de error del estado.
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
	// Usamos useReducer para gestionar el estado del formulario.
	const [formState, formDispatch] = useReducer(registerReducer, initialState);
	// Extrae values del objeto formState usando desestructuración para un acceso más fácil.
	const { values } = formState;
	// Ref para la alerta de error, para poder mover el foco a ella.
	const errorAlertRef = useRef(null);

	/**
	 * Función que se pasa a cada campo del formulario. Cuando cambia, llama a formDispatch con la acción UPDATE_FIELD para
	 * actualizar el estado.
	 * @param {string} field - El nombre del campo a actualizar.
	 * @param {string} value - El nuevo valor del campo.
	 */
	const handleInputChange = (field, value) => {
		formDispatch({ type: "UPDATE_FIELD", payload: { field, value } });
	};

	/**
	 * Maneja el envío del formulario de registro. Realiza el registro del usuario, lo loguea automáticamente y lo redirige a
	 * la página principal.
	 * @param {React.FormEvent<HTMLFormElement>} e - El evento de envío del formulario.
	 */
	const submit = async (e) => {
		e.preventDefault();
		// Guarda para prevenir envíos múltiples si el botón está deshabilitado o ya se está cargando.
		if (formState.isButtonDisabled || formState.isLoading) {
			return;
		}
		// Inicia el estado de carga y limpia errores previos.
		formDispatch({ type: "REGISTER_START" });
		const { name, surname, phone, mail, password } = values;
		try {
			// La función registerUser retorna directamente los datos de sesión.
			const sessionData = await registerUser(
				name,
				surname,
				phone,
				mail,
				password
			);

			// Despacha la acción de login para actualizar el estado de Redux con la información del usuario y el token.
			loginDispatch(
				login({
					user: sessionData.user,
					token: sessionData.token,
				})
			);
			// Guarda el token en sessionStorage para persistencia de la sesión.
			window.sessionStorage["token"] = sessionData.token;
			// Indica que el proceso ha finalizado con éxito.
			formDispatch({ type: "REGISTER_SUCCESS" });
			// Redirige al usuario a la página principal.
			navigate("/");
		} catch (error) {
			console.error("Fallo en el registro o login:", error);
			let errorMessage;
			// Si es un error de red, mostramos un mensaje específico.
			if (error instanceof TypeError && error.message === "Failed to fetch") {
				errorMessage =
					"No se pudo conectar con el servidor. Por favor, comprueba tu conexión e inténtalo de nuevo.";
			} else {
				// Para otros errores (ej. 409 Conflict), usamos el mensaje del servidor.
				errorMessage =
					error.message ||
					"No se pudo completar el registro. Inténtalo de nuevo más tarde.";
			}
			formDispatch({
				type: "REGISTER_FAILURE",
				payload: errorMessage,
			});
		}
	};

	/**
	 * Efecto para mover el foco a la alerta de error cuando esta aparece.
	 */
	useEffect(() => {
		if (formState.error && errorAlertRef.current) {
			errorAlertRef.current.focus();
		}
	}, [formState.error]);

	// Configuración de los campos del formulario para renderizarlos dinámicamente.
	// Se usa useMemo para evitar que se recalcule en cada renderizado, optimizando el rendimiento.
	// Solo se recalculará si `values.password` cambia, que es la única dependencia externa.
	const formFieldsConfig = useMemo(
		() => [
			[
				{
					id: "formGridName",
					name: "Nombre",
					field: "name",
					validationFunction: validateName,
					autocomplete: "given-name",
					errorMessage: "El nombre no puede estar vacío.",
				},
				{
					id: "formGridSurname",
					name: "Apellidos",
					field: "surname",
					validationFunction: validateSurname,
					autocomplete: "family-name",
					errorMessage: "Los apellidos no pueden estar vacíos.",
				},
			],
			[
				{
					id: "formGridPhone",
					name: "Teléfono",
					field: "phone",
					inputType: "tel",
					validationFunction: validatePhone,
					autocomplete: "tel",
					errorMessage: "El formato del teléfono no es válido.",
				},
				{
					id: "formGridEmail",
					name: "Correo electrónico",
					field: "mail",
					inputType: "email",
					validationFunction: validateMail,
					autocomplete: "email",
					errorMessage: "El formato del correo electrónico no es válido.",
				},
			],
			[
				{
					id: "password",
					name: "Contraseña",
					field: "password",
					inputType: "password",
					validationFunction: validatePassword,
					autocomplete: "new-password",
					ariaDescribedBy: "password-requirements",
				},
				{
					id: "confirm-password",
					name: "Repite la contraseña",
					field: "samePassword",
					inputType: "password",
					// La validación de este campo depende del valor de la contraseña, por eso se define aquí.
					validationFunction: (value) =>
						validateSamePassword(values.password, value),
					autocomplete: "new-password",
				},
			],
		],
		[values.password]
	);

	/**
	 * Efecto que habilita o deshabilita el botón de envío del formulario basado en la validez de todos los campos.
	 * Itera sobre la configuración de los campos para validar el formulario de forma declarativa.
	 */
	useEffect(() => {
		// Itera sobre todos los campos definidos en la configuración para determinar si el formulario es válido.
		const isFormValid = formFieldsConfig
			/**
			 * formFieldsConfig es un array de arrays, así que flat() lo convierte en un único array con todos los objetos de
			 * configuración de los campos.
			 */
			.flat()
			/**
			 * Recorre el array y ejecuta la función que se le pasa para cada elemento. Retorna true sólo si la función retorna
			 * true para todos los elementos. Si encuentra un solo elemento que no cumple la condición, se detiene y retorna false.
			 */
			.every((field) => field.validationFunction(values[field.field]) === true);

		formDispatch({ type: "SET_VALIDITY", payload: isFormValid });
	}, [values, formFieldsConfig]);

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
				{formFieldsConfig.map((row, rowIndex) => (
					// eslint-disable-next-line react/no-array-index-key
					<Row key={`form-row-${rowIndex}`}>
						{row.map((field) => (
							<Col xs={12} md={6} key={field.id}>
								<ValidatedFormGroup
									{...field}
									value={values[field.field]}
									inputToChange={(value) =>
										handleInputChange(field.field, value)
									}
									message={true}
								/>
							</Col>
						))}
					</Row>
				))}
				{/* Mensaje informativo sobre los requisitos de la contraseña. */}
				<div
					id="password-requirements"
					className={`${styles.infoMessage} mb-3`}
				>
					<p className="mb-1 fw-normal">
						Tu contraseña debe contener al menos:
					</p>
					{/* ps-3 añade un poco de sangría a la lista para mejorar la legibilidad */}
					<ul className="mb-0 ps-3 fw-normal">
						<li>8 caracteres.</li>
						<li>Una letra.</li>
						<li>Un número.</li>
						<li>Un carácter especial (ej: @$!%*?&.,_-).</li>
					</ul>
				</div>

				<div className="mt-5 pt-3">
					{/* justify-content-sm-end alineará la Col a la derecha en breakpoints 'sm' y mayores */}
					<Row className="justify-content-sm-end">
						{/* sm="auto" hace que la Col se ajuste al contenido en breakpoints 'sm' y mayores */}
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

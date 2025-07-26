import { useEffect, useState } from "react";
import { Row, Col, Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router";
import { validateMail, validatePassword } from "../validation/validations.js";
import ValidatedFormGroup from "./ValidatedFormGroup";
import ErrorMessageAlert from "./ErrorMessageAlert.js";
import { login } from "../slicers/loginSlice";
import { useDispatch } from "react-redux";
import { userLogin } from "../helpers/helpers.js";
import "bootstrap/dist/css/bootstrap.css";
import styles from "../css/LoginForm.module.css";

/* Componente que valida la info de los inputs y deshabilita el botón "Enviar" hasta que lo que escribe el usuario 
esté en el formato correcto */
export function LoginForm() {
	const loginDispatch = useDispatch();
	const navigate = useNavigate();
	// Variable que guarda el correo del usuario que está intentando loguearse
	const [mail, setMail] = useState("");
	// Variable que guarda la contraseña del usuario que está intentando loguearse
	const [password, setPassword] = useState("");
	// Variable que guarda si el botón está deshabilitado o no
	const [disabled, setDisabled] = useState(true);
	// Variable que avisa si ha habido algún error al loguearse el usuario
	const [loginError, setLoginError] = useState(null);
	// Variable que dice cuando hay que mostrar la alerta de error
	const [showErrorAlert, setShowErrorAlert] = useState(false);

	/**
	 * Maneja el envío del formulario de inicio de sesión. Realiza una petición al servidor para autenticar al usuario y, si
	 * es exitosa, guarda la información del usuario y el token en Redux y sessionStorage.
	 */
	const submit = async (e) => {
		e.preventDefault();
		setLoginError(null);
		setShowErrorAlert(false);

		try {
			const data = await userLogin(mail, password);
			// El usuario se loguea y guardamos su info y su token en la store...
			loginDispatch(
				login({
					user: data.user,
					token: data.token,
				})
			);
			// ...y después guardamos el token en sessionStorage
			window.sessionStorage["token"] = data.token;
			// Cuando el usuario se loguea le mandamos a su página de usuario
			navigate("/UserPage");
		} catch (error) {
			console.error("Login failed:", error);
			setLoginError(error.message || "Error al iniciar sesión.");
			setShowErrorAlert(true);
		}
	};

	/**
	 * Efecto que habilita o deshabilita el botón de envío del formulario.
	 * El botón se habilita solo si el correo electrónico y la contraseña cumplen con las validaciones.
	 */
	useEffect(() => {
		if (validateMail(mail) && validatePassword(password)) {
			setDisabled(false);
		} else {
			setDisabled(true);
		}
	}, [mail, password]);

	/**
	 * Cierra la alerta de mensaje de error y resetea el estado del error.
	 * Se pasa como prop al componente ErrorMessageAlert.
	 */
	const handleCloseAlert = () => {
		setShowErrorAlert(false);
		setLoginError(null);
	};

	return (
		<>
			{showErrorAlert && loginError && (
				<ErrorMessageAlert message={loginError} onClose={handleCloseAlert} />
			)}
			<Form
				id="loginForm"
				noValidate
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
				<div className="mt-5 pt-3 border-top">
					{/* justify-content-sm-end alineará la Col a la derecha en breakpoints sm y mayores */}
					<Row className="justify-content-sm-end">
						{/* sm="auto" hace que la Col se ajuste al contenido en breakpoints sm y mayores */}
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

export default LoginForm;

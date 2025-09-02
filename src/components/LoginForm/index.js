import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Row, Col, Button, Form, Spinner } from "react-bootstrap";
import { validateMail, validateName } from "../../validation/validations.js";
import ValidatedFormGroup from "../ValidatedFormGroup/index.js";
import ErrorMessageAlert from "../ErrorMessageAlert";
import { loginUser } from "../../services/authService.js";
import { useAuthFormHandler } from "../../hooks/useAuthFormHandler.js";
import "bootstrap/dist/css/bootstrap.css";
import styles from "./LoginForm.module.css";

/**
 * Componente que representa el formulario de inicio de sesión.
 */
export function LoginForm() {
	const [mail, setMail] = useState("");
	const [password, setPassword] = useState("");
	// Ref para la alerta de error, para poder mover el foco a ella.
	const errorAlertRef = useRef(null);

	const formValues = useMemo(() => ({ mail, password }), [mail, password]);

	const isFormValid = useCallback(
		() => validateMail(mail) && validateName(password),
		[mail, password]
	);

	const { formState, formDispatch, handleSubmit } = useAuthFormHandler(
		formValues,
		isFormValid,
		loginUser,
		"/userPage"
	);

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
				onSubmit={handleSubmit}
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

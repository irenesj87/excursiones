import React, { useState, useCallback, useMemo } from "react";
import { Form } from "react-bootstrap";
import {
	validateMail,
	validateName as isNotEmpty,
} from "../../validation/validations.js";
import { ROUTES, FORM_TEXT } from "../../constants.js";
import ValidatedFormGroup from "../ValidatedFormGroup";
import FormErrorAlert from "../FormErrorAlert/index.js";
import CustomButton from "../CustomButton";
import { loginUser } from "../../services/authService.js";
import { useAuthFormHandler } from "../../hooks/useAuthFormHandler.js";
import "bootstrap/dist/css/bootstrap.css";
import styles from "./LoginForm.module.css";

/**
 * Componente que representa el formulario de inicio de sesión.
 * @returns {React.ReactElement} El formulario de inicio de sesión.
 */
export function LoginForm() {
	const [mail, setMail] = useState("");
	const [password, setPassword] = useState("");

	const formValues = useMemo(() => ({ mail, password }), [mail, password]);

	/**
	 * Comprueba si el formulario es válido.
	 * @returns {boolean} - `true` si el formulario es válido, `false` en caso contrario.
	 */
	const isFormValid = useCallback(
		() => validateMail(mail) && isNotEmpty(password),
		[mail, password]
	);

	const { formState, formDispatch, handleSubmit } = useAuthFormHandler(
		// El hook espera los argumentos para la API en el mismo orden.
		formValues,
		isFormValid,
		loginUser,
		ROUTES.USER
	);

	const isButtonDisabled = !isFormValid();

	return (
		<>
			<FormErrorAlert
				error={formState.error}
				onClearError={() => formDispatch({ type: "CLEAR_ERROR" })}
			/>
			<Form
				id="loginForm"
				noValidate
				aria-busy={formState.isLoading}
				onSubmit={handleSubmit}
				className={`${styles.formLabel} fw-bold`}
			>
				<ValidatedFormGroup
					id="formLoginEmail"
					name={FORM_TEXT.EMAIL_LABEL}
					inputType="email"
					inputToChange={setMail}
					validationFunction={validateMail}
					value={mail}
					message={true}
					autocomplete="email"
					errorMessage={FORM_TEXT.INVALID_EMAIL_FORMAT}
				/>
				<ValidatedFormGroup
					id="formLoginPassword"
					inputType="password"
					name={FORM_TEXT.PASSWORD_LABEL}
					inputToChange={setPassword}
					validationFunction={isNotEmpty}
					value={password}
					message={true}
					autocomplete="current-password"
					errorMessage={FORM_TEXT.PASSWORD_CANNOT_BE_EMPTY}
				/>
				<div className="d-grid d-sm-flex justify-content-sm-end">
					<CustomButton
						type="submit"
						variant={isButtonDisabled ? "secondary" : "primary"}
						isLoading={formState.isLoading}
						disabled={isButtonDisabled}
					>
						Enviar
					</CustomButton>
				</div>
			</Form>
		</>
	);
}

export default LoginForm;

import { useState, useCallback, useMemo } from "react";
import { Form } from "react-bootstrap";
import { validateMail, validateName } from "../../validation/validations.js";
import ValidatedFormGroup from "../ValidatedFormGroup/index.js";
import FormErrorAlert from "../FormErrorAlert";
import FormSubmitButton from "../FormSubmitButton";
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
				<FormSubmitButton
					isLoading={formState.isLoading}
					isButtonDisabled={formState.isButtonDisabled}
				/>
			</Form>
		</>
	);
}

export default LoginForm;

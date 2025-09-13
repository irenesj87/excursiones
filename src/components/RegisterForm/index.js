import { useState, useMemo, useCallback } from "react";
import { Row, Col, Form } from "react-bootstrap";
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
import FormErrorAlert from "../FormErrorAlert";
import FormSubmitButton from "../FormSubmitButton";
import { useAuthFormHandler } from "../../hooks/useAuthFormHandler.js";
import "bootstrap/dist/css/bootstrap.css";
import styles from "./RegisterForm.module.css";

// Estado inicial para el reducer del formulario.
const initialState = {
	name: "",
	surname: "",
	phone: "",
	mail: "",
	password: "",
	samePassword: "",
};

/**
 * Componente que contiene la lógica del formulario de registro.
 */
function RegisterForm() {
	const [values, setValues] = useState(initialState);

	/**
	 * Función que se pasa a cada campo del formulario. Cuando cambia, llama a formDispatch con la acción UPDATE_FIELD para
	 * actualizar el estado.
	 */
	const handleInputChange = (field, value) => {
		setValues((prev) => ({ ...prev, [field]: value }));
	};

	const authFormValues = useMemo(
		() => ({
			name: values.name,
			surname: values.surname,
			phone: values.phone,
			mail: values.mail,
			password: values.password,
		}),
		// Dependencias primitivas para asegurar que el objeto solo se recrea cuando un valor cambia.
		[values.name, values.surname, values.phone, values.mail, values.password]
	);

	const isFormValid = useCallback(() => {
		return (
			validateName(values.name) === true &&
			validateSurname(values.surname) === true &&
			validatePhone(values.phone) === true &&
			validateMail(values.mail) === true &&
			validatePassword(values.password) === true &&
			validateSamePassword(values.password, values.samePassword) === true
		);
	}, [values]);

	const { formState, formDispatch, handleSubmit } = useAuthFormHandler(
		// El hook espera los argumentos para la API en el mismo orden.
		authFormValues,
		isFormValid,
		registerUser,
		"/"
	);

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

	return (
		<>
			<FormErrorAlert
				error={formState.error}
				onClearError={() => formDispatch({ type: "CLEAR_ERROR" })}
			/>
			{/* Formulario de registro */}
			<Form
				id="registerForm"
				className={`${styles.formLabel} fw-bold`}
				aria-busy={formState.isLoading}
				onSubmit={handleSubmit}
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

				<FormSubmitButton
					isLoading={formState.isLoading}
					isButtonDisabled={formState.isButtonDisabled}
				/>
			</Form>
		</>
	);
}

export default RegisterForm;

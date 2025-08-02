import { useState } from "react";
import { Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import styles from "../css/ValidatedFormGroup.module.css";

/**
 * Componente reutilizable para un campo de formulario con validación integrada.
 * @param {object} props - Las propiedades del componente.
 * @param {string} props.id - ID único para el campo de formulario y la etiqueta.
 * @param {string} props.name - Texto para la etiqueta del campo.
 * @param {string} [props.inputType="text"] - Tipo de input (ej. "text", "email", "password").
 * @param {(value: string) => void} props.inputToChange - Función para actualizar el estado del valor del input en el componente padre.
 * @param {(value: string) => boolean} props.validationFunction - Función que valida el valor del input y retorna true si es válido.
 * @param {string} props.value - El valor actual del campo de formulario.
 * @param {boolean} props.message - Si es true, muestra un mensaje de error cuando la validación falla.
 * @param {string} [props.errorMessage] - Mensaje de error específico. Si no se proporciona, se usa uno genérico.
 * @param {string} props.autocomplete - Valor para el atributo autocomplete del input.
 * @param {string} [props.ariaDescribedBy] - IDs adicionales para aria-describedby, separados por espacios.
 */
function ValidatedFormGroup({
	id,
	name,
	inputType = "text", // Default inputType to text
	inputToChange,
	validationFunction,
	value,
	message,
	errorMessage,
	autocomplete,
	ariaDescribedBy,
}) {
	// Variable that saves if the information we receive is valid or not, (is not blank or in an incorrect format)
	const [notValid, setNotValid] = useState(false);
	// ID único para el mensaje de error, para asociarlo con el input.
	const errorId = `${id}-error`;

	// Function that receives the information and updates it
	const nameChange = (event) => {
		const newValue = event.target.value;
		inputToChange(newValue);
		setNotValid(!validationFunction(newValue));
	};

	// Combina los IDs externos con el ID del error interno si es visible.
	const describedBy = [ariaDescribedBy, message && notValid ? errorId : null]
		.filter(Boolean)
		.join(" ");

	return (
		<Form.Group className="mb-3" controlId={id}>
			<Form.Label>{name}</Form.Label>
			<Form.Control
				type={inputType}
				onChange={nameChange}
				name={name}
				value={value}
				autoComplete={autocomplete}
				isInvalid={notValid}
				aria-describedby={describedBy || undefined}
			/>
			{message && (
				<Form.Control.Feedback type="invalid" id={errorId} className={`${styles.errorMessage} text-danger fw-bold mt-1}`}>
					{errorMessage || "Recuerda, no puedes dejar un campo vacío o en un formato incorrecto."}
				</Form.Control.Feedback>
			)}
		</Form.Group>
	);
}

export default ValidatedFormGroup;

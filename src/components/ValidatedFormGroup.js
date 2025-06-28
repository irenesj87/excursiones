import { useState } from "react";
import { Col, Form } from "react-bootstrap";
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
 * @param {string} props.autocomplete - Valor para el atributo autocomplete del input.
 */
function ValidatedFormGroup({
	id, 
	name,
	inputType = "text", // Default inputType to text
	inputToChange,
	validationFunction,
	value,
	message,
	autocomplete,
	...colProps // Collect remaining props (like xs, md, lg)
}) {
	// Variable that saves if the information we receive is valid or not, (is not blank or in an incorrect format)
	const [notValid, setNotValid] = useState(false);

	// Function that receives the information and updates it
	const nameChange = (event) => {
		const value = event.target.value;
		inputToChange(value);
		setNotValid(!validationFunction(value));
	};

	return (
		<Form.Group as={Col} {...colProps} className="mb-3">
			<Form.Label htmlFor={id}>{name}</Form.Label>
			<Form.Control
				type={inputType}
				onChange={nameChange}
				id={id}
				name={name}
				value={value}
				autoComplete={autocomplete}
			/>
			{message && notValid && (
				<p className={styles.errorMessage}>
					Recuerda, no puedes dejar un campo vacío o en un formato incorrecto
				</p>
			)}
		</Form.Group>
	);
}

export default ValidatedFormGroup;

import { useState } from "react";
import { Col, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import styles from "../css/ValidatedFormGroup.module.css";

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

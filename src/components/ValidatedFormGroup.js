import React, { useState } from "react";
import { Col, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import styles from "../css/ValidatedFormGroup.module.css";

function ValidatedFormGroup(props) {
	// Variable that saves if the information we receive is valid or not, (is not blank or in an incorrect format)
	const [notValid, setNotValid] = useState(false);

	// Function that receives the information and updates it
	const nameChange = (event) => {
		const value = event.target.value;
		props.inputToChange(value);
		setNotValid(!props.validationFunction(value));
	};

	return (
		<Form.Group as={Col} className="mb-3">
			<Form.Label htmlFor={props.name}>{props.name}</Form.Label>
			<Form.Control
				type={props.inputType}
				onChange={nameChange}
				id={props.name}
				name={props.name}
				value={props.value}
				autoComplete={props.autocomplete}
			/>
			{props.message && notValid && (
				<p className={styles.errorMessage}>
					Recuerda, no puedes dejar un campo vacío o en un formato incorrecto
				</p>
			)}
			{!props.message && notValid}
		</Form.Group>
	);
}

export default ValidatedFormGroup;

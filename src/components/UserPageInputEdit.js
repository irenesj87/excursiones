import React from "react";
import { Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import styles from "../css/UserPageInputEdit.module.css";

// This component controls the user page edit inputs
function UserPageInputEdit(props) {
	return (
		<Form.Control
			className={styles.userInput}
			id={props.id}
			type="text"
			value={props.value}
			onChange={(e) => {
				const value = e.target.value;
				props.inputToChange(value);
			}}
			disabled={!props.isEditing}
		/>
	);
}

export default UserPageInputEdit;

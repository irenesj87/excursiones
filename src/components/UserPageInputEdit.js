import React from "react";
import "bootstrap/dist/css/bootstrap.css";
import styles from "../css/UserPageInputEdit.module.css";

// This component controls the user page edit inputs
function UserPageInputEdit(props) {
	const inputChange = (event) => {
		const value = event.target.value;
		props.inputToChange(value);
	};

	const editingInput = (
		<input
			id={props.id}
			type="text"
			className={styles.userInput}
			onChange={inputChange}
			value={props.value}
		/>
	);

	return (
		<div>
			{!props.isEditing && props.value}
			{props.isEditing && editingInput}
		</div>
	);
}

export default UserPageInputEdit;

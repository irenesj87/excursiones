import { Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import styles from "../css/UserPageInputEdit.module.css";

// This component controls the user page edit inputs
function UserPageInputEdit({id, value, inputToChange, isEditing}) {
	return (
		<Form.Control
			className={styles.userInput}
			id={id}
			type="text"
			value={value}
			onChange={(e) => {
				const value = e.target.value;
				inputToChange(value);
			}}
			disabled={!isEditing}
		/>
	);
}

export default UserPageInputEdit;

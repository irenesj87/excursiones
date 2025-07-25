import { Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import styles from "../css/UserPageInputEdit.module.css";

/** Este componente controla los inputs de edición de la página de usuario */
function UserPageInputEdit({ id, value, onInputChange, isEditing }) {
	return (
		<Form.Control
			className={styles.userInput}
			id={id}
			type="text"
			value={value}
			onChange={(e) => onInputChange(e.target.value)}
			disabled={!isEditing}
		/>
	);
}

export default UserPageInputEdit;

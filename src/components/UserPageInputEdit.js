import { forwardRef, useState, useEffect } from "react";
import { Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import styles from "../css/UserPageInputEdit.module.css";

/**
 * @typedef {object} UserPageInputEditProps
 * @property {string} id - ID único para el campo de formulario.
 * @property {string} value - El valor actual del campo.
 * @property {(newValue: string) => void} onInputChange - Función para manejar el cambio de valor.
 * @property {boolean} isEditing - Indica si el campo está en modo de edición.
 * @property {(value: string) => boolean} validationFunction - Función para validar el valor del campo.
 * @property {boolean} message - Indica si se debe mostrar un mensaje de error.
 */

/**
 * Componente interno que contiene la lógica de renderizado para el input de edición.
 * @param {UserPageInputEditProps} props - Las propiedades del componente.
 * @param {React.Ref<HTMLInputElement>} ref - La ref que se reenvía al input.
 */
function UserPageInputEditComponent(props, ref) {
	const { id, value, onInputChange, isEditing, validationFunction, message } =
		props;
	const [notValid, setNotValid] = useState(false);
	const errorId = `${id}-error`;

	useEffect(() => {
		if (!isEditing) {
			setNotValid(false);
		}
	}, [isEditing]);

	const handleChange = (event) => {
		const newValue = event.target.value;
		onInputChange(newValue);
		if (validationFunction) {
			setNotValid(!validationFunction(newValue));
		}
	};

	return (
		<>
			<Form.Control
				ref={ref} // Pass the ref to the underlying Form.Control
				className={styles.userInput}
				id={id}
				type="text"
				value={value}
				onChange={handleChange}
				disabled={!isEditing}
				isInvalid={notValid}
				aria-describedby={notValid && message ? errorId : undefined}
			/>
			{message && (
				<Form.Control.Feedback
					type="invalid"
					id={errorId}
					className={`${styles.errorMessage} text-danger fw-bold mt-1`}
				>
					Recuerda, no puedes dejar un campo vacío o en un formato incorrecto.
				</Form.Control.Feedback>
			)}
		</>
	);
}

const UserPageInputEdit = forwardRef(UserPageInputEditComponent);

UserPageInputEdit.displayName = "UserPageInputEdit";

export default UserPageInputEdit;

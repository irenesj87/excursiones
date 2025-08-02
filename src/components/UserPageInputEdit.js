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
 * @property {(value: string) => boolean | string} validationFunction - Función para validar el valor del campo. Retorna `true` si es válido, o un `string` con el mensaje de error.
 * @property {boolean} message - Indica si se debe mostrar un mensaje de error.
 * @property {string} [errorMessage] - Mensaje de error específico. Si no se proporciona, se usa uno genérico.
 */

/**
 * Componente interno que contiene la lógica de renderizado para el input de edición.
 * @param {UserPageInputEditProps} props - Las propiedades del componente.
 * @param {React.Ref<HTMLInputElement>} ref - La ref que se reenvía al input.
 */
function UserPageInputEditComponent(props, ref) {
	const {
		id,
		value,
		onInputChange,
		isEditing,
		validationFunction,
		message,
		errorMessage,
	} = props;
	// Estado para almacenar el mensaje de error de validación. `null` si es válido.
	const [validationError, setValidationError] = useState(null);
	/**
	 * ID único para el mensaje de error, para asociarlo con el input.
	 */
	const errorId = `${id}-error`;

	/**
	 * Efecto que se ejecuta cuando el modo de edición cambia.
	 * Si se sale del modo de edición, se resetea el estado de validez a `false`.
	 */
	useEffect(() => {
		if (!isEditing) {
			// Cuando se sale del modo de edición, reseteamos el estado de validez
			// para que no se muestren errores de validación previos.
			setValidationError(null);
		}
	}, [isEditing]);

	const handleChange = (event) => {
		const { value: newValue } = event.target;
		onInputChange(newValue);
		if (validationFunction) {
			const validationResult = validationFunction(newValue);
			// Si el resultado no es `true`, es un mensaje de error (string) o `false`.
			setValidationError(validationResult === true ? null : validationResult);
		}
	};

	const isInvalid = message && validationError !== null;

	return (
		/**
		 * Renderiza el componente de control de formulario.
		 */
		<>
			<Form.Control
				ref={ref} // Pass the ref to the underlying Form.Control
				className={styles.userInput}
				id={id}
				type="text"
				value={value}
				onChange={handleChange}
				disabled={!isEditing}
				isInvalid={isInvalid}
				aria-describedby={isInvalid ? errorId : undefined}
			/>
			{isInvalid && (
				<Form.Control.Feedback
					type="invalid"
					id={errorId}
					className={`${styles.errorMessage} text-danger fw-bold mt-1`}
					// aria-live="polite" ensures that screen readers announce the error
					// message when it appears, without interrupting the user's flow.
					// This is crucial for dynamic, real-time validation feedback.
					aria-live="polite"
				>
					{typeof validationError === "string"
						? validationError
						: errorMessage ||
						  "Recuerda, no puedes dejar un campo vacío o en un formato incorrecto."}
				</Form.Control.Feedback>
			)}
		</>
	);
}

const UserPageInputEdit = forwardRef(UserPageInputEditComponent);

UserPageInputEdit.displayName = "UserPageInputEdit";

export default UserPageInputEdit;

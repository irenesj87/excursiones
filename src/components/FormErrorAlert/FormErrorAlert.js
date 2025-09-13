import { useRef, useEffect } from "react";
import ErrorMessageAlert from "../ErrorMessageAlert";

/**
 * @typedef {object} FormErrorAlertProps
 * @property {string | null} error - El mensaje de error a mostrar.
 * @property {() => void} onClearError - Función para limpiar el error.
 */

/**
 * Componente reutilizable para mostrar una alerta de error en un formulario.
 * Gestiona el foco en la alerta para mejorar la accesibilidad.
 * @param {FormErrorAlertProps} props
 */
const FormErrorAlert = ({ error, onClearError }) => {
	const errorAlertRef = useRef(null);

	// Efecto para mover el foco a la alerta de error cuando aparece.
	useEffect(() => {
		if (error && errorAlertRef.current) {
			errorAlertRef.current.focus();
		}
	}, [error]);

	if (!error) {
		return null;
	}

	return (
		// El div wrapper permite que la alerta sea programáticamente enfocable.
		// tabIndex="-1" lo hace enfocable vía JS sin añadirlo al orden de tabulación.
		<div ref={errorAlertRef} tabIndex={-1}>
			<ErrorMessageAlert message={error} onClose={onClearError} />
		</div>
	);
};

export default FormErrorAlert;

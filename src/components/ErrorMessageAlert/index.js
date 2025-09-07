import React from "react";
import { Alert } from "react-bootstrap";

/** @typedef {object} ErrorMessageAlertProps
 * @property {string} message - El mensaje de error a mostrar.
 * @property {() => void} onClose - Función que se ejecuta cuando se cierra la alerta.
 */

/**
 * Componente que muestra una alerta de error.
 * @param {ErrorMessageAlertProps} props - Las propiedades del componente.
 * @returns {React.ReactElement} El componente de alerta de error.
 */
function ErrorMessageAlert({ message, onClose }) {
	return (
		<Alert variant="danger" onClose={onClose} dismissible>
			<Alert.Heading as="h2">Error</Alert.Heading>
			{message}
		</Alert>
	);
}

export default ErrorMessageAlert;

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
	// Verificación de seguridad: Nos aseguramos de que el mensaje sea una cadena de texto
	// para prevenir vulnerabilidades de Cross-Site Scripting (XSS). Si se recibe algo
	// que no es un string, se mostrará un mensaje de error genérico y seguro.
	const content =
		typeof message === "string" ? message : "Ha ocurrido un error inesperado.";

	return (
		<Alert variant="danger" onClose={onClose} dismissible>
			<Alert.Heading as="h2">Error</Alert.Heading>
			{content}
		</Alert>
	);
}

export default ErrorMessageAlert;

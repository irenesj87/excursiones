import React from "react";
import { Alert } from "react-bootstrap";

/** Componente que muestra una alerta de error.
 * @param {object} props - Las propiedades del componente.
 * @param {string} props.message - El mensaje de error a mostrar.
 * @param {() => void} props.onClose - Función que se ejecuta cuando se cierra la alerta.
 * @returns {React.ReactElement} El componente de alerta de error.
 */
function ErrorMessageAlert({ message, onClose }) {
	return (
		<Alert variant="danger" onClose={onClose} dismissible>
			<Alert.Heading>Error</Alert.Heading>
			{message}
		</Alert>
	);
}

export default ErrorMessageAlert;

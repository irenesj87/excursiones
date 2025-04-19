import React from "react";
import { Alert } from "react-bootstrap";

function ErrorMessagesAlert(props) {
	const { show, message, onClose } = props;

	// Renderiza la alerta sólo si show es true
	if (show) {
		return (
			<Alert variant="danger" onClose={onClose} dismissible>
				<Alert.Heading>Error</Alert.Heading>
				<p>{message}</p>
			</Alert>
		);
	}

	// Si show es false, no renderiza nada
	return null;
}

export default ErrorMessagesAlert;

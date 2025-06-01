import { Alert } from "react-bootstrap";

function ErrorMessageAlert({ show, message, onClose }) {
	// Renderiza la alerta sólo si 'show' es true
	if (show) {
		return (
			<Alert variant="danger" onClose={onClose} dismissible>
				<Alert.Heading>Error</Alert.Heading>
				{message}
			</Alert>
		);
	}
	// Si 'show' es false, no renderiza nada
	return null;
}

export default ErrorMessageAlert;

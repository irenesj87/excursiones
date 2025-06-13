import { Alert } from "react-bootstrap";

// Componente que muestra una alerta de error
function ErrorMessageAlert({ message, onClose }) {
	return (
		<Alert variant="danger" onClose={onClose} dismissible>
			<Alert.Heading>Error</Alert.Heading>
			{message}
		</Alert>
	);
}

export default ErrorMessageAlert;

import { Alert } from "react-bootstrap";
import PropTypes from "prop-types";

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

// Definición de PropTypes.
// PropTypes: Es una librería para que los componentes reciban el tipo correcto de props de forma segura
ErrorMessageAlert.propTypes = {
	show: PropTypes.bool.isRequired, // Debe ser un booleano y es obligatorio
	message: PropTypes.string.isRequired, // Debe ser una cadena de texto y es obligatorio
	onClose: PropTypes.func.isRequired, // Debe ser una función y es obligatoria
};

export default ErrorMessageAlert;

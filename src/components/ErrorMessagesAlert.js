import React from "react";
import { Alert } from "react-bootstrap";

function ErrorMessagesAlert(props) {
	// Destructure props for cleaner access
	const { show, message, onClose } = props;

	// Render the Alert only if the 'show' prop is true
	if (show) {
		return (
			<Alert variant="danger" onClose={onClose} dismissible>
				<Alert.Heading>Error</Alert.Heading>
				{/* Display the message passed via props */}
				<p>{message}</p>
			</Alert>
		);
	}

	// If 'show' is false, render nothing
	return null;
}

export default ErrorMessagesAlert;

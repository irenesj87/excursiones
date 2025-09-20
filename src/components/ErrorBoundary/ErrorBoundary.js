import React from "react";

/**
 * Un componente de React que captura errores de JavaScript en cualquier parte de su árbol de componentes hijo,
 * registra esos errores y muestra una UI de respaldo en lugar del árbol de componentes que se ha roto.
 *
 * @param {object} props - Las propiedades del componente.
 * @param {React.ReactNode} props.children - Los componentes hijos que el ErrorBoundary protegerá.
 * @param {React.ReactNode} props.fallback - La UI que se mostrará cuando ocurra un error.
 */
class ErrorBoundary extends React.Component {
	constructor(props) {
		super(props);
		/**
		 * @type {object}
		 * @property {boolean} hasError - Indica si se ha capturado un error.
		 */
		this.state = { hasError: false };
	}

	static getDerivedStateFromError(_error) {
		// Actualiza el estado para que el siguiente renderizado muestre la UI de respaldo.
		return { hasError: true };
	}

	componentDidCatch(error, errorInfo) {
		// La mejor práctica es ser explícito con el entorno de producción.
		if (process.env.NODE_ENV === "production") {
			// EN PRODUCCIÓN: No exponer detalles en la consola del cliente.
			// Enviar el error a un servicio de logging externo (ej: Sentry, LogRocket, etc.).
			// logErrorToMyService(error, errorInfo);
			console.error("Se ha producido un error en la aplicación."); // Mensaje genérico
		} else {
			// En cualquier otro entorno (development, test, etc.), es útil ver el error completo.
			console.error("Error capturado por ErrorBoundary:", error, errorInfo);
		}
	}

	render() {
		return this.state.hasError
			? this.props.fallback // Si hay un error, muestra la UI de respaldo.
			: this.props.children; // Si no, renderiza los componentes hijos.
	}
}

export default ErrorBoundary;

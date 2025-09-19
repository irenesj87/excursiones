import React from "react";

/**
 * Un componente de React que captura errores de JavaScript en cualquier parte de su árbol de componentes hijo,
 * registra esos errores y muestra una UI de respaldo en lugar del árbol de componentes que se ha roto.
 */
class ErrorBoundary extends React.Component {
	constructor(props) {
		super(props);
		this.state = { hasError: false };
	}

	static getDerivedStateFromError(_error) {
		// Actualiza el estado para que el siguiente renderizado muestre la UI de respaldo.
		return { hasError: true };
	}

	componentDidCatch(error, errorInfo) {
		// Puedes registrar el error en un servicio de reporte de errores (ej: Sentry, LogRocket)
		console.error("Error no capturado en ErrorBoundary:", error, errorInfo);
	}

	render() {
		return this.state.hasError
			? this.props.fallback // Si hay un error, muestra la UI de respaldo.
			: this.props.children; // Si no, renderiza los componentes hijos.
	}
}

export default ErrorBoundary;

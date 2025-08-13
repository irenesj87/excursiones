import React from "react";
import { FiAlertTriangle } from "react-icons/fi";
import styles from "../css/FilterError.module.css";

/**
 * Componente para mostrar un mensaje de error cuando falla la carga de los filtros.
 * @param {object} props
 * @param {Error | null} [props.error] - El objeto de error.
 * @returns {React.ReactElement}
 */
function FilterError({ error }) {
	const message =
		error?.message || "No se pudieron cargar los filtros. Inténtalo de nuevo.";
	return (
		<div className={styles.errorContainer} role="alert">
			<FiAlertTriangle className={styles.errorIcon} aria-hidden="true" />
			<p className={styles.errorMessage}>
				{/* El prefijo "Error: " está oculto visualmente pero es leído por los lectores de pantalla para dar más contexto. */}
				<span className="visually-hidden">Error: </span>
				{message}
			</p>
		</div>
	);
}

export default FilterError;
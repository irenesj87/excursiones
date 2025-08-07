import React from "react";
import { FiAlertTriangle } from "react-icons/fi";
import styles from "../css/FilterError.module.css";

/**
 * Componente para mostrar un mensaje de error cuando falla la carga de los filtros.
 * @param {object} props
 * @param {string} [props.message="No se pudieron cargar los filtros."] - El mensaje de error a mostrar.
 * @returns {React.ReactElement}
 */
function FilterError({ message = "No se pudieron cargar los filtros." }) {
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
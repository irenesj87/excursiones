import React from "react";
import { FiAlertTriangle } from "react-icons/fi";
import styles from "./FilterError.module.css";

/**
 * Componente para mostrar un mensaje de error cuando falla la carga de los filtros.
 * @param {object} props
 * @param {(Error & { secondaryMessage?: string }) | null} [props.error] - El objeto de error.
 * @returns {React.ReactElement}
 */
function FilterError({ error }) {
	const message =
		error?.message || "No se pudieron cargar los filtros. Inténtalo de nuevo.";
	const secondaryMessage = error?.secondaryMessage;

	return (
		<div className={styles.errorContainer} role="alert">
			<FiAlertTriangle className={styles.errorIcon} aria-hidden="true" />
			<div>
				<p className={styles.errorMessage}>
					<span className="visually-hidden">Error: </span>
					{message}
				</p>
				{secondaryMessage && (
					<p className={styles.secondaryMessage}>{secondaryMessage}</p>
				)}
			</div>
		</div>
	);
}

export default FilterError;

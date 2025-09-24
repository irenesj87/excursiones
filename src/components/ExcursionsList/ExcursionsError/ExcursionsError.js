import { memo } from "react";
import { FiAlertCircle } from "react-icons/fi";
import styles from "./ExcursionsError.module.css";

const DEFAULT_ERROR_MESSAGE =
	"Lo sentimos, ha ocurrido un error al cargar las excursiones.";

/**
 * Componente que muestra un mensaje de error con un icono. Se renderiza cuando la carga de excursiones falla.
 * @param {ExcursionsErrorProps} props
 * @typedef {object} ExcursionsErrorProps
 * @property {(Error & { secondaryMessage?: string }) | null} error - El objeto de error que contiene el mensaje a mostrar.
 */
const ExcursionsErrorComponent = ({ error }) => (
	<div className={`${styles.excursionsContainer} ${styles.centeredStatus}`}>
		<div role="alert" className={styles.messageNotFound}>
			<FiAlertCircle
				className={styles.messageIcon}
				data-testid="alert-icon"
				aria-hidden="true"
			/>
			<p className={styles.primaryMessage}>
				{error?.message || DEFAULT_ERROR_MESSAGE}
			</p>
			{error?.secondaryMessage && (
				<p className={styles.secondaryMessage}>{error.secondaryMessage}</p>
			)}
		</div>
	</div>
);

const ExcursionsError = memo(ExcursionsErrorComponent);
export default ExcursionsError;

import { memo } from "react";
import { FiAlertCircle } from "react-icons/fi";
import styles from "./ExcursionsError.module.css";
import DOMPurify from "dompurify";

export const DEFAULT_ERROR_MESSAGE =
	"Lo sentimos, ha ocurrido un error al cargar las excursiones.";

/**
 * Componente que muestra un mensaje de error con un icono. Se renderiza cuando la carga de excursiones falla.
 * @param {ExcursionsErrorProps} props
 * @typedef {object} ExcursionsErrorProps
 * @property {(Error & { secondaryMessage?: string }) | null} error - El objeto de error que contiene el mensaje a mostrar.
 */
const ExcursionsErrorComponent = ({ error }) => (
	<div
		className={`${styles.excursionsContainer} ${styles.centeredStatus}`}
		data-testid="excursions-error"
	>
		<div role="alert" className={styles.messageNotFound}>
			<FiAlertCircle
				className={`${styles.messageIcon} text-danger`}
				data-testid="alert-icon"
				aria-hidden="true"
			/>
			<p className={styles.primaryMessage}>
				{error?.message || DEFAULT_ERROR_MESSAGE}
			</p>
			{/* Si se necesita renderizar HTML en el mensaje secundario, se sanitiza primero con DOMPurify
			para prevenir ataques XSS. Esto elimina cualquier script o elemento peligroso. */}
			{error?.secondaryMessage && (
				<p
					className={styles.secondaryMessage}
					dangerouslySetInnerHTML={{
						__html: DOMPurify.sanitize(error.secondaryMessage),
					}}
				/>
			)}
		</div>
	</div>
);

const ExcursionsError = memo(ExcursionsErrorComponent);
export default ExcursionsError;

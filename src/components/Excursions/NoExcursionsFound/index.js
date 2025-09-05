import { memo } from "react";
import { FiSearch } from "react-icons/fi";
import styles from "./NoExcursionsFound.module.css";

/**
 * Componente que muestra un mensaje cuando no se encuentran excursiones que coincidan con los criterios de búsqueda.
 */
const NoExcursionsFoundComponent = () => (
	<div className={`${styles.excursionsContainer} ${styles.centeredStatus}`}>
		<div role="status" className={styles.messageNotFound}>
			<FiSearch
				className={styles.messageIcon}
				data-testid="search-icon"
				aria-hidden="true"
			/>
			<p className={styles.primaryMessage}>
				No se encontraron excursiones con esas características.
			</p>
			<p className={styles.secondaryMessage}>
				Prueba a cambiar los filtros para refinar tu búsqueda.
			</p>
		</div>
	</div>
);

const NoExcursionsFound = memo(NoExcursionsFoundComponent);
export default NoExcursionsFound;

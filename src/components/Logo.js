import { FaMountain } from "react-icons/fa";
import styles from "../css/Logo.module.css";

/**
 * Componente que renderiza el logo de la aplicación, incluyendo un icono de montaña y el texto "Excursiones Juntos".
 */
function Logo() {
	return (
		<div className={styles.logoContainer}>
			<FaMountain className={styles.logoIcon} aria-hidden="true" />
			<span className={styles.logoText}>Excursiones Juntos</span>
		</div>
	);
}

export default Logo;

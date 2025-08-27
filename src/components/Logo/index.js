import { Link } from "react-router-dom";
import styles from "./Logo.module.css";

/**
 * Componente que renderiza el logo de la aplicación con el texto "Excursiones Juntos".
 */
function Logo() {
	return (
		<Link to="/" className={styles.logoContainer}>
			<span className={styles.logoText}>Excursiones Juntos</span>
		</Link>
	);
}

export default Logo;

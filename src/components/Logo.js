import "bootstrap/dist/css/bootstrap.css";
import styles from "../css/Logo.module.css";

// Componente que muestra el logo de la aplicación.
function Logo() {
	return <span className={styles.logoText}>Excursiones Juntos</span>;
}

export default Logo;

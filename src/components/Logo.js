import styles from "../css/Logo.module.css";

/**
 * Componente que renderiza el logo de la aplicación, incluyendo un icono de montaña y el texto "Excursiones Juntos".
 */
function Logo() {
	return (
		<div className={styles.logoContainer}>
			<span className={styles.logoText}>Excursiones Juntos</span>
		</div>
	);
}

export default Logo;

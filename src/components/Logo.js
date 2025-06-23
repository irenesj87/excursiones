import { Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import styles from "../css/Logo.module.css";

/**
 * Componente que muestra el logo de la aplicación.
 */
function Logo() {
	return (
		<Col xs="12" md="3">
			<span className={styles.logoText}>Excursiones Juntos</span>
		</Col>
	);
}

export default Logo;

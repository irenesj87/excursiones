import { MdMail } from "react-icons/md";
import "bootstrap/dist/css/bootstrap.css";
import styles from "../css/Footer.module.css";

/**
 * Obtiene el año actual para mostrar en el pie de página.
 * @returns {number} El año actual.
 */
const currentYear = new Date().getFullYear();

/**
 * Componente del pie de página que muestra información de contacto y derechos de autor.
 * @returns {React.ReactElement} El componente del pie de página.
 */
function Footer() {
	return (
		<footer className={styles.footer} role="contentinfo">
			<a
				href="mailto:excursionesjuntos@gmail.com"
				className={styles.mailIconLink}
				aria-label="Enviar correo electrónico"
			>
				<MdMail />
			</a>
			<p className={styles.footerText}>
				© Excursiones Juntos 2021 - {currentYear}. Todos los derechos reservados.
			</p>
		</footer>
	);
}

export default Footer;

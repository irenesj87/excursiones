import { useCallback } from "react";
import { Tooltip, OverlayTrigger } from "react-bootstrap";
import { MdMail } from "react-icons/md";
import "bootstrap/dist/css/bootstrap.css";
import styles from "./Footer.module.css";

/**
 * Obtiene el año actual para mostrar en el pie de página.
 * @returns {number} El año actual.
 */
const currentYear = new Date().getFullYear();

/**
 * Componente del pie de página que muestra información de contacto y derechos de autor.
 * Se adapta al tema claro/oscuro de la aplicación.
 * @returns {React.ReactElement} El componente del pie de página.
 */
function Footer() {
	/**
	 * Renderiza el Tooltip para el icono de correo.
	 * Se memoiza con `useCallback` para evitar que se recree en cada renderizado.
	 * @param {object} props - Propiedades inyectadas por OverlayTrigger.
	 * @returns {React.ReactElement}
	 */
	const renderMailTooltip = useCallback(
		(props) => (
			<Tooltip id="mail-tooltip" {...props}>
				Envíanos un correo
			</Tooltip>
		),
		[]
	);
	return (
		<footer className={styles.footer} role="contentinfo">
			<OverlayTrigger placement="top" overlay={renderMailTooltip}>
				<a
					href="mailto:excursionesjuntos@gmail.com"
					className={styles.mailIconLink}
					aria-label="Enviar correo electrónico"
				>
					<MdMail />
				</a>
			</OverlayTrigger>
			<small className={styles.footerText}>
				© Excursiones Juntos 2021 - {currentYear}. Todos los derechos
				reservados.
			</small>
		</footer>
	);
}

export default Footer;

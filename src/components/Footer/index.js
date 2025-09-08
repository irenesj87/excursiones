import { useCallback } from "react";
import { Tooltip, OverlayTrigger } from "react-bootstrap";
import { MdMail } from "react-icons/md";
import { CONTACT_EMAIL, COMPANY_NAME, START_YEAR } from "../../constants";
import styles from "./Footer.module.css";

/**
 * Genera el texto de copyright dinámicamente.
 * Muestra un solo año si el año de inicio y el actual son el mismo.
 * @returns {string} El texto de copyright.
 */
const getCopyrightText = () => {
	const CURRENT_YEAR = new Date().getFullYear();
	const yearDisplay =
		START_YEAR === CURRENT_YEAR
			? START_YEAR
			: `${START_YEAR} - ${CURRENT_YEAR}`;
	return `© ${COMPANY_NAME} ${yearDisplay}. Todos los derechos reservados.`;
};

/**
 * Componente del pie de página que muestra información de contacto y derechos de autor.
 * Se adapta al tema claro/oscuro de la aplicación.
 * @returns {React.ReactElement} El componente del pie de página.
 */
function FooterComponent() {
	/**
	 * Renderiza el Tooltip para el icono de correo.
	 * Se memoiza con `useCallback` para evitar que se recree en cada renderizado.
	 * @param {object} props - Propiedades inyectadas por OverlayTrigger.
	 * @returns {React.ReactElement}
	 */
	const renderMailTooltip = useCallback(
		(props) => <Tooltip {...props}>Envíanos un correo</Tooltip>,
		[]
	);
	return (
		<footer className={styles.footer}>
			<OverlayTrigger placement="top" overlay={renderMailTooltip}>
				<a
					href={`mailto:${CONTACT_EMAIL}`}
					className={styles.mailIconLink}
					aria-label="Enviar correo electrónico"
				>
					<MdMail />
				</a>
			</OverlayTrigger>
			<small className={styles.footerText}>{getCopyrightText()}</small>
		</footer>
	);
}

export default FooterComponent;

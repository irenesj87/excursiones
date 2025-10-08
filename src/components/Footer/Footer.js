import React from "react";
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
 * @returns {React.ReactElement} El componente del pie de página.
 */
function FooterComponent() {
	return (
		<footer className={styles.footer}>
			<a
				href={`mailto:${CONTACT_EMAIL}`}
				className={styles.mailIconLink}
				aria-label="Enviar correo electrónico"
			>
				<MdMail />
			</a>

			<small className={styles.footerText}>{getCopyrightText()}</small>
		</footer>
	);
}

export default FooterComponent;

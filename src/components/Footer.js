import React from "react";
import { FiMail } from "react-icons/fi";
import "bootstrap/dist/css/bootstrap.css";
import styles from "../css/Footer.module.css";

function Footer() {
	// Función que retorna el año actual
	const getCurrentYear = () => {
		return new Date().getFullYear();
	};

	return (
		<footer className={styles.footer} role="contentinfo">
			<p>
				<a href="mailto:excursionesjuntos@gmail.com"><FiMail/></a>
			</p>
			<p>
				© Excursiones Juntos 2021 - {getCurrentYear()}. Todos los derechos reservados.
			</p>
		</footer>
	);
}

export default Footer;

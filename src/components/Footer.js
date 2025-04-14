import React from "react";
import "bootstrap/dist/css/bootstrap.css";
import styles from "../css/Footer.module.css";

// This is the webpage footer
function Footer() {
	// Function that returns the current year
	const getCurrentYear = () => {
		return new Date().getFullYear();
	};

	return (
		<footer className={styles.footer} role="contentinfo">
			<p>
				<a href="mailto:excursionesjuntos@gmail.com">Contáctanos</a>
			</p>
			<p>
				© Excursiones Juntos 2021 - {getCurrentYear()}. Todos los derechos reservados.
			</p>
		</footer>
	);
}

export default Footer;

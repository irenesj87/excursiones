import { MdMail } from "react-icons/md";
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
				<a
					href="mailto:excursionesjuntos@gmail.com"
					aria-label="Enviar correo electrónico"
				>
					<MdMail />
				</a>
			</p>
			<p>
				© Excursiones Juntos 2021 - {getCurrentYear()}. Todos los derechos
				reservados.
			</p>
		</footer>
	);
}

export default Footer;

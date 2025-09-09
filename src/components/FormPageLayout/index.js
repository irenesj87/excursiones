import { useId } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import styles from "./FormPageLayout.module.css";

/**
 * @typedef {object} FormPageLayoutProps
 * @property {string} title - El título principal que se mostrará en la tarjeta.
 * @property {string} [subtitle] - Un subtítulo opcional para dar más contexto.
 * @property {React.ReactNode} children - El contenido del formulario a renderizar.
 * @property {import('react-bootstrap/esm/Col').ColProps['xl']} [colWidth="5"] - Ancho de la columna para el formulario.
 * @property {string} [switcherPrompt] - Texto que precede al enlace de cambio de página (ej. "¿No tienes cuenta?").
 * @property {string} [switcherLinkText] - Texto del enlace de cambio de página (ej. "Regístrate").
 * @property {string} [switcherLinkTo] - La ruta a la que debe navegar el enlace (ej. "/register").
 */

/**
 * Componente que proporciona un diseño de página reutilizable para formularios.
 * Centra el contenido del formulario en una tarjeta, adaptándose a diferentes breakpoints.
 * @param {FormPageLayoutProps} props - Las propiedades del componente.
 */
function FormPageLayout({
	title,
	subtitle,
	children,
	colWidth = "5",
	switcherPrompt,
	switcherLinkText,
	switcherLinkTo,
}) {
	// Genera un ID único y estable para el título, garantizando la accesibilidad.
	const titleId = useId();

	/**
	 * Renderiza el layout del formulario.
	 * @returns {JSX.Element} El componente de layout del formulario.
	 */
	return (
		<Container as="main" fluid className={`${styles.container} h-100`}>
			<Row className="justify-content-center align-items-center h-100">
				<Col xs={12} md={9} lg={8} xl={colWidth}>
					<Card
						as="section"
						className={styles.contentPane}
						aria-labelledby={titleId}
					>
						<Card.Body>
							<Card.Title as="h2" id={titleId} className={styles.cardTitle}>
								{title}
							</Card.Title>
							{subtitle && <p className={styles.cardSubtitle}>{subtitle}</p>}
							{children}
						</Card.Body>
						{switcherPrompt && switcherLinkText && switcherLinkTo && (
							<Card.Footer className={`${styles.switcher} d-lg-none`}>
								{switcherPrompt}{" "}
								<Link to={switcherLinkTo} className={styles.switcherLink}>
									{switcherLinkText}
								</Link>
							</Card.Footer>
						)}
					</Card>
				</Col>
			</Row>
		</Container>
	);
}

export default FormPageLayout;

import { Container, Row, Col, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import styles from "./FormPageLayout.module.css";

/**
 * Componente que proporciona un diseño de página reutilizable para formularios.
 * Centra el contenido del formulario en una tarjeta, adaptándose a diferentes breakpoints.
 * @param {object} props - Las propiedades del componente.
 * @param {string} props.title - El título principal que se mostrará en la tarjeta.
 * @param {string} [props.subtitle] - Un subtítulo opcional para dar más contexto.
 * @param {React.ReactNode} props.children - El contenido del formulario a renderizar.
 * @param {import('react-bootstrap/esm/Col').ColProps['xl']} [props.colWidth="5"] - Ancho de la columna para el formulario.
 * @param {string} [props.switcherPrompt] - Texto que precede al enlace de cambio de página (ej. "¿No tienes cuenta?").
 * @param {string} [props.switcherLinkText] - Texto del enlace de cambio de página (ej. "Regístrate").
 * @param {string} [props.switcherLinkTo] - La ruta a la que debe navegar el enlace (ej. "/register").
 */
function FormPageLayout(props) {
	const {
		title,
		subtitle,
		children,
		colWidth = "5",
		switcherPrompt,
		switcherLinkText,
		switcherLinkTo,
	} = props;

	// Genera un ID único para el título, que se usará para la accesibilidad.Reemplaza espacios y caracteres especiales para crear
	// un ID válido.
	const titleId = `form-layout-title-${title
		.toLowerCase()
		.replace(/[\s/]/g, "-")}`;

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

FormPageLayout.propTypes = {
	title: PropTypes.string.isRequired,
	subtitle: PropTypes.string,
	children: PropTypes.node.isRequired,
	colWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	switcherPrompt: PropTypes.string,
	switcherLinkText: PropTypes.string,
	switcherLinkTo: PropTypes.string,
};

FormPageLayout.defaultProps = {
	subtitle: null,
	colWidth: "5",
	switcherPrompt: null,
	switcherLinkText: null,
	switcherLinkTo: null,
};

export default FormPageLayout;

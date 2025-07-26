import { Container, Row, Col, Card } from "react-bootstrap";
import styles from "../css/FormPageLayout.module.css";

/**
 * Componente que proporciona un diseño de página reutilizable para formularios.
 * Centra el contenido del formulario en una tarjeta, adaptándose a diferentes breakpoints.
 * Layout reutilizable para páginas con formularios centrados (Login, Registro).
 * @param {object} props
 * @param {string} props.title - El título principal que se mostrará en la tarjeta.
 * @param {string} [props.subtitle] - Un subtítulo opcional para dar más contexto.
 * @param {React.ReactNode} props.children - El contenido del formulario a renderizar.
 * @param {import('react-bootstrap/esm/Col').ColProps['xl']} [props.colWidth="5"] - Ancho de la columna para el formulario.
 * @returns {React.ReactElement} El componente de layout del formulario.
 */
function FormPageLayout({ title, subtitle, children, colWidth = "5" }) {
	// Genera un ID único para el título, que se usará para la accesibilidad.
	// Reemplaza espacios y caracteres especiales para crear un ID válido.
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
					<Card className="contentPane" role="region" aria-labelledby={titleId}>
						<Card.Body>
							<Card.Title as="h2" id={titleId} className={styles.cardTitle}>
								{title}
							</Card.Title>
							{subtitle && <p className={styles.cardSubtitle}>{subtitle}</p>}
							{children}
						</Card.Body>
					</Card>
				</Col>
			</Row>
		</Container>
	);
}

export default FormPageLayout;

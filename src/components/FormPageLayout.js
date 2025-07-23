import { Container, Row, Col, Card } from "react-bootstrap";
import styles from "../css/FormPageLayout.module.css";

/**
 * Componente que proporciona un diseño de página reutilizable para formularios.
 * Centra el contenido del formulario en una tarjeta, adaptándose a diferentes breakpoints.
 * Layout reutilizable para páginas con formularios centrados (Login, Registro).
 * @param {object} props - Las propiedades del componente.
 * @param {string} props.title - El título que se mostrará en la tarjeta.
 * @param {React.ReactNode} props.children - El contenido del formulario a renderizar.
 * @param {import('react-bootstrap/esm/Col').ColProps['xl']} [props.colWidth="5"] - Ancho de la columna para el formulario en breakpoints grandes.
 */
function FormPageLayout({ title, children, colWidth = "5" }) {
	/**
	 * Renderiza el layout del formulario.
	 * @returns {JSX.Element} El componente de layout del formulario.
	 */
	return (
		<Container fluid className={`${styles.container} h-100`}>
			<Row className="justify-content-center align-items-center h-100">
				<Col xs={12} md={9} lg={8} xl={colWidth}>
					<Card className="contentPane">
						<Card.Body>
							<Card.Title as="h2" className={styles.cardTitle}>
								{title}
							</Card.Title>
							{children}
						</Card.Body>
					</Card>
				</Col>
			</Row>
		</Container>
	);
}

export default FormPageLayout;

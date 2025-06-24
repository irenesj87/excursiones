import { Container, Row, Col, Card } from "react-bootstrap";
import RegisterForm from "./RegisterForm";
import "bootstrap/dist/css/bootstrap.css";
import styles from "../css/RegisterPage.module.css";

/**
 * Componente que representa la página de registro de usuarios.
 */
function RegisterPage() {
	return (
		// Aseguramos que el Container se expanda verticalmente
		<Container fluid className={`${styles.container} d-flex flex-column flex-grow-1`}>
			{/* La Row también debe crecer para que align-items-center funcione en toda la altura */}
			<Row className="justify-content-center align-items-center flex-grow-1">
				<Col xs={12} lg={9} xl={5}>
					<Card className={styles.registerCard}>
						<Card.Body>
							<Card.Title as="h2" className={styles.cardTitle}>Bienvenido/a</Card.Title>
							<RegisterForm />
						</Card.Body>
					</Card>
				</Col>
			</Row>
		</Container>
	);
}

export default RegisterPage;

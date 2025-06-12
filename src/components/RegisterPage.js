import { Container, Row, Col, Card } from "react-bootstrap";
import RegisterForm from "./RegisterForm";
import "bootstrap/dist/css/bootstrap.css";
import styles from "../css/RegisterPage.module.css";

function RegisterPage() {
	return (
		<Container fluid className={styles.container}>
			<Row className="justify-content-center align-items-center">
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

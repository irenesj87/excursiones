import { Container, Row, Col, Card } from "react-bootstrap";
import LoginForm from "../components/LoginForm";
import "bootstrap/dist/css/bootstrap.css";
import styles from "../css/LoginPage.module.css";

function LoginPage() {
	return (
		<Container className={styles.containerLoginForm} fluid >
			<Row className="justify-content-center align-items-center">
				<Col xs={12} md={9} lg={8} xl={3}>
					<Card className={styles.loginCard}>
						<Card.Body>
							<Card.Title as="h2" className={styles.cardTitle}>Inicia sesión</Card.Title>
							<LoginForm />
						</Card.Body>
					</Card>
				</Col>
			</Row>
		</Container>
	);
}

export default LoginPage;

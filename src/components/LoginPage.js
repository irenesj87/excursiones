// src/pages/LoginPage.js (Create this new file)
import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import LoginForm from "../components/LoginForm"; // Adjust the path if necessary
import styles from "../css/LoginPage.module.css"; // Create this CSS file too

function LoginPage() {
	return (
		// Use Container fluid for full width, or regular Container for fixed width
		<Container className={styles.containerLoginForm} fluid >
			{/* Center the content vertically and horizontally */}
			<Row>
				<Col xs="12">
					<h2 className={styles.title}>Inicia sesión</h2>
				</Col>
			</Row>
			<Row className="justify-content-center align-items-center">
				<Col xs={11} sm={8} md={6} lg={6} xl={3}>
					<Card className={styles.loginCard}>
						<Card.Body>
							<LoginForm />
						</Card.Body>
					</Card>
				</Col>
			</Row>
		</Container>
	);
}

export default LoginPage;

import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import RegisterForm from "./RegisterForm";
import "bootstrap/dist/css/bootstrap.css";
import styles from "../css/RegisterPage.module.css";

function RegisterPage() {
	return (
		<Container fluid className={styles.container}>
			<Row>
				<Col xs="12">
					<h2 className={styles.title}>Bienvenido/a</h2>
				</Col>
			</Row>
			<Row className="justify-content-center align-items-center">
				<Col xs={11} sm={8} md={7} lg={8} xl={4}>
					<Card className={styles.registerCard}>
						<Card.Body>
							<RegisterForm />
						</Card.Body>
					</Card>
				</Col>
			</Row>
		</Container>
	);
}

export default RegisterPage;

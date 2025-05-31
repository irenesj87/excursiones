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
				<Col xs={12} lg={9} xl={5}>
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

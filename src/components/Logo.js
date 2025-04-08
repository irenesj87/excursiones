import React from "react";
import { Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import styles from "../css/Logo.module.css";

function Logo() {
	return (
		<Col className={styles.logoContainer} xs="12" md="3">
			<span className={styles.logoText}>Excursiones Juntos</span>
		</Col>
	);
}

export default Logo;

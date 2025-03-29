import React from "react";
import { Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import styles from "../css/Logo.module.css";

function Logo() {
	return (
		<Col className={styles.logo} xs="12" md="3">
			<Link to="/">Excursiones Juntos</Link>
		</Col>
	);
}

export default Logo;

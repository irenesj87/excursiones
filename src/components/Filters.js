import React from "react";
import { Col, Accordion } from "react-bootstrap";
import FiltersList from "./FiltersList";
import styles from "../css/Filters.module.css";
import "bootstrap/dist/css/bootstrap.css";

function Filters() {
	return (
		<Col xs="12" md="3" lg="2">
			<Accordion flush className={styles.customAccordion}>
				<Accordion.Item eventKey="0">
					<Accordion.Header className={styles.customAccordionHeader}>Zona</Accordion.Header>
					<Accordion.Body className={styles.customAccordionBody}>
						<FiltersList filterName="area" />
					</Accordion.Body>
				</Accordion.Item>
				<Accordion.Item eventKey="1">
					<Accordion.Header className={styles.customAccordionHeader}>Dificultad</Accordion.Header>
					<Accordion.Body className={styles.customAccordionBody}>
						<FiltersList filterName="difficulty" />
					</Accordion.Body>
				</Accordion.Item>
				<Accordion.Item eventKey="2" id="time">
					<Accordion.Header className={styles.customAccordionHeader}>Tiempo estimado</Accordion.Header>
					<Accordion.Body className={styles.customAccordionBody}>
						<FiltersList filterName="time" />
					</Accordion.Body>
				</Accordion.Item>
			</Accordion>
		</Col>
	);
}

export default Filters;

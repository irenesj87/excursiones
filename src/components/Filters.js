import React from "react";
import { Col, Accordion } from "react-bootstrap";
import FiltersList from "./FiltersList";
import { FaMountainSun } from "react-icons/fa6";
import { GoGraph } from "react-icons/go";
import { MdAccessTimeFilled } from "react-icons/md";
import "bootstrap/dist/css/bootstrap.css";
import styles from "../css/Filters.module.css";

function Filters() {
	return (
		<Col xs="12" sm="12" md="4" lg="3" xl="2">
			<Accordion flush className={styles.customAccordion}>
				<Accordion.Item eventKey="0">
					<Accordion.Header className={styles.customAccordionHeader}>
						<FaMountainSun />
						Zona
					</Accordion.Header>
					<Accordion.Body className={styles.customAccordionBody}>
						{/* Pone todos los filtros que hay en el servidor de tipo 'area' */}
						<FiltersList filterName="area" />
					</Accordion.Body>
				</Accordion.Item>
				<Accordion.Item eventKey="1">
					<Accordion.Header className={styles.customAccordionHeader}>
						<GoGraph />
						Dificultad
					</Accordion.Header>
					<Accordion.Body className={styles.customAccordionBody}>
						{/* Pone todos los filtros que hay en el servidor de tipo 'difficulty' */}
						<FiltersList filterName="difficulty" />
					</Accordion.Body>
				</Accordion.Item>
				<Accordion.Item eventKey="2">
					<Accordion.Header className={styles.customAccordionHeader}>
						<MdAccessTimeFilled />
						Tiempo estimado
					</Accordion.Header>
					<Accordion.Body className={styles.customAccordionBody}>
						{/* Pone todos los filtros que hay en el servidor de tipo 'time' */}
						<FiltersList filterName="time" />
					</Accordion.Body>
				</Accordion.Item>
			</Accordion>
		</Col>
	);
}

export default Filters;

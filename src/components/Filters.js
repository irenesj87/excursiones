import React from "react";
import { Col, Accordion } from "react-bootstrap";
import FiltersList from "./FiltersList";
import "bootstrap/dist/css/bootstrap.css";

function Filters() {
	return (
		<Col xs="12" md="3" lg="2">
			<Accordion flush>
				<Accordion.Item eventKey="0">
					<Accordion.Header>Zona</Accordion.Header>
					<Accordion.Body>
						<FiltersList filterName="area" />
					</Accordion.Body>
				</Accordion.Item>
				<Accordion.Item eventKey="1">
					<Accordion.Header>Dificultad</Accordion.Header>
					<Accordion.Body>
						<FiltersList filterName="difficulty" />
					</Accordion.Body>
				</Accordion.Item>
				<Accordion.Item eventKey="2" id="time">
					<Accordion.Header>Tiempo estimado</Accordion.Header>
					<Accordion.Body>
						<FiltersList filterName="time" />
					</Accordion.Body>
				</Accordion.Item>
			</Accordion>
		</Col>
	);
}

export default Filters;

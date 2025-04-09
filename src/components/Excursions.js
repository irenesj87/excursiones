import React from "react";
import { Col } from "react-bootstrap";
import Excursion from "./Excursion";
import "bootstrap/dist/css/bootstrap.css";
import styles from "../css/Excursions.module.css";

function Excursions(props) {
	/**
	 * Array that saves the excursions that have to be displayed, this can display the entire list of excursions we have on the server (if the user didn't search for anything
	 * in the search bar or the filters) or the list of excursions that the search with the search bar or the filters gives us
	 */
	const excursions = props.excursionData.map((excursion) => (
		<Excursion key={excursion.id} {...excursion} />
	));

	// Variable that saves if the user has search for an excursion we already had in the database or not
	const found = excursions.length > 0;

	// Variable that has the message that has to be displayed if we don´t find the excursion the user wants
	const notFound = (
		<div className={styles.messageNotFound}>
			Lo sentimos, pero no tenemos ninguna excursión con esas características.
		</div>
	);

	return (
		<Col className={styles.container} xs="12" md="8" lg="8">
			<h2 className={styles.title}>Próximas excursiones</h2>
			{found && excursions}
			{!found && notFound}
		</Col>
	);
}

export default Excursions;

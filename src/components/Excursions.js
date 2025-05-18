import React from "react";
import Excursion from "./Excursion";
import "bootstrap/dist/css/bootstrap.css";
import styles from "../css/Excursions.module.css";

function Excursions(props) {
	/* Array que guarda las excursiones que se deben mostrar, pueden ser toda la lista de excursiones o las que busque 
	el usario con la barra de búsqueda o los filtros */
	const excursions = props.excursionData.map((excursion) => (
		/* El spread operator pasa las propiedades del objeto (name, area, difficulty...) como props del componente Excursion */
		<Excursion key={excursion.id} {...excursion} />
	));

	// Variable que guarda si el usuario ha buscado una excursión que ya teníamos en la base de datos o no
	const found = excursions.length > 0;

	// Variable que guarda el mensaje que se debe mostrar si no se encuentra la excursión que el usuario busca
	const notFound = (
		<div className={`${styles.messageNotFound} text-center`}>
			Lo sentimos, pero no tenemos ninguna excursión con esas características.
		</div>
	);

	return (
		<div className={styles.container}>
			<h2 className={styles.title}>Próximas excursiones</h2>
			{found && excursions}
			{!found && notFound}
		</div>
	);
}

export default Excursions;

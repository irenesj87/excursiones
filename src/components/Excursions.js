import { Row, Col, Spinner, Alert } from "react-bootstrap";
import Excursion from "./Excursion";
import DelayedFallback from "./DelayedFallback";
import "bootstrap/dist/css/bootstrap.css";
import styles from "../css/Excursions.module.css";

function Excursions({ excursionData, isLoading, error }) {
	if (isLoading) {
		return (
			<DelayedFallback
				delay={300}
				className={`${styles.centeredStatus} flex-grow-1`}
			>
				<Spinner as="output" animation="border">
					<span className="visually-hidden">Cargando excursiones...</span>
				</Spinner>
				<p className="mt-2">Cargando excursiones...</p>
			</DelayedFallback>
		);
	}

	if (error) {
		// Show error if there is one (and spinner is not showing)
		return (
			// Mostrar el error solo si no estamos cargando
			<div className={`${styles.centeredStatus} py-5 flex-grow-1 w-100`}>
				<Alert variant="danger">
					{error.message ||
						"Lo sentimos, ha ocurrido un error al cargar las excursiones."}
				</Alert>
			</div>
		);
	}

	// Si llegamos aquí, no se está mostrando el spinner activo ni hay un error.
	// Mostrar la lista de excursiones o el mensaje de "no encontrado" solo si no estamos cargando y no hay error.
	const excursionComponents = excursionData.map((excursion) => (
		/* El spread operator pasa las propiedades del objeto (name, area, difficulty...) como props del componente Excursion */
		<Excursion key={excursion.id} {...excursion} />
	));
	const found = excursionComponents.length > 0;

	if (found) {
		// Hay excursiones para mostrar
		return (
			<div className={styles.container}>
				<Row>
					<Col xs={12} xl={10}>
						<h2 className={styles.title}>Próximas excursiones</h2>
						<div>
							{/* Contenedor para los excursionComponents */}
							{excursionComponents}
						</div>
					</Col>
				</Row>
			</div>
		);
	} else if (!isLoading) {
		// No hay excursiones en excursionData y no estamos cargando. Mostrar el mensaje "no encontrado".
		// Similar al spinner, un div para ser centrado.
		return (
			<div
				className={`${styles.messageNotFound} ${styles.centeredStatus} text-center py-5 flex-grow-1 w-100`}
			>
				Lo sentimos, pero no tenemos ninguna excursión con esas características.
			</div>
		);
	} else {
		// Si isLoading es true pero no hay datos (ej: al inicio de la carga antes de que lleguen los datos), no mostramos nada aún.
		return null;
	}
}

export default Excursions;

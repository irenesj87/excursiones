import { memo, useMemo } from "react";
import { Row, Col, Spinner, Alert } from "react-bootstrap";
import Excursion from "./Excursion";
import DelayedFallback from "./DelayedFallback";
import "bootstrap/dist/css/bootstrap.css";
import styles from "../css/Excursions.module.css";

/**
 * Componente que sirve para mostrar la lista de excursiones
 * @param {Array<Object>} excursionData - Array de objetos de excursiones a mostrar.
 * @param {boolean} isLoading - Indica si los datos de las excursiones están cargando.
 * @param {Error | null} error - Objeto de error si ha ocurrido un problema al cargar las excursiones.
 */
const Excursions = memo(function Excursions({
	excursionData,
	isLoading,
	error,
}) {
	// Se memoizan las excursiones para que no se estén renderizando siempre
	const excursionComponents = useMemo(
		() =>
			excursionData.map((excursion) => (
				/** El spread operator pasa las propiedades del objeto (name, area, difficulty...) como props del componente
				 * Excursion
				 */
				<Excursion key={excursion.id} {...excursion} />
			)),
		[excursionData]
	);
	// Si se están cargando los datos de las excursiones, mostrar el spinner
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
	// Si hay un error, mostrar un mensaje de error
	if (error) {
		return (
			<div className={`${styles.centeredStatus} py-5 flex-grow-1 w-100`}>
				<Alert variant="danger">
					{error.message ||
						"Lo sentimos, ha ocurrido un error al cargar las excursiones."}
				</Alert>
			</div>
		);
	}
	/** Si llegamos aquí, no se está mostrando el spinner ni hay un error. Si no hay excursiones para mostrar, se muestra
	 * el mensaje "no encontrada".
	 */
	if (excursionComponents.length === 0) {
		return (
			<div
				className={`${styles.messageNotFound} ${styles.centeredStatus} text-center py-5 flex-grow-1 w-100`}
			>
				Lo sentimos, pero no tenemos ninguna excursión con esas características.
			</div>
		);
	}

	// Si hay excursiones, se muestran.
	return (
		<div className={styles.container}>
			<Row>
				<Col xs={12} xl={10}>
					<h2 className={styles.title}>Próximas excursiones</h2>
					<div>{excursionComponents}</div>
				</Col>
			</Row>
		</div>
	);
});

export default Excursions;

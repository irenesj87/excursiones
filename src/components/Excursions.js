import { useState, useEffect } from "react"; // Importar useState y useEffect
import { Row, Col, Spinner, Alert } from "react-bootstrap";
import Excursion from "./Excursion";
import "bootstrap/dist/css/bootstrap.css";
import styles from "../css/Excursions.module.css";

function Excursions({ excursionData, isLoading, error }) {
	// Estado local para controlar la visualización del spinner con retraso
	const [showDelayedSpinner, setShowDelayedSpinner] = useState(false);

	// Efecto para gestionar el retraso del spinner basado en la prop isLoading
	useEffect(() => {
		let timerId;
		if (isLoading) {
			// Si está cargando, establece un temporizador para mostrar el spinner después de un retraso
			timerId = setTimeout(() => {
				setShowDelayedSpinner(true);
			}, 300); // Retraso de 300ms, ajústalo según sea necesario
		} else {
			// Si no está cargando, asegúrate de que el spinner no se muestre y limpia el temporizador
			setShowDelayedSpinner(false);
		}
		return () => clearTimeout(timerId); // Limpieza del temporizador
	}, [isLoading]); // Dependencia: se ejecuta cuando isLoading cambia

	// --- Render Logic ---

	if (showDelayedSpinner && isLoading) {
		// Show spinner if delay passed and still loading
		return (
			// Este div será centrado horizontalmente por la Col de Layout.js.
			// styles.centeredStatus (con justify-content: center) centrará el contenido verticalmente.
			// flex-grow-1 permite que este div ocupe la altura de la Col padre.
			<Col
				xs={12}
				xl={10}
				className={`${styles.centeredStatus} flex-grow-1`}
			>
				<Spinner as="output" animation="border">
					<span className="visually-hidden">Cargando excursiones...</span>
				</Spinner>
				<p className="mt-2">Cargando excursiones...</p>
			</Col>
		);
	}

	if (error) {
		// Show error if there is one (and spinner is not showing)
		return (
			// Similar al spinner, un div para ser centrado.
			<div className={`${styles.centeredStatus} py-5 flex-grow-1 w-100`}>
				<Alert variant="danger">
					{error.message ||
						"Lo sentimos, ha ocurrido un error al cargar las excursiones."}
				</Alert>
			</div>
		);
	}

	// Si llegamos aquí, no se está mostrando el spinner activo ni hay un error.
	// Ahora determinamos si mostrar la lista, el mensaje de "no encontrado" o nada (durante la ventana de retraso).

	const excursionComponents = excursionData.map((excursion) => (
		/* El spread operator pasa las propiedades del objeto (name, area, difficulty...) como props del componente Excursion */
		<Excursion key={excursion.id} {...excursion} />
	));
	const found = excursionComponents.length > 0;

	if (found) {
		// Hay excursiones para mostrar (pueden ser nuevas o antiguas si estamos en la ventana de retraso)
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
	} else {
		// No hay excursiones en excursionData (found is false).
		// Si la carga ha terminado (!isLoading), mostramos el mensaje "no encontrado".
		if (!isLoading) {
			// Similar al spinner, un div para ser centrado.
			return (
				<div
					className={`${styles.messageNotFound} ${styles.centeredStatus} text-center py-5 flex-grow-1 w-100`}
				>
					Lo sentimos, pero no tenemos ninguna excursión con esas
					características.
				</div>
			);
		}
		// En la ventana de retraso del spinner, si no hay datos (y no hay error),
		// no mostrar "no encontrado" todavía para evitar el mensaje prematuro.
		return null;
	}
}

export default Excursions;

import { Row, Col, Card, Placeholder } from "react-bootstrap";
import ExcursionCardSkeleton from "./ExcursionCardSkeleton";
import styles from "../css/UserPageSkeleton.module.css";

/**
 * Componente que muestra un esqueleto de carga para la página de perfil de usuario.
 * Simula la estructura de la `UserPage` mientras los componentes reales se cargan.
 */
function UserPageSkeleton() {
	/**
	 * Renderiza un placeholder para la tarjeta de información del usuario.
	 * @returns {React.ReactElement}
	 */
	const renderUserInfoPlaceholder = () => (
		<Card className="h-100">
			<Card.Header as="div">
				<Placeholder animation="glow">
					<Placeholder xs={6} />
				</Placeholder>
			</Card.Header>
			<Card.Body className="d-flex flex-column">
				<Placeholder as="div" animation="glow">
					{/* Simula 4 filas de etiqueta + input */}
					{[...Array(4)].map((_, i) => (
						<Row
                        // eslint-disable-next-line react/no-array-index-key
							key={`user-info-placeholder-row-${i}`}
							className="mb-4 gx-2 align-items-center"
						>
							<Col sm={3} className="text-sm-end">
								<Placeholder xs={10} />
							</Col>
							<Col sm={9}>
								<Placeholder xs={12} className={styles.inputPlaceholder} />
							</Col>
						</Row>
					))}
				</Placeholder>
				<div className="mt-auto border-top pt-3">
					<Row className="justify-content-sm-end">
						<Col xs={12} sm="auto">
							<Placeholder.Button
								variant="secondary"
								className={styles.buttonPlaceholder}
							/>
						</Col>
					</Row>
				</div>
			</Card.Body>
		</Card>
	);

	/**
	 * Renderiza un placeholder para la lista de excursiones del usuario.
	 * @returns {React.ReactElement}
	 */
	const renderExcursionsPlaceholder = () => (
		<Card className="h-100 d-flex flex-column">
			<Card.Header as="div">
				<Placeholder animation="glow">
					<Placeholder xs={8} />
				</Placeholder>
			</Card.Header>
			<Card.Body className="d-flex flex-column flex-grow-1">
				<Row xs={1} md={2} className="g-3">
					{/* Muestra 2 tarjetas de esqueleto para simular la lista */}
					{[...Array(2)].map((_, i) => (
                        // eslint-disable-next-line react/no-array-index-key
						<Col key={`user-excursion-skeleton-${i}`}>
							<ExcursionCardSkeleton isLoggedIn={true} />
						</Col>
					))}
				</Row>
			</Card.Body>
		</Card>
	);

	return (
		<Row className="justify-content-center pt-2" aria-hidden="true">
			<Col xs={11} md={11} lg={11} xl={8}>
				<Placeholder as="h2" animation="glow" className="mb-4 mt-2">
					<Placeholder xs={3} />
				</Placeholder>
				<Row className="mb-3">
					<Col lg={6} xl={4} className="mb-4 mb-lg-0">
						{renderUserInfoPlaceholder()}
					</Col>
					<Col lg={6} xl={8}>
						{renderExcursionsPlaceholder()}
					</Col>
				</Row>
			</Col>
		</Row>
	);
}

export default UserPageSkeleton;

import React from "react";
import { Row, Col, Placeholder } from "react-bootstrap";
import FormPageLayout from "./FormPageLayout";
import styles from "../css/LoginPageSkeleton.module.css";

/**
 * Componente que muestra un esqueleto de carga para la página de inicio de sesión.
 * Simula la estructura del formulario de login mientras los componentes reales se cargan.
 */
function LoginPageSkeleton() {
	/**
	 * Renderiza un placeholder para un campo de formulario (etiqueta + input).
	 * @returns {React.ReactElement}
	 */
	const renderInputPlaceholder = () => (
		<div className="mb-3">
			<Placeholder animation="glow">
				{/* Placeholder para la etiqueta (label) */}
				<Placeholder xs={4} className="mb-1" />
				{/* Placeholder para el campo de entrada (input) */}
				<Placeholder xs={12} className={styles.inputPlaceholder} />
			</Placeholder>
		</div>
	);

	return (
		<FormPageLayout title="Inicia sesión" colWidth="3">
			<div aria-hidden="true">
				{renderInputPlaceholder()}
				{renderInputPlaceholder()}

				{/* Placeholder para el botón de envío */}
				<div className="mt-5 pt-3 border-top">
					<Row className="justify-content-sm-end">
						<Col xs={12} sm="auto">
							<Placeholder.Button
								variant="secondary"
								className={`${styles.buttonPlaceholder} w-100`}
							/>
						</Col>
					</Row>
				</div>
			</div>
		</FormPageLayout>
	);
}

export default LoginPageSkeleton;

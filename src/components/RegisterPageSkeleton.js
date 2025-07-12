import { Row, Col, Placeholder } from "react-bootstrap";
import FormPageLayout from "./FormPageLayout";
import styles from "../css/RegisterPageSkeleton.module.css";

/**
 * Componente que muestra un esqueleto de carga para la página de registro.
 * Simula la estructura del formulario de registro mientras los componentes reales se cargan.
 */
function RegisterPageSkeleton() {
	/**
	 * Renderiza un placeholder para un campo de formulario (etiqueta + input).
	 * @param {string} key - Clave única para el elemento.
	 * @returns {React.ReactElement}
	 */
	const renderInputPlaceholder = (key) => (
		<Col xs={12} md={6} key={key} className="mb-3">
			<Placeholder animation="glow">
				{/* Placeholder para la etiqueta (label) */}
				<Placeholder xs={4} className="mb-1" />
				{/* Placeholder para el campo de entrada (input) */}
				<Placeholder xs={12} className={styles.inputPlaceholder} />
			</Placeholder>
		</Col>
	);

	return (
		<FormPageLayout title="Bienvenido/a">
			<div aria-hidden="true">
				<Row>
					{/* Genera 6 placeholders para los campos del formulario */}
					{[...Array(6)].map((_, i) =>
						renderInputPlaceholder(`register-input-placeholder-${i}`)
					)}
				</Row>

				{/* Placeholder para el mensaje informativo sobre la contraseña */}
				<Placeholder as="div" animation="glow" className="mb-3">
					<Placeholder xs={11} size="sm" />
				</Placeholder>

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

export default RegisterPageSkeleton;

import { Button, Spinner, Row, Col } from "react-bootstrap";

/**
 * @typedef {object} FormSubmitButtonProps
 * @property {boolean} isLoading - Indica si el formulario se está enviando.
 * @property {boolean} isButtonDisabled - Indica si el botón debe estar deshabilitado.
 * @property {React.ReactNode} [children] - El texto a mostrar en el botón.
 */

/**
 * Componente reutilizable para el botón de envío de formularios, con manejo de estado de carga.
 * @param {FormSubmitButtonProps} props
 */
const FormSubmitButton = ({
	isLoading,
	isButtonDisabled,
	children = "Enviar",
}) => (
	<div className="mt-5 pt-3">
		<Row className="justify-content-sm-end">
			<Col xs={12} sm="auto">
				<Button
					variant={isButtonDisabled || isLoading ? "secondary" : "success"}
					type="submit"
					aria-disabled={isButtonDisabled || isLoading}
					className="w-100"
				>
					{isLoading ? (
						<output>
							<Spinner
								as="span"
								animation="border"
								size="sm"
								aria-hidden="true"
							/>
							<span className="visually-hidden">Cargando...</span>
						</output>
					) : (
						children
					)}
				</Button>
			</Col>
		</Row>
	</div>
);

export default FormSubmitButton;

import { Row, Col } from "react-bootstrap";
import { useSelector } from "react-redux";
import FormPageLayout from "../FormPageLayout/FormPageLayout";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import registerFormStyles from "../RegisterForm/RegisterForm.module.css";

/** @typedef {import("../../types").RootState} RootState */

/**
 * Esqueleto de carga cuya función es mostrar una versión simplificada del formulario de registro mientras el componente real
 * (RegisterForm.js) se está cargando.
 */
function RegisterPageSkeleton() {
	const mode = useSelector(
		/** @param {RootState} state */
		(state) => state.themeReducer.mode
	);

	// Define los colores del esqueleto según el tema para una experiencia visual consistente.
	const baseColor = mode === "dark" ? "#202020" : "#e0e0e0";
	const highlightColor = mode === "dark" ? "#444" : "#f5f5f5";

	/**
	 * Renderiza un marcador de posición para los campos de entrada del formulario.
	 * @param {string} labelWidth - Ancho del marcador de posición del texto de la etiqueta.
	 * @returns {React.ReactElement} Marcador de posición para el campo de entrada.
	 */
	const renderInputPlaceholder = (labelWidth) => (
		<div className="mb-3">
			<Skeleton width={labelWidth} containerClassName="d-block mb-2" />
			<Skeleton height={38} />
		</div>
	);

	return (
		// Utiliza FormPageLayout para mantener la estructura del formulario de registro.
		<FormPageLayout
			title="Bienvenido/a"
			subtitle="Crea tu cuenta para empezar a explorar."
			switcherPrompt="¿Ya tienes una cuenta?"
			switcherLinkText="Inicia sesión"
			switcherLinkTo="/loginPage"
		>
			<SkeletonTheme baseColor={baseColor} highlightColor={highlightColor}>
				<div
					aria-hidden="true"
					className={`${registerFormStyles.formLabel} fw-bold`}
				>
					<Row>
						<Col xs={12} md={6}>
							{renderInputPlaceholder("30%")} {/* Nombre */}
						</Col>
						<Col xs={12} md={6}>
							{renderInputPlaceholder("40%")} {/* Apellidos */}
						</Col>
					</Row>
					<Row>
						<Col xs={12} md={6}>
							{renderInputPlaceholder("35%")} {/* Teléfono */}
						</Col>
						<Col xs={12} md={6}>
							{renderInputPlaceholder("50%")} {/* Correo electrónico */}
						</Col>
					</Row>
					<Row>
						<Col xs={12} md={6}>
							{renderInputPlaceholder("40%")} {/* Contraseña */}
						</Col>
						<Col xs={12} md={6}>
							{renderInputPlaceholder("60%")} {/* Repite la contraseña */}
						</Col>
					</Row>

					{/* Esqueleto para el mensaje informativo de la contraseña. */}
					<div className={`${registerFormStyles.infoMessage} mb-3`}>
						<p className="mb-1 fw-normal">
							<Skeleton width="70%" />
						</p>
						<ul className="mb-0 ps-3 fw-normal">
							<li>
								<Skeleton width="40%" />
							</li>
							<li>
								<Skeleton width="35%" />
							</li>
							<li>
								<Skeleton width="35%" />
							</li>
							<li>
								<Skeleton width="60%" />
							</li>
						</ul>
					</div>

					{/* Esqueleto para el botón de envío */}
					<div className="mt-5 pt-3">
						<Row className="justify-content-sm-end">
							<Col xs={12} sm="auto">
								<Skeleton
									height={38}
									className="w-100"
									style={{ minWidth: 70 }}
								/>
							</Col>
						</Row>
					</div>
				</div>
			</SkeletonTheme>
		</FormPageLayout>
	);
}

export default RegisterPageSkeleton;

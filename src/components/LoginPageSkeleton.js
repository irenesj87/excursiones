import { Row, Col } from "react-bootstrap";
import { useSelector } from "react-redux";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import FormPageLayout from "./FormPageLayout";
import loginFormStyles from "../css/LoginForm.module.css";

/** @typedef {import("../types").RootState} RootState */

/**
 * Componente que muestra un esqueleto de carga para la página de inicio de sesión.
 * Simula la estructura del formulario de login mientras los componentes reales se cargan.
 */
function LoginPageSkeleton() {
	const mode = useSelector(
		/** @param {RootState} state */
		(state) => state.themeReducer.mode
	);
	// Define los colores del esqueleto según el tema para una experiencia visual consistente.
	const baseColor = mode === "dark" ? "#202020" : "#e0e0e0";
	const highlightColor = mode === "dark" ? "#444" : "#f5f5f5";

	/** Renderiza un placeholder para un campo de formulario (label + input). */
	const renderInputPlaceholder = () => (
		<div className="mb-3">
			<Skeleton width="40%" containerClassName="d-block mb-2" />
			<Skeleton height={38} />
		</div>
	);

	return (
		<FormPageLayout
			title="Inicia sesión"
			colWidth="3"
			subtitle="Nos alegra verte de nuevo."
			switcherPrompt="¿No tienes una cuenta?"
			switcherLinkText="Regístrate"
			switcherLinkTo="/registerPage"
		>
			<SkeletonTheme baseColor={baseColor} highlightColor={highlightColor}>
				<div
					aria-hidden="true"
					className={`${loginFormStyles.formLabel} fw-bold`}
				>
					{renderInputPlaceholder()}
					{renderInputPlaceholder()}
					{/* Esqueleto para el botón de envío */}
					<div className="mt-5 pt-3">
						<Row className="justify-content-sm-end">
							<Col xs={12} sm="auto">
								{/*
							  Para el esqueleto del botón, necesitamos un comportamiento responsivo:
							  - En breakpoints pequeños (xs), debe ocupar el 100% del ancho (como el botón real).
							  - En breakpoints más grandes (sm+), debe tener un ancho fijo para simular el botón.
							  - La clase `w-100` asegura el ancho completo, y el `min-width` en el estilo evita que la columna 
							  `sm="auto"` colapse en breakpoints grandes.
							*/}
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

export default LoginPageSkeleton;

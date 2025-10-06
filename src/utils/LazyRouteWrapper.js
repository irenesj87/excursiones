import React, { Suspense } from "react";
import { Col } from "react-bootstrap";

/**
 * Componente wrapper para simplificar la renderización de rutas con carga perezosa.
 * @param {{
 *   PageComponent: React.ComponentType<object>;
 *   SkeletonComponent: React.ComponentType<object>;
 *   [key: string]: any;
 * }} props - Las propiedades del componente, que incluyen el componente de página, un esqueleto y cualquier otra prop a pasar.
 * `PageComponent`: El componente de la página que se cargará de forma perezosa.
 * `SkeletonComponent`: El componente de esqueleto que se mostrará mientras `PageComponent` se está cargando.
 * `...rest`: Cualquier otra prop que se deba pasar a `PageComponent`.
 * @returns {React.ReactElement} Componente para simplificar la carga perezosa.
 */
const LazyRouteWrapper = ({ PageComponent, SkeletonComponent, ...rest }) => {
	const fallback = <SkeletonComponent />;

	return (
		<Col xs={12}>
			<Suspense fallback={fallback}>
				<PageComponent {...rest} />
			</Suspense>
		</Col>
	);
};

export default LazyRouteWrapper;

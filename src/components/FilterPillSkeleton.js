import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

/**
 * Componente que muestra un esqueleto de carga con la forma de una píldora de filtro.
 * Se utiliza para indicar visualmente que las opciones de filtro se están cargando,
 * utilizando react-loading-skeleton.
 * @returns {React.ReactElement}
 */
function FilterPillSkeleton() {
	// La configuración del tema (colores) se gestiona en el componente padre (FiltersList)
	// para evitar múltiples instancias de SkeletonTheme.
	return <Skeleton height={38} borderRadius={20} />;
}

export default FilterPillSkeleton;
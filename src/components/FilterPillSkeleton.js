import React from "react";
import styles from "../css/FilterPillSkeleton.module.css";

/**
 * Componente que muestra un esqueleto de carga con la forma de una píldora de filtro.
 * Se utiliza para indicar visualmente que las opciones de filtro se están cargando.
 * @returns {React.ReactElement}
 */
function FilterPillSkeleton() {
	return <div className={styles.skeletonPill}></div>;
}

export default FilterPillSkeleton;
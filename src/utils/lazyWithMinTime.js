import { lazy } from "react";

/**
 * Carga perezosa para componentes de ruta. Su propósito es asegurar que cuando un componente se carga de forma perezosa,
 * el indicador de carga (como por ejemplo, un "esqueleto" o skeleton) se muestre al usuario durante un tiempo mínimo, que
 * por defecto es de 500 milisegundos. Resuelve un problema común de experiencia de usuario llamado parpadeo (flickering).
 * @param {() => Promise<any>} factory - La función de importación dinámica.
 * @param {number} [minTime=500] - El tiempo mínimo de carga en milisegundos.
 * @returns {React.LazyExoticComponent<any>}
 */
// `factory`: Una función que retorna una promesa que resuelve el módulo del componente.
// `minTime`: El tiempo mínimo en milisegundos que el componente de carga (esqueleto) debe ser visible.
// Retorna un componente React.lazy que asegura que el componente se muestre después de `minTime`,
// evitando parpadeos rápidos si la carga es muy rápida.
export const lazyWithMinTime = (factory, minTime = 500) => {
	return lazy(() =>
		Promise.all([
			factory(),
			new Promise((resolve) => setTimeout(resolve, minTime)),
		]).then(([moduleExports]) => moduleExports)
	);
};

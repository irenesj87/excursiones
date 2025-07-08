import { Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import FiltersList from "./FiltersList";
import { clearAllFilters } from "../slicers/filterSlice";
import { FaMountainSun } from "react-icons/fa6";
import { GoGraph } from "react-icons/go";
import { MdAccessTimeFilled } from "react-icons/md";
import { FiX } from "react-icons/fi";
import "bootstrap/dist/css/bootstrap.css";
import styles from "../css/Filters.module.css";

/**
 * Componente para renderizar los filtros de búsqueda (zona, dificultad, tiempo estimado)
 * @returns {React.ReactElement} El componente para los filtros
 */
function Filters() {
	const dispatch = useDispatch();

	const handleClearFilters = () => {
		dispatch(clearAllFilters());
	};

	return (
		<div className={styles.filtersContainer}>
			<div className={styles.stickyWrapper}>
				<header className={styles.header}>
					<h2 className={styles.title}>Filtros</h2>
					<Button
						variant="link"
						onClick={handleClearFilters}
						className={styles.clearButton}
						aria-label="Limpiar todos los filtros"
					>
						<FiX aria-hidden="true" />
						<span>Limpiar</span>
					</Button>
				</header>

				<section className={styles.filterSection}>
					<h3 className={styles.filterTitle}>
						<FaMountainSun />
						<span>Zona</span>
					</h3>
					<FiltersList filterName="area" />
				</section>

				<section className={styles.filterSection}>
					<h3 className={styles.filterTitle}>
						<GoGraph />
						<span>Dificultad</span>
					</h3>
					<FiltersList filterName="difficulty" />
				</section>

				<section className={styles.filterSection}>
					<h3 className={styles.filterTitle}>
						<MdAccessTimeFilled />
						<span>Tiempo estimado</span>
					</h3>
					<FiltersList filterName="time" />
				</section>
			</div>
		</div>
	);
}

export default Filters;

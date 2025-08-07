import { memo, useMemo, useCallback, useState, useEffect, useRef } from "react";
import { Row, Col } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { SkeletonTheme } from "react-loading-skeleton";
import { FiSearch, FiAlertCircle } from "react-icons/fi";
import { updateUser } from "../slicers/loginSlice";
import ExcursionCard from "./ExcursionCard";
import ExcursionCardSkeleton from "./ExcursionCardSkeleton";
import { joinExcursion as joinExcursionService } from "../services/excursionService";
import "bootstrap/dist/css/bootstrap.css";
import styles from "../css/Excursions.module.css";

/** @typedef {import('types.js').RootState} RootState */
/** @typedef {import('types.js').Excursion} Excursion */

/**
 * @typedef {object} ExcursionsLoadingProps
 * @property {boolean} isLoggedIn - Indica si el usuario ha iniciado sesión.
 * @property {'light' | 'dark'} props.mode - El modo de tema actual.
 */

/**
 * Componente para mostrar el esqueleto mientras las excursiones se cargan.
 * @param {ExcursionsLoadingProps} props
 */
const ExcursionsLoadingComponent = ({ isLoggedIn, mode }) => {
	const baseColor = mode === "dark" ? "#2d3748" : "#e0e0e0";
	const highlightColor = mode === "dark" ? "#444" : "#f5f5f5";

	return (
		<SkeletonTheme baseColor={baseColor} highlightColor={highlightColor}>
			<div className={styles.excursionsContainer}>
				<h2 className={styles.title}>Próximas excursiones</h2>
				<div role="status" aria-live="polite" className="visually-hidden">
					Cargando excursiones...
				</div>
				<Row as="ul" className="gx-4 gy-5 list-unstyled">
					{Array.from({ length: 8 }).map((_, index) => (
						<Col
							as="li"
							xs={12}
							md={6}
							lg={4}
							xl={3}
							// eslint-disable-next-line react/no-array-index-key
							key={`skeleton-card-${index}`}
							className="d-flex"
						>
							<ExcursionCardSkeleton isLoggedIn={isLoggedIn} />
						</Col>
					))}
				</Row>
			</div>
		</SkeletonTheme>
	);
};
const ExcursionsLoading = memo(ExcursionsLoadingComponent);

/**
 * Componente para mostrar un mensaje de error si ha habido algún problema en la carga de las excursiones.
 * @param {ExcursionsErrorProps} props
 * @typedef {object} ExcursionsErrorProps
 * @property {Error | null} error - El objeto de error.
 */
const ExcursionsErrorComponent = ({ error }) => (
	<div className={`${styles.excursionsContainer} ${styles.centeredStatus}`}>
		<div role="alert" className={styles.messageNotFound}>
			<FiAlertCircle className={styles.messageIcon} aria-hidden="true" />
			<p className={styles.primaryMessage}>
				{error.message ||
					"Lo sentimos, ha ocurrido un error al cargar las excursiones."}
			</p>
		</div>
	</div>
);
const ExcursionsError = memo(ExcursionsErrorComponent);

/** Componente para cuando no se encuentran resultados. */
const NoExcursionsFoundComponent = () => (
	<div className={`${styles.excursionsContainer} ${styles.centeredStatus}`}>
		<div role="status" className={styles.messageNotFound}>
			<FiSearch className={styles.messageIcon} aria-hidden="true" />
			<p className={styles.primaryMessage}>
				No se encontraron excursiones con esas características.
			</p>
			<p className={styles.secondaryMessage}>
				Prueba a cambiar los filtros para mejorar tu búsqueda.
			</p>
		</div>
	</div>
);
const NoExcursionsFound = memo(NoExcursionsFoundComponent);

/**
 * Componente que sirve para mostrar la lista de excursiones disponibles.
 * @param {object} props - Las propiedades del componente.
 * @param {Excursion[]} [props.excursionData=[]] - Array de excursiones a mostrar.
 * @param {boolean} props.isLoading - Indica si los datos de las excursiones se están cargando.
 * @param {Error | null} props.error - Objeto de error si ha ocurrido un problema al cargar las excursiones.
 */
function ExcursionsComponent({ excursionData = [], isLoading, error }) {
	// Se obtiene el estado del loginReducer y el objeto usuario
	const {
		login: isLoggedIn,
		user,
		token,
	} = useSelector(
		/** @param {RootState} state */
		(state) => state.loginReducer
	);
	// Se obtiene el estado del themeReducer para saber el modo (claro u oscuro)
	const mode = useSelector(
		/** @param {RootState} state */
		(state) => state.themeReducer.mode
	);
	const loginDispatch = useDispatch();
	// Estado para las excursiones que se muestran. Esto nos permite mantener los resultados antiguos visibles mientras se cargan
	// los nuevos datos para evitar que parpadeen o se queden en blanco.
	const [displayedExcursions, setDisplayedExcursions] = useState(excursionData);
	// Estado para anunciar cambios a los lectores de pantalla.
	const [announcement, setAnnouncement] = useState("");
	const isInitialLoad = useRef(true);

	// Efecto para gestionar qué excursiones se muestran. Se ejecuta cada vez que isLoading o excursionData cambian
	useEffect(() => {
		// Si la carga ha terminado, actualizamos las excursiones visibles con los nuevos datos.
		if (!isLoading) {
			setDisplayedExcursions(excursionData);

			// Solo anunciar en cargas posteriores a la inicial (ej. al aplicar filtros)
			if (!isInitialLoad.current) {
				if (excursionData.length > 0) {
					const plural =
						excursionData.length === 1 ? "excursión" : "excursiones";
					const message = `Búsqueda completada. Se han encontrado ${excursionData.length} ${plural}.`;
					setAnnouncement(message);
				}
				// Si no hay resultados, el componente de "no encontrado" ya se anuncia.
			}

			if (isInitialLoad.current) {
				isInitialLoad.current = false;
			}
		}
	}, [isLoading, excursionData]);

	/**
	 * Función asíncrona para unirse a una excursión.
	 * @param {string | number} excursionId - El ID de la excursión a la que el usuario desea unirse.
	 */
	const joinExcursion = useCallback(
		async (excursionId) => {
			try {
				const updatedUser = await joinExcursionService(
					user?.mail,
					excursionId,
					token
				);
				loginDispatch(updateUser({ user: updatedUser }));
			} catch (error) {
				console.error("Error al unirse a la excursión:", error);
				// Relanzamos el error para que el componente que llama (ExcursionCard) pueda manejarlo.
				throw error;
			}
		},
		// `token` se añade como dependencia para asegurar que la función tiene la versión más reciente.
		[user?.mail, token, loginDispatch]
	);

	/**
	 * Componentes de las tarjetas de excursión, memoizados para optimizar el rendimiento, ya que el mapear un array a componentes
	 * puede ser costoso si hay muchas excursiones.
	 * Cada tarjeta recibe las propiedades necesarias y se encarga de mostrar la información de la excursión.
	 * Además, se comprueba si el usuario ha iniciado sesión y si ya está apuntado a la excursión para mostrar el botón de unirse o
	 * no.
	 */
	const excursionComponents = useMemo(
		() =>
			displayedExcursions.map((excursion) => {
				const isJoined = isLoggedIn && user?.excursions?.includes(excursion.id);
				return (
					<Col
						as="li" // Renderizar como un elemento de lista para mejorar la semántica
						xs={12}
						md={6}
						lg={4}
						xl={3}
						key={excursion.id}
						className="d-flex" // d-flex para que las cards se estiren y ocupen toda la altura
					>
						<ExcursionCard
							{...excursion}
							isLoggedIn={isLoggedIn}
							isJoined={isJoined}
							onJoin={joinExcursion}
						/>
					</Col>
				);
			}),
		[displayedExcursions, isLoggedIn, user?.excursions, joinExcursion]
	);

	// --- Lógica de Renderizado Condicional ---

	if (error) {
		return <ExcursionsError error={error} />;
	}

	if (isLoading && displayedExcursions.length === 0) {
		return <ExcursionsLoading isLoggedIn={isLoggedIn} mode={mode} />;
	}

	if (!isLoading && excursionData.length === 0) {
		return <NoExcursionsFound />;
	}

	// Por defecto, mostrar las excursiones.
	return (
		<div className={styles.excursionsContainer}>
			{/* Este elemento anuncia los resultados de los filtros a los lectores de pantalla sin ser visible. */}
			<div role="status" aria-live="polite" className="visually-hidden">
				{announcement}
			</div>
			<h2 className={styles.title}>Próximas excursiones</h2>
			<Row as="ul" className="gx-4 gy-5 list-unstyled">
				{excursionComponents}
			</Row>
		</div>
	);
}

const Excursions = memo(ExcursionsComponent);
export default Excursions;

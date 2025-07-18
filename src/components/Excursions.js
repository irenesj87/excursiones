import { memo, useMemo, useCallback, useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { SkeletonTheme } from "react-loading-skeleton";
import { BsBinoculars } from "react-icons/bs";
import { updateUser } from "../slicers/loginSlice";
import ExcursionCard from "components/ExcursionCard";
import ExcursionCardSkeleton from "./ExcursionCardSkeleton";
import "bootstrap/dist/css/bootstrap.css";
import styles from "../css/Excursions.module.css";

/** @typedef {import('types.js').RootState} RootState */
/** @typedef {import('types.js').Excursion} Excursion */

/**
 * Componente que sirve para mostrar la lista de excursiones disponibles
 * @param {object} props - Las propiedades del componente.
 * @param {Excursion[]} [props.excursionData=[]] - Array de objetos de excursiones a mostrar.
 * @param {boolean} props.isLoading - Indica si los datos de las excursiones se están cargando.
 * @param {Error | null} props.error - Objeto de error si ha ocurrido un problema al cargar las excursiones.
 */
function ExcursionsComponent({ excursionData = [], isLoading, error }) {
	// Se obtiene el estado del loginReducer y el objeto usuario
	const { login: isLoggedIn, user } = useSelector(
		/** @param {RootState} state */
		(state) => state.loginReducer
	);
	// Se obtiene el estado del themeReducer para saber el modo (claro u oscuro)
	const mode = useSelector(
		/** @param {RootState} state */
		(state) => state.themeReducer.mode
	);
	const loginDispatch = useDispatch();
	// Estado para las excursiones que se muestran en. Esto nos permite mantener los resultados antiguos visibles mientras se cargan los 
	// nuevos datos para evitar que parpadeen o se queden en blanco.
	const [displayedExcursions, setDisplayedExcursions] = useState(excursionData);

	// Efecto para gestionar qué excursiones se muestran. Se ejecuta cada vez que isLoading o excursionData cambian
	useEffect(() => {
		// Si la carga ha terminado, actualizamos las excursiones visibles con los nuevos datos.
		if (!isLoading) {
			setDisplayedExcursions(excursionData);
		}
	}, [isLoading, excursionData]);

	/**
	 * Función que sirve para apuntarse a una excursión. Envuelve la función un callback. Esto la memoriza y sólo se volverá a crear si 
	 * user?.mail o loginDispatch cambian.
	 */
	const joinExcursion = useCallback(
		async (excursionId) => {
			const auxUserMail = user?.mail;
			if (!auxUserMail) return; // Si no hay correo de usuario, la función termina
			// Llama a la API con un usuario específico y una excursión específica
			const url = `http://localhost:3001/users/${auxUserMail}/excursions/${excursionId}`;
			/** @type {RequestInit} */
			const options = {
				method: "PUT",
				mode: "cors",
				headers: {
					"Content-Type": "application/json",
					Authorization: "Bearer " + window.sessionStorage["token"],
				},
				body: JSON.stringify({ id: excursionId }),
			};

			try {
				const response = await fetch(url, options);
				if (!response.ok) {
					throw new Error("No estás autorizado/a para hacer esta operación");
				}
				const data = await response.json();
				loginDispatch(updateUser({ user: data }));
			} catch (error) {
				console.error("Error al unirse a la excursión:", error);
			}
		},
		[user?.mail, loginDispatch]
	);

	// Renderiza las ExcursionCard pasándole todas las propiedades de la excursión, el estado de login y si el usuario actual está apuntado
	// a ella o no
	const excursionComponents = useMemo(
		() =>
			displayedExcursions.map((excursion) => {
				const isJoined = isLoggedIn && user?.excursions?.includes(excursion.id);
				return (
					<Col
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

	// Si hay un error, mostrar un mensaje
	if (error) {
		return (
			<div className={`${styles.excursionsContainer} ${styles.centeredStatus}`}>
				<output className={styles.messageNotFound}>
					{error.message ||
						"Lo sentimos, ha ocurrido un error al cargar las excursiones."}
				</output>
			</div>
		);
	}

	// --- Lógica de Renderizado Condicional ---

	// 1. Si estamos cargando y no hay excursiones previas que mostrar (carga inicial),
	// mostramos los esqueletos para evitar el salto de layout.
	if (isLoading && displayedExcursions.length === 0) {
		const baseColor = mode === "dark" ? "#2d3748" : "#e0e0e0";
		const highlightColor = mode === "dark" ? "#444" : "#f5f5f5";

		return (
			<SkeletonTheme baseColor={baseColor} highlightColor={highlightColor}>
				<div className={styles.excursionsContainer}>
					<h2 className={styles.title}>Próximas excursiones</h2>
					<Row className="gx-4 gy-5" aria-label="Cargando excursiones...">
						{/* Mostramos 8 placeholders para dar una idea de la estructura */}
						{Array.from({ length: 8 }).map((_, index) => (
							<Col
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
	}

	// 2. Si la carga ha finalizado y el resultado de la búsqueda (`excursionData`) está vacío,
	// mostramos el mensaje "no encontrado". Se comprueba `excursionData` en lugar de `displayedExcursions`
	// para evitar el parpadeo del mensaje durante la transición de carga a resultados.
	if (!isLoading && excursionData.length === 0) {
		return (
			<div className={`${styles.excursionsContainer} ${styles.centeredStatus}`}>
				<output className={styles.messageNotFound}>
					<BsBinoculars className={styles.messageIcon} aria-hidden="true" />
					<p className={styles.primaryMessage}>
						No hemos encontrado ninguna excursión con esas características.
					</p>
					<p className={styles.secondaryMessage}>
						Prueba a cambiar los filtros para ampliar la búsqueda.
					</p>
				</output>
			</div>
		);
	}

	// 3. Por defecto, mostrar las excursiones. Durante una búsqueda, se mostrarán las
	// antiguas mientras se cargan las nuevas, manteniendo el layout estable.
	return (
		<div className={styles.excursionsContainer}>
			<h2 className={styles.title}>Próximas excursiones</h2>
			{/* La fila simplemente distribuye las tarjetas; el contenedor padre se encarga de la altura. */}
			<Row className="gx-4 gy-5">{excursionComponents}</Row>
		</div>
	);
}

const Excursions = memo(ExcursionsComponent);
export default Excursions;

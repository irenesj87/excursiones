import { memo, useMemo, useCallback, useState, useEffect, useRef } from "react";
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
 * Componente que sirve para mostrar la lista de excursiones disponibles.
 * @param {object} props - Las propiedades del componente.
 * @param {Excursion[]} [props.excursionData=[]] - Array de excursiones a mostrar.
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

	/**
	 * Componentes de las tarjetas de excursión, memoizados para optimizar el rendimiento.
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

	// Si hay un error, mostrar un mensaje
	if (error) {
		return (
			<div className={`${styles.excursionsContainer} ${styles.centeredStatus}`}>
				{/* Usamos role="alert" para que el error sea anunciado inmediatamente por los lectores de pantalla */}
				<div role="alert" className={styles.messageNotFound}>
					<p className={styles.primaryMessage}>
						{error.message ||
							"Lo sentimos, ha ocurrido un error al cargar las excursiones."}
					</p>
				</div>
			</div>
		);
	}

	// --- Lógica de Renderizado Condicional ---

	// 1. Si estamos cargando y no hay excursiones previas que mostrar (carga inicial), mostramos los esqueletos para evitar salto de layout.
	if (isLoading && displayedExcursions.length === 0) {
		const baseColor = mode === "dark" ? "#2d3748" : "#e0e0e0";
		const highlightColor = mode === "dark" ? "#444" : "#f5f5f5";

		return (
			<SkeletonTheme baseColor={baseColor} highlightColor={highlightColor}>
				<div className={styles.excursionsContainer}>
					<h2 className={styles.title}>Próximas excursiones</h2>
					{/* Anunciamos el estado de carga a los lectores de pantalla de forma no intrusiva */}
					<div role="status" aria-live="polite" className="visually-hidden">
						Cargando excursiones...
					</div>
					<Row className="gx-4 gy-5">
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
				{/* Usamos role="status" para que el mensaje se anuncie de forma no intrusiva */}
				<div role="status" className={styles.messageNotFound}>
					<BsBinoculars className={styles.messageIcon} aria-hidden="true" />
					<p className={styles.primaryMessage}>
						No hemos encontrado ninguna excursión con esas características.
					</p>
					<p className={styles.secondaryMessage}>
						Prueba a cambiar los filtros para ampliar la búsqueda.
					</p>
				</div>
			</div>
		);
	}

	// 3. Por defecto, mostrar las excursiones. Durante una búsqueda, se mostrarán las
	// antiguas mientras se cargan las nuevas, manteniendo el layout estable.
	return (
		<div className={styles.excursionsContainer}>
			{/* Este elemento anuncia los resultados de los filtros a los lectores de pantalla sin ser visible. */}
			<div role="status" aria-live="polite" className="visually-hidden">
				{announcement}
			</div>
			<h2 className={styles.title}>Próximas excursiones</h2>
			{/* Usamos una lista (ul) para agrupar las tarjetas de excursiones, lo que es semánticamente correcto.
			    La prop 'as' en Row y Col (dentro de excursionComponents) se encarga de renderizar los elementos HTML correctos.
			    'list-unstyled' de Bootstrap elimina los estilos por defecto de la lista.
			 */}
			<Row as="ul" className="gx-4 gy-5 list-unstyled">
				{excursionComponents}
			</Row>
		</div>
	);
}

const Excursions = memo(ExcursionsComponent);
export default Excursions;

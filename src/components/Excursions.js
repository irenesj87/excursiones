import { memo, useMemo, useCallback, useRef, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { BsBinoculars } from "react-icons/bs";
import { updateUser } from "../slicers/loginSlice";
import ExcursionCard from "components/ExcursionCard";
import ExcursionCardSkeleton from "./ExcursionCardSkeleton";
import DelayedFallback from "./DelayedFallback";
import "bootstrap/dist/css/bootstrap.css";
import styles from "../css/Excursions.module.css";

/** @typedef {import('types.js').RootState} RootState */
/** @typedef {import('types.js').Excursion} Excursion */

/**
 * Componente que sirve para mostrar la lista de excursiones.
 * @param {object} props - Las propiedades del componente.
 * @param {Excursion[]} [props.excursionData=[]] - Array de objetos de excursiones a mostrar.
 * @param {boolean} props.isLoading - Indica si los datos de las excursiones se están cargando.
 * @param {Error | null} props.error - Objeto de error si ha ocurrido un problema al cargar las excursiones.
 */
function ExcursionsComponent({ excursionData = [], isLoading, error }) {
	const { login: isLoggedIn, user } = useSelector(
		/** @param {RootState} state */
		(state) => state.loginReducer
	);
	const loginDispatch = useDispatch();

	// Usamos una ref para saber si es la primera carga.
	// `useRef` persiste su valor entre renderizados sin causar un nuevo renderizado.
	const hasLoadedOnce = useRef(false);

	// Este efecto se ejecuta cada vez que `isLoading` cambia.
	// Marcamos `hasLoadedOnce` como `true` una vez que la primera carga ha terminado (`isLoading` es `false`).
	useEffect(() => {
		if (!isLoading) {
			hasLoadedOnce.current = true;
		}
	}, [isLoading]);

	const joinExcursion = useCallback(
		async (excursionId) => {
			const auxUserMail = user?.mail;
			if (!auxUserMail) return;

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

	const excursionComponents = useMemo(
		() =>
			excursionData.map((excursion) => {
				const isJoined = isLoggedIn && user?.excursions?.includes(excursion.id);
				return (
					<Col
						xs={12}
						md={6}
						lg={4}
						xl={3}
						key={excursion.id}
						className="d-flex" // Usamos d-flex para que las cards se estiren y ocupen toda la altura
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
		[excursionData, isLoggedIn, user?.excursions, joinExcursion]
	);

	// Si se están cargando los datos de las excursiones, mostrar el spinner
	if (isLoading) {
		return (
			<div className={styles.excursionsContainer}>
				<h2 className={styles.title}>Próximas excursiones</h2>
				<DelayedFallback
					className="w-100 align-items-stretch"
					// Si nunca ha cargado (`hasLoadedOnce` es false), mostramos los skeletons inmediatamente.
					immediate={!hasLoadedOnce.current}
				>
					<Row className="gx-4 gy-5" aria-label="Cargando excursiones...">
						{/* Mostramos 8 placeholders para dar una idea de la estructura en diferentes tamaños de pantalla */}
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
				</DelayedFallback>
			</div>
		);
	}

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

	/** Si llegamos aquí, no se está mostrando el spinner ni hay un error. Si no hay excursiones para mostrar, se muestra
	 * el mensaje de "No encontrada"
	 */
	if (excursionComponents.length === 0) {
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

	// Si hay excursiones, se muestran.
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

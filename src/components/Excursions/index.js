import { memo, useMemo, useCallback, useState, useEffect, useRef } from "react";
import { Row, Col } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { updateUser } from "../../slicers/loginSlice";
import ExcursionCard from "../ExcursionCard";
import { joinExcursion as joinExcursionService } from "../../services/excursionService";
import ExcursionsLoading from "./ExcursionsLoading";
import ExcursionsError from "./ExcursionsError";
import NoExcursionsFound from "./NoExcursionsFound";
import "bootstrap/dist/css/bootstrap.css";
import styles from "./Excursions.module.css";

/** @typedef {import('types.js').RootState} RootState */
/** @typedef {import('types.js').Excursion} Excursion */

/**
 * Componente principal que orquesta la visualización de la lista de excursiones.
 * Gestiona los estados de carga, error y "no encontrado", renderizando el componente hijo apropiado.
 * @param {ExcursionsProps} props
 * @typedef {object} ExcursionsProps
 * @property {Excursion[]} [excursionData=[]] - Array de excursiones a mostrar.
 * @property {boolean} isLoading - Indica si los datos de las excursiones se están cargando.
 * @property {(Error & { secondaryMessage?: string }) | null} error - Objeto de error si ha ocurrido un problema al cargar
 * las excursiones.
 */
function ExcursionsComponent({ excursionData = [], isLoading, error }) {
	// Se obtiene el estado del loginReducer, el objeto usuario y el token
	const {
		login: isLoggedIn,
		user,
		token,
	} = useSelector(
		/** @param {RootState} state */
		(state) => state.loginReducer
	);
	const loginDispatch = useDispatch();
	// Estado para las excursiones que se muestran. Esto nos permite mantener los resultados antiguos visibles mientras se
	// cargan los nuevos datos para evitar que parpadeen o se queden en blanco.
	const [displayedExcursions, setDisplayedExcursions] = useState(excursionData);
	// Estado para anunciar cambios a los lectores de pantalla.
	const [announcement, setAnnouncement] = useState("");
	// Referencia para saber si es la primera carga del componente. Permite evitar anunciar resultados en la primera carga.
	const isInitialLoad = useRef(true);

	// Efecto para gestionar qué excursiones se muestran. Se ejecuta cada vez que isLoading o excursionData cambian
	useEffect(() => {
		// No actualizamos nada mientras los datos se están cargando.
		// Esto mantiene los resultados antiguos visibles para una mejor UX.
		if (isLoading) {
			return;
		}

		// Cuando la carga finaliza, actualizamos las excursiones mostradas.
		setDisplayedExcursions(excursionData);

		// Anunciar el resultado de la búsqueda a los lectores de pantalla, pero solo
		// después de la carga inicial para evitar ruido innecesario.
		if (isInitialLoad.current) {
			isInitialLoad.current = false; // Marcar la carga inicial como completada.
		} else if (excursionData.length > 0) {
			const plural = excursionData.length === 1 ? "excursión" : "excursiones";
			const message = `Búsqueda completada. Se han encontrado ${excursionData.length} ${plural}.`;
			setAnnouncement(message);
		}
	}, [isLoading, excursionData]);

	/**
	 * Función asíncrona para unirse a una excursión.
	 * @param {string | number} excursionId - El ID de la excursión a la que el usuario desea unirse.
	 */
	const joinExcursion = useCallback(
		async (excursionId) => {
			try {
				/** Llamamos al servicio para unirse a la excursión. Este es el que hace la petición al servidor para apuntar
				 * al usuario a la excursión. El 'await' le dice a JavaScript que pause la ejecución de la función
				 * 'joinExcursion'hasta que 'joinExcursionService' termine y retorne una respuesta o un error.
				 * Si la petición es exitosa, 'updateUser' contendrá la info actualizada del usuario (con la nueva excursión
				 * en su lista), y se actualizará el estado del usuario en Redux, lo que hará que los componentes que
				 * dependen de este estado se re-rendericen automáticamente con la información actualizada, (por ejemplo, el
				 * botón 'Apuntarse' cambiará a 'Apuntado').
				 */
				const updatedUser = await joinExcursionService(
					user?.mail,
					excursionId,
					token
				);
				loginDispatch(updateUser({ user: updatedUser }));
				// Si hay un error, se captura y se maneja en el componente ExcursionCard, que es el que llama esta función.
			} catch (error) {
				console.error("Error técnico al unirse a la excursión:", error);
				// Relanzamos un nuevo error con un mensaje más amigable para el usuario.
				// Este error será capturado y mostrado por el componente ExcursionCard.
				throw new Error(
					"No ha sido posible apuntarse a la excursión. Por favor, inténtalo de nuevo más tarde."
				);
			}
		},
		// `token` se añade como dependencia para asegurar que la función tiene la versión más reciente.
		[user?.mail, token, loginDispatch]
	);

	/**
	 * Componentes de las tarjetas de excursión, memoizados para optimizar el rendimiento, ya que el mapear un array a
	 * componentes puede ser costoso si hay muchas excursiones.
	 * Cada tarjeta recibe las propiedades necesarias y se encarga de mostrar la información de la excursión.
	 * Además, se comprueba si el usuario ha iniciado sesión y si ya está apuntado a la excursión para mostrar el botón
	 * de unirse o no.
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
						key={excursion.id}
						xl={3}
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
	// Si hay un error, mostrar el componente de error.
	if (error) {
		return <ExcursionsError error={error} />;
	}
	// Si las excursiones se están cargando y no hay excursiones, mostrar el esqueleto de carga.
	if (isLoading && displayedExcursions.length === 0) {
		return <ExcursionsLoading isLoggedIn={isLoggedIn} />;
	}
	// Si no se está cargando y no hay excursiones, mostrar el componente de "no encontrado".
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

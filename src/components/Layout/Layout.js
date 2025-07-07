import React, {
	useState,
	useEffect,
	useCallback,
	lazy,
	Suspense,
	memo,
	useReducer,
} from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import { verifyToken } from "../../services/authService";
import { login, logout } from "../../slicers/loginSlice";
import NavigationBar from "../NavigationBar";
import Filters from "../Filters";
import Excursions from "../Excursions";
import OriginalFooter from "../Footer"; // Se renombra la importación original para que no haya conflictos
import DelayedFallback from "../DelayedFallback";
import "bootstrap/dist/css/bootstrap.css";
import styles from "../../css/Layout.module.css";
/**
 * Carga perezosa para componentes de ruta. El lazy loading permite que los componentes se carguen sólo cuando el usuario lo
 * necesita, así se mejoran los tiempos iniciales de carga de la página.
 */
const RegisterPage = lazy(() => import("../RegisterPage"));
const LoginPage = lazy(() => import("../LoginPage"));
const UserPage = lazy(() => import("../UserPage"));
/**
 * La memoización es una técnica de optimización donde se cachean los resultados para que no se tenga que renderizar otra
 * vez una función o un componente. Así se mejoran los tiempos de ejecución de la página.
 */
const Footer = memo(OriginalFooter);

// Constantes para configurar el indicador de carga (o fallback) de Suspense para los componentes que se cargan de forma
// perezosa
const baseFallbackClassName =
	"d-flex justify-content-center align-items-center fw-bold p-5 flex-grow-1"; // Se utiliza para dar estilo al contenedor mientras una página se carga
// Mensaje de texto que se mostrará al usuario
const fallbackContent = "Cargando página...";
// Tiempo de espera en milisegundos antes de mostrar el fallback
const fallbackDelay = 500;

/**
 * Componente wrapper para simplificar la renderización de rutas con carga perezosa.
 * @param {object} props - Las propiedades del componente.
 * @param {React.ComponentType} props.PageComponent - El componente de la página a renderizar.
 * @returns {React.ReactElement} Componente para simplificar la carga perezosa.
 */
const LazyRouteWrapper = ({ PageComponent }) => (
	<Col xs={12}>
		{/**
		 * Suspense: Es un mecanismo que permite mostrar una interfaz de "carga" (un fallback) mientras espera que un
		 * componente perezoso (lazy) termine de cargarse.
		 */}
		<Suspense
			// La prop "fallback" dice que se debe renderizar durante esa espera
			fallback={
				/**
				 * Se le pasa el retraso de 500ms que definimos en la constante. Esto evita que el mensaje "Cargando página..."
				 * parpadee si la página carga muy rápido.
				 */
				<DelayedFallback
					delay={fallbackDelay}
					className={baseFallbackClassName}
				>
					{fallbackContent}
				</DelayedFallback>
			}
		>
			<PageComponent />
		</Suspense>
	</Col>
);

/**
 * Componente principal del layout de la aplicación.
 * Gestiona el estado de las excursiones, la autenticación del usuario y la estructura general de la página.
 * @returns {React.ReactElement} El componente Layout
 */
const Layout = () => {
	const loginDispatch = useDispatch();

	/**
	 * useReducer: Es un hook de React, alternativa a useSate, que se usa cuando el estado es más complejo y tiene varias
	 * cosas interrelacionadas entre sí, en este caso, los datos, el estado de carga y los errores.
	 */
	/**
	 * Estado para la gestión de datos de excursiones, usando un reducer para mayor claridad. Este es el objeto que define el
	 * estado inicial.
	 */
	const excursionsInitialState = {
		data: [],
		isLoading: true,
		error: null,
	};

	/**
	 * Función reductora. Recibe el estado actual (state) y un objeto (action) que describe qué ha sucedido y retorna un
	 * nuevo estado
	 */
	const excursionsReducer = (
		/** @type {any} */ state,
		/** @type {{ type: any; payload: any; }} */ action
	) => {
		switch (action.type) {
			case "FETCH_START":
				return { ...state, isLoading: true, error: null };
			case "FETCH_SUCCESS":
				return { ...state, isLoading: false, data: action.payload };
			case "FETCH_ERROR":
				return { ...state, isLoading: false, error: action.payload, data: [] }; // Limpiar datos en caso de error
			default:
				throw new Error(`Acción no soportada: ${action.type}`);
		}
	};

	// Aquí se utiliza el hook useReducer
	/**
	 * excursionsReducer: Función que gestiona la lógica
	 * excursionsState: Es el objeto que contiene el estado actual. En cualquier momento, se puede leer
	 * excursionsState.data, excursionsState.isLoading o excursionsState.error para saber qué está pasando.
	 * excursionsDispatch: Es una función que usas para "despachar" o enviar acciones al reducer. Por ejemplo, para iniciar
	 * la carga de datos, llama a excursionsDispatch({ type: "FETCH_START" }). Esto haría que el reducer ejecute el código
	 * del case "FETCH_START"
	 */
	const [excursionsState, excursionsDispatch] = useReducer(
		excursionsReducer,
		excursionsInitialState
	);

	/**
	 * Callback para manejar una carga exitosa de excursiones, actualizando el estado.
	 */
	const handleExcursionsFetchSuccess = useCallback(
		(/** @type {any[]} */ excursions) => {
			excursionsDispatch({ type: "FETCH_SUCCESS", payload: excursions });
		},
		[]
	);

	/**
	 * Estado para saber si la comprobación inicial de autenticación del usuario ha terminado. Esto evita que cuando el usuario
	 * esté logueado vea un parpadeo de los botones que se utilizan cuando el usuario no está logueado
	 */
	const [isAuthCheckComplete, setIsAuthCheckComplete] = useState(false);

	/**
	 * useEffect que controla el token en sessionStorage. Se guarda el token actual en sessionStorage y se loguea al usuario
	 * de nuevo en caso de que se refresque la página. Con esto el usuario no perderá su sesión, es decir, se queda logueado
	 */
	useEffect(() => {
		const verifyAuthStatus = async () => {
			const sessionToken = sessionStorage.getItem("token");
			try {
				// Usamos el servicio de autenticación. Este ya maneja el caso de que no haya token.
				const data = await verifyToken(sessionToken);
				// Si el servicio retorna datos, el token es válido.
				if (data) {
					// Actualiza el estado de la Redux store poniendo al usuario como logueado
					loginDispatch(
						login({
							user: data.user,
							token: data.token,
						})
					);
				}
				// Si 'data' es null (porque no había token), no se hace nada y el usuario
				// permanece en el estado inicial (deslogueado).
			} catch (error) {
				console.error(
					"Error en la verificación del estado de autenticación:",
					error.message
				);
				// Si hubo un error (ej. token inválido), deslogueamos al usuario.
				loginDispatch(logout());
				sessionStorage.removeItem("token");
			} finally {
				setIsAuthCheckComplete(true); // Marcar autenticación del usuario como completa independientemente del resultado
			}
		};
		verifyAuthStatus();
	}, [loginDispatch]);

	/**
	 * useCallback: Memoriza una función. Esto significa que React guarda una versión de esa función y la reutiliza en los
	 * siguientes renderizados del componente, en lugar de crear una función completamente nueva cada vez. Solo volverá a
	 * crear la función si alguna de sus "dependencias" han cambiado.
	 *
	 * 1. Evita re-renderizados innecesarios en componentes hijos: Si pasas una función como prop a un componente hijo que
	 * está optimizado con React.memo, ese componente hijo volverá a renderizarse cada vez que el padre lo haga, incluso si
	 * nada ha cambiado visualmente. Esto ocurre porque, sin useCallback, la función que pasas es técnicamente un "nuevo"
	 * objeto en cada renderizado. useCallback asegura que el componente hijo reciba exactamente la misma instancia de la
	 * función, y React.memo puede entonces determinar correctamente que no necesita volver a renderizarse.
	 *
	 * 2. Estabiliza dependencias en otros Hooks (como useEffect): Si usas una función dentro de un useEffect y la incluyes
	 * en su array de dependencias, el efecto se ejecutará en cada renderizado si la función no está envuelta en useCallback.
	 * Esto puede causar bucles infinitos o ejecuciones innecesarias de código costoso (como peticiones a una API).
	 *
	 * En resumen, se utiliza cuando se pasan funciones como props a componentes hijos optimizados (React.memo) o cuando
	 * una función sea una dependencia de otro Hook como useEffect, useMemo o incluso otro useCallback.
	 *
	 * Callback para indicar el inicio de una operación de fetch de excursiones. Establece isLoading a true y
	 * resetea error.
	 */
	const handleExcursionsFetchStart = useCallback(() => {
		excursionsDispatch({ type: "FETCH_START" });
	}, []);

	/**
	 * Callback para indicar el fin de una operación de fetch de excursiones. Establece isLoading a false y guarda
	 * el error si lo hay.
	 */
	const handleExcursionsFetchEnd = useCallback((/** @type {any} */ error) => {
		if (error) {
			excursionsDispatch({ type: "FETCH_ERROR", payload: error });
		}
	}, []);

	// El componente Excursions recibirá isLoading y error para manejar su propia UI.
	const excursionsContent = (
		<Excursions
			excursionData={excursionsState.data}
			isLoading={excursionsState.isLoading}
			error={excursionsState.error}
		/>
	);

	// El layout principal usa Flexbox (`styles.layout`) para asegurar que el footer se mantenga al final de la página,
	// incluso si el contenido es corto.
	return (
		<div className={styles.layout}>
			<NavigationBar
				onExcursionsFetchSuccess={handleExcursionsFetchSuccess}
				onExcursionsFetchStart={handleExcursionsFetchStart}
				onExcursionsFetchEnd={handleExcursionsFetchEnd}
				isAuthCheckComplete={isAuthCheckComplete}
			/>
			{/* El elemento <main> es la segunda fila del grid y se expande automáticamente. */}
			<main className={styles.mainContentWrapper}>
				<Container fluid>
					<Row className="justify-content-start">
						<Routes>
							{/* Define la ruta por defecto */}
							<Route
								path="/"
								element={
									<>
										<Col xs={12} md={4} lg={3} xl={2} className="mb-3 mb-md-0">
											<Filters />
										</Col>
										<Col
											xs={12}
											md={8}
											lg={9}
											xl={10}
											className="d-flex flex-column"
										>
											{excursionsContent}
										</Col>
									</>
								}
							/>
							{/* Define las rutas para los componentes RegisterPage, LoginPage y UserPage */}
							<Route
								path="registerPage"
								element={<LazyRouteWrapper PageComponent={RegisterPage} />}
							/>
							<Route
								path="loginPage"
								element={<LazyRouteWrapper PageComponent={LoginPage} />}
							/>
							<Route
								path="userPage"
								element={<LazyRouteWrapper PageComponent={UserPage} />}
							/>
						</Routes>
					</Row>
				</Container>
			</main>
			<Footer />
		</div>
	);
};

export default Layout;

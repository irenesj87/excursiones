import { useState, useEffect, useCallback, lazy, Suspense, memo } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
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

// Constantes para configurar el indicador de carga (o fallback) de Suspense para los componentes que se cargan de forma perezosa
const baseFallbackClassName =
	"d-flex justify-content-center align-items-center fw-bold p-5 flex-grow-1"; // Se utiliza para dar estilo al contenedor mientras una página se carga
// Mensaje de texto que se mostrará al usuario
const fallbackContent = "Cargando página...";
// Tiempo de espera en milisegundos antes de mostrar el fallback
const fallbackDelay = 500;

// Componente wrapper para simplificar la renderización de rutas con carga perezosa.
// ({ PageComponent, extraFallbackClass = "" }): Esto es la desestructuración de las props que recibe el componente.
// PageComponent: Es el componente de la página que queremos renderizar (por ejemplo, RegisterPage o LoginPage).
// extraFallbackClass = "": Es una prop opcional. Permite pasar una clase CSS extra para el indicador de carga. Si no se le
// pasa nada, por defecto será una cadena vacía.
const LazyRouteWrapper = ({ PageComponent, extraFallbackClass = "" }) => (
	<Col xs={12} className="d-flex flex-column flex-grow-1">
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
					className={`${baseFallbackClassName} ${extraFallbackClass}`}
				>
					{/**
					 * Es el contenido que mostrará DelayedFallback. En este caso, el texto "Cargando página..."
					 */}
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
 */
const Layout = () => {
	const loginDispatch = useDispatch();
	/**
	 * Array de excursiones que se necesita en cada momento, ya sea para mostrar todas las excursiones, las que el usuario
	 * selecciona con los filtros o las que busca en la barra de búsqueda
	 */
	const [excursionArray, setExcursionArray] = useState([]);
	// Estado para saber si la carga de excursiones ha terminado
	const [isLoadingExcursions, setIsLoadingExcursions] = useState(true);
	// Estado que dice si ha habido algún problema al cargar las excursiones
	const [fetchExcursionsError, setFetchExcursionsError] = useState(null);
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
			// Coge el token de la sessionStorage del navegador
			const sessionToken = sessionStorage.getItem("token");
			// Variable que tiene la url para hacer el fetch
			const url = `http://localhost:3001/token/${sessionToken}`;
			// Variable que guarda las opciones que se necesitan para el fetch
			const options = {
				method: "GET",
				mode: "cors",
				headers: { "Content-Type": "application/json" },
			};

			try {
				// Si hay token
				if (sessionToken) {
					// Esperamos a la respuesta del servidor
					const response = await fetch(url, options);
					// Si ha habido un error
					if (!response.ok) {
						let errorMessage = `Error de validación del token: ${response.status}`;
						try {
							/**
							 * Se intenta obtener un mensaje de error más descriptivo (algunos servidores retornan
							 * una respuesta en JSON que contiene datos adicionales del error)
							 */
							const errorData = await response.json();
							errorMessage = errorData.message || errorMessage;
						} catch (parseError) {
							// Si la respuesta no es JSON, se registra el error de parseo y se usa el statusText o el mensaje por defecto.
							console.warn(
								"Error al parsear la respuesta JSON del error:",
								parseError
							);
							errorMessage = response.statusText || errorMessage;
						}
						throw new Error(errorMessage);
					}
					// Pasa la respuesta en JSON del servidor a un objeto JavaScript
					const data = await response.json();
					// Actualiza el estado de la Redux store poniendo al usuario como logueado
					loginDispatch(
						login({
							user: data.user,
							token: data.token,
						})
					);
				}
				// Si no hay token, el usuario permanece en el estado inicial (deslogueado por defecto en Redux)
			} catch (error) {
				console.error(
					"Error en la verificación del estado de autenticación:",
					error.message
				);
				if (sessionToken) {
					// Solo desloguear y limpiar si se intentó validar un token
					// Se desloguea al usuario...
					loginDispatch(logout());
					// ...y se elimina el token de la sessionStorage
					sessionStorage.removeItem("token");
				}
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
	 * 2. Estabilizar dependencias en otros Hooks (como useEffect): Si usas una función dentro de un useEffect y la incluyes
	 * en su array de dependencias, el efecto se ejecutará en cada renderizado si la función no está envuelta en useCallback.
	 * Esto puede causar bucles infinitos o ejecuciones innecesarias de código costoso (como peticiones a una API).
	 *
	 * En resumen, se utiliza cuando se pasan funciones como props a componentes hijos optimizados (React.memo) o cuando
	 * una función sea una dependencia de otro Hook como useEffect, useMemo o incluso otro useCallback.
	 *
	 * Callback para indicar el inicio de una operación de fetch de excursiones. Establece isLoadingExcursions a true y
	 * resetea fetchExcursionsError.
	 */
	const handleExcursionsFetchStart = useCallback(() => {
		setIsLoadingExcursions(true);
		setFetchExcursionsError(null);
	}, []);

	/**
	 * Callback para indicar el fin de una operación de fetch de excursiones. Establece isLoadingExcursions a false y guarda
	 * el error si lo hay.
	 */
	const handleExcursionsFetchEnd = useCallback((error) => {
		if (error) {
			setFetchExcursionsError(error); // Asume que 'error' es un objeto de error o un mensaje
		}
		setIsLoadingExcursions(false);
	}, []);

	// El componente Excursions recibirá isLoading y error para manejar su propia UI.
	const excursionsContent = (
		<Excursions
			excursionData={excursionArray}
			isLoading={isLoadingExcursions}
			error={fetchExcursionsError}
		/>
	);

	return (
		<div className={styles.layout}>
			<NavigationBar
				setExcursions={setExcursionArray}
				onExcursionsFetchStart={handleExcursionsFetchStart}
				onExcursionsFetchEnd={handleExcursionsFetchEnd}
				isAuthCheckComplete={isAuthCheckComplete}
			/>
			<Container
				className={`${styles.mainContentWrapper} flex-grow-1 d-flex flex-column`}
				fluid
			>
				<main className="flex-grow-1 d-flex flex-column">
					<Row className="flex-grow-1 d-flex justify-content-start">
						<Routes>
							{/* Define la ruta por defecto */}
							<Route
								path="/"
								element={
									<>
										<Col xs={12} md={4} lg={3} xl={2}>
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
							{/* Define las rutas para los componentes Register, LoginPage y UserPage */}
							<Route
								path="registerPage"
								element={
									<LazyRouteWrapper
										PageComponent={RegisterPage}
										extraFallbackClass={styles.fallbackMinHeight}
									/>
								}
							/>
							<Route
								path="loginPage"
								element={
									<LazyRouteWrapper
										PageComponent={LoginPage}
										extraFallbackClass={styles.fallbackMinHeight}
									/>
								}
							/>
							<Route
								path="userPage"
								element={
									<LazyRouteWrapper
										PageComponent={UserPage}
										extraFallbackClass={styles.fallbackMinHeight}
									/>
								}
							/>
						</Routes>
					</Row>
				</main>
				<Row>
					<Footer />
				</Row>
			</Container>
		</div>
	);
};

export default Layout;

import React, { useState, memo } from "react";
import { Container, Row, Col, Button, Offcanvas, Badge } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Routes, Route } from "react-router-dom";
import NavigationBar from "../NavigationBar";
import Filters from "../Filters";
import Excursions from "../Excursions";
import OriginalFooter from "../Footer"; // Se renombra la importación original para que no haya conflictos
import ProtectedRoute from "../ProtectedRoute";
import RegisterPageSkeleton from "../skeletons/RegisterPageSkeleton";
import LoginPageSkeleton from "../skeletons/LoginPageSkeleton";
import UserPageSkeleton from "../skeletons/UserPageSkeleton";
import { useAuth } from "../../hooks/useAuth";
import { useExcursions } from "../../hooks/useExcursions";
import { lazyWithMinTime } from "../../utils/lazyWithMinTime";
import LazyRouteWrapper from "../../utils/LazyRouteWrapper";
import { FiFilter } from "react-icons/fi";
import "bootstrap/dist/css/bootstrap.css";
import styles from "../../css/Layout.module.css";

/** @typedef {import('../../types').RootState} RootState */

/**
 * Lazy loading de los componentes RegisterPage, LoginPage y UserPage.
 * Se utiliza `lazyWithMinTime` para optimizar la carga de estos componentes.
 */
const RegisterPage = lazyWithMinTime(() => import("../RegisterPage"));
const LoginPage = lazyWithMinTime(() => import("../LoginPage"));
const UserPage = lazyWithMinTime(() => import("../UserPage"));

// Componente Footer memoizado para evitar re-renderizados innecesarios.
const Footer = memo(OriginalFooter);

/**
 * Componente principal de la aplicación. Gestiona el estado de las excursiones, la autenticación del usuario y la estructura
 * general de la página.
 * @returns {React.ReactElement} El layout
 */
const Layout = () => {
	// Estado para controlar la visibilidad del menú Offcanvas de filtros en breakpoints pequeños.
	const [showFilters, setShowFilters] = useState(false);
	// Función para cerrar el Offcanvas de filtros.
	const handleCloseFilters = () => setShowFilters(false);
	// Función para abrir el Offcanvas de filtros.
	const handleShowFilters = () => setShowFilters(true);

	// Se usa el hook useAuth para saber si ya se ha verificado si el usuario tiene una sesión activa.
	const { isAuthCheckComplete } = useAuth();

	// Se usa el hook useExcursions para obtener el estado completo de las excursiones, que contiene los datos, el estado de carga y
	// los errores.
	const {
		excursionsState,
		handleExcursionsFetchStart,
		handleExcursionsFetchSuccess,
		handleExcursionsFetchEnd,
	} = useExcursions();

	// Se obtienen los filtros activos del estado global de Redux. Estos filtros se usan para filtrar las excursiones que se muestran
	// en la lista de excursiones.
	const activeFilterCount = useSelector(
		/** @param {RootState} state */
		(state) =>
			state.filterReducer.area.length +
			state.filterReducer.difficulty.length +
			state.filterReducer.time.length
	);

	// Texto para el contador de filtros en el botón de 'Mostrar Filtros' que aparece en breakpoints 'xs'.
	const filterCountText =
		activeFilterCount === 1 ? "seleccionado" : "seleccionados";

	// Variable que contiene el componente Excursions. Recibirá los datos, el estado de carga (isLoading) y el estado de error desde
	// el hook useExcursions.
	const excursionsContent = (
		<Excursions
			excursionData={excursionsState.data}
			isLoading={excursionsState.isLoading}
			error={excursionsState.error}
		/>
	);

	return (
		<div className={styles.layout}>
			{/* Componente de navegación al que se le pasan las funciones de manejo de excursiones y el estado de verificación de 
			    autenticación del usuario como props. Esto permite que la barra de navegación pueda interactuar con el estado de las
				excursiones y la autenticación del usuario */}
			<NavigationBar
				onFetchSuccess={handleExcursionsFetchSuccess}
				onExcursionsFetchStart={handleExcursionsFetchStart}
				onExcursionsFetchEnd={handleExcursionsFetchEnd}
				isAuthCheckComplete={isAuthCheckComplete}
			/>
			{/* Contenedor principal que alberga el contenido de la página. Utiliza react-bootstrap para el diseño responsivo */}
			<main className={styles.mainContentWrapper}>
				<Container fluid className="d-flex flex-column flex-grow-1">
					<Row className="justify-content-start flex-grow-1 align-items-stretch">
						<Routes>
							{/* Define la ruta por defecto */}
							<Route
								path="/"
								element={
									<>
										{/* Columna de filtros visible a partir de 'md' en adelante */}
										<Col
											md={4}
											lg={3}
											xl={2}
											className="d-none d-md-block ps-md-0 pe-md-0"
										>
											<Filters />
										</Col>
										{/* Contenido principal que incluye el botón para mostrar filtros en breakpoints 'xs' y 
										    la lista de excursiones en cualquier breakpoint*/}
										<Col
											xs={12}
											md={8}
											lg={9}
											xl={10}
											className="d-flex flex-column position-relative"
										>
											{/* Botón para mostrar filtros (visible hasta 'md') */}
											<div className="d-grid d-md-none mt-3 mb-1">
												<Button
													variant="outline-secondary"
													onClick={handleShowFilters}
													className="filtersToggleButton"
												>
													<FiFilter className="me-2" />
													<span>
														Mostrar Filtros
														{activeFilterCount > 0 && (
															<Badge
																pill
																bg={null}
																className={`${styles.filterBadge} ms-2`}
															>
																{activeFilterCount} {filterCountText}
															</Badge>
														)}
													</span>
												</Button>
											</div>
											{excursionsContent}
											{/* Menú Offcanvas para los filtros en breakpoints hasta 'md'. Es independiente del de 
											 navegación. */}
											<Offcanvas
												show={showFilters}
												onHide={handleCloseFilters}
												placement="start"
												className="d-md-none" // Asegura que el componente solo se active en breakpoints hasta 'md'
											>
												<Offcanvas.Header closeButton>
													<Offcanvas.Title>Filtros</Offcanvas.Title>
												</Offcanvas.Header>
												<Offcanvas.Body className="d-flex flex-column">
													<Filters showTitle={false} />
												</Offcanvas.Body>
											</Offcanvas>
										</Col>
									</>
								}
							/>
							{/* Define las rutas para los componentes RegisterPage, LoginPage y UserPage */}
							<Route
								path="registerPage"
								element={
									<LazyRouteWrapper
										PageComponent={RegisterPage}
										SkeletonComponent={RegisterPageSkeleton}
									/>
								}
							/>
							<Route
								path="loginPage"
								element={
									<LazyRouteWrapper
										PageComponent={LoginPage}
										SkeletonComponent={LoginPageSkeleton}
									/>
								}
							/>
							<Route
								path="userPage"
								element={
									// ProtectedRoute asegura que el usuario esté autenticado antes de acceder a UserPage, es decir,
									// restringe el acceso. Esto lo hace revisando el estado de autenticación del usuario (que se 
									// gestiona con Redux en loginSlice).
									// Este componente tiene tres propósitos:
									// 1. Evita mostrar una página "rota": Impide que un usuario no autenticado vea una página de
									//    perfil vacía o con errores, ya que un usuario no autenticado (alguien que no ha iniciado
									//    sesión) podría escribir /userPage en el navegador y llegar a la página. Sin embargo, como
									//    no hay datos de usuario en el estado de Redux (state.loginReducer.user sería null), la
									//    página de perfil se mostraría vacía o con errores, pero nunca mostraría los datos de otro
									//    usuario. Su función aquí es mejorar la experiencia de usuario y mantener la lógica de 
									//    acceso.
									// 2. Gestiona el flujo de autenticación: Si un usuario no logueado intenta acceder a /userPage,
									//    lo redirige de forma limpia a la página de inicio de sesión (/loginPage).
									// 3. Redirección inteligente: Guarda la página que el usuario intentaba visitar para que, una
									//    vez que inicie sesión, pueda ser redirigido de vuelta a su perfil automáticamente.
									<ProtectedRoute isAuthCheckComplete={isAuthCheckComplete}>
										<LazyRouteWrapper
											PageComponent={UserPage}
											SkeletonComponent={UserPageSkeleton}
										/>
									</ProtectedRoute>
								}
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

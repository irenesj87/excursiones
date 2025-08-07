import React, { useState, memo } from "react";
import { FiFilter } from "react-icons/fi";
import { Container, Row, Col, Button, Offcanvas } from "react-bootstrap";
import { Routes, Route } from "react-router-dom";
import NavigationBar from "../NavigationBar";
import Filters from "../Filters";
import Excursions from "../Excursions";
import OriginalFooter from "../Footer"; // Se renombra la importación original para que no haya conflictos
import RegisterPageSkeleton from "../RegisterPageSkeleton";
import LoginPageSkeleton from "../LoginPageSkeleton";
import UserPageSkeleton from "../UserPageSkeleton";
import { useAuth } from "../../hooks/useAuth";
import { useExcursions } from "../../hooks/useExcursions";
import { lazyWithMinTime } from "../../utils/lazyWithMinTime";
import LazyRouteWrapper from "../../utils/LazyRouteWrapper";
import "bootstrap/dist/css/bootstrap.css";
import styles from "../../css/Layout.module.css";

const RegisterPage = lazyWithMinTime(() => import("../RegisterPage"));
const LoginPage = lazyWithMinTime(() => import("../LoginPage"));
const UserPage = lazyWithMinTime(() => import("../UserPage"));

/**
 * La memoización es una técnica de optimización donde se cachean los resultados para que no se tenga que renderizar otra
 * vez una función o componente. Así, se mejoran los tiempos de ejecución de la página.
 */
const Footer = memo(OriginalFooter);

/**
 * Componente principal del layout de la aplicación.
 * Gestiona el estado de las excursiones, la autenticación del usuario y la estructura general de la página.
 * @returns {React.ReactElement} El layout
 */
const Layout = () => {
	// Estado para controlar la visibilidad del menú Offcanvas de filtros en breakpoints pequeños.
	const [showFilters, setShowFilters] = useState(false);

	// Función para cerrar el Offcanvas de filtros.
	const handleCloseFilters = () => setShowFilters(false);
	// Función para abrir el Offcanvas de filtros.
	const handleShowFilters = () => setShowFilters(true);

	// Hook para manejar la autenticación del usuario y verificar el token.
	// `isAuthCheckComplete` se usa para controlar cuándo se renderizan las rutas perezosas que requieren autenticación.
	const { isAuthCheckComplete } = useAuth();
	// Hook para manejar el estado de las excursiones.
	// Incluye funciones para iniciar, finalizar y manejar el éxito del fetching de excursiones.
	const {
		excursionsState,
		handleExcursionsFetchStart,
		handleExcursionsFetchSuccess,
		handleExcursionsFetchEnd,
	} = useExcursions();

	// El componente Excursions recibirá isLoading y error para manejar su propia UI.
	const excursionsContent = (
		<Excursions
			excursionData={excursionsState.data}
			isLoading={excursionsState.isLoading}
			error={excursionsState.error}
		/>
	);

	return (
		<div className={styles.layout}>
			<NavigationBar
				onExcursionsFetchSuccess={handleExcursionsFetchSuccess}
				onExcursionsFetchStart={handleExcursionsFetchStart}
				onExcursionsFetchEnd={handleExcursionsFetchEnd}
				isAuthCheckComplete={isAuthCheckComplete}
			/>
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
										{/* Contenido principal que incluye el botón para breakpoints pequeños y la lista 
										    de excursiones */}
										<Col
											xs={12}
											md={8}
											lg={9}
											xl={10}
											className="d-flex flex-column position-relative"
										>
											{/* Botón para mostrar filtros (visible solo hasta 'md') */}
											<div className="d-grid d-md-none mt-3 mb-1">
												<Button
													variant="outline-secondary"
													onClick={handleShowFilters}
													className="filtersToggleButton"
												>
													<FiFilter className="me-2" />
													<span>Mostrar Filtros</span>
												</Button>
											</div>
											{excursionsContent}
											{/* Menú Offcanvas para los filtros en breakpoints pequeños. Es independiente 
											del de navegación. */}
											<Offcanvas
												show={showFilters}
												onHide={handleCloseFilters}
												placement="start"
												className="d-md-none" // Asegura que el componente solo se active en breakpoints pequeños
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
									<LazyRouteWrapper
										PageComponent={UserPage}
										SkeletonComponent={UserPageSkeleton}
										isAuthCheckComplete={isAuthCheckComplete}
									/>
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

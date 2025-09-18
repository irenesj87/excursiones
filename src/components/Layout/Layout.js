import React, { memo } from "react";
import { Container, Row } from "react-bootstrap";
import { Routes, Route, useLocation } from "react-router-dom";
import NavigationBar from "../NavigationBar";
import ExcursionsPage from "../ExcursionsPage";
import OriginalFooter from "../Footer/Footer"; // Se renombra la importación original para que no haya conflictos
import ProtectedRoute from "../ProtectedRoute";
import RegisterPageSkeleton from "../RegisterPage/RegisterPageSkeleton";
import LoginPageSkeleton from "../LoginPage/LoginPageSkeleton";
import UserPageSkeleton from "../UserPage/UserPageSkeleton";
import { useAuth } from "../../hooks/useAuth";
import { useExcursions } from "../../hooks/useExcursions";
import { lazyWithMinTime } from "../../utils/lazyWithMinTime";
import LazyRouteWrapper from "../../utils/LazyRouteWrapper";
import styles from "./Layout.module.css";

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
 * Componente principal de la aplicación. Gestiona el estado de las excursiones, la autenticación del usuario y la
 * estructura general de la página.
 * @returns {React.ReactElement} El layout
 */
const Layout = () => {
	const location = useLocation();
	const isOnExcursionsPage = location.pathname === "/";

	// Se usa el hook useAuth para saber si ya se ha verificado si el usuario tiene una sesión activa.
	const { isAuthCheckComplete } = useAuth();

	// Se usa el hook useExcursions para obtener el estado completo de las excursiones, que contiene los datos, el estado
	// de carga y los errores.
	const {
		excursionsState,
		handleExcursionsFetchStart,
		handleExcursionsFetchSuccess,
		handleExcursionsFetchEnd,
	} = useExcursions();

	return (
		<div className={styles.layout}>
			{/* Componente de navegación al que se le pasan las funciones de manejo de excursiones y el estado de
			 * verificación de autenticación del usuario como props. Esto permite que la barra de navegación pueda
			 * interactuar con el estado de las excursiones y la autenticación del usuario
			 */}
			<NavigationBar
				onFetchSuccess={handleExcursionsFetchSuccess}
				onExcursionsFetchStart={handleExcursionsFetchStart}
				onExcursionsFetchEnd={handleExcursionsFetchEnd}
				isAuthCheckComplete={isAuthCheckComplete}
				isOnExcursionsPage={isOnExcursionsPage}
			/>
			{/* Contenedor principal que alberga el contenido de la página */}
			<main className={styles.mainContentWrapper}>
				<Container fluid className="d-flex flex-column flex-grow-1">
					<Row className="justify-content-start flex-grow-1 align-items-stretch">
						<Routes>
							{/* Define la ruta por defecto */}
							<Route
								path="/"
								element={<ExcursionsPage excursionsState={excursionsState} />}
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

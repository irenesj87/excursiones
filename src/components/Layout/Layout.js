import React, { useState, useEffect } from "react";
import { Container, Row } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { login, logout } from "../../slicers/loginSlice";
import { Routes, Route } from "react-router-dom";
import NavigationBar from "../NavigationBar";
import Register from "../Register";
import Filters from "../Filters";
import Excursions from "../Excursions";
import UserPage from "../UserPage";
import Footer from "../Footer";
import "bootstrap/dist/css/bootstrap.css";
import styles from "../../css/Layout.module.css";

//This is the layout, here goes the web structure.
const Layout = () => {
	// Variable we need to be able to use dispatchers
	const loginDispatch = useDispatch();

	// Array of excursions that are needed in that moment which are the list of all the excursions and the search (for both the search bar and the filters)
	const [excursionArray, setExcursionArray] = useState([]);

	// This useEffect controls the token in the sessionStorage. The token is saved in the sessionStorage for the user to be able to stay logged in
	useEffect(() => {
		// This function saves the current token and logs the user again in case that the webpage is refreshed. With this the user won´t lose his session
		const loadToken = async () => {
			// Gets the token from sessionStorage
			const sessionToken = sessionStorage["token"];
			// Variable that has the url that is needed for the fetch
			const url = `http://localhost:3001/token/${sessionToken}`;
			// Variable that saves the options that the fetch needs
			const options = {
				method: "GET",
				mode: "cors",
				headers: { "Content-Type": "application/json" },
			};

			// If there´s a token
			if (sessionToken) {
				try {
					// We wait for the server to respond
					const response = await fetch(url, options);
					if (response.status === 404) {
						throw new Error("Token not found or invalid");
					}
					const data = await response.json();
					loginDispatch(
						login({
							user: data.user,
							token: data.token,
						})
					);
				} catch (error) {
					console.error("Token validation error:", error);
					loginDispatch(logout());
					sessionStorage.removeItem("token");
				}
			}
		};

		loadToken();
	}, [loginDispatch]);

	return (
		<Container className={styles.layout} fluid>
			<NavigationBar setExcursions={setExcursionArray} />
			<main>
				<Row>
					<Routes>
						<Route
							path="/"
							element={
								<>
									<Filters />
									<Excursions excursionData={excursionArray} />
								</>
							}
						/>
						<Route path="register" element={<Register />} />
						<Route path="userPage" element={<UserPage />} />
					</Routes>
				</Row>
			</main>
			<Row>
				<Footer />
			</Row>
		</Container>
	);
};

export default Layout;

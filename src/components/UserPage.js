import { useState, useEffect } from "react";
import { Col, Row, Container, Card } from "react-bootstrap";
import { useSelector } from "react-redux";
import ExcursionCard from "./ExcursionCard";
import "bootstrap/dist/css/bootstrap.css";
import styles from "../css/UserPage.module.css";
import UserInfoForm from "./UserInfoForm";

function UserPage() {
	// This useSelector gives us the info if an user is logged or not
	const { login: isLoggedIn, user } = useSelector(
		(state) => state.loginReducer
	);
	// State for saving the user's excursions info
	const [userExcursions, setUserExcursions] = useState([]);
	//
	const excursionsUrl = `http://localhost:3001/excursions`;

	// Fetch the user's excursions data
	useEffect(() => {
		const fetchData = async () => {
			if (isLoggedIn && user && user.excursions.length > 0) {
				try {
					const response = await fetch(excursionsUrl);
					if (!response.ok) {
						throw new Error(`HTTP error! status: ${response.status}`);
					}
					const data = await response.json();
					const filteredExcursions = data.filter((excursion) =>
						user.excursions.includes(excursion.id)
					);
					setUserExcursions(filteredExcursions);
				} catch (error) {
					console.error("Error fetching excursions:", error);
				}
			} else {
				setUserExcursions([]);
			}
		};
		fetchData();
	}, [isLoggedIn, user, excursionsUrl]);

	return (
		<Container>
			<Row className="mb-4 justify-content-center">
				<Col>
					<h2 className={styles.title}>Tu perfil</h2>
				</Col>
			</Row>
			<Row className="mb-4 justify-content-center">
				<Col xs="12" md="12" lg="9" xl="10">
					<UserInfoForm />
				</Col>
			</Row>
			<Row className="mb-4 justify-content-center">
				<Col xs="12" md="12" lg="9" xl="10">
					<Card className={styles.excursionsCard}>
						<Card.Header className={styles.cardHeader}>
							Excursiones a las que te has apuntado
						</Card.Header>
						<Card.Body className={styles.cardBody}>
							{userExcursions.length > 0 ? (
								<Row xs={1} md={2} className="g-3">
									{userExcursions.map((excursion) => (
										<Col key={excursion.id}>
											<ExcursionCard
												name={excursion.name}
												area={excursion.area}
												description={excursion.description}
												difficulty={excursion.difficulty}
												time={excursion.time}
											/>
										</Col>
									))}
								</Row>
							) : (
								<p className={`${styles.noExcursionsJoined} no-excursions-text`}>
									Aún no te has apuntado a ninguna excursión.
								</p>
							)}
						</Card.Body>
					</Card>
				</Col>
			</Row>
		</Container>
	);
}

export default UserPage;

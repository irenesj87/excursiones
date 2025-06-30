import LoginForm from "./LoginForm";
import FormPageLayout from "./FormPageLayout";
import "bootstrap/dist/css/bootstrap.css";

// Componente que representa la página de inicio de sesión.
function LoginPage() {
	return (
		<FormPageLayout title="Inicia sesión" colWidth="3">
			<LoginForm />
		</FormPageLayout>
	);
}

export default LoginPage;

import LoginForm from "../LoginForm/LoginForm";
import FormPageLayout from "../FormPageLayout/FormPageLayout";
import "bootstrap/dist/css/bootstrap.css";

// Componente que representa la página de inicio de sesión.
function LoginPage() {
	return (
		<FormPageLayout
			title="Inicia sesión"
			subtitle="Nos alegra verte de nuevo."
			colWidth="3"
			switcherPrompt="¿No tienes una cuenta?"
			switcherLinkText="Regístrate"
			switcherLinkTo="/registerPage"
		>
			<LoginForm />
		</FormPageLayout>
	);
}

export default LoginPage;

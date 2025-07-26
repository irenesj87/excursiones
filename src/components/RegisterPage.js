import RegisterForm from "./RegisterForm";
import FormPageLayout from "./FormPageLayout";
import "bootstrap/dist/css/bootstrap.css";

/**
 * Componente que representa la página de registro de usuarios.
 */
function RegisterPage() {
	return (
		<FormPageLayout
			title="Bienvenido/a"
			subtitle="Crea tu cuenta para empezar a explorar."
		>
			<RegisterForm />
		</FormPageLayout>
	);
}

export default RegisterPage;

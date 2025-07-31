import RegisterForm from "./RegisterForm";
import FormPageLayout from "./FormPageLayout";
import "bootstrap/dist/css/bootstrap.css";

/**
* Componente que representa la página de registro de usuarios.
* Utiliza `FormPageLayout` para proporcionar un diseño consistente con otras páginas de formulario, y renderiza `RegisterForm` 
  dentro de este layout.
*/
function RegisterPage() {
	return (
		<FormPageLayout
			title="Bienvenido/a"
			subtitle="Crea tu cuenta para empezar a explorar."
			switcherPrompt="¿Ya tienes una cuenta?"
			switcherLinkText="Inicia sesión"
			switcherLinkTo="/loginPage"
		>
			<RegisterForm />
		</FormPageLayout>
	);
}

export default RegisterPage;

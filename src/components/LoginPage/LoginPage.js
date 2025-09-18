import LoginForm from "../LoginForm";
import FormPageLayout from "../FormPageLayout/FormPageLayout";
import { ROUTES, LOGIN_PAGE_TEXT } from "../../constants";
import "bootstrap/dist/css/bootstrap.css";

// Componente que representa la página de inicio de sesión.
function LoginPage() {
	return (
		<FormPageLayout
			title={LOGIN_PAGE_TEXT.TITLE}
			subtitle={LOGIN_PAGE_TEXT.SUBTITLE}
			colWidth="3"
			switcherPrompt={LOGIN_PAGE_TEXT.SWITCHER_PROMPT}
			switcherLinkText={LOGIN_PAGE_TEXT.SWITCHER_LINK_TEXT}
			switcherLinkTo={ROUTES.REGISTER}
		>
			<LoginForm />
		</FormPageLayout>
	);
}

export default LoginPage;

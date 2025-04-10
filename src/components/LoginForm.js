// src/components/LoginForm.js (o donde prefieras)
import React, { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { validateMail, validatePassword } from "../validation/validations.js"; // Ajusta la ruta si es necesario
import ValidatedFormGroup from "./ValidatedFormGroup"; // Ajusta la ruta si es necesario
import { login } from "../slicers/loginSlice"; // Ajusta la ruta si es necesario
import { useDispatch } from "react-redux";
import { userLogin } from "../helpers/helpers.js"; // Ajusta la ruta si es necesario
import styles from "../css/Login.module.css"; // Mantén los estilos relevantes aquí o pásalos

// Recibe una prop 'onLoginSuccess' para notificar cuando el login es exitoso (útil para cerrar el modal)
export function LoginForm({ onLoginSuccess }) {
    const loginDispatch = useDispatch();
    const [disabled, setDisabled] = useState(true);
    const [mail, setMail] = useState("");
    const [password, setPassword] = useState("");

    const submit = async (e) => {
        e.preventDefault();
        try {
            const data = await userLogin(mail, password);
            loginDispatch(
                login({
                    user: data.user,
                    token: data.token,
                })
            );
            window.sessionStorage["token"] = data.token;

            // Notifica al componente padre que el login fue exitoso
            if (onLoginSuccess) {
                onLoginSuccess();
            }

        } catch (error) {
            alert(error); // Considera un manejo de errores más amigable
        }
    };

    useEffect(() => {
        if (validateMail(mail) && validatePassword(password)) {
            setDisabled(false);
        } else {
            setDisabled(true);
        }
    }, [mail, password]);

    return (
        // Usamos las clases de estilo originales si aplican al formulario en sí
        <Form id="loginForm" noValidate onSubmit={submit} className={styles.formText}>
            <ValidatedFormGroup
                id="formLoginModalEmail" // Cambia ID si es necesario para evitar duplicados
                name="Correo electrónico"
                inputType="email"
                inputToChange={setMail}
                validationFunction={validateMail}
                value={mail}
                message={false}
                autocomplete="email"
            />
            <ValidatedFormGroup
                id="formLoginModalPassword" // Cambia ID si es necesario
                inputType="password"
                name="Contraseña"
                inputToChange={setPassword}
                validationFunction={validatePassword}
                value={password}
                message={false}
                autocomplete="current-password"
            />
            <Button
                className={`${styles.sendBtn} mt-3`} // Mantén estilos del botón
                variant={disabled ? "secondary" : "success"}
                type="submit"
                disabled={disabled}
            >
                Enviar
            </Button>
        </Form>
    );
}

export default LoginForm;
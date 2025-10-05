import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import CustomButton from "./CustomButton";
import styles from "./CustomButton.module.css";

describe("CustomButton", () => {
	test("se renderiza correctamente con las props por defecto", () => {
		render(<CustomButton>Púlsame</CustomButton>);
		const button = screen.getByRole("button", { name: /púlsame/i });

		expect(button).toBeInTheDocument();
		expect(button).toHaveTextContent("Púlsame");
		expect(button).not.toBeDisabled();
		expect(button).toHaveClass(styles.customButton, styles.primary);
	});

	test("llama al manejador onClick cuando se hace clic", () => {
		const handleClick = jest.fn();
		render(<CustomButton onClick={handleClick}>Click</CustomButton>);

		const button = screen.getByRole("button", { name: /click/i });
		fireEvent.click(button);

		expect(handleClick).toHaveBeenCalledTimes(1);
	});

	test("está deshabilitado cuando la prop disabled es true", () => {
		const handleClick = jest.fn();
		render(
			<CustomButton disabled onClick={handleClick}>
				No se puede pulsar
			</CustomButton>
		);

		const button = screen.getByRole("button", { name: /no se puede pulsar/i });
		expect(button).toBeDisabled();

		fireEvent.click(button);
		expect(handleClick).not.toHaveBeenCalled();
	});

	test("muestra el spinner y está deshabilitado cuando isLoading es true", () => {
		const handleClick = jest.fn();
		render(
			<CustomButton isLoading onClick={handleClick}>
				Enviando
			</CustomButton>
		);

		const button = screen.getByRole("button", { name: /enviando/i });
		expect(button).toBeDisabled();
		expect(button).toHaveAttribute("aria-busy", "true");

		// Verifica que el spinner, el texto original y el texto accesible están presentes
		expect(screen.getByText("Cargando...")).toBeInTheDocument();
		// El texto original "Enviando" ahora debe estar visible junto al spinner.
		expect(screen.getByText("Enviando")).toBeInTheDocument();

		fireEvent.click(button);
		expect(handleClick).not.toHaveBeenCalled();
	});

	test("aplica la clase de la variante 'secondary'", () => {
		render(<CustomButton variant="secondary">Secundario</CustomButton>);
		const button = screen.getByRole("button", { name: /secundario/i });
		expect(button).toHaveClass(styles.secondary);
		expect(button).not.toHaveClass(styles.primary);
	});

	test("renderiza contenido de forma segura y previene ataques XSS", () => {
		// Este test valida que React escapa el contenido para prevenir XSS.
		const maliciousString = "<script>alert('XSS')</script>";
		render(<CustomButton>{maliciousString}</CustomButton>);

		const button = screen.getByRole("button");

		// El contenido debe estar en el botón, pero como texto plano, no como un script ejecutable.
		expect(button).toHaveTextContent(maliciousString);
		// Verificamos que no se ha creado una etiqueta <script> real en el DOM.
		expect(button.querySelector("script")).not.toBeInTheDocument();
	});
});

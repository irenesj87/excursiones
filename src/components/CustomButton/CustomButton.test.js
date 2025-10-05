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

		const button = screen.getByRole("button", { name: /cargando/i });
		expect(button).toBeDisabled();
		expect(button).toHaveAttribute("aria-busy", "true");

		// Verifica que el spinner y el texto accesible están presentes
		expect(screen.getByText("Cargando...")).toBeInTheDocument();
		// El texto original "Enviando" no debe estar visible
		expect(screen.queryByText("Enviando")).not.toBeInTheDocument();

		fireEvent.click(button);
		expect(handleClick).not.toHaveBeenCalled();
	});

	test("aplica la clase de la variante 'secondary'", () => {
		render(<CustomButton variant="secondary">Secundario</CustomButton>);
		const button = screen.getByRole("button", { name: /secundario/i });
		expect(button).toHaveClass(styles.secondary);
		expect(button).not.toHaveClass(styles.primary);
	});

	test("no renderiza children que no sean string o number por seguridad", () => {
		// Este test valida la mitigación de XSS
		// Se crea un elemento React complejo que no es un string o number.
		// La implementación de CustomButton debería filtrar esto por seguridad.
		const maliciousChild = (
			<span data-testid="malicious-content">
				{"<script>alert('XSS')</script>"}
			</span>
		);
		// @ts-ignore - Ignoramos el error de tipo intencionadamente para este test de seguridad,
		// ya que estamos probando que el componente rechaza un tipo de 'children' no permitido.
		render(<CustomButton>{maliciousChild}</CustomButton>);

		const button = screen.getByRole("button");
		expect(button.innerHTML).not.toContain("&lt;script&gt;");
		expect(button).toBeEmptyDOMElement();
	});
});

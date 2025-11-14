// NÃO importe React — Deno dará erro se React não for usado

import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Navigation } from "./Navigation.jsx";

Deno.test("Navigation renders correctly", () => {
  const screen = render(
    <MemoryRouter>
      <Navigation />
    </MemoryRouter>
  );

  // Exemplo simples de teste
  screen.getByText("Pioneira Auxiliar");
});

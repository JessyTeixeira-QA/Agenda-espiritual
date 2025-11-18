import _React from "https://esm.sh/react@18"; 

import { render, screen } from "https://esm.sh/@testing-library/react@14.2.2?deps=react@18,react-dom@18";
import { MemoryRouter } from "https://esm.sh/react-router-dom@6.23.1?deps=react@18,react-dom@18";
import Navigation from "./components/Navigation.jsx";

Deno.test("Navigation renders correctly", () => {
  render(
    <MemoryRouter>
      <Navigation />
    </MemoryRouter>
  );

  screen.getByText(/Pioneira Auxiliar/);
});

Deno.test("Navigation has correct links", () => {
  render(
    <MemoryRouter>
      <Navigation />
    </MemoryRouter>
  );

  const links = ["/", "/programacao", "/cartas", "/relatorios", "/configuracoes"];
  links.forEach((link) => {
    const element = screen.getByRole("link", { name: new RegExp(link, "i") });
    if (!element) throw new Error(`Link não encontrado: ${link}`);
  });
});

Deno.test("Navigation highlights active link", () => {
  render(
    <MemoryRouter initialEntries={["/programacao"]}>
      <Navigation />
    </MemoryRouter>
  );

  const activeLink = screen.getByRole("link", { name: "Programação" });
  if (!activeLink.className.includes("border-blue-500")) {
    throw new Error("Active link não recebeu classe esperada");
  }
});

Deno.test("Navigation icons are present", () => {
  render(
    <MemoryRouter>
      <Navigation />
    </MemoryRouter>
  );

  const icons = ["Home", "Calendar", "FileText", "BarChart3", "Settings"];
  icons.forEach((icon) => {
    const el = screen.getByTestId(`icon-${icon}`);
    if (!el) throw new Error(`Ícone não encontrado: icon-${icon}`);
  });
});

Deno.test("Navigation has correct number of links", () => {
  render(
    <MemoryRouter>
      <Navigation />
    </MemoryRouter>
  );

  const linkElements = screen.getAllByRole("link");
  if (linkElements.length !== 5)
    throw new Error(`Número incorreto de links: ${linkElements.length}`);
});

Deno.test("Navigation link labels are correct", () => {
  render(
    <MemoryRouter>
      <Navigation />
    </MemoryRouter>
  );

  const labels = ["Início", "Programação", "Cartas", "Relatórios", "Configurações"];
  labels.forEach((label) => {
    if (!screen.getByText(label)) throw new Error(`Label não encontrada: ${label}`);
  });
});

Deno.test("Navigation has proper structure", () => {
  render(
    <MemoryRouter>
      <Navigation />
    </MemoryRouter>
  );

  const navElement = screen.getByRole("navigation");
  if (!navElement) throw new Error("Elemento NAV não encontrado");

  screen.getByText("Pioneira Auxiliar");
});

Deno.test("Navigation links have correct classes", () => {
  render(
    <MemoryRouter>
      <Navigation />
    </MemoryRouter>
  );

  const links = screen.getAllByRole("link");
  links.forEach((link) => {
    if (!link.className.includes("inline-flex"))
      throw new Error("Classe base ausente em um link");
  });
});

Deno.test("Navigation responds to route changes", () => {
  const { rerender } = render(
    <MemoryRouter initialEntries={["/"]}>
      <Navigation />
    </MemoryRouter>
  );

  let activeLink = screen.getByRole("link", { name: "Início" });
  if (!activeLink.className.includes("border-blue-500"))
    throw new Error("Início deveria estar ativo");

  rerender(
    <MemoryRouter initialEntries={["/cartas"]}>
      <Navigation />
    </MemoryRouter>
  );

  activeLink = screen.getByRole("link", { name: "Cartas" });
  if (!activeLink.className.includes("border-blue-500"))
    throw new Error("Cartas deveria estar ativo");
});

Deno.test("Navigation renders without crashing", () => {
  render(
    <MemoryRouter>
      <Navigation />
    </MemoryRouter>
  );
});

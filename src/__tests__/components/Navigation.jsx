// /src/__tests__/components/Navigation.jsx

import { NavLink } from "react-router-dom"; // Importe NavLink

export default function Navigation() {
  const links = [
    { to: "/", label: "Início", icon: "Home" },
    { to: "/programacao", label: "Programação", icon: "Calendar" },
    { to: "/cartas", label: "Cartas", icon: "FileText" },
    { to: "/relatorios", label: "Relatórios", icon: "BarChart3" },
    { to: "/configuracoes", label: "Configurações", icon: "Settings" },
  ];

  return (
    <nav role="navigation">
      <span>Pioneira Auxiliar</span>
      
      {/* Container para os links */}
      <div className="flex justify-around"> 
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            // A função de className é necessária para o teste de highlight
            className={({ isActive }) => 
              `inline-flex flex-col items-center p-3 border-b-2 ${
                isActive ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500"
              }`
            }
          >
            {/* Elemento de Ícone (Substitua por um componente real de ícone) */}
            <span data-testid={`icon-${link.icon}`}>
              [Ícone {link.icon}] 
            </span>

            {/* Label do Link */}
            <span className="text-xs mt-1">{link.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
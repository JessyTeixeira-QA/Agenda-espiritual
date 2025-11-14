// Arquivo: App.jsx (ou onde a Navigation é definida)

import React from 'react';
// 1. IMPORTAÇÕES FALTANDO: Importe useLocation e os ícones
import { Link, useLocation } from 'react-router-dom';
import { Calendar, FileText, Home, Settings, BarChart3 } from 'lucide-react'; 
// Se 'lucide-react' não for o pacote de ícones, ajuste a importação dos ícones (ex: de react-icons)

export function Navigation() {
  // 2. CORREÇÃO DE HOOK: useLocation DEVE ser chamado no corpo do componente
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'Início' },
    { path: '/programacao', icon: Calendar, label: 'Programação' },
    { path: '/cartas', icon: FileText, label: 'Cartas' },
    { path: '/relatorios', icon: BarChart3, label: 'Relatórios' },
    { path: '/configuracoes', icon: Settings, label: 'Configurações' }
  ];

  return (
    <nav className="bg-white shadow-sm border-b">
      {/* 3. REMOVIDO: location já existe, a checagem é desnecessária aqui */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-900">Pioneira Auxiliar</h1>
          </div>
          <div className="flex space-x-8">
            {navItems.map(({ path, icon: Icon, label }) => {
              // 4. CORREÇÃO DE VALIDAÇÃO: Ícones e labels existem no navItems,
              // mas a validação de 'path' é mais importante.
              if (!path) {
                console.error("Invalid navigation item: Missing path");
                return null;
              }

              return (
                <Link
                  key={path}
                  to={path}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    location.pathname === path
                      ? 'border-blue-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
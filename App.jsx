import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import { Calendar, FileText, Home, Settings, BarChart3 } from 'lucide-react'
// import { useState } from 'react' // Removido: Não está sendo usado neste componente.
import { Button } from '@/components/ui/button.jsx'
import Dashboard from './components/Dashboard'
import Programacao from './components/Programacao'
import EditorCartas from './components/EditorCartas'
import Configuracoes from './components/Configuracoes'
import Relatorios from './components/Relatorios'
import './App.css'

function Navigation() {
  const location = useLocation()
  
  const navItems = [
    { path: '/', icon: Home, label: 'Início' },
    { path: '/programacao', icon: Calendar, label: 'Programação' },
    { path: '/cartas', icon: FileText, label: 'Cartas' },
    { path: '/relatorios', icon: BarChart3, label: 'Relatórios' },
    { path: '/configuracoes', icon: Settings, label: 'Configurações' }
  ]

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-900">Pioneira Auxiliar</h1>
          </div>
          <div className="flex space-x-8">
            {navItems.map(({ path, icon: Icon, label }) => (
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
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/programacao" element={<Programacao />} />
            <Route path="/cartas" element={<EditorCartas />} />
            <Route path="/relatorios" element={<Relatorios />} />
            <Route path="/configuracoes" element={<Configuracoes />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
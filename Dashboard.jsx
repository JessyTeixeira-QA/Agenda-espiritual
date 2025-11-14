import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Calendar, Clock, Users, BookOpen, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'

function Dashboard() {
  const navigate = useNavigate()
  const [proximasAtividades, setProximasAtividades] = useState([])
  const [estatisticas, setEstatisticas] = useState({
    horasPredicacao: 0,
    revisitas: 0,
    estudos: 0,
    publicacoes: 0
  })

  useEffect(() => {
    // Carregar dados do localStorage
    const atividades = JSON.parse(localStorage.getItem('atividades') || '[]')
    const hoje = new Date()
    
    // Filtrar próximas atividades (próximos 7 dias)
    const proximasSemana = atividades.filter(atividade => {
      const dataAtividade = new Date(atividade.data)
      const diffTime = dataAtividade - hoje
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      return diffDays >= 0 && diffDays <= 7
    }).sort((a, b) => new Date(a.data) - new Date(b.data))
    
    setProximasAtividades(proximasSemana.slice(0, 5))
    
    // Calcular estatísticas do mês atual baseadas em atividades concluídas
    const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1)
    const atividadesMes = atividades.filter(atividade => {
      const dataAtividade = new Date(atividade.data)
      return dataAtividade >= inicioMes && dataAtividade <= hoje && atividade.concluida
    })
    
    const stats = {
      horasPredicacao: Math.round(atividadesMes
        .filter(a => a.categoria === 'pregacao')
        .reduce((total, a) => total + (parseFloat(a.horas) || 0), 0) * 100) / 100,
      revisitas: atividadesMes.filter(a => a.categoria === 'revisita').length,
      estudos: atividadesMes.filter(a => a.categoria === 'estudo').length,
      publicacoes: atividadesMes
        .reduce((total, a) => total + (parseInt(a.publicacoes) || 0), 0)
    }
    
    setEstatisticas(stats)
  }, [])

  const formatarData = (data) => {
    const dataObj = new Date(data)
    const hoje = new Date()
    const amanha = new Date(hoje)
    amanha.setDate(hoje.getDate() + 1)
    
    if (dataObj.toDateString() === hoje.toDateString()) {
      return 'Hoje'
    } else if (dataObj.toDateString() === amanha.toDateString()) {
      return 'Amanhã'
    } else {
      return dataObj.toLocaleDateString('pt-PT', { 
        weekday: 'short', 
        day: 'numeric', 
        month: 'short' 
      })
    }
  }

  const handleNovaAtividade = () => {
    navigate('/programacao?nova=true')
  }

  const handleNovaCarta = () => {
    navigate('/cartas?nova=true')
  }

  const handleVerCalendario = () => {
    navigate('/programacao?view=calendario')
  }

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">Visão geral das suas atividades e progresso</p>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Horas de Pregação</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estatisticas.horasPredicacao.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">Este mês (concluídas)</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revisitas</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estatisticas.revisitas}</div>
            <p className="text-xs text-muted-foreground">Este mês (concluídas)</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estudos Bíblicos</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estatisticas.estudos}</div>
            <p className="text-xs text-muted-foreground">Este mês (concluídas)</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Publicações</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estatisticas.publicacoes}</div>
            <p className="text-xs text-muted-foreground">Este mês (concluídas)</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Próximas Atividades */}
        <Card>
          <CardHeader>
            <CardTitle>Próximas Atividades</CardTitle>
            <CardDescription>Suas atividades para os próximos dias</CardDescription>
          </CardHeader>
          <CardContent>
            {proximasAtividades.length > 0 ? (
              <div className="space-y-4">
                {proximasAtividades.map((atividade) => (
                  <div key={atividade.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium">{atividade.titulo}</h4>
                      <p className="text-sm text-gray-600">
                        {formatarData(atividade.data)} às {atividade.horaInicio}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                        {atividade.categoria}
                      </span>
                      {atividade.concluida && (
                        <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                          ✓ Concluída
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">Nenhuma atividade programada</p>
            )}
          </CardContent>
        </Card>

        {/* Acesso Rápido */}
        <Card>
          <CardHeader>
            <CardTitle>Acesso Rápido</CardTitle>
            <CardDescription>Ações frequentes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={handleNovaAtividade}
              >
                <Plus className="mr-2 h-4 w-4" />
                Nova Atividade
              </Button>
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={handleNovaCarta}
              >
                <Plus className="mr-2 h-4 w-4" />
                Nova Carta
              </Button>
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={handleVerCalendario}
              >
                <Calendar className="mr-2 h-4 w-4" />
                Ver Calendário
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Dashboard


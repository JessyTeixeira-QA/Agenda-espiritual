import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, List, Grid } from 'lucide-react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'

function CalendarioView({ atividades, onAtividadeClick }) {
  const [dataAtual, setDataAtual] = useState(new Date())
  const [visualizacao, setVisualizacao] = useState('mes')

  const meses = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ]

  const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

  const navegarMes = (direcao) => {
    const novaData = new Date(dataAtual)
    novaData.setMonth(dataAtual.getMonth() + direcao)
    setDataAtual(novaData)
  }

  const navegarSemana = (direcao) => {
    const novaData = new Date(dataAtual)
    novaData.setDate(dataAtual.getDate() + (direcao * 7))
    setDataAtual(novaData)
  }

  const navegarDia = (direcao) => {
    const novaData = new Date(dataAtual)
    novaData.setDate(dataAtual.getDate() + direcao)
    setDataAtual(novaData)
  }

  const obterAtividadesDoDia = (data) => {
    const dataStr = data.toISOString().split('T')[0]
    return atividades.filter(atividade => atividade.data === dataStr)
  }

  const obterDiasDoMes = () => {
    const ano = dataAtual.getFullYear()
    const mes = dataAtual.getMonth()
    
    const primeiroDia = new Date(ano, mes, 1)
    const ultimoDia = new Date(ano, mes + 1, 0)
    const diasAntes = primeiroDia.getDay()
    
    const dias = []
    
    // Dias do mês anterior
    for (let i = diasAntes - 1; i >= 0; i--) {
      const data = new Date(ano, mes, -i)
      dias.push({ data, outroMes: true })
    }
    
    // Dias do mês atual
    for (let dia = 1; dia <= ultimoDia.getDate(); dia++) {
      const data = new Date(ano, mes, dia)
      dias.push({ data, outroMes: false })
    }
    
    // Dias do próximo mês para completar a grade
    const diasRestantes = 42 - dias.length
    for (let dia = 1; dia <= diasRestantes; dia++) {
      const data = new Date(ano, mes + 1, dia)
      dias.push({ data, outroMes: true })
    }
    
    return dias
  }

  const obterSemanaAtual = () => {
    const inicioSemana = new Date(dataAtual)
    inicioSemana.setDate(dataAtual.getDate() - dataAtual.getDay())
    
    const dias = []
    for (let i = 0; i < 7; i++) {
      const data = new Date(inicioSemana)
      data.setDate(inicioSemana.getDate() + i)
      dias.push(data)
    }
    
    return dias
  }

  const renderizarVisualizacaoMes = () => {
    const dias = obterDiasDoMes()
    
    return (
      <div className="grid grid-cols-7 gap-1">
        {diasSemana.map(dia => (
          <div key={dia} className="p-2 text-center font-medium text-gray-500 text-sm">
            {dia}
          </div>
        ))}
        {dias.map((item, index) => {
          const atividadesDoDia = obterAtividadesDoDia(item.data)
          const isHoje = item.data.toDateString() === new Date().toDateString()
          
          return (
            <div
              key={index}
              className={`min-h-[80px] p-1 border border-gray-200 ${
                item.outroMes ? 'bg-gray-50 text-gray-400' : 'bg-white'
              } ${isHoje ? 'bg-blue-50 border-blue-300' : ''}`}
            >
              <div className={`text-sm font-medium ${isHoje ? 'text-blue-600' : ''}`}>
                {item.data.getDate()}
              </div>
              <div className="space-y-1 mt-1">
                {atividadesDoDia.slice(0, 2).map(atividade => (
                  <div
                    key={atividade.id}
                    className={`text-xs p-1 rounded cursor-pointer truncate ${
                      atividade.concluida 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}
                    onClick={() => onAtividadeClick && onAtividadeClick(atividade)}
                    title={atividade.titulo}
                  >
                    {atividade.titulo}
                  </div>
                ))}
                {atividadesDoDia.length > 2 && (
                  <div className="text-xs text-gray-500">
                    +{atividadesDoDia.length - 2} mais
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  const renderizarVisualizacaoSemana = () => {
    const diasSemana = obterSemanaAtual()

    
    return (
      <div className="grid grid-cols-7 gap-2">
        {diasSemana.map((data, index) => {
          const atividadesDoDia = obterAtividadesDoDia(data)
          const isHoje = data.toDateString() === new Date().toDateString()
          
          return (
            <div key={index} className="border border-gray-200 rounded-lg">
              <div className={`p-2 text-center border-b ${isHoje ? 'bg-blue-50 text-blue-600' : 'bg-gray-50'}`}>
                <div className="text-xs text-gray-500">
                  {data.toLocaleDateString('pt-PT', { weekday: 'short' })}
                </div>
                <div className="font-medium">
                  {data.getDate()}
                </div>
              </div>
              <div className="p-2 space-y-2 min-h-[200px]">
                {atividadesDoDia.map(atividade => (
                  <div
                    key={atividade.id}
                    className={`text-xs p-2 rounded cursor-pointer ${
                      atividade.concluida 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}
                    onClick={() => onAtividadeClick && onAtividadeClick(atividade)}
                  >
                    <div className="font-medium">{atividade.horaInicio}</div>
                    <div className="truncate">{atividade.titulo}</div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  const renderizarVisualizacaoDia = () => {
    const atividadesDoDia = obterAtividadesDoDia(dataAtual)
    
    return (
      <div className="space-y-4">
        <div className="text-center">
          <h3 className="text-lg font-medium">
            {dataAtual.toLocaleDateString('pt-PT', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </h3>
        </div>
        
        <div className="space-y-2">
          {atividadesDoDia.length > 0 ? (
            atividadesDoDia.map(atividade => (
              <Card 
                key={atividade.id} 
                className={`cursor-pointer hover:shadow-md transition-shadow ${
                  atividade.concluida ? 'border-green-200 bg-green-50' : ''
                }`}
                onClick={() => onAtividadeClick && onAtividadeClick(atividade)}
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-base">{atividade.titulo}</CardTitle>
                    {atividade.concluida && (
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                        ✓ Concluída
                      </span>
                    )}
                  </div>
                  <CardDescription>
                    {atividade.horaInicio}
                    {atividade.horaFim && ` - ${atividade.horaFim}`}
                  </CardDescription>
                </CardHeader>
                {atividade.descricao && (
                  <CardContent>
                    <p className="text-sm text-gray-600">{atividade.descricao}</p>
                  </CardContent>
                )}
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma atividade</h3>
                <p className="mt-1 text-sm text-gray-500">Não há atividades programadas para este dia.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    )
  }

  const obterTituloNavegacao = () => {
    switch (visualizacao) {
      case 'dia':
        return dataAtual.toLocaleDateString('pt-PT', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })
      case 'semana':
        const inicioSemana = new Date(dataAtual)
        inicioSemana.setDate(dataAtual.getDate() - dataAtual.getDay())
        const fimSemana = new Date(inicioSemana)
        fimSemana.setDate(inicioSemana.getDate() + 6)
        
        return `${inicioSemana.getDate()} - ${fimSemana.getDate()} de ${meses[dataAtual.getMonth()]} ${dataAtual.getFullYear()}`
      case 'mes':
      default:
        return `${meses[dataAtual.getMonth()]} ${dataAtual.getFullYear()}`
    }
  }

  const navegarData = (direcao) => {
    switch (visualizacao) {
      case 'dia':
        navegarDia(direcao)
        break
      case 'semana':
        navegarSemana(direcao)
        break
      case 'mes':
      default:
        navegarMes(direcao)
        break
    }
  }

  return (
    <div className="space-y-6">
      {/* Controles de Navegação */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" onClick={() => navegarData(-1)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-xl font-semibold min-w-[250px] text-center">
            {obterTituloNavegacao()}
          </h2>
          <Button variant="outline" size="sm" onClick={() => navegarData(1)}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex space-x-2">
          <Button
            variant={visualizacao === 'dia' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setVisualizacao('dia')}
          >
            Dia
          </Button>
          <Button
            variant={visualizacao === 'semana' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setVisualizacao("semana")}
          >
            Semana
          </Button>
          <Button
            variant={visualizacao === 'mes' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setVisualizacao("mes")}
          >
            Mês
          </Button>
        </div>
      </div>

      {/* Visualização do Calendário */}
      <Card>
        <CardContent className="p-6">
          {visualizacao === 'mes' && renderizarVisualizacaoMes()}
          {visualizacao === 'semana' && renderizarVisualizacaoSemana()}
          {visualizacao === 'dia' && renderizarVisualizacaoDia()}
        </CardContent>
      </Card>
    </div>
  )
}

export default CalendarioView


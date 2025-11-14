import { useState, useEffect } from 'react'
import { Download, Calendar, Clock, Users, BookOpen, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'

function Relatorios() {
  const [atividades, setAtividades] = useState([])
  const [mesAno, setMesAno] = useState('')
  const [relatorioMensal, setRelatorioMensal] = useState(null)

  useEffect(() => {
    const atividadesSalvas = JSON.parse(localStorage.getItem('atividades') || '[]')
    setAtividades(atividadesSalvas)
    
    // Definir mês atual como padrão
    const hoje = new Date()
    const mesAtualStr = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}`
    setMesAno(mesAtualStr)
  }, [])

  useEffect(() => {
    if (mesAno && atividades.length > 0) {
      gerarRelatorioMensal(mesAno)
    }
  }, [mesAno, atividades])

  const gerarRelatorioMensal = (mesAnoStr) => {
    const [ano, mes] = mesAnoStr.split('-').map(Number)
    const inicioMes = new Date(ano, mes - 1, 1)
    const fimMes = new Date(ano, mes, 0)

    const atividadesMes = atividades.filter(atividade => {
      const dataAtividade = new Date(atividade.data)
      return dataAtividade >= inicioMes && dataAtividade <= fimMes && atividade.concluida
    })

    const relatorio = {
      mes: inicioMes.toLocaleDateString('pt-PT', { month: 'long', year: 'numeric' }),
      totalAtividades: atividadesMes.length,
      horasPredicacao: atividadesMes
        .filter(a => a.categoria === 'pregacao')
        .reduce((total, a) => total + (a.horas || 0), 0),
      revisitas: atividadesMes.filter(a => a.categoria === 'revisita').length,
      estudosBiblicos: atividadesMes.filter(a => a.categoria === 'estudo').length,
      publicacoes: atividadesMes.reduce((total, a) => total + (a.publicacoes || 0), 0),
      reunioes: atividadesMes.filter(a => a.categoria === 'reuniao').length,
      assembleias: atividadesMes.filter(a => a.categoria === 'assembleia').length,
      congressos: atividadesMes.filter(a => a.categoria === 'congresso').length,
      outras: atividadesMes.filter(a => a.categoria === 'outro').length,
      atividades: atividadesMes.sort((a, b) => new Date(a.data) - new Date(b.data))
    }

    setRelatorioMensal(relatorio)
  }

  const obterMesesDisponiveis = () => {
    const meses = new Set()
    atividades.forEach(atividade => {
      const data = new Date(atividade.data)
      const mesAno = `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, '0')}`
      meses.add(mesAno)
    })
    
    // Adicionar mês atual se não existir
    const hoje = new Date()
    const mesAtual = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}`
    meses.add(mesAtual)
    
    return Array.from(meses).sort().reverse()
  }

  const exportarRelatorio = () => {
    if (!relatorioMensal) return

    const conteudo = `
RELATÓRIO DE ATIVIDADES - ${relatorioMensal.mes.toUpperCase()}

═══════════════════════════════════════════════════════════════

RESUMO GERAL:
• Total de Atividades Concluídas: ${relatorioMensal.totalAtividades}
• Horas de Pregação: ${relatorioMensal.horasPredicacao}
• Revisitas: ${relatorioMensal.revisitas}
• Estudos Bíblicos: ${relatorioMensal.estudosBiblicos}
• Publicações Distribuídas: ${relatorioMensal.publicacoes}

DETALHAMENTO POR CATEGORIA:
• Reuniões: ${relatorioMensal.reunioes}
• Pregação: ${relatorioMensal.atividades.filter(a => a.categoria === 'pregacao').length}
• Revisitas: ${relatorioMensal.revisitas}
• Estudos Bíblicos: ${relatorioMensal.estudosBiblicos}
• Assembleias: ${relatorioMensal.assembleias}
• Congressos: ${relatorioMensal.congressos}
• Outras Atividades: ${relatorioMensal.outras}

═══════════════════════════════════════════════════════════════

ATIVIDADES REALIZADAS:

${relatorioMensal.atividades.map(atividade => {
  const data = new Date(atividade.data).toLocaleDateString('pt-PT')
  let detalhes = `${data} - ${atividade.titulo} (${atividade.categoria})`
  
  if (atividade.horaInicio) {
    detalhes += ` às ${atividade.horaInicio}`
  }
  
  if (atividade.horas > 0) {
    detalhes += ` - ${atividade.horas}h`
  }
  
  if (atividade.publicacoes > 0) {
    detalhes += ` - ${atividade.publicacoes} pub.`
  }
  
  if (atividade.descricao) {
    detalhes += `\n  Descrição: ${atividade.descricao}`
  }
  
  return detalhes
}).join('\n\n')}

═══════════════════════════════════════════════════════════════

Relatório gerado em: ${new Date().toLocaleString('pt-PT')}
Sistema: Pioneira Auxiliar
    `.trim()

    const blob = new Blob([conteudo], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `relatorio-${mesAno}.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const formatarMesAno = (mesAnoStr) => {
    const [ano, mes] = mesAnoStr.split('-').map(Number)
    const data = new Date(ano, mes - 1, 1)
    return data.toLocaleDateString('pt-PT', { month: 'long', year: 'numeric' })
  }

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Relatórios</h1>
          <p className="mt-2 text-gray-600">Visualize e exporte seus relatórios mensais</p>
        </div>
        {relatorioMensal && (
          <Button onClick={exportarRelatorio}>
            <Download className="mr-2 h-4 w-4" />
            Exportar Relatório
          </Button>
        )}
      </div>

      {/* Seletor de Mês */}
      <div className="mb-6">
        <Select value={mesAno} onValueChange={setMesAno}>
          <SelectTrigger className="w-64">
            <SelectValue placeholder="Selecione o mês" />
          </SelectTrigger>
          <SelectContent>
            {obterMesesDisponiveis().map(mesAnoStr => (
              <SelectItem key={mesAnoStr} value={mesAnoStr}>
                {formatarMesAno(mesAnoStr)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {relatorioMensal ? (
        <div className="space-y-6">
          {/* Resumo Geral */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Resumo de {relatorioMensal.mes}
              </CardTitle>
              <CardDescription>
                Estatísticas das atividades concluídas no período
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">{relatorioMensal.horasPredicacao}</div>
                  <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
                    <Clock className="h-4 w-4" />
                    Horas de Pregação
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">{relatorioMensal.revisitas}</div>
                  <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
                    <Users className="h-4 w-4" />
                    Revisitas
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">{relatorioMensal.estudosBiblicos}</div>
                  <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
                    <BookOpen className="h-4 w-4" />
                    Estudos Bíblicos
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600">{relatorioMensal.publicacoes}</div>
                  <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
                    <BookOpen className="h-4 w-4" />
                    Publicações
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detalhamento por Categoria */}
          <Card>
            <CardHeader>
              <CardTitle>Detalhamento por Categoria</CardTitle>
              <CardDescription>
                Número de atividades concluídas por tipo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{relatorioMensal.reunioes}</div>
                  <div className="text-sm text-blue-800">Reuniões</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {relatorioMensal.atividades.filter(a => a.categoria === 'pregacao').length}
                  </div>
                  <div className="text-sm text-green-800">Pregação</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{relatorioMensal.assembleias}</div>
                  <div className="text-sm text-purple-800">Assembleias</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">{relatorioMensal.congressos}</div>
                  <div className="text-sm text-orange-800">Congressos</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Lista de Atividades */}
          <Card>
            <CardHeader>
              <CardTitle>Atividades Realizadas</CardTitle>
              <CardDescription>
                Lista detalhada de todas as atividades concluídas no período
              </CardDescription>
            </CardHeader>
            <CardContent>
              {relatorioMensal.atividades.length > 0 ? (
                <div className="space-y-3">
                  {relatorioMensal.atividades.map(atividade => (
                    <div key={atividade.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium">{atividade.titulo}</h4>
                        <p className="text-sm text-gray-600">
                          {new Date(atividade.data).toLocaleDateString('pt-PT')}
                          {atividade.horaInicio && ` às ${atividade.horaInicio}`}
                        </p>
                        {atividade.descricao && (
                          <p className="text-sm text-gray-500 mt-1">{atividade.descricao}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                          {atividade.categoria}
                        </span>
                        {atividade.horas > 0 && (
                          <div className="text-sm text-gray-600 mt-1">{atividade.horas}h</div>
                        )}
                        {atividade.publicacoes > 0 && (
                          <div className="text-sm text-gray-600">{atividade.publicacoes} pub.</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  Nenhuma atividade concluída neste período
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <Calendar className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Selecione um mês</h3>
            <p className="mt-1 text-sm text-gray-500">
              Escolha um mês para visualizar o relatório de atividades.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default Relatorios


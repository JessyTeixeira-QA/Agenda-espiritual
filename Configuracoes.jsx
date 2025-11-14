import { useState } from 'react'
import { Download, Trash2, Save } from 'lucide-react' // 'Upload' foi removido, pois não era usado diretamente como componente
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'

function Configuracoes() {
  const [configuracoes, setConfiguracoes] = useState(() => {
    const configSalvas = localStorage.getItem('configuracoes')
    return configSalvas ? JSON.parse(configSalvas) : {
      nomeUsuario: '',
      telefone: '',
      congregacao: '',
      enderecoSalao: '',
      assinaturaPadrao: ''
    }
  })

  const salvarConfiguracoes = () => {
    localStorage.setItem('configuracoes', JSON.stringify(configuracoes))
    alert('Configurações salvas com sucesso!')
  }

  const exportarDados = () => {
    const dados = {
      atividades: JSON.parse(localStorage.getItem('atividades') || '[]'),
      cartas: JSON.parse(localStorage.getItem('cartas') || '[]'),
      configuracoes: JSON.parse(localStorage.getItem('configuracoes') || '{}')
    }

    const dataStr = JSON.stringify(dados, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    
    const link = document.createElement('a')
    link.href = url
    link.download = `pioneira-auxiliar-backup-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const importarDados = (event) => {
    const file = event.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const dados = JSON.parse(e.target.result)
        
        if (dados.atividades) {
          localStorage.setItem('atividades', JSON.stringify(dados.atividades))
        }
        if (dados.cartas) {
          localStorage.setItem('cartas', JSON.stringify(dados.cartas))
        }
        if (dados.configuracoes) {
          localStorage.setItem('configuracoes', JSON.stringify(dados.configuracoes))
          setConfiguracoes(dados.configuracoes)
        }
        
        alert('Dados importados com sucesso! Recarregue a página para ver as alterações.')
      } catch (_error) {
        alert('Erro ao importar dados. Verifique se o arquivo está correto.')
      }
    }
    reader.readAsText(file)
  }

  const limparTodosDados = () => {
    if (confirm('Tem certeza que deseja apagar todos os dados? Esta ação não pode ser desfeita.')) {
      localStorage.removeItem('atividades')
      localStorage.removeItem('cartas')
      localStorage.removeItem('configuracoes')
      setConfiguracoes({
        nomeUsuario: '',
        telefone: '',
        congregacao: '',
        enderecoSalao: '',
        assinaturaPadrao: ''
      })
      alert('Todos os dados foram apagados.')
    }
  }

  const estatisticas = () => {
    const atividades = JSON.parse(localStorage.getItem('atividades') || '[]')
    const cartas = JSON.parse(localStorage.getItem('cartas') || '[]')
    
    return {
      totalAtividades: atividades.length,
      totalCartas: cartas.length,
      horasTotais: atividades.reduce((total, a) => total + (a.horas || 0), 0),
      publicacoesTotais: atividades.reduce((total, a) => total + (a.publicacoes || 0), 0)
    }
  }

  const stats = estatisticas()

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Configurações</h1>
        <p className="mt-2 text-gray-600">Gerencie suas preferências e dados</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Informações Pessoais */}
        <Card>
          <CardHeader>
            <CardTitle>Informações Pessoais</CardTitle>
            <CardDescription>Configure suas informações básicas</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="nomeUsuario">Nome</Label>
              <Input
                id="nomeUsuario"
                value={configuracoes.nomeUsuario}
                onChange={(e) => setConfiguracoes({...configuracoes, nomeUsuario: e.target.value})}
                placeholder="Seu nome completo"
              />
            </div>
            <div>
              <Label htmlFor="telefone">Telefone</Label>
              <Input
                id="telefone"
                value={configuracoes.telefone}
                onChange={(e) => setConfiguracoes({...configuracoes, telefone: e.target.value})}
                placeholder="Seu número de telefone"
              />
            </div>
            <div>
              <Label htmlFor="congregacao">Congregação</Label>
              <Input
                id="congregacao"
                value={configuracoes.congregacao}
                onChange={(e) => setConfiguracoes({...configuracoes, congregacao: e.target.value})}
                placeholder="Nome da sua congregação"
              />
            </div>
            <div>
              <Label htmlFor="enderecoSalao">Endereço do Salão do Reino</Label>
              <Textarea
                id="enderecoSalao"
                value={configuracoes.enderecoSalao}
                onChange={(e) => setConfiguracoes({...configuracoes, enderecoSalao: e.target.value})}
                placeholder="Endereço completo do Salão do Reino"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="assinaturaPadrao">Assinatura Padrão para Cartas</Label>
              <Textarea
                id="assinaturaPadrao"
                value={configuracoes.assinaturaPadrao}
                onChange={(e) => setConfiguracoes({...configuracoes, assinaturaPadrao: e.target.value})}
                placeholder="Sua assinatura padrão para as cartas"
                rows={4}
              />
            </div>
            <Button onClick={salvarConfiguracoes} className="w-full">
              <Save className="mr-2 h-4 w-4" />
              Salvar Configurações
            </Button>
          </CardContent>
        </Card>

        {/* Gestão de Dados */}
        <div className="space-y-6">
          {/* Estatísticas */}
          <Card>
            <CardHeader>
              <CardTitle>Estatísticas</CardTitle>
              <CardDescription>Resumo dos seus dados</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{stats.totalAtividades}</div>
                  <div className="text-sm text-gray-600">Atividades</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{stats.totalCartas}</div>
                  <div className="text-sm text-gray-600">Cartas</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{stats.horasTotais}</div>
                  <div className="text-sm text-gray-600">Horas Totais</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{stats.publicacoesTotais}</div>
                  <div className="text-sm text-gray-600">Publicações</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Backup e Restauração */}
          <Card>
            <CardHeader>
              <CardTitle>Backup e Restauração</CardTitle>
              <CardDescription>Faça backup ou restaure seus dados</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={exportarDados} className="w-full" variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Exportar Dados (Backup)
              </Button>
              
              <div>
                <Label htmlFor="importFile">Importar Dados</Label>
                <Input
                  id="importFile"
                  type="file"
                  accept=".json"
                  onChange={importarDados}
                  className="mt-1"
                />
              </div>
              
              <Button 
                onClick={limparTodosDados} 
                variant="destructive" 
                className="w-full"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Apagar Todos os Dados
              </Button>
            </CardContent>
          </Card>

          {/* Informações do App */}
          <Card>
            <CardHeader>
              <CardTitle>Sobre o App</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-gray-600">
                <p><strong>Versão:</strong> 1.0.0</p>
                <p><strong>Desenvolvido para:</strong> Pioneiras Auxiliares</p>
                <p><strong>Funcionalidades:</strong></p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Programação de atividades</li>
                  <li>Editor de cartas para pregação</li>
                  <li>Estatísticas de serviço</li>
                  <li>Backup e restauração de dados</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Configuracoes
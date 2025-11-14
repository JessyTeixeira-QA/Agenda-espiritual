import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Plus, Edit, Trash2, Calendar as CalendarIcon, CheckCircle, Circle, List, Grid } from 'lucide-react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog.jsx'
import CalendarioView from './CalendarioView'

function Programacao() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [atividades, setAtividades] = useState([])
  const [dialogAberto, setDialogAberto] = useState(false)
  const [atividadeEditando, setAtividadeEditando] = useState(null)
  const [filtroCategoria, setFiltroCategoria] = useState('todas')
  const [visualizacao, setVisualizacao] = useState("lista") // 'lista' ou 'calendario'
  
  const [formData, setFormData] = useState({
    titulo: '',
    data: '',
    horaInicio: '',
    horaFim: '',
    categoria: '',
    descricao: '',
    horas: 0,
    publicacoes: 0,
    concluida: false,
    recorrente: false,
    tipoRecorrencia: 'semanal',
    quantidadeRecorrencia: 4 // Número de semanas
  })

  const categorias = [
    { value: 'reuniao', label: 'Reunião' },
    { value: 'pregacao', label: 'Pregação' },
    { value: 'revisita', label: 'Revisita' },
    { value: 'estudo', label: 'Estudo Bíblico' },
    { value: 'assembleia', label: 'Assembleia' },
    { value: 'congresso', label: 'Congresso' },
    { value: 'outro', label: 'Outro' }
  ]

  useEffect(() => {
    const atividadesSalvas = JSON.parse(localStorage.getItem('atividades') || '[]')
    setAtividades(atividadesSalvas)

    // Verificar parâmetros da URL
    if (searchParams.get('nova') === 'true') {
      abrirDialog()
      setSearchParams({}) // Limpar parâmetro
    }
    if (searchParams.get('view') === 'calendario') {
      setVisualizacao('calendario')
      setSearchParams({}) // Limpar parâmetro
    }
  }, [searchParams, setSearchParams])

  const salvarAtividades = (novasAtividades) => {
    localStorage.setItem('atividades', JSON.stringify(novasAtividades))
    setAtividades(novasAtividades)
  }

  const abrirDialog = (atividade = null) => {
    if (atividade) {
      setAtividadeEditando(atividade)
      setFormData(atividade)
    } else {
      setAtividadeEditando(null)
      setFormData({
        titulo: '',
        data: '',
        horaInicio: '',
        horaFim: '',
        categoria: '',
        descricao: '',
        horas: 0,
        publicacoes: 0,
        concluida: false,
        recorrente: false,
        tipoRecorrencia: 'semanal',
        quantidadeRecorrencia: 4
      })
    }
    setDialogAberto(true)
  }

  const fecharDialog = () => {
    setDialogAberto(false)
    setAtividadeEditando(null)
  }

  const salvarAtividade = () => {
    if (!formData.titulo || !formData.data || !formData.categoria) {
      alert('Por favor, preencha os campos obrigatórios')
      return
    }

    if (formData.recorrente && formData.tipoRecorrencia === 'semanal') {
      // Gerar atividades semanais recorrentes
      const atividadesRecorrentes = []
      const dataInicial = new Date(formData.data)
      
      for (let i = 0; i < formData.quantidadeRecorrencia; i++) {
        const dataAtividade = new Date(dataInicial)
        dataAtividade.setDate(dataInicial.getDate() + (i * 7))
        
        const atividadeRecorrente = {
          ...formData,
          id: Date.now() + i,
          data: dataAtividade.toISOString().split('T')[0],
          horas: parseFloat(formData.horas) || 0,
          publicacoes: parseInt(formData.publicacoes) || 0,
          concluida: false,
          serieRecorrente: Date.now(), // ID para identificar a série
          numeroSemana: i + 1
        }
        
        atividadesRecorrentes.push(atividadeRecorrente)
      }
      
      const novasAtividades = [...atividades, ...atividadesRecorrentes]
      salvarAtividades(novasAtividades)
    } else {
      // Atividade única
      const novaAtividade = {
        ...formData,
        id: atividadeEditando ? atividadeEditando.id : Date.now(),
        horas: parseFloat(formData.horas) || 0,
        publicacoes: parseInt(formData.publicacoes) || 0
      }

      let novasAtividades
      if (atividadeEditando) {
        novasAtividades = atividades.map(a => a.id === atividadeEditando.id ? novaAtividade : a)
      } else {
        novasAtividades = [...atividades, novaAtividade]
      }

      salvarAtividades(novasAtividades)
    }

    fecharDialog()
  }

  const excluirAtividade = (id) => {
    if (confirm('Tem certeza que deseja excluir esta atividade?')) {
      const novasAtividades = atividades.filter(a => a.id !== id)
      salvarAtividades(novasAtividades)
    }
  }

  const alternarConclusao = (id) => {
    const novasAtividades = atividades.map(atividade => 
      atividade.id === id 
        ? { ...atividade, concluida: !atividade.concluida }
        : atividade
    )
    salvarAtividades(novasAtividades)
  }

  const atividadesFiltradas = atividades.filter(atividade => 
    filtroCategoria === 'todas' || atividade.categoria === filtroCategoria
  ).sort((a, b) => new Date(b.data) - new Date(a.data))

  const formatarData = (data) => {
    return new Date(data).toLocaleDateString('pt-PT', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const renderizarListaAtividades = () => (
    <div className="space-y-4">
      {atividadesFiltradas.length > 0 ? (
        atividadesFiltradas.map((atividade) => (
          <Card key={atividade.id} className={atividade.concluida ? 'border-green-200 bg-green-50' : ''}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex items-start gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => alternarConclusao(atividade.id)}
                    className="mt-1"
                  >
                    {atividade.concluida ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <Circle className="h-5 w-5 text-gray-400" />
                    )}
                  </Button>
                  <div>
                    <CardTitle className={`flex items-center gap-2 ${atividade.concluida ? 'line-through text-gray-500' : ''}`}>
                      <CalendarIcon className="h-5 w-5" />
                      {atividade.titulo}
                      {atividade.serieRecorrente && (
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          Semana {atividade.numeroSemana}
                        </span>
                      )}
                    </CardTitle>
                    <CardDescription>
                      {formatarData(atividade.data)} • {atividade.horaInicio}
                      {atividade.horaFim && ` - ${atividade.horaFim}`}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => abrirDialog(atividade)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => excluirAtividade(atividade.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                    {categorias.find(c => c.value === atividade.categoria)?.label}
                  </span>
                  {atividade.concluida && (
                    <span className="ml-2 px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                      ✓ Concluída
                    </span>
                  )}
                  {atividade.descricao && (
                    <p className="mt-2 text-sm text-gray-600">{atividade.descricao}</p>
                  )}
                </div>
                {(atividade.categoria === 'pregacao' || atividade.categoria === 'revisita') && atividade.concluida && (
                  <div className="text-right text-sm text-gray-600">
                    {atividade.horas > 0 && <div>Horas: {atividade.horas}</div>}
                    {atividade.publicacoes > 0 && <div>Publicações: {atividade.publicacoes}</div>}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <Card>
          <CardContent className="text-center py-8">
            <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma atividade</h3>
            <p className="mt-1 text-sm text-gray-500">Comece criando uma nova atividade.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Programação</h1>
          <p className="mt-2 text-gray-600">Gerencie suas atividades e compromissos</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={visualizacao === 'lista' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setVisualizacao('lista')}
          >
            <List className="mr-2 h-4 w-4" />
            Lista
          </Button>
          <Button
            variant={visualizacao === 'calendario' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setVisualizacao('calendario')}
          >
            <Grid className="mr-2 h-4 w-4" />
            Calendário
          </Button>
          <Dialog open={dialogAberto} onOpenChange={setDialogAberto}>
            <DialogTrigger asChild>
              <Button onClick={() => abrirDialog()}>
                <Plus className="mr-2 h-4 w-4" />
                Nova Atividade
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>
                  {atividadeEditando ? 'Editar Atividade' : 'Nova Atividade'}
                </DialogTitle>
                <DialogDescription>
                  Preencha os detalhes da atividade
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="titulo" className="text-right">Título</Label>
                  <Input
                    id="titulo"
                    value={formData.titulo}
                    onChange={(e) => setFormData({...formData, titulo: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="categoria" className="text-right">Categoria</Label>
                  <Select value={formData.categoria} onValueChange={(value) => setFormData({...formData, categoria: value})}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {categorias.map(cat => (
                        <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="data" className="text-right">Data</Label>
                  <Input
                    id="data"
                    type="date"
                    value={formData.data}
                    onChange={(e) => setFormData({...formData, data: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="horaInicio" className="text-right">Hora Início</Label>
                  <Input
                    id="horaInicio"
                    type="time"
                    value={formData.horaInicio}
                    onChange={(e) => setFormData({...formData, horaInicio: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="horaFim" className="text-right">Hora Fim</Label>
                  <Input
                    id="horaFim"
                    type="time"
                    value={formData.horaFim}
                    onChange={(e) => setFormData({...formData, horaFim: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                {(formData.categoria === 'pregacao' || formData.categoria === 'revisita') && (
                  <>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="horas" className="text-right">Horas</Label>
                      <Input
                        id="horas"
                        type="number"
                        step="0.5"
                        value={formData.horas}
                        onChange={(e) => setFormData({...formData, horas: e.target.value})}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="publicacoes" className="text-right">Publicações</Label>
                      <Input
                        id="publicacoes"
                        type="number"
                        value={formData.publicacoes}
                        onChange={(e) => setFormData({...formData, publicacoes: e.target.value})}
                        className="col-span-3"
                      />
                    </div>
                  </>
                )}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="descricao" className="text-right">Descrição</Label>
                  <Input
                    id="descricao"
                    value={formData.descricao}
                    onChange={(e) => setFormData({...formData, descricao: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                
                {/* Campos de Recorrência */}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Recorrente</Label>
                  <div className="col-span-3 flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="recorrente"
                      checked={formData.recorrente}
                      onChange={(e) => setFormData({...formData, recorrente: e.target.checked})}
                      className="rounded"
                    />
                    <Label htmlFor="recorrente" className="text-sm">Atividade semanal recorrente</Label>
                  </div>
                </div>
                
                {formData.recorrente && (
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="quantidadeRecorrencia" className="text-right">Quantas semanas</Label>
                    <Input
                      id="quantidadeRecorrencia"
                      type="number"
                      min="1"
                      max="52"
                      value={formData.quantidadeRecorrencia}
                      onChange={(e) => setFormData({...formData, quantidadeRecorrencia: parseInt(e.target.value) || 1})}
                      className="col-span-3"
                    />
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button type="submit" onClick={salvarAtividade}>
                  {atividadeEditando ? 'Atualizar' : 'Salvar'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {visualizacao === 'lista' && (
        <>
          {/* Filtros */}
          <div className="mb-6">
            <Select value={filtroCategoria} onValueChange={setFiltroCategoria}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas as categorias</SelectItem>
                {categorias.map(cat => (
                  <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Lista de Atividades */}
          {renderizarListaAtividades()}
        </>
      )}

      {visualizacao === 'calendario' && (
        <CalendarioView 
          atividades={atividades} 
          onAtividadeClick={(atividade) => abrirDialog(atividade)}
          visualizacaoCalendario="mes"
          setVisualizacaoCalendario={() => {}}
        />
      )}
    </div>
  )
}

export default Programacao


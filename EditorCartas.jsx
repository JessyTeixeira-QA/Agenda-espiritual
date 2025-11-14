import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Plus, Save, FileText, Trash2, Download, Copy } from 'lucide-react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog.jsx'
import ModalConfirmacao from './ModalConfirmacao'

function EditorCartas() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [cartas, setCartas] = useState([])
  const [cartaAtual, setCartaAtual] = useState(null)
  const [dialogAberto, setDialogAberto] = useState(false)
  const [tituloNovaCarta, setTituloNovaCarta] = useState('')
  const [assuntoNovaCarta, setAssuntoNovaCarta] = useState('')
  const [conteudoEditor, setConteudoEditor] = useState('')
  const [assuntos, setAssuntos] = useState([])
  const [filtroAssunto, setFiltroAssunto] = useState('todos')
  const [modalConfirmacao, setModalConfirmacao] = useState({
    aberto: false,
    cartaParaExcluir: null
  })
  const textareaRef = useRef(null)

  const modelosCartas = {
    apresentacao: {
      titulo: 'Carta de Apresentação',
      conteudo: `Caro/a [Nome],

Espero que esta carta o/a encontre bem. Meu nome é [Seu Nome] e sou uma das Testemunhas de Jeová da sua região.

Gostaria de compartilhar com o/a senhor/a uma mensagem de esperança que tem trazido muito conforto a milhões de pessoas ao redor do mundo. A Bíblia nos ensina sobre o propósito de Deus para a humanidade e como podemos encontrar verdadeira paz e felicidade.

Se tiver interesse em conversar sobre este assunto, ficarei muito feliz em visitá-lo/a em um momento conveniente para o/a senhor/a.

Atenciosamente,
[Seu Nome]
Testemunha de Jeová

Contato: [Seu Telefone]`
    },
    convite: {
      titulo: 'Convite para Reunião',
      conteudo: `Caro/a [Nome],

Tenho o prazer de convidá-lo/a para assistir às nossas reuniões cristãs, que são realizadas no Salão do Reino das Testemunhas de Jeová.

Nossas reuniões são:
• Reunião de meio de semana: [Dia] às [Hora]
• Reunião de fim de semana: [Dia] às [Hora]

Endereço: [Endereço do Salão do Reino]

Estas reuniões são gratuitas e abertas ao público. Será uma oportunidade maravilhosa para aprender mais sobre a Bíblia e conhecer pessoas que compartilham valores cristãos.

Esperamos vê-lo/a em breve!

Atenciosamente,
[Seu Nome]
Testemunha de Jeová

Contato: [Seu Telefone]`
    },
    seguimento: {
      titulo: 'Seguimento de Visita',
      conteudo: `Caro/a [Nome],

Foi um prazer conversar com o/a senhor/a em nossa última visita. Espero que tenha tido a oportunidade de refletir sobre os pontos bíblicos que discutimos.

Como prometido, gostaria de compartilhar algumas informações adicionais sobre [Tópico discutido]. A publicação em anexo contém material que pode ser muito útil para aprofundar seu entendimento sobre este assunto.

Se desejar, posso visitá-lo/a novamente para continuarmos nossa conversa. Por favor, me informe qual seria o melhor dia e horário para o/a senhor/a.

Que Jeová o/a abençoe!

Atenciosamente,
[Seu Nome]
Testemunha de Jeová

Contato: [Seu Telefone]`
    }
  }

  useEffect(() => {
    const cartasSalvas = JSON.parse(localStorage.getItem('cartas') || '[]')
    setCartas(cartasSalvas)

    // Carregar assuntos salvos ou criar assuntos padrão
    const assuntosSalvos = JSON.parse(localStorage.getItem('assuntos') || '[]')
    if (assuntosSalvos.length === 0) {
      const assuntosPadrao = ['Trabalho', 'Família', 'Reflexões', 'Testemunho', 'Encorajamento']
      localStorage.setItem('assuntos', JSON.stringify(assuntosPadrao))
      setAssuntos(assuntosPadrao)
    } else {
      setAssuntos(assuntosSalvos)
    }

    // Verificar parâmetros da URL
    if (searchParams.get('nova') === 'true') {
      setDialogAberto(true)
      setSearchParams({}) // Limpar parâmetro
    }
  }, [searchParams, setSearchParams])

  const salvarCartas = (novasCartas) => {
    localStorage.setItem('cartas', JSON.stringify(novasCartas))
    setCartas(novasCartas)
  }

  const criarNovaCarta = (modelo = null) => {
    const novaCarta = {
      id: Date.now(),
      titulo: modelo ? modelo.titulo : tituloNovaCarta || 'Nova Carta',
      assunto: assuntoNovaCarta || 'Geral',
      conteudo: modelo ? modelo.conteudo : '',
      dataCriacao: new Date().toISOString(),
      dataUltimaEdicao: new Date().toISOString()
    }

    const novasCartas = [...cartas, novaCarta]
    salvarCartas(novasCartas)
    setCartaAtual(novaCarta)
    setConteudoEditor(novaCarta.conteudo)
    setDialogAberto(false)
    setTituloNovaCarta('')
    setAssuntoNovaCarta('')
  }

  const salvarCartaAtual = () => {
    if (!cartaAtual) return

    const cartaAtualizada = {
      ...cartaAtual,
      conteudo: conteudoEditor,
      dataUltimaEdicao: new Date().toISOString()
    }

    const novasCartas = cartas.map(carta => 
      carta.id === cartaAtual.id ? cartaAtualizada : carta
    )

    salvarCartas(novasCartas)
    setCartaAtual(cartaAtualizada)
  }

  const excluirCarta = (id) => {
    if (confirm('Tem certeza que deseja excluir esta carta?')) {
      const novasCartas = cartas.filter(carta => carta.id !== id)
      salvarCartas(novasCartas)
      
      if (cartaAtual && cartaAtual.id === id) {
        setCartaAtual(null)
        setConteudoEditor('')
      }
    }
  }

  const selecionarCarta = (carta) => {
    setCartaAtual(carta)
    setConteudoEditor(carta.conteudo)
  }

  const adicionarAssunto = (novoAssunto) => {
    if (novoAssunto && !assuntos.includes(novoAssunto)) {
      const novosAssuntos = [...assuntos, novoAssunto]
      setAssuntos(novosAssuntos)
      localStorage.setItem('assuntos', JSON.stringify(novosAssuntos))
    }
  }

  const cartasFiltradas = cartas.filter(carta => 
    filtroAssunto === 'todos' || carta.assunto === filtroAssunto
  )

  const cartasAgrupadasPorAssunto = cartasFiltradas.reduce((grupos, carta) => {
    const assunto = carta.assunto || 'Sem Assunto'
    if (!grupos[assunto]) {
      grupos[assunto] = []
    }
    grupos[assunto].push(carta)
    return grupos
  }, {})

  const exportarParaPDF = () => {
    if (!cartaAtual) return
    
    // Criar um elemento temporário para impressão
    const printWindow = window.open('', '_blank')
    printWindow.document.write(`
      <html>
        <head>
          <title>${cartaAtual.titulo}</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; margin: 40px; }
            h1 { color: #333; }
            .content { white-space: pre-wrap; }
          </style>
        </head>
        <body>
          <h1>${cartaAtual.titulo}</h1>
          <div class="content">${conteudoEditor}</div>
        </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.print()
  }

  const copiarTexto = () => {
    navigator.clipboard.writeText(conteudoEditor)
    alert('Texto copiado para a área de transferência!')
  }

  const inserirTextoNaPosicao = (texto) => {
    const textarea = textareaRef.current
    if (!textarea) return

    const inicio = textarea.selectionStart
    const fim = textarea.selectionEnd
    const textoAntes = conteudoEditor.substring(0, inicio)
    const textoDepois = conteudoEditor.substring(fim)
    
    setConteudoEditor(textoAntes + texto + textoDepois)
    
    // Reposicionar cursor
    setTimeout(() => {
      textarea.selectionStart = textarea.selectionEnd = inicio + texto.length
      textarea.focus()
    }, 0)
  }

  const formatarTexto = (tipo) => {
    const textarea = textareaRef.current
    if (!textarea) return

    const inicio = textarea.selectionStart
    const fim = textarea.selectionEnd
    const textoSelecionado = conteudoEditor.substring(inicio, fim)
    
    if (textoSelecionado) {
      let textoFormatado = textoSelecionado
      
      switch (tipo) {
        case 'negrito':
          textoFormatado = `**${textoSelecionado}**`
          break
        case 'italico':
          textoFormatado = `*${textoSelecionado}*`
          break
        case 'sublinhado':
          textoFormatado = `__${textoSelecionado}__`
          break
      }
      
      const textoAntes = conteudoEditor.substring(0, inicio)
      const textoDepois = conteudoEditor.substring(fim)
      setConteudoEditor(textoAntes + textoFormatado + textoDepois)
    }
  }

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Editor de Cartas</h1>
          <p className="mt-2 text-gray-600">Crie e edite suas cartas para pregação</p>
        </div>
        <Dialog open={dialogAberto} onOpenChange={setDialogAberto}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nova Carta
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nova Carta</DialogTitle>
              <DialogDescription>
                Escolha como criar sua nova carta
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="titulo">Título da carta</Label>
                <Input
                  id="titulo"
                  value={tituloNovaCarta}
                  onChange={(e) => setTituloNovaCarta(e.target.value)}
                  placeholder="Digite o título da carta"
                />
              </div>
              <div>
                <Label htmlFor="assunto">Assunto</Label>
                <Select value={assuntoNovaCarta} onValueChange={setAssuntoNovaCarta}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um assunto" />
                  </SelectTrigger>
                  <SelectContent>
                    {assuntos.map(assunto => (
                      <SelectItem key={assunto} value={assunto}>{assunto}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  className="mt-2"
                  placeholder="Ou digite um novo assunto"
                  value={assuntoNovaCarta}
                  onChange={(e) => setAssuntoNovaCarta(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      const novoAssunto = e.target.value.trim()
                      if (novoAssunto) {
                        adicionarAssunto(novoAssunto)
                        setAssuntoNovaCarta(novoAssunto)
                      }
                    }
                  }}
                />
              </div>
              <div>
                <Label>Ou escolha um modelo:</Label>
                <div className="grid gap-2 mt-2">
                  {Object.entries(modelosCartas).map(([key, modelo]) => (
                    <Button
                      key={key}
                      variant="outline"
                      onClick={() => criarNovaCarta(modelo)}
                      className="justify-start"
                    >
                      {modelo.titulo}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={() => criarNovaCarta()}>
                Criar Carta em Branco
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista de Cartas */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Cartas Salvas</CardTitle>
              <CardDescription>Organizadas por assunto</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Filtro por Assunto */}
              <div className="mb-4">
                <Select value={filtroAssunto} onValueChange={setFiltroAssunto}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos os assuntos</SelectItem>
                    {assuntos.map(assunto => (
                      <SelectItem key={assunto} value={assunto}>{assunto}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {cartas.length > 0 ? (
                <div className="space-y-4">
                  {Object.entries(cartasAgrupadasPorAssunto).map(([assunto, cartasDoAssunto]) => (
                    <div key={assunto}>
                      <h4 className="font-medium text-sm text-gray-700 mb-2 px-2 py-1 bg-gray-100 rounded">
                        {assunto} ({cartasDoAssunto.length})
                      </h4>
                      <div className="space-y-2 ml-2">
                        {cartasDoAssunto.map((carta) => (
                          <div
                            key={carta.id}
                            className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                              cartaAtual && cartaAtual.id === carta.id
                                ? 'bg-blue-50 border-blue-200'
                                : 'hover:bg-gray-50'
                            }`}
                            onClick={() => selecionarCarta(carta)}
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <h5 className="font-medium text-sm">{carta.titulo}</h5>
                                <p className="text-xs text-gray-500 mt-1">
                                  {new Date(carta.dataUltimaEdicao).toLocaleDateString('pt-PT')}
                                </p>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  excluirCarta(carta.id)
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">Nenhuma carta salva</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Editor */}
        <div className="lg:col-span-2">
          {cartaAtual ? (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>{cartaAtual.titulo}</CardTitle>
                    <CardDescription>
                      Última edição: {new Date(cartaAtual.dataUltimaEdicao).toLocaleString('pt-PT')}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={copiarTexto}>
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={exportarParaPDF}>
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button size="sm" onClick={salvarCartaAtual}>
                      <Save className="mr-2 h-4 w-4" />
                      Salvar
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Barra de Ferramentas */}
                <div className="flex gap-2 mb-4 p-2 bg-gray-50 rounded">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => formatarTexto('negrito')}
                  >
                    <strong>B</strong>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => formatarTexto('italico')}
                  >
                    <em>I</em>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => formatarTexto('sublinhado')}
                  >
                    <u>U</u>
                  </Button>
                  <div className="border-l mx-2"></div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => inserirTextoNaPosicao('[Nome]')}
                  >
                    Nome
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => inserirTextoNaPosicao('[Data]')}
                  >
                    Data
                  </Button>
                </div>

                {/* Área de Texto */}
                <Textarea
                  ref={textareaRef}
                  value={conteudoEditor}
                  onChange={(e) => setConteudoEditor(e.target.value)}
                  placeholder="Digite o conteúdo da sua carta aqui..."
                  className="min-h-[400px] font-mono"
                />
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma carta selecionada</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Selecione uma carta da lista ou crie uma nova para começar a editar.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

export default EditorCartas


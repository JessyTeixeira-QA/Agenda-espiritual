import { useState } from 'react'; // Remover React

// --- Icon Mockups (lucide-react style) ---
// Componentes SVG embutidos para atender ao mandato de arquivo único
const ChevronLeft = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
);
const ChevronRight = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
);
const CalendarIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
);

// --- UI Component Mockups (simulando shadcn/ui com Tailwind) ---
const Button = ({ variant = 'default', size = 'default', className = '', onClick, children }) => {
  const baseClasses = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
  
  const variantClasses = {
    default: "bg-blue-600 text-white hover:bg-blue-700 shadow-md",
    outline: "border border-gray-300 bg-white hover:bg-gray-100 text-gray-700",
  };
  
  const sizeClasses = {
    default: "h-10 py-2 px-4",
    sm: "h-9 px-3 rounded-md",
    lg: "h-11 px-8 rounded-md",
    icon: "h-10 w-10",
  };
  
  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

const Card = ({ className = '', children, onClick }) => (
  <div onClick={onClick} className={`rounded-xl border bg-white text-gray-900 shadow-sm ${className}`}>
    {children}
  </div>
);
const CardHeader = ({ className = '', children }) => (
  <div className={`flex flex-col space-y-1.5 p-6 ${className}`}>
    {children}
  </div>
);
const CardTitle = ({ className = '', children }) => (
  <h3 className={`text-2xl font-semibold leading-none tracking-tight ${className}`}>
    {children}
  </h3>
);
const CardDescription = ({ className = '', children }) => (
  <p className={`text-sm text-gray-500 ${className}`}>
    {children}
  </p>
);
const CardContent = ({ className = '', children }) => (
  <div className={`p-6 pt-0 ${className}`}>
    {children}
  </div>
);

// --- CalendarioView Component (Refatorado e Limpo) ---
function CalendarioView({ atividades, onAtividadeClick }) {
  // useEffect removido, pois não estava sendo usado
  const [dataAtual, setDataAtual] = useState(new Date());
  const [visualizacao, setVisualizacao] = useState('mes');

  const meses = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  // Lógica de Navegação
  const navegarMes = (direcao) => {
    const novaData = new Date(dataAtual);
    novaData.setMonth(dataAtual.getMonth() + direcao);
    setDataAtual(novaData);
  };

  const navegarSemana = (direcao) => {
    const novaData = new Date(dataAtual);
    novaData.setDate(dataAtual.getDate() + (direcao * 7));
    setDataAtual(novaData);
  };

  const navegarDia = (direcao) => {
    const novaData = new Date(dataAtual);
    novaData.setDate(dataAtual.getDate() + direcao);
    setDataAtual(novaData);
  };

  const obterAtividadesDoDia = (data) => {
    // Formata a data para 'YYYY-MM-DD' para comparação
    const dataStr = data.toISOString().split('T')[0];
    return atividades.filter(atividade => atividade.data === dataStr)
      .sort((a, b) => (a.horaInicio || '').localeCompare(b.horaInicio || '')); // Garante a ordem por horário
  };

  const obterDiasDoMes = () => {
    const ano = dataAtual.getFullYear();
    const mes = dataAtual.getMonth();

    const primeiroDia = new Date(ano, mes, 1);
    const ultimoDia = new Date(ano, mes + 1, 0);
    const diasAntes = primeiroDia.getDay(); // 0 (Dom) a 6 (Sáb)

    const dias = [];

    // Dias do mês anterior (preenchimento)
    for (let i = diasAntes - 1; i >= 0; i--) {
      const data = new Date(ano, mes, -i);
      dias.push({ data, outroMes: true });
    }

    // Dias do mês atual
    for (let dia = 1; dia <= ultimoDia.getDate(); dia++) {
      const data = new Date(ano, mes, dia);
      dias.push({ data, outroMes: false });
    }

    // Dias do próximo mês para completar a grade (42 slots)
    const diasRestantes = 42 - dias.length;
    for (let dia = 1; dia <= diasRestantes; dia++) {
      const data = new Date(ano, mes + 1, dia);
      dias.push({ data, outroMes: true });
    }

    return dias;
  };

  const obterSemanaAtual = () => {
    const inicioSemana = new Date(dataAtual);
    // Move para o domingo da semana atual
    inicioSemana.setDate(dataAtual.getDate() - dataAtual.getDay());

    const dias = [];
    for (let i = 0; i < 7; i++) {
      const data = new Date(inicioSemana);
      data.setDate(inicioSemana.getDate() + i);
      dias.push(data);
    }

    return dias;
  };

  const renderizarVisualizacaoMes = () => {
    const dias = obterDiasDoMes();

    return (
      <div className="grid grid-cols-7 gap-1">
        {diasSemana.map(dia => (
          <div key={dia} className="p-2 text-center font-bold text-blue-800 bg-blue-50 text-sm rounded-t-lg">
            {dia}
          </div>
        ))}
        {dias.map((item, index) => {
          const atividadesDoDia = obterAtividadesDoDia(item.data);
          const isHoje = item.data.toDateString() === new Date().toDateString();
          const isMesAtual = !item.outroMes;

          return (
            <div
              key={index}
              className={`min-h-[100px] p-2 border border-gray-200 rounded-sm overflow-hidden transition-all duration-150 ease-in-out
                ${isMesAtual ? 'bg-white hover:shadow-md' : 'bg-gray-50 text-gray-400'}
                ${isHoje ? 'bg-blue-100 border-blue-400 ring-2 ring-blue-500/50' : ''}`}
            >
              <div className={`text-sm font-semibold ${isHoje ? 'text-blue-700' : isMesAtual ? 'text-gray-800' : 'text-gray-400'}`}>
                {item.data.getDate()}
              </div>
              <div className="space-y-1 mt-1">
                {atividadesDoDia.slice(0, 2).map(atividade => (
                  <div
                    key={atividade.id}
                    className={`text-xs p-1 rounded-lg cursor-pointer truncate shadow-sm transition-all hover:ring-2 hover:ring-offset-1
                      ${atividade.concluida
                        ? 'bg-green-100 text-green-800 ring-green-300'
                        : 'bg-blue-200 text-blue-900 ring-blue-300'
                      }`}
                    onClick={(e) => { e.stopPropagation(); onAtividadeClick && onAtividadeClick(atividade); }}
                    title={atividade.titulo}
                  >
                    {atividade.titulo}
                  </div>
                ))}
                {atividadesDoDia.length > 2 && (
                  <div className="text-xs text-gray-500 mt-1 font-medium">
                    +{atividadesDoDia.length - 2} mais
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderizarVisualizacaoSemana = () => {
    const diasSemanaAtual = obterSemanaAtual();

    return (
      <div className="grid grid-cols-7 gap-3">
        {diasSemanaAtual.map((data, index) => {
          const atividadesDoDia = obterAtividadesDoDia(data);
          const isHoje = data.toDateString() === new Date().toDateString();

          return (
            <div key={index} className="border border-gray-200 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className={`p-3 text-center border-b ${isHoje ? 'bg-blue-600 text-white shadow-md' : 'bg-blue-50'}`}>
                <div className={`text-sm font-semibold ${isHoje ? 'text-white' : 'text-blue-800'}`}>
                  {data.toLocaleDateString('pt-PT', { weekday: 'short' })}
                </div>
                <div className={`text-3xl font-extrabold mt-1 ${isHoje ? 'text-white' : 'text-gray-900'}`}>
                  {data.getDate()}
                </div>
              </div>
              <div className="p-3 space-y-2 min-h-[300px] max-h-[50vh] overflow-y-auto bg-white">
                {atividadesDoDia.length > 0 ? (
                  atividadesDoDia.map(atividade => (
                    <div
                      key={atividade.id}
                      className={`text-sm p-3 rounded-xl cursor-pointer shadow-md transition-all hover:bg-opacity-80
                        ${atividade.concluida
                          ? 'bg-green-200 text-green-900 hover:bg-green-300'
                          : 'bg-blue-200 text-blue-900 hover:bg-blue-300'
                        }`}
                      onClick={() => onAtividadeClick && onAtividadeClick(atividade)}
                    >
                      <div className="font-bold text-base">{atividade.titulo}</div>
                      <div className="text-xs mt-1 font-mono">{atividade.horaInicio}</div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-400 text-xs py-4">
                    Dia livre
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderizarVisualizacaoDia = () => {
    const atividadesDoDia = obterAtividadesDoDia(dataAtual);

    return (
      <div className="space-y-6">
        <div className="text-center p-4 bg-gray-50 rounded-xl shadow-inner">
          <h3 className="text-2xl font-extrabold text-blue-700">
            {dataAtual.toLocaleDateString('pt-PT', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </h3>
        </div>

        <div className="space-y-4">
          {atividadesDoDia.length > 0 ? (
            atividadesDoDia.map(atividade => (
              <Card
                key={atividade.id}
                className={`cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-[1.01]
                  ${atividade.concluida ? 'border-green-400 bg-green-50 shadow-lg' : 'border-blue-300 bg-white shadow-lg'
                  }`}
                onClick={() => onAtividadeClick && onAtividadeClick(atividade)}
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className={`text-xl ${atividade.concluida ? 'text-green-800' : 'text-blue-800'}`}>{atividade.titulo}</CardTitle>
                    {atividade.concluida && (
                      <span className="px-3 py-1 text-xs font-bold bg-green-200 text-green-900 rounded-full shadow-inner">
                        <svg className="inline h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                        Concluída
                      </span>
                    )}
                  </div>
                  <CardDescription className="text-base text-gray-500">
                    <span className="font-mono text-lg">{atividade.horaInicio}</span>
                    {atividade.horaFim && ` - ${atividade.horaFim}`}
                  </CardDescription>
                </CardHeader>
                {atividade.descricao && (
                  <CardContent>
                    <p className="text-sm text-gray-700 leading-relaxed italic border-l-4 border-blue-200 pl-3">
                      {atividade.descricao}
                    </p>
                  </CardContent>
                )}
              </Card>
            ))
          ) : (
            <Card className="border-dashed border-2 border-gray-300 bg-gray-50">
              <CardContent className="text-center py-12">
                <CalendarIcon className="mx-auto h-16 w-16 text-gray-400 opacity-60" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">Nenhuma atividade agendada</h3>
                <p className="mt-1 text-sm text-gray-500">Clique para adicionar uma nova atividade para este dia.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    );
  };

  const obterTituloNavegacao = () => {
    if (!dataAtual) {
      return '';
    }

    try {
      switch (visualizacao) {
        case 'dia':
          return dataAtual.toLocaleDateString('pt-PT', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          });
        case 'semana': {
          const inicioSemana = new Date(dataAtual.getTime());
          inicioSemana.setDate(dataAtual.getDate() - dataAtual.getDay());
          const fimSemana = new Date(inicioSemana.getTime());
          fimSemana.setDate(inicioSemana.getDate() + 6);

          const inicioStr = inicioSemana.toLocaleDateString('pt-PT', { day: 'numeric', month: 'short' });
          const fimStr = fimSemana.toLocaleDateString('pt-PT', { day: 'numeric', month: 'short' });

          return `${inicioStr} - ${fimStr} ${dataAtual.getFullYear()}`;
        }
        case 'mes':
        default:
          return `${meses[dataAtual.getMonth()]} ${dataAtual.getFullYear()}`;
      }
    } catch (error) {
      console.error('Erro ao formatar data para título de navegação:', error);
      return '';
    }
  };

  const navegarData = (direcao) => {
    switch (visualizacao) {
      case 'dia':
        navegarDia(direcao);
        break;
      case 'semana':
        navegarSemana(direcao);
        break;
      case 'mes':
      default:
        navegarMes(direcao);
        break;
    }
  };

  return (
    <div className="space-y-6 p-4 max-w-7xl mx-auto font-sans">
      {/* Controles de Navegação */}
      <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-4 rounded-xl shadow-lg border border-gray-100">
        <div className="flex items-center space-x-2 mb-4 sm:mb-0">
          <Button variant="outline" size="sm" onClick={() => navegarData(-1)} className="p-2">
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h2 className="text-xl font-extrabold min-w-[200px] text-center text-gray-800 transition-opacity duration-300">
            {obterTituloNavegacao()}
          </h2>
          <Button variant="outline" size="sm" onClick={() => navegarData(1)} className="p-2">
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex space-x-2 bg-gray-100 p-1 rounded-lg">
          <Button
            variant={visualizacao === 'dia' ? 'default' : 'outline'}
            size="sm"
            className={`transition-all ${visualizacao === 'dia' ? 'shadow-md' : 'shadow-none'}`}
            onClick={() => setVisualizacao('dia')}
          >
            Dia
          </Button>
          <Button
            variant={visualizacao === 'semana' ? 'default' : 'outline'}
            size="sm"
            className={`transition-all ${visualizacao === 'semana' ? 'shadow-md' : 'shadow-none'}`}
            onClick={() => setVisualizacao("semana")}
          >
            Semana
          </Button>
          <Button
            variant={visualizacao === 'mes' ? 'default' : 'outline'}
            size="sm"
            className={`transition-all ${visualizacao === 'mes' ? 'shadow-md' : 'shadow-none'}`}
            onClick={() => setVisualizacao("mes")}
          >
            Mês
          </Button>
        </div>
      </div>

      {/* Visualização do Calendário */}
      <Card className="shadow-2xl border-none">
        <CardContent className="p-6">
          {visualizacao === 'mes' && renderizarVisualizacaoMes()}
          {visualizacao === 'semana' && renderizarVisualizacaoSemana()}
          {visualizacao === 'dia' && renderizarVisualizacaoDia()}
        </CardContent>
      </Card>
    </div>
  );
}

// --- Main Application Component ---
function App() {
  const [atividades, setAtividades] = useState([
    // Dados de exemplo
    { id: 1, titulo: 'Meditação Matinal', data: '2025-11-13', horaInicio: '06:00', horaFim: '06:30', descricao: 'Oração e leitura do Salmo 23.', concluida: true },
    { id: 2, titulo: 'Estudo Bíblico', data: '2025-11-13', horaInicio: '19:00', horaFim: '20:00', descricao: 'Estudo do Livro de Romanos, Capítulo 8.', concluida: false },
    { id: 3, titulo: 'Serviço Voluntário', data: '2025-11-14', horaInicio: '10:00', horaFim: '12:00', descricao: 'Ajuda na cozinha da comunidade.', concluida: false },
    { id: 4, titulo: 'Jejum Semanal', data: '2025-11-15', horaInicio: '00:00', horaFim: '23:59', descricao: 'Dia de reflexão e jejum completo.', concluida: false },
    { id: 5, titulo: 'Culto de Domingo', data: '2025-11-16', horaInicio: '18:00', horaFim: '19:30', descricao: 'Celebração na igreja principal.', concluida: false },
    { id: 6, titulo: 'Reunião de Célula', data: '2025-11-19', horaInicio: '20:00', horaFim: '21:00', descricao: 'Encontro em grupo para oração e comunhão.', concluida: true },
    { id: 7, titulo: 'Retiro Espiritual', data: '2025-11-28', horaInicio: '08:00', horaFim: '18:00', descricao: 'Dia inteiro dedicado à oração e leitura.', concluida: false },
    { id: 8, titulo: 'Oração pelas Famílias', data: '2025-11-14', horaInicio: '20:30', horaFim: '21:00', descricao: 'Intercessão pelas famílias da congregação.', concluida: false },
    // Adiciona uma tarefa para a data de hoje para testar o destaque
    { id: 9, titulo: 'Tarefa de Hoje', data: new Date().toISOString().split('T')[0], horaInicio: '15:00', horaFim: '16:00', descricao: 'Verificação da agenda espiritual.', concluida: false },
    { id: 10, titulo: 'Outra Tarefa de Hoje', data: new Date().toISOString().split('T')[0], horaInicio: '17:00', horaFim: '17:30', descricao: 'Preparar o sermão para o fim de semana.', concluida: true },
  ]);

  const [atividadeSelecionada, setAtividadeSelecionada] = useState(null);

  const handleAtividadeClick = (atividade) => {
    setAtividadeSelecionada(atividade);
  };

  const handleCloseModal = () => {
    setAtividadeSelecionada(null);
  };

  const handleToggleConcluida = () => {
    if (atividadeSelecionada) {
      setAtividades(prev =>
        prev.map(a =>
          a.id === atividadeSelecionada.id ? { ...a, concluida: !a.concluida } : a
        )
      );
      setAtividadeSelecionada(prev => ({ ...prev, concluida: !prev.concluida }));
    }
  };

  // Modal de Detalhe da Atividade
  const DetalheAtividadeModal = ({ atividade, onClose, onToggleConcluida }) => {
    if (!atividade) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-lg shadow-2xl animate-fade-in">
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className={`text-2xl ${atividade.concluida ? 'text-green-700' : 'text-blue-700'}`}>
                {atividade.titulo}
              </CardTitle>
              <button onClick={onClose} className="text-gray-500 hover:text-gray-900 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
              </button>
            </div>
            <CardDescription className="text-base">
              {atividade.data} | {atividade.horaInicio}{atividade.horaFim && ` - ${atividade.horaFim}`}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700 italic border-l-4 border-blue-200 pl-3 leading-relaxed">{atividade.descricao || 'Nenhuma descrição fornecida.'}</p>
            
            <div className="flex items-center justify-between pt-2">
              <span className={`px-3 py-1 text-sm font-semibold rounded-full shadow-inner ${
                atividade.concluida ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'
              }`}>
                {atividade.concluida ? 'Concluída' : 'Pendente'}
              </span>

              <Button onClick={onToggleConcluida} variant={atividade.concluida ? 'outline' : 'default'}>
                {atividade.concluida ? 'Marcar como Pendente' : 'Marcar como Concluída'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-700 text-white p-4 shadow-lg">
        <h1 className="text-3xl font-extrabold text-center tracking-wider">
          Agenda Espiritual
        </h1>
      </header>
      <main className="p-4 sm:p-8">
        <CalendarioView 
          atividades={atividades} 
          onAtividadeClick={handleAtividadeClick} 
        />
      </main>
      <DetalheAtividadeModal 
        atividade={atividadeSelecionada}
        onClose={handleCloseModal}
        onToggleConcluida={handleToggleConcluida}
      />
      
      {/* Estilos para Tailwind CSS e fonte Inter */}
      <style>
        {`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap');
        body { font-family: 'Inter', sans-serif; }
        .animate-fade-in {
            animation: fadeIn 0.3s ease-out;
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        /* Ajustes de responsividade para visualização do mês em telas pequenas */
        @media (max-width: 640px) {
            .min-h-\[100px\] {
                min-height: 80px;
            }
            .p-2 {
                padding: 0.5rem;
            }
            .text-sm {
                font-size: 0.75rem; /* 12px */
            }
            .text-xs {
                font-size: 0.65rem; /* ~10px */
            }
        }
        `}
      </style>
    </div>
  );
}

export default App;
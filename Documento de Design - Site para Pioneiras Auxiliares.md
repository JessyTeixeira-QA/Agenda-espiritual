# Documento de Design - Site para Pioneiras Auxiliares

## Esquema de Cores
- **Cor Primária**: #2C5F7A (Azul escuro profissional)
- **Cor Secundária**: #4A90A4 (Azul médio)
- **Cor de Destaque**: #87CEEB (Azul claro)
- **Cor de Fundo**: #F8F9FA (Cinza muito claro)
- **Cor do Texto**: #2D3748 (Cinza escuro)
- **Cor de Sucesso**: #48BB78 (Verde)
- **Cor de Alerta**: #ED8936 (Laranja)

## Tipografia
- **Fonte Principal**: 'Inter', sans-serif (para títulos e interface)
- **Fonte Secundária**: 'Source Sans Pro', sans-serif (para texto corrido)
- **Tamanhos**:
  - H1: 2.5rem (40px)
  - H2: 2rem (32px)
  - H3: 1.5rem (24px)
  - Texto normal: 1rem (16px)
  - Texto pequeno: 0.875rem (14px)

## Estrutura de Navegação
1. **Página Principal (Dashboard)**
   - Visão geral das atividades próximas
   - Estatísticas rápidas
   - Acesso rápido às funcionalidades principais

2. **Programação**
   - Calendário interativo
   - Lista de eventos
   - Formulário para adicionar/editar eventos

3. **Editor de Cartas**
   - Lista de cartas guardadas
   - Editor de texto rico
   - Modelos de cartas

4. **Configurações**
   - Preferências do utilizador
   - Gestão de dados

## Wireframes das Páginas Principais

### Dashboard
```
+------------------------------------------+
|  LOGO    Programação | Cartas | Config  |
+------------------------------------------+
|                                          |
|  Próximas Atividades    |  Estatísticas  |
|  - Reunião (Hoje 19h)  |  Horas: 15     |
|  - Pregação (Amanhã)   |  Revisitas: 3  |
|  - Estudo (Sexta)      |  Estudos: 1    |
|                        |                |
+------------------------+----------------+
|                                          |
|  Acesso Rápido                          |
|  [Nova Atividade] [Nova Carta]          |
|                                          |
+------------------------------------------+
```

### Programação
```
+------------------------------------------+
|  LOGO    Programação | Cartas | Config  |
+------------------------------------------+
|                                          |
|  [+ Nova Atividade]           [Filtros]  |
|                                          |
|  +----------------------------------+   |
|  |        CALENDÁRIO                |   |
|  |  Dom Seg Ter Qua Qui Sex Sáb    |   |
|  |   1   2   3   4   5   6   7     |   |
|  |   8   9  10  11  12  13  14     |   |
|  |  ...                            |   |
|  +----------------------------------+   |
|                                          |
|  Lista de Eventos:                       |
|  □ Reunião - Hoje 19:00                 |
|  □ Pregação - Amanhã 09:00               |
|                                          |
+------------------------------------------+
```

### Editor de Cartas
```
+------------------------------------------+
|  LOGO    Programação | Cartas | Config  |
+------------------------------------------+
|                                          |
|  Cartas Guardadas:    [+ Nova Carta]    |
|  - Carta de Apresentação                |
|  - Convite para Reunião                 |
|  - Seguimento de Visita                 |
|                                          |
+------------------------------------------+
|                                          |
|  Editor de Texto:                       |
|  [B] [I] [U] [Lista] [Modelo]           |
|  +----------------------------------+   |
|  |                                  |   |
|  |  Caro/a [Nome],                  |   |
|  |                                  |   |
|  |  Escreva aqui o conteúdo da      |   |
|  |  sua carta...                    |   |
|  |                                  |   |
|  +----------------------------------+   |
|  [Guardar] [Exportar PDF] [Limpar]      |
|                                          |
+------------------------------------------+
```

## Componentes de Interface

### Botões
- Primários: Fundo azul (#2C5F7A), texto branco
- Secundários: Fundo transparente, borda azul, texto azul
- Hover: Ligeiro escurecimento da cor

### Cards
- Fundo branco, sombra suave
- Bordas arredondadas (8px)
- Padding interno de 1.5rem

### Formulários
- Campos com bordas arredondadas
- Focus state com cor primária
- Labels claros e descritivos

### Calendário
- Grid responsivo
- Eventos mostrados como pequenos indicadores coloridos
- Hover states para interatividade


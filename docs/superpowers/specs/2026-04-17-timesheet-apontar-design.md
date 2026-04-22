# Design: Sistema de Apontamento de Horas (Timesheet)

**Data:** 2026-04-17  
**Status:** Aprovado  
**Versão:** 1.0

## Sumário Executivo

Sistema de apontamento de horas que permite aos usuários registrar tempo trabalhado em tarefas através de:
1. Cronômetro flutuante com controle em tempo real
2. Entrada manual em tabela semanal estilo timesheet
3. Integração com a lista de tarefas existente

## Requisitos Funcionais

### RF1: Tela de Apontamento
- Mostrar tabela com tarefas nas linhas e dias da semana (Seg-Sáb) nas colunas
- Navegação de semanas com botões < >
- Filtros encadeados: Cliente → Tarefa → Responsável
- Inputs de tempo (HH:MM:SS) sempre visíveis em cada célula
- Totalizações por dia (coluna) e por tarefa (linha)
- Validação com aviso ao ultrapassar 8h por dia

### RF2: Cronômetro Flutuante
- Componente arrastável fixo no canto inferior direito
- Visível em todas as telas do sistema quando ativo
- Mostra nome da tarefa e cliente
- Controles: Play/Pause, Stop, Minimizar, Fechar
- Atualização em tempo real (HH:MM:SS a cada segundo)
- Apenas um cronômetro ativo por vez

### RF3: Integração com Tarefas
- Botão "Apontar" no cabeçalho da tela Tarefas → navega para tela Apontar
- Botão de timer (00:00:00 + play) em cada tarefa da lista
- Ao clicar "Ver apontamentos" em uma tarefa → navega para Apontar com filtros pré-aplicados
- Estado visual diferente quando timer está rodando na tarefa

### RF4: Gerenciamento de Tempo
- Timer lança automaticamente no dia atual ao parar
- Múltiplas sessões no mesmo dia somam automaticamente
- Edição manual com confirmação para valores existentes
- Formato HH:MM:SS com parsing flexível (aceita "230" como "02:30:00")

## Arquitetura de Componentes

### Estrutura de Arquivos

```
src/app/
├── components/
│   ├── Apontar.tsx                    // Tela principal de apontamento
│   ├── FloatingTimer.tsx              // Cronômetro flutuante global
│   └── ui/
│       └── time-input.tsx             // Input especializado para HH:MM:SS
│
├── contexts/
│   └── TimerContext.tsx               // Context API para estado do timer
│
└── types/
    └── timesheet.ts                   // Tipos TypeScript do sistema
```

### Hierarquia de Componentes

```
App/Layout Principal
├── TimerProvider (Context)
│   ├── FloatingTimer (condicional, quando timer ativo)
│   └── Páginas
│       ├── Tarefas
│       │   ├── Botão "Apontar" (header)
│       │   └── TimerButton por tarefa
│       └── Apontar
│           ├── ConfigBreadcrumb: Tarefas > Apontar
│           ├── WhiteBlock: Filtros encadeados
│           └── WhiteBlock: Tabela Timesheet
```

## Modelos de Dados

### Interfaces TypeScript

```typescript
// Entrada de tempo individual
interface TimeEntry {
  id: string;
  tarefaId: number;
  tarefaNome: string;
  clienteNome: string;
  responsavel: string;
  data: string;              // 'YYYY-MM-DD'
  duracao: string;           // 'HH:MM:SS'
  duracaoSegundos: number;   // Para cálculos
  origem: 'manual' | 'timer';
}

// Estado do timer ativo
interface TimerState {
  tarefaId: number;
  tarefaNome: string;
  clienteNome: string;
  responsavel: string;
  iniciadoEm: number;        // timestamp
  pausadoEm?: number;        // timestamp (se pausado)
  tempoAcumulado: number;    // segundos já contados antes de pausar
  rodando: boolean;
  posicao: { x: number; y: number }; // posição do floating timer
}

// Resumo de horas por tarefa/dia para a tabela
interface TimesheetRow {
  tarefaId: number;
  tarefaNome: string;
  clienteNome: string;
  responsavel: string;
  horas: {
    [dia: string]: string;   // 'YYYY-MM-DD' -> 'HH:MM:SS'
  };
  totalSemana: string;       // 'HH:MM:SS'
}

// Filtros da tela Apontar
interface ApontarFilters {
  clienteId: number | null;
  tarefaId: number | null;
  responsavelId: number | null;
}

// Semana sendo visualizada
interface WeekView {
  inicio: Date;              // Segunda-feira
  fim: Date;                 // Sábado
  dias: Date[];              // Array de 6 dias (Seg-Sáb)
}
```

### Funções Auxiliares

```typescript
// Converter segundos para HH:MM:SS
formatDuration(segundos: number): string

// Converter HH:MM:SS para segundos
parseDuration(hhmmss: string): number

// Somar durações (HH:MM:SS + HH:MM:SS)
addDurations(d1: string, d2: string): string

// Validar formato HH:MM:SS
isValidDuration(valor: string): boolean

// Gerar semana atual ou navegada
getWeek(offset: number): WeekView

// Parsear input flexível ("230" → "02:30:00")
parseTimeInput(input: string): { horas: number; minutos: number; segundos: number; totalSegundos: number } | null
```

## Componente FloatingTimer

### Estados Visuais

1. **Expandido (padrão):**
   - Nome da tarefa + cliente
   - Timer em tempo real (HH:MM:SS)
   - Botões: Play/Pause, Stop, Minimizar, Fechar
   - Dimensões: ~320px × ~140px

2. **Minimizado:**
   - Apenas timer + ícone
   - Dimensões: ~160px × ~60px
   - Clique expande

3. **Pausado:**
   - Timer congelado
   - Botão Play para retomar
   - Opacidade reduzida (0.9)

### Controles

| Botão | Ação | Comportamento |
|-------|------|---------------|
| Play/Pause | `toggleTimer()` | Se rodando: pausa (salva tempo acumulado)<br/>Se pausado: retoma contagem |
| Stop | `stopTimer()` | Para o timer<br/>Lança automaticamente no dia atual<br/>Remove FloatingTimer<br/>Toast: "Tempo lançado: HH:MM:SS" |
| Fechar (X) | `discardTimer()` | Mostra confirmação: "Descartar tempo sem salvar?"<br/>Se confirmar: descarta e remove<br/>Se cancelar: mantém ativo |
| Minimizar | `toggleMinimized()` | Alterna entre expandido/minimizado |

### Funcionalidades Especiais

- **Arrastável:** Permite reposicionar com mouse drag
- **Persiste posição:** Salva no contexto durante sessão
- **Z-index alto:** 9999 (sempre visível)
- **Animações:** Fade in/out ao aparecer/desaparecer
- **Shake animation:** Quando tenta iniciar segundo timer

## Tela Apontar - Layout

### Estrutura Visual

```
[Fundo cinza com padding 24px]

  Breadcrumb: Tarefas > Apontar
  
  [WhiteBlock 1 - Filtros]
    [Select Cliente] [Select Tarefa] [Select Responsável] [Botão Limpar]
  
  [WhiteBlock 2 - Tabela]
    [< Semana anterior] [14/04 - 19/04/2026] [Próxima semana >]
    
    ┌─────────┬─────┬─────┬─────┬─────┬─────┬─────┬──────────┐
    │ Tarefa  │ Seg │ Ter │ Qua │ Qui │ Sex │ Sáb │ Total    │
    │         │14/04│15/04│16/04│17/04│18/04│19/04│ Semana   │
    ├─────────┼─────┼─────┼─────┼─────┼─────┼─────┼──────────┤
    │ Total   │03:30│05:15│08:00│07:45│06:30│02:00│ 33:00:00 │
    ├─────────┼─────┼─────┼─────┼─────┼─────┼─────┼──────────┤
    │ DCTF    │02:30│03:00│04:00│02:00│01:30│00:00│ 13:00:00 │
    │ Ago/25  │     │     │     │     │     │     │          │
    │ ABC Ltda│     │     │     │     │     │     │          │
    ├─────────┼─────┼─────┼─────┼─────┼─────┼─────┼──────────┤
    │ REINF   │01:00│02:15│04:00│05:45│05:00│02:00│ 20:00:00 │
    │ Out/25  │     │     │⚠️   │     │     │     │          │
    │ ABC Ltda│     │     │     │     │     │     │          │
    └─────────┴─────┴─────┴─────┴─────┴─────┴─────┴──────────┘
    
    ⚠️ = Warning de >8h no dia
```

### Funcionalidades da Tabela

1. **TimeInput:**
   - Input sempre visível em cada célula
   - Formato HH:MM:SS com parsing flexível
   - Validação ao sair (onBlur)
   - Aceita: "230" → "02:30:00", "2:30" → "02:30:00", etc.

2. **Totalizações:**
   - Linha de totais abaixo do cabeçalho (soma por dia)
   - Coluna "Total Semana" à direita (soma por tarefa)
   - Célula bottom-right: total geral da semana

3. **Validação 8h:**
   - Ícone AlertTriangle quando total do dia > 8h
   - Tooltip: "Total do dia excede 8 horas (XX:XX:XX)"
   - Não bloqueia, apenas avisa

4. **Edição:**
   - Ao alterar valor existente: confirmação
   - Dialog: "Tem certeza que deseja alterar de XX:XX:XX para YY:YY:YY?"
   - Valores novos/zerados: sem confirmação

### Filtros Encadeados

```
Cliente (aberto)
  ↓ filtra
Tarefa (só tarefas do cliente selecionado, desabilitado se sem cliente)
  ↓ filtra
Responsável (só responsáveis da tarefa selecionada, desabilitado se sem tarefa)
```

Botão "Limpar filtros" remove todas as seleções e mostra todas as tarefas.

## Integração com Tarefas

### Modificações em Tarefas.tsx

1. **Botão "Apontar" no cabeçalho:**
   - Já existe (linha 338)
   - Ao clicar: navega para `/apontar` sem filtros

2. **TimerButton em cada tarefa:**
   - **Estado 1 (parado):** "00:00:00" + ícone Play
   - **Estado 2 (rodando):** tempo atual + ícone Stop (destacado)
   - Ao clicar quando parado: inicia timer
   - Ao clicar quando rodando: para timer (lança horas)

3. **Botão "Ver apontamentos" nos detalhes:**
   - No drawer/modal de detalhes da tarefa
   - Navega para `/apontar` com filtros pré-aplicados:
     - Cliente = tarefa.empresa
     - Tarefa = tarefa.nome
     - Responsável = tarefa.responsavel
   - Mostra apenas esta linha na tabela
   - Usuário pode limpar filtros

### Tratamento de Conflitos

**Tentar iniciar timer quando já existe um ativo:**

```typescript
if (timerState && timerState.tarefaId !== novoTarefaId) {
  toast.error('Já existe um cronômetro ativo. Pare o cronômetro atual antes de iniciar outro.');
  
  // Shake animation no FloatingTimer
  triggerTimerAttention();
  
  return; // não inicia
}
```

## Gerenciamento de Estado - TimerContext

### Estrutura do Context

```typescript
interface TimerContextValue {
  // Estado do timer
  timerState: TimerState | null;
  tempoAtual: number; // segundos, atualizado a cada segundo
  
  // Dados de apontamentos
  entries: TimeEntry[];
  timesheetRows: TimesheetRow[];
  
  // Ações do timer
  startTimer: (tarefa) => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  stopTimer: () => void;
  discardTimer: () => void;
  updateTimerPosition: (x, y) => void;
  
  // Ações de apontamento manual
  addTimeEntry: (tarefaId, data, duracao) => void;
  updateTimeEntry: (tarefaId, data, novaDuracao) => void;
  
  // Queries
  getTotalPorDia: (data) => string;
  getTotalPorTarefa: (tarefaId, semana) => string;
  getEntryPorTarefaDia: (tarefaId, data) => string;
}
```

### Lógica Principal

**Atualização do timer a cada segundo:**
```typescript
useEffect(() => {
  if (!timerState?.rodando) return;
  
  const interval = setInterval(() => {
    const agora = Date.now();
    const decorrido = Math.floor((agora - timerState.iniciadoEm) / 1000);
    setTempoAtual(timerState.tempoAcumulado + decorrido);
  }, 1000);
  
  return () => clearInterval(interval);
}, [timerState]);
```

**Adicionar tempo (manual ou timer):**
```typescript
const addTimeEntry = (tarefaId, data, duracao) => {
  const existing = entries.find(e => 
    e.tarefaId === tarefaId && e.data === data
  );
  
  if (existing) {
    // Somar com o existente
    const novoTotal = addDurations(existing.duracao, duracao);
    updateTimeEntry(tarefaId, data, novoTotal);
  } else {
    // Criar novo entry
    setEntries(prev => [...prev, newEntry]);
  }
};
```

**Parar timer e lançar:**
```typescript
const stopTimer = () => {
  if (!timerState) return;
  
  const hoje = format(new Date(), 'yyyy-MM-dd');
  const duracao = formatDuration(tempoAtual);
  
  addTimeEntry(timerState.tarefaId, hoje, duracao);
  
  setTimerState(null);
  setTempoAtual(0);
  
  toast.success(`Tempo lançado: ${duracao}`);
};
```

## Fluxos de Usuário

### Fluxo 1: Iniciar Timer da Lista de Tarefas

1. Usuário está na tela Tarefas
2. Clica no botão "00:00:00" + play em uma tarefa
3. Sistema verifica se já existe timer ativo
4. Se não: FloatingTimer aparece (fade-in)
5. Timer começa: 00:00:01, 00:00:02...
6. Botão na lista muda para: tempo + stop
7. Timer permanece visível em qualquer tela

### Fluxo 2: Pausar e Retomar Timer

1. Timer rodando no FloatingTimer
2. Clica em "Pause"
3. Timer congela (ex: 01:23:45)
4. Botão muda para "Play"
5. Clica "Play" novamente
6. Timer retoma: 01:23:46, 01:23:47...

### Fluxo 3: Parar Timer e Lançar Horas

1. Timer rodando/pausado
2. Clica "Stop"
3. Sistema:
   - Identifica dia atual
   - Busca entry existente para tarefa + dia
   - Soma ou cria novo
   - Atualiza state
4. FloatingTimer desaparece (fade-out)
5. Toast: "Tempo lançado: HH:MM:SS"
6. Tabela Apontar atualiza em tempo real

### Fluxo 4: Descartar Timer

1. Timer ativo
2. Clica "X"
3. Confirmação: "Descartar tempo? (HH:MM:SS será perdido)"
4. Se confirmar: timer desaparece, nada lançado
5. Se cancelar: volta ao normal

### Fluxo 5: Editar Horas Manualmente

1. Tela Apontar
2. Navega para semana desejada
3. Aplica filtros (opcional)
4. Clica célula, digita: "2:30:15"
5. Formato automático: "02:30:15"
6. Ao sair (onBlur):
   - Valida formato
   - Se já existe valor: confirmação
   - Se não: salva direto
7. Totais recalculam
8. Se dia > 8h: warning aparece

### Fluxo 6: Navegar de Tarefa para Apontar

1. Tela Tarefas, detalhes de tarefa
2. Clica "Ver apontamentos"
3. Navega para `/apontar`
4. Filtros pré-aplicados automaticamente
5. Tabela mostra só aquela tarefa
6. Pode limpar filtros para ver outras

### Fluxo 7: Validação de 8h

1. Usuário lança horas
2. Sistema soma total do dia
3. Se > 8h:
   - Linha "Total" fica amarela
   - Ícone AlertTriangle
   - Tooltip com total
4. Não bloqueia salvamento
5. Warning é informativo

## Validações e Tratamento de Erros

### Validações de Input (TimeInput)

**Parsing flexível:**
```
"230"      → "02:30:00"
"2:30"     → "02:30:00"
"2:30:15"  → "02:30:15"
"145"      → "01:45:00"
```

**Rejeições:**
```
"25:00:00" → erro: "Hora inválida"
"12:60:00" → erro: "Minutos inválidos"
"12:30:60" → erro: "Segundos inválidos"
"abc"      → erro: "Formato inválido"
"-01:00"   → erro: "Não pode ser negativo"
```

**Validação ao sair do campo:**
```typescript
function validateTimeInput(valor: string): ValidationResult {
  if (!valor || valor === '00:00:00') {
    return { valid: true, normalized: '00:00:00' };
  }
  
  const parsed = parseTimeInput(valor);
  if (!parsed) {
    return { valid: false, error: 'Formato inválido. Use HH:MM:SS' };
  }
  
  if (parsed.horas > 23) {
    return { valid: false, error: 'Horas devem ser entre 00-23' };
  }
  if (parsed.minutos > 59) {
    return { valid: false, error: 'Minutos devem ser entre 00-59' };
  }
  if (parsed.segundos > 59) {
    return { valid: false, error: 'Segundos devem ser entre 00-59' };
  }
  
  return { valid: true, normalized: formatDuration(parsed.totalSegundos) };
}
```

### Avisos e Warnings

**Total diário > 8h:**
```tsx
{totalDiaSegundos > 28800 && (
  <div className="warning-indicator">
    <AlertTriangle size={14} className="text-yellow-600" />
    <Tooltip>
      Total do dia excede 8 horas ({formatDuration(totalDiaSegundos)})
    </Tooltip>
  </div>
)}
```

**Cronômetro já ativo:**
```typescript
toast.error(
  'Já existe um cronômetro ativo. Pare o cronômetro atual antes de iniciar outro.',
  { duration: 4000 }
);

// Shake animation no FloatingTimer
floatingTimerRef.current?.classList.add('shake-animation');
```

### Confirmações

**Editar tempo existente:**
```typescript
const confirma = window.confirm(
  `Tem certeza que deseja alterar de ${valorAntigo} para ${valorNovo}?`
);
```

**Descartar timer:**
```typescript
const confirma = window.confirm(
  `Descartar tempo sem salvar? (${formatDuration(tempoAtual)} será perdido)`
);
```

### Mensagens de Sucesso

**Timer parado:**
```typescript
toast.success(`Tempo lançado: ${formatDuration(tempoAtual)}`, {
  duration: 3000,
  icon: '✓'
});
```

**Horas editadas:**
```typescript
toast.success('Horas atualizadas com sucesso', {
  duration: 2000
});
```

## Dados Mock

### Mock TimeEntries

```typescript
const mockEntries: TimeEntry[] = [
  {
    id: 'e001',
    tarefaId: 1,
    tarefaNome: 'DCTF Ago/25',
    clienteNome: 'Empresa ABC Ltda',
    responsavel: 'Fernanda',
    data: '2026-04-14', // Segunda
    duracao: '02:30:00',
    duracaoSegundos: 9000,
    origem: 'timer'
  },
  {
    id: 'e002',
    tarefaId: 1,
    tarefaNome: 'DCTF Ago/25',
    clienteNome: 'Empresa ABC Ltda',
    responsavel: 'Fernanda',
    data: '2026-04-15', // Terça
    duracao: '03:00:00',
    duracaoSegundos: 10800,
    origem: 'manual'
  },
  {
    id: 'e003',
    tarefaId: 4,
    tarefaNome: 'REINF Out/25',
    clienteNome: 'Empresa ABC Ltda',
    responsavel: 'Maria Silva',
    data: '2026-04-16', // Quarta
    duracao: '08:30:00', // Acima de 8h (warning)
    duracaoSegundos: 30600,
    origem: 'timer'
  },
  // ... mais entries
];
```

## Padrões de Design

### Layout (seguindo padrões do sistema)

- **Fundo:** `colors.elements['background 02']` (cinza)
- **Padding externo:** 24px
- **WhiteBlock:** `bg-card rounded-[var(--radius-card)] p-4`
- **Breadcrumb:** `ConfigBreadcrumb` component
- **Espaçamento entre blocos:** 24px (mb-6)

### Tipografia

- **Título página:** 24px, bold
- **Labels:** `var(--text-label)`
- **Caption:** `var(--text-caption)`
- **Peso semibold:** `var(--font-weight-semibold)`

### Cores

- **Primary:** `var(--primary)` (laranja DOM)
- **Success:** `var(--chart-1)` (verde)
- **Warning:** `var(--chart-3)` (amarelo)
- **Error:** `var(--chart-4)` (vermelho)
- **Muted:** `var(--muted-foreground)`

### Ícones (lucide-react)

- Clock: timer/apontamento
- Play: iniciar
- Pause: pausar
- Square: stop
- X: fechar/cancelar
- ChevronLeft/Right: navegação
- AlertTriangle: warning
- CheckCircle2: sucesso

## Considerações Técnicas

### Performance

- **Timer update:** Usa `setInterval` com cleanup
- **Cálculos:** Memoizados com `useMemo` (totais, rows)
- **Re-renders:** Context otimizado com `useCallback`

### Persistência

- **Dados:** Mock data em memória (não persiste entre refreshes)
- **Timer state:** Perdido ao fechar navegador
- **Posição FloatingTimer:** Salva no contexto durante sessão

### Responsividade

- Tabela pode ter scroll horizontal em telas pequenas
- FloatingTimer adapta posição em viewports estreitas
- Filtros empilham em mobile

### Acessibilidade

- Inputs com labels adequados
- Botões com aria-labels
- Tooltips com informações contextuais
- Navegação por teclado funcional

## Próximos Passos

1. ✅ Design aprovado
2. 🔜 Criar plano de implementação detalhado
3. 🔜 Implementar tipos e Context
4. 🔜 Implementar FloatingTimer
5. 🔜 Implementar tela Apontar
6. 🔜 Integrar com Tarefas
7. 🔜 Testes de integração
8. 🔜 Ajustes finais e polish

## Anexos

### Referências de Design

- Figma Dom DS: https://www.figma.com/design/Q2p5d5mIahsEPxXYMOA16V/Dom-DS-Core-Web?node-id=0-1
- Padrão de layout: StatusIntegracao.tsx, Auditoria.tsx
- Componentes UI: src/app/components/ui/

### Decisões de Design

| Decisão | Justificativa |
|---------|---------------|
| Apenas um timer ativo | Evita confusão, simplifica UX |
| Formato HH:MM:SS | Precisão de segundos, consistente com timer |
| Parsing flexível | Facilita digitação rápida |
| Confirmação ao editar | Previne alterações acidentais |
| Aviso 8h (não bloqueio) | Informativo, não restritivo |
| Filtros encadeados | Reduz opções irrelevantes, guia o usuário |
| Seg-Sáb (não Dom) | Alinhado com semana de trabalho |
| Soma automática | Evita sobrescrever tempo acumulado |

---

**Fim do documento de design.**

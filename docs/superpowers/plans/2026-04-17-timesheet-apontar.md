# Sistema de Apontamento de Horas (Timesheet) - Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implementar sistema completo de apontamento de horas com cronômetro flutuante e entrada manual em tabela semanal.

**Architecture:** Context API para gerenciar estado global do timer e entries; componentes isolados (FloatingTimer, Apontar, TimeInput); integração com Tarefas existente via navegação e botões; dados mock em memória.

**Tech Stack:** React 18.3, TypeScript, Context API, Tailwind CSS, lucide-react, date-fns, sonner (toasts), Radix UI

---

## File Structure

**Files to create:**
- `src/app/types/timesheet.ts` - TypeScript interfaces (TimeEntry, TimerState, TimesheetRow, etc)
- `src/app/utils/time.ts` - Time manipulation utilities (formatDuration, parseDuration, addDurations, etc)
- `src/app/contexts/TimerContext.tsx` - Global timer state management with Context API
- `src/app/components/ui/time-input.tsx` - Specialized HH:MM:SS input component
- `src/app/components/FloatingTimer.tsx` - Draggable floating timer component
- `src/app/components/Apontar.tsx` - Main timesheet screen with filters and table

**Files to modify:**
- `src/app/App.tsx:801-850` - Wrap with TimerProvider, add FloatingTimer component
- `src/app/components/Tarefas.tsx` - Add TimerButton per task, integrate with timer context

---

### Task 1: TypeScript Types

**Files:**
- Create: `src/app/types/timesheet.ts`

- [ ] **Step 1: Create timesheet types file**

```typescript
// src/app/types/timesheet.ts

/**
 * Entrada de tempo individual registrada (manual ou via timer)
 */
export interface TimeEntry {
  id: string;
  tarefaId: number;
  tarefaNome: string;
  clienteNome: string;
  responsavel: string;
  data: string;              // 'YYYY-MM-DD'
  duracao: string;           // 'HH:MM:SS'
  duracaoSegundos: number;   // Para cálculos internos
  origem: 'manual' | 'timer';
}

/**
 * Estado do timer ativo (único por vez)
 */
export interface TimerState {
  tarefaId: number;
  tarefaNome: string;
  clienteNome: string;
  responsavel: string;
  iniciadoEm: number;        // timestamp em ms
  pausadoEm?: number;        // timestamp quando pausou (undefined se rodando)
  tempoAcumulado: number;    // segundos já contados antes de pausar
  rodando: boolean;          // true = contando, false = pausado
  posicao: { x: number; y: number }; // posição do floating timer na tela
}

/**
 * Linha da tabela de timesheet (agregação por tarefa)
 */
export interface TimesheetRow {
  tarefaId: number;
  tarefaNome: string;
  clienteNome: string;
  responsavel: string;
  dataVencimento: string;    // 'YYYY-MM-DD' para ordenação
  horas: {
    [dia: string]: string;   // 'YYYY-MM-DD' -> 'HH:MM:SS'
  };
  totalSemana: string;       // 'HH:MM:SS'
}

/**
 * Filtros da tela Apontar
 */
export interface ApontarFilters {
  clienteId: number | null;
  tarefaId: number | null;
  responsavelId: number | null;
}

/**
 * Semana sendo visualizada (Segunda a Sábado)
 */
export interface WeekView {
  inicio: Date;              // Segunda-feira
  fim: Date;                 // Sábado
  dias: Date[];              // Array de 6 dias [Seg, Ter, Qua, Qui, Sex, Sáb]
}

/**
 * Resultado de parsing de tempo
 */
export interface ParsedTime {
  horas: number;
  minutos: number;
  segundos: number;
  totalSegundos: number;
}

/**
 * Resultado de validação de input
 */
export interface ValidationResult {
  valid: boolean;
  normalized?: string;       // Formato normalizado (HH:MM:SS)
  error?: string;            // Mensagem de erro
}
```

- [ ] **Step 2: Commit types**

```bash
git add src/app/types/timesheet.ts
git commit -m "feat(timesheet): add TypeScript interfaces and types"
```

---

### Task 2: Time Utility Functions

**Files:**
- Create: `src/app/utils/time.ts`

- [ ] **Step 1: Create time utilities file with formatDuration**

```typescript
// src/app/utils/time.ts
import { ParsedTime, ValidationResult } from '../types/timesheet';

/**
 * Converte segundos para formato HH:MM:SS
 */
export function formatDuration(segundos: number): string {
  const horas = Math.floor(segundos / 3600);
  const minutos = Math.floor((segundos % 3600) / 60);
  const segs = segundos % 60;
  
  return `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}:${String(segs).padStart(2, '0')}`;
}

/**
 * Converte HH:MM:SS para segundos
 */
export function parseDuration(hhmmss: string): number {
  const parts = hhmmss.split(':').map(p => parseInt(p, 10));
  
  if (parts.length === 3) {
    const [h, m, s] = parts;
    return h * 3600 + m * 60 + s;
  }
  
  return 0;
}

/**
 * Soma duas durações em formato HH:MM:SS
 */
export function addDurations(d1: string, d2: string): string {
  const s1 = parseDuration(d1);
  const s2 = parseDuration(d2);
  return formatDuration(s1 + s2);
}
```

- [ ] **Step 2: Add flexible time input parser**

```typescript
// Adicionar ao final de src/app/utils/time.ts

/**
 * Parseia input flexível de tempo
 * Aceita: "230" -> 02:30:00, "2:30" -> 02:30:00, "2:30:15" -> 02:30:15
 */
export function parseTimeInput(input: string): ParsedTime | null {
  if (!input || input.trim() === '') return null;
  
  const cleaned = input.trim();
  
  // Formato completo: HH:MM:SS
  if (cleaned.includes(':')) {
    const parts = cleaned.split(':').map(p => parseInt(p, 10));
    
    if (parts.length === 2) {
      // HH:MM
      const [h, m] = parts;
      if (isNaN(h) || isNaN(m)) return null;
      return {
        horas: h,
        minutos: m,
        segundos: 0,
        totalSegundos: h * 3600 + m * 60
      };
    }
    
    if (parts.length === 3) {
      // HH:MM:SS
      const [h, m, s] = parts;
      if (isNaN(h) || isNaN(m) || isNaN(s)) return null;
      return {
        horas: h,
        minutos: m,
        segundos: s,
        totalSegundos: h * 3600 + m * 60 + s
      };
    }
    
    return null;
  }
  
  // Apenas números: trata como minutos totais
  const num = parseInt(cleaned, 10);
  if (isNaN(num)) return null;
  
  const horas = Math.floor(num / 60);
  const minutos = num % 60;
  
  return {
    horas,
    minutos,
    segundos: 0,
    totalSegundos: num * 60
  };
}
```

- [ ] **Step 3: Add validation function**

```typescript
// Adicionar ao final de src/app/utils/time.ts

/**
 * Valida e normaliza input de tempo
 */
export function validateTimeInput(valor: string): ValidationResult {
  if (!valor || valor.trim() === '' || valor === '00:00:00') {
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
  
  return { 
    valid: true, 
    normalized: formatDuration(parsed.totalSegundos) 
  };
}
```

- [ ] **Step 4: Add week calculation utilities**

```typescript
// Adicionar ao final de src/app/utils/time.ts
import { startOfWeek, addDays, format } from 'date-fns';
import { WeekView } from '../types/timesheet';

/**
 * Gera objeto WeekView para semana atual ou navegada
 * @param offset - Número de semanas para avançar/retroceder (0 = semana atual)
 */
export function getWeek(offset: number = 0): WeekView {
  const hoje = new Date();
  const inicioSemanaAtual = startOfWeek(hoje, { weekStartsOn: 1 }); // 1 = Segunda
  const inicioSemanaDesejada = addDays(inicioSemanaAtual, offset * 7);
  
  const dias: Date[] = [];
  for (let i = 0; i < 6; i++) {
    // Seg, Ter, Qua, Qui, Sex, Sáb (6 dias)
    dias.push(addDays(inicioSemanaDesejada, i));
  }
  
  return {
    inicio: inicioSemanaDesejada,
    fim: dias[5], // Sábado
    dias
  };
}

/**
 * Formata data para exibição (ex: "14/04")
 */
export function formatDayHeader(date: Date): string {
  return format(date, 'dd/MM');
}

/**
 * Formata intervalo de semana (ex: "14/04 - 19/04/2026")
 */
export function formatWeekRange(week: WeekView): string {
  const inicio = format(week.inicio, 'dd/MM');
  const fim = format(week.fim, 'dd/MM/yyyy');
  return `${inicio} - ${fim}`;
}
```

- [ ] **Step 5: Commit utility functions**

```bash
git add src/app/utils/time.ts
git commit -m "feat(timesheet): add time manipulation utility functions"
```

---

### Task 3: Mock Data

**Files:**
- Create: `src/app/data/mock-timesheet.ts`

- [ ] **Step 1: Create mock data file**

```typescript
// src/app/data/mock-timesheet.ts
import { TimeEntry } from '../types/timesheet';

/**
 * Mock de entries de tempo para desenvolvimento
 */
export const mockTimeEntries: TimeEntry[] = [
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
    tarefaId: 1,
    tarefaNome: 'DCTF Ago/25',
    clienteNome: 'Empresa ABC Ltda',
    responsavel: 'Fernanda',
    data: '2026-04-16', // Quarta
    duracao: '04:00:00',
    duracaoSegundos: 14400,
    origem: 'manual'
  },
  {
    id: 'e004',
    tarefaId: 1,
    tarefaNome: 'DCTF Ago/25',
    clienteNome: 'Empresa ABC Ltda',
    responsavel: 'Fernanda',
    data: '2026-04-17', // Quinta (hoje)
    duracao: '02:00:00',
    duracaoSegundos: 7200,
    origem: 'timer'
  },
  {
    id: 'e005',
    tarefaId: 1,
    tarefaNome: 'DCTF Ago/25',
    clienteNome: 'Empresa ABC Ltda',
    responsavel: 'Fernanda',
    data: '2026-04-18', // Sexta
    duracao: '01:30:00',
    duracaoSegundos: 5400,
    origem: 'manual'
  },
  {
    id: 'e006',
    tarefaId: 4,
    tarefaNome: 'REINF Out/25',
    clienteNome: 'Empresa ABC Ltda',
    responsavel: 'Maria Silva',
    data: '2026-04-14', // Segunda
    duracao: '01:00:00',
    duracaoSegundos: 3600,
    origem: 'timer'
  },
  {
    id: 'e007',
    tarefaId: 4,
    tarefaNome: 'REINF Out/25',
    clienteNome: 'Empresa ABC Ltda',
    responsavel: 'Maria Silva',
    data: '2026-04-15', // Terça
    duracao: '02:15:00',
    duracaoSegundos: 8100,
    origem: 'manual'
  },
  {
    id: 'e008',
    tarefaId: 4,
    tarefaNome: 'REINF Out/25',
    clienteNome: 'Empresa ABC Ltda',
    responsavel: 'Maria Silva',
    data: '2026-04-16', // Quarta
    duracao: '08:30:00', // > 8h (warning test case)
    duracaoSegundos: 30600,
    origem: 'timer'
  },
  {
    id: 'e009',
    tarefaId: 4,
    tarefaNome: 'REINF Out/25',
    clienteNome: 'Empresa ABC Ltda',
    responsavel: 'Maria Silva',
    data: '2026-04-17', // Quinta
    duracao: '05:45:00',
    duracaoSegundos: 20700,
    origem: 'timer'
  },
  {
    id: 'e010',
    tarefaId: 4,
    tarefaNome: 'REINF Out/25',
    clienteNome: 'Empresa ABC Ltda',
    responsavel: 'Maria Silva',
    data: '2026-04-18', // Sexta
    duracao: '05:00:00',
    duracaoSegundos: 18000,
    origem: 'manual'
  },
  {
    id: 'e011',
    tarefaId: 4,
    tarefaNome: 'REINF Out/25',
    clienteNome: 'Empresa ABC Ltda',
    responsavel: 'Maria Silva',
    data: '2026-04-19', // Sábado
    duracao: '02:00:00',
    duracaoSegundos: 7200,
    origem: 'timer'
  },
];
```

- [ ] **Step 2: Commit mock data**

```bash
git add src/app/data/mock-timesheet.ts
git commit -m "feat(timesheet): add mock time entries data"
```

---

### Task 4: TimerContext - Setup

**Files:**
- Create: `src/app/contexts/TimerContext.tsx`

- [ ] **Step 1: Create context with interface and initial setup**

```typescript
// src/app/contexts/TimerContext.tsx
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { TimeEntry, TimerState, TimesheetRow, ApontarFilters } from '../types/timesheet';
import { formatDuration, parseDuration, addDurations } from '../utils/time';
import { mockTimeEntries } from '../data/mock-timesheet';

interface TimerContextValue {
  // Estado do timer
  timerState: TimerState | null;
  tempoAtual: number; // segundos, atualizado a cada segundo
  
  // Dados de apontamentos
  entries: TimeEntry[];
  timesheetRows: TimesheetRow[];
  
  // Ações do timer
  startTimer: (tarefa: { id: number; nome: string; cliente: string; responsavel: string }) => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  stopTimer: () => void;
  discardTimer: () => void;
  updateTimerPosition: (x: number, y: number) => void;
  toggleMinimized: () => void;
  isMinimized: boolean;
  
  // Ações de apontamento manual
  addTimeEntry: (tarefaId: number, data: string, duracao: string) => void;
  updateTimeEntry: (tarefaId: number, data: string, novaDuracao: string) => void;
  
  // Queries
  getTotalPorDia: (data: string) => string;
  getTotalPorTarefa: (tarefaId: number, dias: string[]) => string;
  getEntryPorTarefaDia: (tarefaId: number, data: string) => string;
}

const TimerContext = createContext<TimerContextValue | undefined>(undefined);

export function useTimer() {
  const context = useContext(TimerContext);
  if (!context) {
    throw new Error('useTimer must be used within TimerProvider');
  }
  return context;
}
```

- [ ] **Step 2: Add TimerProvider component with state**

```typescript
// Adicionar ao final de src/app/contexts/TimerContext.tsx

export function TimerProvider({ children }: { children: React.ReactNode }) {
  const [timerState, setTimerState] = useState<TimerState | null>(null);
  const [tempoAtual, setTempoAtual] = useState<number>(0);
  const [entries, setEntries] = useState<TimeEntry[]>(mockTimeEntries);
  const [isMinimized, setIsMinimized] = useState(false);
  
  // Atualizar tempo a cada segundo quando timer está rodando
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

- [ ] **Step 3: Commit context setup**

```bash
git add src/app/contexts/TimerContext.tsx
git commit -m "feat(timesheet): create TimerContext with initial setup"
```

---

### Task 5: TimerContext - Timer Actions

**Files:**
- Modify: `src/app/contexts/TimerContext.tsx`

- [ ] **Step 1: Implement startTimer function**

```typescript
// Adicionar dentro do TimerProvider, após os useEffects

  const startTimer = useCallback((tarefa: { id: number; nome: string; cliente: string; responsavel: string }) => {
    // Verificar se já existe timer ativo
    if (timerState && timerState.tarefaId !== tarefa.id) {
      toast.error('Já existe um cronômetro ativo. Pare o cronômetro atual antes de iniciar outro.');
      // TODO: trigger shake animation (será implementado no FloatingTimer)
      return;
    }
    
    // Se já existe timer para esta tarefa, apenas retomar
    if (timerState && timerState.tarefaId === tarefa.id) {
      resumeTimer();
      return;
    }
    
    // Iniciar novo timer
    const agora = Date.now();
    setTimerState({
      tarefaId: tarefa.id,
      tarefaNome: tarefa.nome,
      clienteNome: tarefa.cliente,
      responsavel: tarefa.responsavel,
      iniciadoEm: agora,
      pausadoEm: undefined,
      tempoAcumulado: 0,
      rodando: true,
      posicao: { x: window.innerWidth - 350, y: window.innerHeight - 180 } // Bottom-right
    });
    setTempoAtual(0);
    setIsMinimized(false);
  }, [timerState]);
```

- [ ] **Step 2: Implement pause and resume functions**

```typescript
// Adicionar após startTimer

  const pauseTimer = useCallback(() => {
    if (!timerState || !timerState.rodando) return;
    
    const agora = Date.now();
    const decorrido = Math.floor((agora - timerState.iniciadoEm) / 1000);
    
    setTimerState({
      ...timerState,
      pausadoEm: agora,
      tempoAcumulado: timerState.tempoAcumulado + decorrido,
      rodando: false
    });
  }, [timerState]);
  
  const resumeTimer = useCallback(() => {
    if (!timerState || timerState.rodando) return;
    
    const agora = Date.now();
    setTimerState({
      ...timerState,
      iniciadoEm: agora,
      pausadoEm: undefined,
      rodando: true
    });
  }, [timerState]);
```

- [ ] **Step 3: Implement stopTimer function**

```typescript
// Adicionar após resumeTimer

  const stopTimer = useCallback(() => {
    if (!timerState) return;
    
    const hoje = format(new Date(), 'yyyy-MM-dd');
    const duracao = formatDuration(tempoAtual);
    
    // Adicionar entry
    addTimeEntry(timerState.tarefaId, hoje, duracao);
    
    // Limpar timer
    setTimerState(null);
    setTempoAtual(0);
    setIsMinimized(false);
    
    toast.success(`Tempo lançado: ${duracao}`);
  }, [timerState, tempoAtual]);
```

- [ ] **Step 4: Implement discardTimer and helper functions**

```typescript
// Adicionar após stopTimer

  const discardTimer = useCallback(() => {
    const confirma = window.confirm(
      `Descartar tempo sem salvar? (${formatDuration(tempoAtual)} será perdido)`
    );
    
    if (confirma) {
      setTimerState(null);
      setTempoAtual(0);
      setIsMinimized(false);
    }
  }, [tempoAtual]);
  
  const updateTimerPosition = useCallback((x: number, y: number) => {
    if (!timerState) return;
    setTimerState({
      ...timerState,
      posicao: { x, y }
    });
  }, [timerState]);
  
  const toggleMinimized = useCallback(() => {
    setIsMinimized(prev => !prev);
  }, []);
```

- [ ] **Step 5: Commit timer actions**

```bash
git add src/app/contexts/TimerContext.tsx
git commit -m "feat(timesheet): implement timer control functions"
```

---

### Task 6: TimerContext - Time Entry Management

**Files:**
- Modify: `src/app/contexts/TimerContext.tsx`

- [ ] **Step 1: Implement addTimeEntry function**

```typescript
// Adicionar após toggleMinimized

  const addTimeEntry = useCallback((tarefaId: number, data: string, duracao: string) => {
    const existing = entries.find(e => 
      e.tarefaId === tarefaId && e.data === data
    );
    
    if (existing) {
      // Somar com o existente
      const novoTotal = addDurations(existing.duracao, duracao);
      updateTimeEntry(tarefaId, data, novoTotal);
    } else {
      // Criar novo entry
      const tarefaInfo = entries.find(e => e.tarefaId === tarefaId);
      const newEntry: TimeEntry = {
        id: `e${Date.now()}`,
        tarefaId,
        tarefaNome: tarefaInfo?.tarefaNome || 'Tarefa',
        clienteNome: tarefaInfo?.clienteNome || 'Cliente',
        responsavel: tarefaInfo?.responsavel || 'Responsável',
        data,
        duracao,
        duracaoSegundos: parseDuration(duracao),
        origem: 'manual'
      };
      
      setEntries(prev => [...prev, newEntry]);
    }
  }, [entries]);
```

- [ ] **Step 2: Implement updateTimeEntry function**

```typescript
// Adicionar após addTimeEntry

  const updateTimeEntry = useCallback((tarefaId: number, data: string, novaDuracao: string) => {
    setEntries(prev => prev.map(e => {
      if (e.tarefaId === tarefaId && e.data === data) {
        return {
          ...e,
          duracao: novaDuracao,
          duracaoSegundos: parseDuration(novaDuracao)
        };
      }
      return e;
    }));
  }, []);
```

- [ ] **Step 3: Implement query functions**

```typescript
// Adicionar após updateTimeEntry

  const getTotalPorDia = useCallback((data: string): string => {
    const totalSegundos = entries
      .filter(e => e.data === data)
      .reduce((sum, e) => sum + e.duracaoSegundos, 0);
    
    return formatDuration(totalSegundos);
  }, [entries]);
  
  const getTotalPorTarefa = useCallback((tarefaId: number, dias: string[]): string => {
    const totalSegundos = entries
      .filter(e => e.tarefaId === tarefaId && dias.includes(e.data))
      .reduce((sum, e) => sum + e.duracaoSegundos, 0);
    
    return formatDuration(totalSegundos);
  }, [entries]);
  
  const getEntryPorTarefaDia = useCallback((tarefaId: number, data: string): string => {
    const entry = entries.find(e => e.tarefaId === tarefaId && e.data === data);
    return entry ? entry.duracao : '00:00:00';
  }, [entries]);
```

- [ ] **Step 4: Commit entry management**

```bash
git add src/app/contexts/TimerContext.tsx
git commit -m "feat(timesheet): implement time entry management functions"
```

---

### Task 7: TimerContext - Timesheet Rows Computation

**Files:**
- Modify: `src/app/contexts/TimerContext.tsx`

- [ ] **Step 1: Add timesheetRows computation with useMemo**

```typescript
// Adicionar após getEntryPorTarefaDia, antes do return

  // Computar rows da tabela (agrupados por tarefa)
  const timesheetRows = useMemo(() => {
    const tarefasUnicas = new Map<number, TimeEntry>();
    
    // Coletar tarefas únicas
    entries.forEach(entry => {
      if (!tarefasUnicas.has(entry.tarefaId)) {
        tarefasUnicas.set(entry.tarefaId, entry);
      }
    });
    
    // Converter para rows
    const rows: TimesheetRow[] = [];
    
    tarefasUnicas.forEach((entry, tarefaId) => {
      const horasPorDia: { [dia: string]: string } = {};
      let totalSegundos = 0;
      
      // Agrupar entries desta tarefa
      const tarefaEntries = entries.filter(e => e.tarefaId === tarefaId);
      
      tarefaEntries.forEach(e => {
        if (horasPorDia[e.data]) {
          // Já existe entry neste dia, somar
          horasPorDia[e.data] = addDurations(horasPorDia[e.data], e.duracao);
        } else {
          horasPorDia[e.data] = e.duracao;
        }
        totalSegundos += e.duracaoSegundos;
      });
      
      rows.push({
        tarefaId,
        tarefaNome: entry.tarefaNome,
        clienteNome: entry.clienteNome,
        responsavel: entry.responsavel,
        dataVencimento: '2026-05-01', // Mock - TODO: pegar da tarefa real
        horas: horasPorDia,
        totalSemana: formatDuration(totalSegundos)
      });
    });
    
    // Ordenar por data de vencimento (mock fixo por enquanto)
    rows.sort((a, b) => a.dataVencimento.localeCompare(b.dataVencimento));
    
    return rows;
  }, [entries]);
```

- [ ] **Step 2: Add context value and provider return**

```typescript
// Adicionar após timesheetRows

  const value: TimerContextValue = {
    timerState,
    tempoAtual,
    entries,
    timesheetRows,
    startTimer,
    pauseTimer,
    resumeTimer,
    stopTimer,
    discardTimer,
    updateTimerPosition,
    toggleMinimized,
    isMinimized,
    addTimeEntry,
    updateTimeEntry,
    getTotalPorDia,
    getTotalPorTarefa,
    getEntryPorTarefaDia
  };
  
  return (
    <TimerContext.Provider value={value}>
      {children}
    </TimerContext.Provider>
  );
}
```

- [ ] **Step 3: Commit context completion**

```bash
git add src/app/contexts/TimerContext.tsx
git commit -m "feat(timesheet): complete TimerContext with rows computation"
```

---

### Task 8: TimeInput Component

**Files:**
- Create: `src/app/components/ui/time-input.tsx`

- [ ] **Step 1: Create TimeInput component**

```typescript
// src/app/components/ui/time-input.tsx
import React, { useState, useEffect } from 'react';
import { validateTimeInput } from '@/app/utils/time';
import { cn } from './utils';

interface TimeInputProps {
  value: string; // HH:MM:SS
  onChange: (newValue: string) => void;
  onConfirm?: (oldValue: string, newValue: string) => boolean; // return true to apply
  className?: string;
}

export function TimeInput({ value, onChange, onConfirm, className }: TimeInputProps) {
  const [inputValue, setInputValue] = useState(value);
  const [error, setError] = useState<string | null>(null);
  
  // Sincronizar com prop external
  useEffect(() => {
    setInputValue(value);
  }, [value]);
  
  const handleBlur = () => {
    setError(null);
    
    // Se vazio ou igual ao original, não faz nada
    if (!inputValue || inputValue === value) {
      setInputValue(value);
      return;
    }
    
    // Validar
    const validation = validateTimeInput(inputValue);
    
    if (!validation.valid) {
      setError(validation.error || 'Formato inválido');
      setInputValue(value); // Reverter
      return;
    }
    
    const normalized = validation.normalized!;
    
    // Se existe valor anterior não-zero, pedir confirmação
    if (value !== '00:00:00' && normalized !== value && onConfirm) {
      const confirma = onConfirm(value, normalized);
      if (!confirma) {
        setInputValue(value); // Cancelou, reverter
        return;
      }
    }
    
    // Aplicar
    setInputValue(normalized);
    onChange(normalized);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur();
    }
    if (e.key === 'Escape') {
      setInputValue(value);
      e.currentTarget.blur();
    }
  };
  
  return (
    <div className="relative">
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        placeholder="00:00:00"
        className={cn(
          "w-20 px-2 py-1 text-sm text-center",
          "border rounded",
          "focus:outline-none focus:ring-2 focus:ring-primary",
          error && "border-red-500",
          className
        )}
      />
      {error && (
        <div className="absolute z-10 mt-1 px-2 py-1 bg-red-50 border border-red-200 rounded text-xs text-red-600">
          {error}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Commit TimeInput component**

```bash
git add src/app/components/ui/time-input.tsx
git commit -m "feat(timesheet): create TimeInput component with validation"
```

---

### Task 9: FloatingTimer Component - Structure

**Files:**
- Create: `src/app/components/FloatingTimer.tsx`

- [ ] **Step 1: Create FloatingTimer with basic structure**

```typescript
// src/app/components/FloatingTimer.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Square, X, Minimize2, Maximize2 } from 'lucide-react';
import { useTimer } from '../contexts/TimerContext';
import { formatDuration } from '../utils/time';

export function FloatingTimer() {
  const {
    timerState,
    tempoAtual,
    pauseTimer,
    resumeTimer,
    stopTimer,
    discardTimer,
    updateTimerPosition,
    toggleMinimized,
    isMinimized
  } = useTimer();
  
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const timerRef = useRef<HTMLDivElement>(null);
  
  // Não renderizar se não há timer ativo
  if (!timerState) return null;
  
  const tempoFormatado = formatDuration(tempoAtual);
```

- [ ] **Step 2: Add drag handlers**

```typescript
// Adicionar após tempoFormatado

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button')) {
      // Não iniciar drag se clicou em botão
      return;
    }
    
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - timerState.posicao.x,
      y: e.clientY - timerState.posicao.y
    });
  };
  
  useEffect(() => {
    if (!isDragging) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;
      
      // Limitar às bordas da tela
      const maxX = window.innerWidth - (isMinimized ? 180 : 340);
      const maxY = window.innerHeight - (isMinimized ? 80 : 160);
      
      const boundedX = Math.max(0, Math.min(newX, maxX));
      const boundedY = Math.max(0, Math.min(newY, maxY));
      
      updateTimerPosition(boundedX, boundedY);
    };
    
    const handleMouseUp = () => {
      setIsDragging(false);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset, isMinimized, updateTimerPosition]);
```

- [ ] **Step 3: Commit FloatingTimer structure**

```bash
git add src/app/components/FloatingTimer.tsx
git commit -m "feat(timesheet): create FloatingTimer structure with drag support"
```

---

### Task 10: FloatingTimer Component - UI

**Files:**
- Modify: `src/app/components/FloatingTimer.tsx`

- [ ] **Step 1: Add expanded view UI**

```typescript
// Adicionar após os useEffects, antes do return null check

  if (isMinimized) {
    return (
      <div
        ref={timerRef}
        onMouseDown={handleMouseDown}
        onClick={toggleMinimized}
        style={{
          position: 'fixed',
          left: `${timerState.posicao.x}px`,
          top: `${timerState.posicao.y}px`,
          zIndex: 9999,
          cursor: isDragging ? 'grabbing' : 'grab'
        }}
        className="bg-card border-2 border-primary rounded-lg shadow-2xl p-3 flex items-center gap-2 animate-in fade-in duration-200"
      >
        <div className="text-2xl font-mono font-bold text-primary">
          {tempoFormatado}
        </div>
        {timerState.rodando ? (
          <Pause className="text-primary" size={20} />
        ) : (
          <Play className="text-muted-foreground" size={20} />
        )}
      </div>
    );
  }
  
  return (
    <div
      ref={timerRef}
      onMouseDown={handleMouseDown}
      style={{
        position: 'fixed',
        left: `${timerState.posicao.x}px`,
        top: `${timerState.posicao.y}px`,
        zIndex: 9999,
        cursor: isDragging ? 'grabbing' : 'grab',
        opacity: timerState.rodando ? 1 : 0.9
      }}
      className="bg-card border-2 border-primary rounded-lg shadow-2xl w-80 animate-in fade-in duration-200"
    >
      {/* Header com título e fechar */}
      <div className="flex items-start justify-between p-3 border-b">
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold truncate text-foreground">
            {timerState.tarefaNome}
          </div>
          <div className="text-xs text-muted-foreground truncate">
            {timerState.clienteNome}
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            discardTimer();
          }}
          className="shrink-0 ml-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X size={16} />
        </button>
      </div>
```

- [ ] **Step 2: Add timer display and controls**

```typescript
// Adicionar continuação do JSX

      {/* Timer display */}
      <div className="p-4 flex flex-col items-center">
        <div className="text-4xl font-mono font-bold text-primary mb-4">
          {tempoFormatado}
        </div>
        
        {/* Controles */}
        <div className="flex gap-2">
          {timerState.rodando ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                pauseTimer();
              }}
              className="flex items-center gap-2 px-4 py-2 bg-muted hover:bg-muted/80 rounded-md transition-colors"
            >
              <Pause size={16} />
              <span className="text-sm">Pausar</span>
            </button>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                resumeTimer();
              }}
              className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-md transition-colors"
            >
              <Play size={16} />
              <span className="text-sm">Retomar</span>
            </button>
          )}
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              stopTimer();
            }}
            className="flex items-center gap-2 px-4 py-2 bg-chart-1 hover:bg-chart-1/90 text-white rounded-md transition-colors"
          >
            <Square size={16} />
            <span className="text-sm">Parar</span>
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleMinimized();
            }}
            className="p-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Minimize2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Commit FloatingTimer UI**

```bash
git add src/app/components/FloatingTimer.tsx
git commit -m "feat(timesheet): complete FloatingTimer UI with controls"
```

---

### Task 11: Integrate TimerProvider into App

**Files:**
- Modify: `src/app/App.tsx`

- [ ] **Step 1: Add imports at top of App.tsx**

```typescript
// Adicionar após linha 25 (após import GeradorTarefas)
import { TimerProvider } from './contexts/TimerContext';
import { FloatingTimer } from './components/FloatingTimer';
import { Apontar } from './components/Apontar';
```

- [ ] **Step 2: Add 'apontar' to ActiveTab type**

```typescript
// Modificar linha 29-37, adicionar 'apontar' ao type
type ActiveTab =
  | 'visao-geral'
  | 'tarefas'
  | 'documentos-express'
  | 'circular'
  | 'status-integracao'
  | 'relatorios'
  | 'auditoria'
  | 'configuracoes'
  | 'apontar';
```

- [ ] **Step 3: Wrap return with TimerProvider**

Encontrar a linha 822 com `return (` e envolver todo o JSX com TimerProvider:

```typescript
// Linha 822 - modificar de:
  return (
    <div className="flex flex-col" ...>
    
// Para:
  return (
    <TimerProvider>
      <div className="flex flex-col" style={{ width: '100vw', height: '100vh', background: 'var(--background)', overflow: 'hidden' }}>
```

E adicionar fechamento do provider no final, antes do último parêntese:

```typescript
      </div>
      <FloatingTimer />
    </TimerProvider>
  );
}
```

- [ ] **Step 4: Add Apontar to tab rendering**

Encontrar o bloco de renderização de tabs (ao redor da linha 850+) e adicionar case para 'apontar':

```typescript
// Adicionar após o case de 'tarefas':
              {activeTab === 'apontar' && <Apontar />}
```

- [ ] **Step 5: Commit App integration**

```bash
git add src/app/App.tsx
git commit -m "feat(timesheet): integrate TimerProvider and FloatingTimer into App"
```

---

### Task 12: Apontar Component - Setup and Filters

**Files:**
- Create: `src/app/components/Apontar.tsx`

- [ ] **Step 1: Create Apontar with imports and setup**

```typescript
// src/app/components/Apontar.tsx
import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Clock, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { useTimer } from '../contexts/TimerContext';
import { getWeek, formatDayHeader, formatWeekRange, parseDuration } from '../utils/time';
import { TimeInput } from './ui/time-input';
import { WhiteBlock } from './ui/white-block';
import { colors } from '../../design-tokens';
import { ConfigBreadcrumb } from './ConfigBreadcrumb';

export function Apontar() {
  const {
    timesheetRows,
    entries,
    getTotalPorDia,
    updateTimeEntry
  } = useTimer();
  
  const [weekOffset, setWeekOffset] = useState(0);
  const [clienteFiltro, setClienteFiltro] = useState<string | null>(null);
  const [tarefaFiltro, setTarefaFiltro] = useState<number | null>(null);
  const [responsavelFiltro, setResponsavelFiltro] = useState<string | null>(null);
  
  const week = useMemo(() => getWeek(weekOffset), [weekOffset]);
  const weekDates = useMemo(() => week.dias.map(d => format(d, 'yyyy-MM-dd')), [week]);
```

- [ ] **Step 2: Add filter options computation**

```typescript
// Adicionar após weekDates

  // Opções de filtros
  const clientesDisponiveis = useMemo(() => {
    const clientes = new Set(timesheetRows.map(r => r.clienteNome));
    return Array.from(clientes).sort();
  }, [timesheetRows]);
  
  const tarefasDisponiveis = useMemo(() => {
    if (!clienteFiltro) return [];
    
    return timesheetRows
      .filter(r => r.clienteNome === clienteFiltro)
      .map(r => ({ id: r.tarefaId, nome: r.tarefaNome }));
  }, [timesheetRows, clienteFiltro]);
  
  const responsaveisDisponiveis = useMemo(() => {
    if (!tarefaFiltro) return [];
    
    const responsaveis = new Set(
      timesheetRows
        .filter(r => r.tarefaId === tarefaFiltro)
        .map(r => r.responsavel)
    );
    return Array.from(responsaveis).sort();
  }, [timesheetRows, tarefaFiltro]);
```

- [ ] **Step 3: Add filtered rows computation**

```typescript
// Adicionar após responsaveisDisponiveis

  // Rows filtrados
  const filteredRows = useMemo(() => {
    return timesheetRows.filter(row => {
      if (clienteFiltro && row.clienteNome !== clienteFiltro) return false;
      if (tarefaFiltro && row.tarefaId !== tarefaFiltro) return false;
      if (responsavelFiltro && row.responsavel !== responsavelFiltro) return false;
      return true;
    });
  }, [timesheetRows, clienteFiltro, tarefaFiltro, responsavelFiltro]);
  
  const handleLimparFiltros = () => {
    setClienteFiltro(null);
    setTarefaFiltro(null);
    setResponsavelFiltro(null);
  };
  
  const handleTimeChange = (tarefaId: number, data: string, novoValor: string) => {
    updateTimeEntry(tarefaId, data, novoValor);
  };
  
  const handleConfirmChange = (oldValue: string, newValue: string): boolean => {
    if (oldValue === '00:00:00') return true; // Sem confirmação para valor novo
    
    const confirma = window.confirm(
      `Tem certeza que deseja alterar de ${oldValue} para ${newValue}?`
    );
    return confirma;
  };
```

- [ ] **Step 4: Commit Apontar setup**

```bash
git add src/app/components/Apontar.tsx
git commit -m "feat(timesheet): create Apontar component with filters logic"
```

---

### Task 13: Apontar Component - UI Layout

**Files:**
- Modify: `src/app/components/Apontar.tsx`

- [ ] **Step 1: Add main layout with breadcrumb and filters**

```typescript
// Adicionar return no final do componente

  return (
    <div
      style={{
        padding: '24px',
        background: colors.elements['background 02'],
        minHeight: '100%'
      }}
    >
      {/* Breadcrumb */}
      <ConfigBreadcrumb
        crumbs={[
          { label: 'Tarefas', onClick: () => {/* TODO: navegar para tarefas */} },
          { label: 'Apontar' }
        ]}
      />
      
      {/* Filtros */}
      <WhiteBlock className="mb-6">
        <div className="flex items-center gap-4 flex-wrap">
          {/* Cliente */}
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium mb-1">Cliente</label>
            <select
              value={clienteFiltro || ''}
              onChange={(e) => {
                setClienteFiltro(e.target.value || null);
                setTarefaFiltro(null);
                setResponsavelFiltro(null);
              }}
              className="w-full px-3 py-2 border rounded-md bg-background"
            >
              <option value="">Todos os clientes</option>
              {clientesDisponiveis.map(cliente => (
                <option key={cliente} value={cliente}>{cliente}</option>
              ))}
            </select>
          </div>
          
          {/* Tarefa */}
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium mb-1">Tarefa</label>
            <select
              value={tarefaFiltro || ''}
              onChange={(e) => {
                setTarefaFiltro(e.target.value ? parseInt(e.target.value) : null);
                setResponsavelFiltro(null);
              }}
              disabled={!clienteFiltro}
              className="w-full px-3 py-2 border rounded-md bg-background disabled:opacity-50"
            >
              <option value="">Todas as tarefas</option>
              {tarefasDisponiveis.map(tarefa => (
                <option key={tarefa.id} value={tarefa.id}>{tarefa.nome}</option>
              ))}
            </select>
          </div>
          
          {/* Responsável */}
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium mb-1">Responsável</label>
            <select
              value={responsavelFiltro || ''}
              onChange={(e) => setResponsavelFiltro(e.target.value || null)}
              disabled={!tarefaFiltro}
              className="w-full px-3 py-2 border rounded-md bg-background disabled:opacity-50"
            >
              <option value="">Todos os responsáveis</option>
              {responsaveisDisponiveis.map(resp => (
                <option key={resp} value={resp}>{resp}</option>
              ))}
            </select>
          </div>
          
          {/* Limpar */}
          <div className="flex items-end">
            <button
              onClick={handleLimparFiltros}
              disabled={!clienteFiltro && !tarefaFiltro && !responsavelFiltro}
              className="px-4 py-2 text-sm border rounded-md hover:bg-muted transition-colors disabled:opacity-50"
            >
              Limpar filtros
            </button>
          </div>
        </div>
      </WhiteBlock>
```

- [ ] **Step 2: Commit filters UI**

```bash
git add src/app/components/Apontar.tsx
git commit -m "feat(timesheet): add filters UI to Apontar screen"
```

---

### Task 14: Apontar Component - Timesheet Table

**Files:**
- Modify: `src/app/components/Apontar.tsx`

- [ ] **Step 1: Add week navigation and table header**

```typescript
// Adicionar após WhiteBlock de filtros

      {/* Tabela */}
      <WhiteBlock>
        {/* Navegação de semana */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setWeekOffset(prev => prev - 1)}
            className="p-2 hover:bg-muted rounded transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          
          <div className="text-sm font-medium">
            {formatWeekRange(week)}
          </div>
          
          <button
            onClick={() => setWeekOffset(prev => prev + 1)}
            className="p-2 hover:bg-muted rounded transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>
        
        {/* Tabela */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2">
                <th className="text-left p-2 font-semibold min-w-[200px]">Tarefa</th>
                {week.dias.map((dia, idx) => (
                  <th key={idx} className="text-center p-2 font-semibold w-24">
                    <div className="text-xs text-muted-foreground">
                      {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'][idx]}
                    </div>
                    <div className="text-sm">
                      {formatDayHeader(dia)}
                    </div>
                  </th>
                ))}
                <th className="text-center p-2 font-semibold w-24">Total</th>
              </tr>
```

- [ ] **Step 2: Add totals row**

```typescript
// Adicionar continuação da thead

              {/* Linha de totais */}
              <tr className="bg-muted/30 border-b">
                <td className="p-2 font-semibold">Total</td>
                {weekDates.map((data, idx) => {
                  const totalDia = getTotalPorDia(data);
                  const totalSegundos = parseDuration(totalDia);
                  const excede8h = totalSegundos > 28800; // 8h = 28800s
                  
                  return (
                    <td key={idx} className="text-center p-2">
                      <div className="flex items-center justify-center gap-1">
                        {excede8h && (
                          <AlertTriangle 
                            size={14} 
                            className="text-yellow-600" 
                            title={`Total do dia excede 8 horas (${totalDia})`}
                          />
                        )}
                        <span className={excede8h ? 'text-yellow-600 font-semibold' : 'font-medium'}>
                          {totalDia}
                        </span>
                      </div>
                    </td>
                  );
                })}
                <td className="text-center p-2 font-semibold">
                  {/* Total geral da semana - calculado dinamicamente */}
                  {(() => {
                    const totalSegundos = weekDates.reduce((sum, data) => {
                      return sum + parseDuration(getTotalPorDia(data));
                    }, 0);
                    return formatDuration(totalSegundos);
                  })()}
                </td>
              </tr>
            </thead>
```

- [ ] **Step 3: Add table body with rows**

```typescript
// Adicionar tbody após thead

            <tbody>
              {filteredRows.map(row => (
                <tr key={row.tarefaId} className="border-b hover:bg-muted/20">
                  <td className="p-2">
                    <div className="font-medium text-sm">{row.tarefaNome}</div>
                    <div className="text-xs text-muted-foreground">{row.clienteNome}</div>
                  </td>
                  
                  {weekDates.map((data, idx) => (
                    <td key={idx} className="text-center p-2">
                      <TimeInput
                        value={row.horas[data] || '00:00:00'}
                        onChange={(novoValor) => handleTimeChange(row.tarefaId, data, novoValor)}
                        onConfirm={handleConfirmChange}
                        className="mx-auto"
                      />
                    </td>
                  ))}
                  
                  <td className="text-center p-2 font-semibold text-sm">
                    {row.totalSemana}
                  </td>
                </tr>
              ))}
              
              {filteredRows.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center p-8 text-muted-foreground">
                    Nenhuma tarefa encontrada
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </WhiteBlock>
    </div>
  );
}
```

- [ ] **Step 4: Commit timesheet table**

```bash
git add src/app/components/Apontar.tsx
git commit -m "feat(timesheet): complete Apontar timesheet table with week navigation"
```

---

### Task 15: Tarefas Integration - Timer Button Component

**Files:**
- Modify: `src/app/components/Tarefas.tsx`

- [ ] **Step 1: Add imports to Tarefas.tsx**

Adicionar no topo do arquivo, após os imports existentes:

```typescript
import { useTimer } from '../contexts/TimerContext';
import { formatDuration } from '../utils/time';
import { Play, Square } from 'lucide-react';
```

- [ ] **Step 2: Add useTimer hook inside Tarefas component**

Encontrar o componente `export function Tarefas` e adicionar no início do componente:

```typescript
// Adicionar após os useState existentes no componente Tarefas
  const { timerState, tempoAtual, startTimer, stopTimer } = useTimer();
```

- [ ] **Step 3: Create TimerButton subcomponent**

Adicionar antes do return do componente Tarefas:

```typescript
// Adicionar antes do return principal do componente Tarefas

  // Subcomponente: TimerButton por tarefa
  const TimerButton = ({ tarefa }: { tarefa: any }) => {
    const isThisTimerRunning = timerState?.tarefaId === tarefa.id;
    const tempoExibir = isThisTimerRunning ? formatDuration(tempoAtual) : '00:00:00';
    
    const handleClick = () => {
      if (isThisTimerRunning) {
        // Parar timer
        stopTimer();
      } else {
        // Iniciar timer
        startTimer({
          id: tarefa.id,
          nome: tarefa.nome,
          cliente: tarefa.empresa,
          responsavel: tarefa.responsavel
        });
      }
    };
    
    return (
      <button
        onClick={handleClick}
        className={`
          flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors
          ${isThisTimerRunning 
            ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
            : 'bg-muted hover:bg-muted/80'
          }
        `}
      >
        <span className="font-mono text-xs">{tempoExibir}</span>
        {isThisTimerRunning ? (
          <Square size={14} fill="currentColor" />
        ) : (
          <Play size={14} />
        )}
      </button>
    );
  };
```

- [ ] **Step 4: Commit timer button component**

```bash
git add src/app/components/Tarefas.tsx
git commit -m "feat(timesheet): add TimerButton component to Tarefas"
```

---

### Task 16: Tarefas Integration - Add Buttons to UI

**Files:**
- Modify: `src/app/components/Tarefas.tsx`

- [ ] **Step 1: Find and update the header "Apontar" button**

O botão já existe na linha 338. Modificar o onClick para navegar para a tela Apontar. Procurar por:

```typescript
// Localizar ao redor da linha 338:
<button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors">
  <Clock size={18} />
  Apontar
</button>
```

Adicionar onClick:

```typescript
<button 
  onClick={() => {/* TODO: navegar para /apontar - será implementado quando integrar routing */}}
  className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
>
  <Clock size={18} />
  Apontar
</button>
```

- [ ] **Step 2: Add TimerButton to task rows in list view**

Procurar pela renderização das tarefas na view "lista". Adicionar o TimerButton em cada linha de tarefa. O local exato depende da estrutura, mas geralmente está dentro do map das tarefas. Adicionar junto aos outros botões de ação:

```typescript
// Dentro do map de tarefas na view lista, adicionar:
<TimerButton tarefa={tarefa} />
```

- [ ] **Step 3: Add TimerButton to kanban cards**

Da mesma forma, encontrar o map das tarefas na view "kanban" e adicionar:

```typescript
// Dentro do map de tarefas na view kanban, adicionar:
<TimerButton tarefa={tarefa} />
```

- [ ] **Step 4: Commit Tarefas integration**

```bash
git add src/app/components/Tarefas.tsx
git commit -m "feat(timesheet): integrate TimerButton into Tarefas list and kanban views"
```

**Note:** As mudanças exatas de onde adicionar o TimerButton dependem da estrutura do Tarefas.tsx. Durante a implementação, procurar pelas renderizações das tarefas em cada view e adicionar o botão junto com os outros controles.

---

### Task 17: Add "Ver Apontamentos" Navigation

**Files:**
- Modify: `src/app/components/Tarefas.tsx`
- Modify: `src/app/components/Apontar.tsx`

- [ ] **Step 1: Add navigation support to Apontar**

Modificar Apontar.tsx para aceitar filtros iniciais via props ou URL params:

```typescript
// No início do componente Apontar, modificar para aceitar props opcionais
export function Apontar({ 
  initialFilters 
}: { 
  initialFilters?: { cliente?: string; tarefaId?: number; responsavel?: string } 
}) {
  // Modificar os estados de filtro para usar initialFilters
  const [clienteFiltro, setClienteFiltro] = useState<string | null>(
    initialFilters?.cliente || null
  );
  const [tarefaFiltro, setTarefaFiltro] = useState<number | null>(
    initialFilters?.tarefaId || null
  );
  const [responsavelFiltro, setResponsavelFiltro] = useState<string | null>(
    initialFilters?.responsavel || null
  );
```

- [ ] **Step 2: Add navigation function to Apontar in App.tsx**

Modificar App.tsx para passar filtros ao Apontar:

```typescript
// Adicionar estado para filtros de Apontar
const [apontarInitialFilters, setApontarInitialFilters] = useState<any>(undefined);

// Adicionar função para navegar
function handleNavigateApontar(filters?: any) {
  setApontarInitialFilters(filters);
  setActiveTab('apontar');
}

// No render de Apontar, passar os filtros:
{activeTab === 'apontar' && <Apontar initialFilters={apontarInitialFilters} />}
```

- [ ] **Step 3: Add "Ver Apontamentos" button to task details**

No Tarefas.tsx, adicionar botão "Ver Apontamentos" nos detalhes da tarefa (drawer/modal). Procurar onde os detalhes são renderizados e adicionar:

```typescript
// Dentro do drawer/modal de detalhes da tarefa
<button
  onClick={() => {
    // TODO: chamar função handleNavigateApontar com filtros da tarefa
    // handleNavigateApontar({
    //   cliente: tarefa.empresa,
    //   tarefaId: tarefa.id,
    //   responsavel: tarefa.responsavel
    // });
  }}
  className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-muted transition-colors"
>
  <Clock size={16} />
  Ver Apontamentos
</button>
```

- [ ] **Step 4: Commit navigation integration**

```bash
git add src/app/components/Apontar.tsx src/app/components/Tarefas.tsx src/app/App.tsx
git commit -m "feat(timesheet): add navigation from Tarefas to Apontar with filters"
```

**Note:** A navegação exata depende de como o App.tsx gerencia as tabs e a comunicação entre componentes. Esta tarefa pode precisar de ajustes durante implementação.

---

### Task 18: Manual Testing Checklist

**Files:**
- N/A (manual testing)

- [ ] **Step 1: Start dev server**

```bash
npm run dev
```

Abrir http://localhost:5173 no navegador

- [ ] **Step 2: Test FloatingTimer - Start timer**

1. Navegar para tab "Tarefas"
2. Clicar no botão de timer (00:00:00 + play) em qualquer tarefa
3. Verificar que FloatingTimer aparece no canto inferior direito
4. Verificar que timer está contando (00:00:01, 00:00:02...)
5. Verificar que botão na lista mudou para tempo + stop icon

**Expected:** FloatingTimer visível, contando corretamente

- [ ] **Step 3: Test FloatingTimer - Drag**

1. Com timer ativo, arrastar FloatingTimer para outra posição
2. Verificar que componente se move suavemente
3. Verificar que não ultrapassa bordas da tela

**Expected:** Drag funcional com limites corretos

- [ ] **Step 4: Test FloatingTimer - Pause/Resume**

1. Clicar "Pausar" no FloatingTimer
2. Verificar que timer para
3. Verificar que botão muda para "Retomar"
4. Clicar "Retomar"
5. Verificar que timer continua de onde parou

**Expected:** Pause/resume funcionam corretamente

- [ ] **Step 5: Test FloatingTimer - Minimize**

1. Clicar botão minimizar
2. Verificar que timer fica compacto (apenas tempo + ícone)
3. Clicar no timer minimizado
4. Verificar que expande

**Expected:** Minimize/expand funcionam

- [ ] **Step 6: Test FloatingTimer - Stop**

1. Clicar "Parar" no FloatingTimer
2. Verificar toast: "Tempo lançado: HH:MM:SS"
3. Verificar que FloatingTimer desaparece
4. Navegar para tab "Apontar"
5. Verificar que tempo foi lançado no dia atual

**Expected:** Timer para, lança horas no dia atual, desaparece

- [ ] **Step 7: Test FloatingTimer - Discard**

1. Iniciar novo timer
2. Deixar rodar alguns segundos
3. Clicar "X" (fechar)
4. Verificar confirmação: "Descartar tempo sem salvar?"
5. Clicar "Cancelar" - verificar que timer continua
6. Clicar "X" novamente, clicar "OK"
7. Verificar que timer desaparece sem lançar horas

**Expected:** Confirmação funciona, timer descartado

- [ ] **Step 8: Test multiple timer prevention**

1. Iniciar timer em uma tarefa
2. Tentar iniciar timer em outra tarefa
3. Verificar toast de erro: "Já existe um cronômetro ativo..."
4. Verificar que FloatingTimer não muda

**Expected:** Apenas um timer ativo por vez

- [ ] **Step 9: Test Apontar - Week navigation**

1. Navegar para tab "Apontar"
2. Verificar tabela com semana atual (Seg-Sáb)
3. Clicar "<" para semana anterior
4. Verificar que datas mudam
5. Clicar ">" para próxima semana
6. Verificar navegação funciona

**Expected:** Navegação de semanas correta

- [ ] **Step 10: Test Apontar - Filters**

1. Selecionar um cliente no filtro
2. Verificar que select "Tarefa" habilita com tarefas desse cliente
3. Selecionar uma tarefa
4. Verificar que select "Responsável" habilita
5. Verificar que tabela mostra apenas linhas filtradas
6. Clicar "Limpar filtros"
7. Verificar que todos os filtros limpam e tabela mostra tudo

**Expected:** Filtros encadeados funcionam

- [ ] **Step 11: Test Apontar - Manual time entry**

1. Clicar em célula vazia (00:00:00)
2. Digitar "230" e pressionar Enter
3. Verificar que formata para "02:30:00"
4. Verificar que totais (dia e tarefa) atualizam
5. Tentar editar valor existente
6. Verificar confirmação: "Tem certeza que deseja alterar..."
7. Testar cancelar e aceitar

**Expected:** Input flexível funciona, confirmação em edições

- [ ] **Step 12: Test Apontar - 8h warning**

1. Editar células para que total de um dia exceda 8h
2. Verificar ícone de warning (⚠️) na linha "Total" daquele dia
3. Verificar tooltip ao passar mouse
4. Verificar que valor fica amarelo/destacado

**Expected:** Warning visual para dias > 8h

- [ ] **Step 13: Test Apontar - Totals calculation**

1. Verificar que linha "Total" soma corretamente cada dia
2. Verificar que coluna "Total" soma corretamente cada tarefa
3. Adicionar/editar horas e verificar recálculo automático
4. Verificar célula bottom-right (total geral da semana)

**Expected:** Totalizações corretas e automáticas

- [ ] **Step 14: Test timer persistence across navigation**

1. Iniciar timer em "Tarefas"
2. Navegar para "Configurações"
3. Verificar que FloatingTimer continua visível
4. Navegar para "Apontar"
5. Verificar que FloatingTimer continua visível
6. Parar timer e verificar que lança no dia correto

**Expected:** Timer permanece visível em todas as telas

- [ ] **Step 15: Test adding multiple timer sessions same day**

1. Iniciar timer em uma tarefa, rodar 1 minuto, parar
2. Iniciar timer na mesma tarefa novamente, rodar 1 minuto, parar
3. Ir em "Apontar"
4. Verificar que na célula dessa tarefa/dia mostra soma (~02:00:00)

**Expected:** Múltiplas sessões somam automaticamente

---

### Task 19: Fix ConfigBreadcrumb Import

**Files:**
- Modify: `src/app/components/Apontar.tsx`

- [ ] **Step 1: Check if ConfigBreadcrumb exists**

```bash
find src/app/components -name "*readcrumb*" -o -name "*Breadcrumb*"
```

- [ ] **Step 2: If ConfigBreadcrumb doesn't exist, create mock breadcrumb**

Se ConfigBreadcrumb não existir, substituir import e uso no Apontar.tsx:

```typescript
// Remover import:
// import { ConfigBreadcrumb } from './ConfigBreadcrumb';

// Criar componente inline simples:
const SimpleBreadcrumb = ({ crumbs }: { crumbs: { label: string; onClick?: () => void }[] }) => (
  <div className="flex items-center gap-2 mb-4 text-sm">
    {crumbs.map((crumb, idx) => (
      <React.Fragment key={idx}>
        {idx > 0 && <span className="text-muted-foreground">/</span>}
        {crumb.onClick ? (
          <button
            onClick={crumb.onClick}
            className="text-primary hover:underline"
          >
            {crumb.label}
          </button>
        ) : (
          <span className="text-foreground font-medium">{crumb.label}</span>
        )}
      </React.Fragment>
    ))}
  </div>
);

// E usar SimpleBreadcrumb em vez de ConfigBreadcrumb
```

- [ ] **Step 3: Commit breadcrumb fix**

```bash
git add src/app/components/Apontar.tsx
git commit -m "fix(timesheet): handle missing ConfigBreadcrumb component"
```

---

### Task 20: Polish and Final Touches

**Files:**
- Modify multiple files as needed

- [ ] **Step 1: Add animations to FloatingTimer**

Adicionar em FloatingTimer.tsx, no CSS/className:

```typescript
// No className do FloatingTimer, adicionar animação de entrada:
className="... animate-in fade-in slide-in-from-bottom-4 duration-300"

// Quando minimizado:
className="... animate-in zoom-in-95 duration-200"
```

- [ ] **Step 2: Add keyboard shortcuts**

Adicionar em FloatingTimer.tsx, useEffect para teclas:

```typescript
useEffect(() => {
  const handleKeyPress = (e: KeyboardEvent) => {
    // Espaço: pause/resume
    if (e.code === 'Space' && e.target === document.body && timerState) {
      e.preventDefault();
      if (timerState.rodando) {
        pauseTimer();
      } else {
        resumeTimer();
      }
    }
  };
  
  window.addEventListener('keydown', handleKeyPress);
  return () => window.removeEventListener('keydown', handleKeyPress);
}, [timerState, pauseTimer, resumeTimer]);
```

- [ ] **Step 3: Improve mobile responsiveness**

Adicionar media queries em FloatingTimer.tsx:

```typescript
// Ajustar posição inicial para mobile
posicao: { 
  x: window.innerWidth < 768 ? 10 : window.innerWidth - 350, 
  y: window.innerHeight < 768 ? 10 : window.innerHeight - 180 
}

// Ajustar largura para mobile
className={`... ${window.innerWidth < 768 ? 'w-64' : 'w-80'}`}
```

- [ ] **Step 4: Add loading states**

Se necessário, adicionar skeletons durante carregamento inicial dos dados.

- [ ] **Step 5: Final commit**

```bash
git add .
git commit -m "feat(timesheet): add polish, animations, and mobile improvements"
```

---

## Implementation Complete

Após completar todas as 20 tarefas:

1. ✅ Tipos e interfaces TypeScript
2. ✅ Funções utilitárias de tempo
3. ✅ Mock data
4. ✅ TimerContext completo
5. ✅ TimeInput component
6. ✅ FloatingTimer component
7. ✅ Integração no App
8. ✅ Tela Apontar completa
9. ✅ Integração com Tarefas
10. ✅ Testes manuais
11. ✅ Polimento final

O sistema de timesheet estará completo e funcional com todas as features especificadas:
- Timer flutuante global com drag, pause/resume, stop, discard
- Entrada manual de horas em tabela semanal
- Filtros encadeados
- Totalizações automáticas
- Avisos de 8h
- Integração com lista de tarefas
- Dados mock em memória

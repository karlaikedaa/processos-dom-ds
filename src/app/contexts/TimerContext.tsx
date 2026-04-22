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
  addTimeEntry: (tarefaId: number, data: string, duracao: string, metadata: { tarefaNome: string; clienteNome: string; responsavel: string }) => void;
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
  }, [timerState?.rodando, timerState?.tempoAcumulado, timerState?.iniciadoEm]);

  // Timer control functions
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

  // Time entry management functions (MUST come before stopTimer)
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

  const addTimeEntry = useCallback((
    tarefaId: number,
    data: string,
    duracao: string,
    metadata: { tarefaNome: string; clienteNome: string; responsavel: string }
  ) => {
    const existing = entries.find(e =>
      e.tarefaId === tarefaId && e.data === data
    );

    if (existing) {
      // Somar com o existente
      const novoTotal = addDurations(existing.duracao, duracao);
      updateTimeEntry(tarefaId, data, novoTotal);
    } else {
      // Criar novo entry
      const newEntry: TimeEntry = {
        id: `e${Date.now()}`,
        tarefaId,
        tarefaNome: metadata.tarefaNome,
        clienteNome: metadata.clienteNome,
        responsavel: metadata.responsavel,
        data,
        duracao,
        duracaoSegundos: parseDuration(duracao),
        origem: 'timer' as const
      };

      setEntries(prev => [...prev, newEntry]);
    }
  }, [entries, updateTimeEntry]);

  // Timer control functions
  const startTimer = useCallback((tarefa: { id: number; nome: string; cliente: string; responsavel: string }) => {
    // Verificar se já existe timer ativo
    if (timerState && timerState.tarefaId !== tarefa.id) {
      toast.error('Já existe um cronômetro ativo. Pare o cronômetro atual antes de iniciar outro.', { duration: 4000 });
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
      posicao: {
        x: window.innerWidth < 768 ? 10 : window.innerWidth - 350,
        y: window.innerWidth < 768 ? 10 : window.innerHeight - 180
      } // Bottom-right on desktop, top-left on mobile
    });
    setTempoAtual(0);
    setIsMinimized(false);
  }, [timerState, resumeTimer]);

  const stopTimer = useCallback(() => {
    if (!timerState) return;

    const hoje = format(new Date(), 'yyyy-MM-dd');
    const duracao = formatDuration(tempoAtual);

    // Adicionar entry com metadados explícitos antes de limpar o timerState
    addTimeEntry(timerState.tarefaId, hoje, duracao, {
      tarefaNome: timerState.tarefaNome,
      clienteNome: timerState.clienteNome,
      responsavel: timerState.responsavel
    });

    // Limpar timer
    setTimerState(null);
    setTempoAtual(0);
    setIsMinimized(false);

    toast.success(`Tempo lançado: ${duracao}`, { duration: 3000, icon: '✓' });
  }, [timerState, tempoAtual, addTimeEntry]);

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

  // Query functions
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

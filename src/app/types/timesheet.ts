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

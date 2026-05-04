export type TipoFluxo = 'recorrente' | 'esporadico';
export type Frequencia = 'semanal' | 'decendial' | 'mensal' | 'bimestral' | 'trimestral' | 'semestral' | 'anual';
export type MetaTarefa = 'abertura' | 'conclusao';
export type DiaSemana = 'segunda' | 'terca' | 'quarta' | 'quinta' | 'sexta' | 'sabado' | 'domingo';

export interface Fluxo {
  id: number | 'novo';
  nome: string;
  tipo: TipoFluxo;
  ativo: boolean;

  // Aba Detalhes
  metaTarefa?: MetaTarefa;
  frequencia?: Frequencia;
  diaInicio?: number;
  diaSemana?: DiaSemana;
  competencia: number;
  considerarDiasUteis?: boolean;
  adiarFimSemana?: boolean;

  // Aba Etapas
  etapas: Etapa[];

  // Aba Clientes (apenas recorrente)
  clientesSelecionados?: number[];

  // Aba Geração (apenas recorrente)
  mesInicio?: number;
  anoInicio?: number;

  // Metadata
  criadoEm?: string;
  duracaoEstimada?: number;
}

export interface Etapa {
  id: string;
  ordem: number;
  nome: string;
  tarefas: TarefaEtapa[];
  configuracoes: ConfigEtapa;
}

export interface TarefaEtapa {
  id: string;
  tarefaId: number;
  nome: string;
  departamento: string;
  responsavelId: number;
  responsavelNome: string;
  aprovadorId?: number;
  aprovadorNome?: string;
}

export interface ConfigEtapa {
  prazo?: number;
}

// Helper para criar fluxo vazio
export const createEmptyFluxo = (): Fluxo => ({
  id: 'novo',
  nome: '',
  tipo: 'recorrente',
  ativo: true,
  competencia: 0,
  etapas: []
});

import React, { useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { colors, spacing } from '../../design-tokens';
import {
  AlertTriangle, Calendar, List, LayoutGrid, ArrowRight,
  Clock, Zap, FileText, CheckCircle2, Plus, BarChart3, X,
  ChevronRight, ChevronDown, Circle, Lightbulb, ArrowUpDown, ArrowUp, ArrowDown,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

export type TarefasViewTab = 'kanban' | 'lista' | 'calendario' | 'fluxo';

export interface TarefasFilter {
  status?: string;
  cliente?: string;
}

interface VisaoGeralProps {
  onNavigateTarefas?: (viewTab?: TarefasViewTab, filter?: TarefasFilter) => void;
}

// ─── Mock Data ───────────────────────────────────────────────────────────────

const donutData = [
  { name: 'Atrasadas', value: 899, color: '#904EB1' }, // critical
  { name: 'Com impedimento', value: 148, color: '#DC0A0A' }, // negative
  { name: 'Aguardando aprovação', value: 347, color: '#FEA601' }, // warning
  { name: 'Em andamento', value: 210, color: '#0766c5' }, // informative
  { name: 'Desconsideradas', value: 38, color: '#8B8D8F' }, // muted
  { name: 'Concluídas', value: 1240, color: '#387C2B' }, // positive
];

const responsaveis = [
  { name: 'Maria Silva', abertas: 48, abertasAtraso: 2, abertasMulta: 2, concluidas: 45, concluidasAtraso: 1, concluidasMulta: 0, progresso: 94 },
  { name: 'João Pereira', abertas: 35, abertasAtraso: 4, abertasMulta: 4, concluidas: 30, concluidasAtraso: 2, concluidasMulta: 1, progresso: 86 },
  { name: 'Ana Torres', abertas: 29, abertasAtraso: 0, abertasMulta: 0, concluidas: 28, concluidasAtraso: 0, concluidasMulta: 0, progresso: 97 },
  { name: 'Carlos Rocha', abertas: 22, abertasAtraso: 1, abertasMulta: 1, concluidas: 20, concluidasAtraso: 0, concluidasMulta: 0, progresso: 91 },
  { name: 'Fernanda Lima', abertas: 18, abertasAtraso: 0, abertasMulta: 0, concluidas: 17, concluidasAtraso: 0, concluidasMulta: 0, progresso: 94 },
];

const departamentos = [
  { name: 'Contábil', abertas: 48, abertasAtraso: 2, abertasMulta: 2, concluidas: 120, concluidasAtraso: 3, concluidasMulta: 1, progresso: 71 },
  { name: 'Fiscal', abertas: 35, abertasAtraso: 4, abertasMulta: 4, concluidas: 80, concluidasAtraso: 5, concluidasMulta: 2, progresso: 70 },
  { name: 'Administrativo', abertas: 29, abertasAtraso: 0, abertasMulta: 0, concluidas: 95, concluidasAtraso: 0, concluidasMulta: 0, progresso: 77 },
  { name: 'Pessoal', abertas: 22, abertasAtraso: 1, abertasMulta: 1, concluidas: 110, concluidasAtraso: 2, concluidasMulta: 1, progresso: 83 },
  { name: 'Patrimônio', abertas: 18, abertasAtraso: 0, abertasMulta: 0, concluidas: 75, concluidasAtraso: 0, concluidasMulta: 0, progresso: 81 },
];

const empresas = [
  {
    name: 'Empresa ABC Ltda',
    total: 100,
    abertas: 48,
    abertasAtraso: 2,
    abertasMulta: 2,
    concluidas: 52,
    concluidasAtraso: 1,
    concluidasMulta: 0,
    progresso: 52,
    tarefas: [
      { nome: 'DCTF Ago/25', status: 'Aberta', responsavel: 'Maria Silva', dataMeta: '10/04/2026' },
      { nome: 'REINF Out/25', status: 'Em andamento', responsavel: 'João Pereira', dataMeta: '12/04/2026' },
      { nome: 'ECF 2025', status: 'Concluída', responsavel: 'Ana Torres', dataMeta: '08/04/2026' },
    ]
  },
  {
    name: 'Empresa XYZ S/A',
    total: 85,
    abertas: 35,
    abertasAtraso: 4,
    abertasMulta: 2,
    concluidas: 50,
    concluidasAtraso: 2,
    concluidasMulta: 1,
    progresso: 59,
    tarefas: [
      { nome: 'Folha Pagamento Mar/26', status: 'Concluída', responsavel: 'Carlos Rocha', dataMeta: '05/04/2026' },
      { nome: 'Balancete Jan/2026', status: 'Aberta', responsavel: 'Fernanda Lima', dataMeta: '15/04/2026' },
    ]
  },
  {
    name: 'DEF Comércio',
    total: 70,
    abertas: 29,
    abertasAtraso: 0,
    abertasMulta: 0,
    concluidas: 41,
    concluidasAtraso: 0,
    concluidasMulta: 0,
    progresso: 59,
    tarefas: [
      { nome: 'SPED Fiscal Set/25', status: 'Em andamento', responsavel: 'Maria Silva', dataMeta: '11/04/2026' },
      { nome: 'Alteração Contratual', status: 'Aguardando aprovação', responsavel: 'João Pereira', dataMeta: '09/04/2026' },
    ]
  },
  {
    name: 'GHI Serviços',
    total: 65,
    abertas: 22,
    abertasAtraso: 1,
    abertasMulta: 2,
    concluidas: 43,
    concluidasAtraso: 1,
    concluidasMulta: 0,
    progresso: 66,
    tarefas: [
      { nome: 'DCTF Ago/25', status: 'Aberta', responsavel: 'Ana Torres', dataMeta: '10/04/2026' },
      { nome: 'REINF Out/25', status: 'Impedida', responsavel: 'Carlos Rocha', dataMeta: '12/04/2026' },
      { nome: 'Demonstrações Financeiras', status: 'Concluída', responsavel: 'Fernanda Lima', dataMeta: '07/04/2026' },
    ]
  },
  {
    name: 'JKL Indústria',
    total: 50,
    abertas: 18,
    abertasAtraso: 0,
    abertasMulta: 0,
    concluidas: 32,
    concluidasAtraso: 0,
    concluidasMulta: 0,
    progresso: 64,
    tarefas: [
      { nome: 'ECF 2025', status: 'Concluída', responsavel: 'Maria Silva', dataMeta: '08/04/2026' },
    ]
  },
];

const tarefas = [
  {
    nome: 'DCTF Ago/25',
    tipo: 'Recorrente',
    total: 48,
    abertas: 46,
    abertasAtraso: 4,
    abertasMulta: 2,
    concluidas: 2,
    concluidasAtraso: 0,
    concluidasMulta: 0,
    progresso: 4,
    empresas: [
      { nome: 'Empresa ABC Ltda', status: 'Aberta', responsavel: 'Maria Silva', dataMeta: '10/04/2026' },
      { nome: 'GHI Serviços', status: 'Aberta', responsavel: 'Ana Torres', dataMeta: '10/04/2026' },
      { nome: 'MNO Comércio', status: 'Em andamento', responsavel: 'Carlos Rocha', dataMeta: '10/04/2026' },
    ]
  },
  {
    nome: 'REINF Out/25',
    tipo: 'Recorrente',
    total: 35,
    abertas: 30,
    abertasAtraso: 0,
    abertasMulta: 0,
    concluidas: 5,
    concluidasAtraso: 0,
    concluidasMulta: 0,
    progresso: 14,
    empresas: [
      { nome: 'Empresa ABC Ltda', status: 'Em andamento', responsavel: 'João Pereira', dataMeta: '12/04/2026' },
      { nome: 'GHI Serviços', status: 'Impedida', responsavel: 'Carlos Rocha', dataMeta: '12/04/2026' },
    ]
  },
  {
    nome: 'Alteração Contratual',
    tipo: 'Esporádico',
    total: 22,
    abertas: 22,
    abertasAtraso: 0,
    abertasMulta: 0,
    concluidas: 0,
    concluidasAtraso: 0,
    concluidasMulta: 0,
    progresso: 0,
    empresas: [
      { nome: 'DEF Comércio', status: 'Aguardando aprovação', responsavel: 'João Pereira', dataMeta: '09/04/2026' },
    ]
  },
  {
    nome: 'ECF 2025',
    tipo: 'Fluxo',
    total: 20,
    abertas: 15,
    abertasAtraso: 6,
    abertasMulta: 4,
    concluidas: 5,
    concluidasAtraso: 1,
    concluidasMulta: 1,
    progresso: 25,
    empresas: [
      { nome: 'Empresa ABC Ltda', status: 'Concluída', responsavel: 'Ana Torres', dataMeta: '08/04/2026' },
      { nome: 'JKL Indústria', status: 'Concluída', responsavel: 'Maria Silva', dataMeta: '08/04/2026' },
      { nome: 'PQR Serviços', status: 'Em andamento', responsavel: 'Fernanda Lima', dataMeta: '15/04/2026' },
    ]
  },
  {
    nome: 'Balancete Jan/2026',
    tipo: 'Recorrente',
    total: 18,
    abertas: 10,
    abertasAtraso: 0,
    abertasMulta: 0,
    concluidas: 8,
    concluidasAtraso: 0,
    concluidasMulta: 0,
    progresso: 44,
    empresas: [
      { nome: 'Empresa XYZ S/A', status: 'Aberta', responsavel: 'Fernanda Lima', dataMeta: '15/04/2026' },
      { nome: 'DEF Comércio', status: 'Concluída', responsavel: 'Maria Silva', dataMeta: '12/04/2026' },
    ]
  },
];

const pontosAtencao = [
  { label: 'Empresas sem responsável vinculado', value: 12, color: '#562F6A', percent: 30 },
  { label: 'Tarefas sem funcionário responsável', value: 8, color: '#FEA601', percent: 20 },
  { label: 'Agrupadores não configurados', value: 5, color: colors.colors.purple['500'], percent: 13 },
  { label: 'Clientes inativos', value: 3, color: '#8B8D8F', percent: 8 },
];

const acoesRapidas = [
  { label: 'Calendário de tarefas', icon: Calendar, color: colors.colors.blue['600'] },
  { label: 'Lista de tarefas', icon: List, color: colors.colors.orange['600'] },
  { label: 'Kanban', icon: LayoutGrid, color: colors.colors.mint['700'] },
  { label: 'Fluxo de tarefas', icon: ArrowRight, color: colors.colors.purple['500'] },
  { label: 'Item mais acessado 1', icon: FileText, color: colors.colors.yellow['500'] },
  { label: 'Item mais acessado 2', icon: CheckCircle2, color: colors.colors.red['600'] },
];

interface DrawerTarefa {
  id: number;
  nome: string;
  empresa: string;
  responsavel: string;
  status: string;
  dataMeta?: string;
  tipoErro?: string;
  departamento?: string;
  quantidadeTarefas?: number;
}

interface DrawerTab {
  id: string;
  label: string;
  count?: number;
  items: DrawerTarefa[];
}

interface ExpandableCard {
  id: string;
  title: string;
  count: number;
  description?: string;
  items: DrawerTarefa[];
}

type DrawerType = 'pendentes' | 'concluidas' | 'total' | 'falhas-envio' | 'config-pendentes' | 'tarefas-abertas' | 'pontos-atencao' | 'tarefas-multa' | 'resumo-status' | null;

// Mock data simples para drawers básicos
const mockTarefasDrawer: Partial<Record<DrawerType, DrawerTarefa[]>> = {
  'pendentes': [
    { id: 1, nome: 'DCTF Ago/25', empresa: 'Empresa ABC Ltda', responsavel: 'Maria Silva', status: 'Aberta' },
    { id: 2, nome: 'REINF Out/25', empresa: 'Empresa XYZ S/A', responsavel: 'João Pereira', status: 'Em andamento' },
    { id: 3, nome: 'ECF 2025', empresa: 'DEF Comércio', responsavel: 'Ana Torres', status: 'Impedida' },
  ],
  'concluidas': [
    { id: 101, nome: 'Folha Pagamento Mar/26', empresa: 'GHI Serviços', responsavel: 'Carlos Rocha', status: 'Concluída' },
    { id: 102, nome: 'SPED Fiscal Fev/26', empresa: 'JKL Indústria', responsavel: 'Fernanda Lima', status: 'Concluída' },
  ],
  'total': [
    { id: 1, nome: 'DCTF Ago/25', empresa: 'Empresa ABC Ltda', responsavel: 'Maria Silva', status: 'Aberta' },
    { id: 101, nome: 'Folha Pagamento Mar/26', empresa: 'GHI Serviços', responsavel: 'Carlos Rocha', status: 'Concluída' },
  ],
  'resumo-status': [
    { id: 1, nome: 'DCTF Ago/25', empresa: 'Empresa ABC Ltda', responsavel: 'Maria Silva', status: 'Atrasada', dataMeta: '08/04/2026' },
    { id: 2, nome: 'REINF Out/25', empresa: 'GHI Serviços', responsavel: 'João Pereira', status: 'Atrasada', dataMeta: '09/04/2026' },
  ],
};

// Mock data expandido por status para o gráfico de donut
const mockTarefasPorStatus: Record<string, DrawerTarefa[]> = {
  'Atrasadas': [
    { id: 1, nome: 'DCTF Ago/25', empresa: 'Empresa ABC Ltda', responsavel: 'Maria Silva', status: 'Atrasadas', dataMeta: '05/04/2026' },
    { id: 2, nome: 'REINF Out/25', empresa: 'GHI Serviços', responsavel: 'João Pereira', status: 'Atrasadas', dataMeta: '06/04/2026' },
    { id: 3, nome: 'ECF 2025', empresa: 'DEF Comércio', responsavel: 'Ana Torres', status: 'Atrasadas', dataMeta: '07/04/2026' },
    { id: 4, nome: 'Balancete Jan/2026', empresa: 'Empresa XYZ S/A', responsavel: 'Carlos Rocha', status: 'Atrasadas', dataMeta: '08/04/2026' },
  ],
  'Com impedimento': [
    { id: 11, nome: 'SPED Fiscal Mar/26', empresa: 'JKL Indústria', responsavel: 'Fernanda Lima', status: 'Com impedimento', dataMeta: '10/04/2026' },
    { id: 12, nome: 'Folha Pagamento Abr/26', empresa: 'Empresa ABC Ltda', responsavel: 'Maria Silva', status: 'Com impedimento', dataMeta: '11/04/2026' },
  ],
  'Aguardando aprovação': [
    { id: 21, nome: 'Alteração Contratual', empresa: 'DEF Comércio', responsavel: 'João Pereira', status: 'Aguardando aprovação', dataMeta: '12/04/2026' },
    { id: 22, nome: 'Demonstrações Financeiras', empresa: 'GHI Serviços', responsavel: 'Ana Torres', status: 'Aguardando aprovação', dataMeta: '13/04/2026' },
    { id: 23, nome: 'Relatório Gerencial', empresa: 'Empresa XYZ S/A', responsavel: 'Carlos Rocha', status: 'Aguardando aprovação', dataMeta: '14/04/2026' },
  ],
  'Em andamento': [
    { id: 31, nome: 'DCTF Web Set/25', empresa: 'JKL Indústria', responsavel: 'Fernanda Lima', status: 'Em andamento', dataMeta: '15/04/2026' },
    { id: 32, nome: 'EFD Contribuições', empresa: 'Empresa ABC Ltda', responsavel: 'Maria Silva', status: 'Em andamento', dataMeta: '16/04/2026' },
  ],
  'Desconsideradas': [
    { id: 41, nome: 'Tarefa Cancelada 1', empresa: 'DEF Comércio', responsavel: 'João Pereira', status: 'Desconsideradas', dataMeta: '17/04/2026' },
  ],
  'Concluídas': [
    { id: 51, nome: 'GFIP Mar/26', empresa: 'GHI Serviços', responsavel: 'Ana Torres', status: 'Concluídas', dataMeta: '01/04/2026' },
    { id: 52, nome: 'DIRF 2025', empresa: 'Empresa XYZ S/A', responsavel: 'Carlos Rocha', status: 'Concluídas', dataMeta: '02/04/2026' },
    { id: 53, nome: 'DME Fev/26', empresa: 'JKL Indústria', responsavel: 'Fernanda Lima', status: 'Concluídas', dataMeta: '03/04/2026' },
  ],
};

// Mock data para drawers com cards expansíveis
const mockFalhasEnvio: ExpandableCard[] = [
  {
    id: 'portal',
    title: 'Portal do cliente',
    count: 4,
    items: [
      { id: 201, nome: 'DCTF Ago/25', empresa: 'Empresa ABC Ltda', responsavel: 'Maria Silva', status: 'Impedida', tipoErro: 'Erro de autenticação' },
      { id: 202, nome: 'ECF 2025', empresa: 'DEF Comércio', responsavel: 'Ana Torres', status: 'Impedida', tipoErro: 'Timeout na conexão' },
    ]
  },
  {
    id: 'email',
    title: 'E-mail',
    count: 3,
    items: [
      { id: 301, nome: 'Balancete Jan/2026', empresa: 'Empresa XYZ S/A', responsavel: 'Maria Silva', status: 'Pendente', tipoErro: 'Destinatário não encontrado' },
    ]
  },
  {
    id: 'whatsapp',
    title: 'WhatsApp',
    count: 5,
    items: [
      { id: 401, nome: 'Nota Fiscal Entrada', empresa: 'JKL Indústria', responsavel: 'João Pereira', status: 'Pendente', tipoErro: 'Número inválido' },
      { id: 402, nome: 'Cobrança Documentos', empresa: 'Empresa ABC Ltda', responsavel: 'Fernanda Lima', status: 'Pendente', tipoErro: 'Número inválido' },
    ]
  },
];

const mockConfigPendentes: ExpandableCard[] = [
  {
    id: 'funcionarios-inativos',
    title: 'Funcionários inativos com tarefas atreladas',
    description: 'Transfira as tarefas para funcionários ativos',
    count: 2,
    items: [
      { id: 501, nome: 'João Silva', empresa: '', responsavel: 'Contábil', status: '', departamento: 'Contábil', quantidadeTarefas: 12 },
      { id: 502, nome: 'Maria Santos', empresa: '', responsavel: 'Fiscal', status: '', departamento: 'Fiscal', quantidadeTarefas: 8 },
    ]
  },
  {
    id: 'tarefas-sem-responsavel',
    title: 'Tarefas sem responsáveis',
    description: 'Atribua um responsável para cada tarefa',
    count: 3,
    items: [
      { id: 601, nome: 'DCTF Ago/25', empresa: 'Empresa ABC Ltda', responsavel: '-', status: 'Pendente', dataMeta: '10/04/2026' },
      { id: 602, nome: 'REINF Out/25', empresa: 'DEF Comércio', responsavel: '-', status: 'Pendente', dataMeta: '12/04/2026' },
    ]
  },
  {
    id: 'documentos-sem-pasta',
    title: 'Documentos sem pasta de destino',
    description: 'Configure uma pasta de destino para cada documento',
    count: 2,
    items: [
      { id: 701, nome: 'Contrato Social', empresa: '', responsavel: '', status: '' },
      { id: 702, nome: 'Certidão Negativa', empresa: '', responsavel: '', status: '' },
    ]
  },
];

const mockTarefasAbertasTabs: DrawerTab[] = [
  {
    id: 'gerando-multa',
    label: 'Gerando multa',
    count: 1,
    items: [
      { id: 1, nome: 'DCTF Ago/25', empresa: 'Empresa ABC Ltda', responsavel: 'Maria Silva', status: 'Atrasada', dataMeta: '01/04/2026' },
    ]
  },
  {
    id: 'atrasadas',
    label: 'Atrasadas',
    count: 2,
    items: [
      { id: 2, nome: 'REINF Out/25', empresa: 'GHI Serviços', responsavel: 'João Pereira', status: 'Atrasada', dataMeta: '05/04/2026' },
      { id: 3, nome: 'ECF 2025', empresa: 'DEF Comércio', responsavel: 'Ana Torres', status: 'Atrasada', dataMeta: '06/04/2026' },
    ]
  },
  {
    id: 'aguardando',
    label: 'Aguardando aprovação',
    count: 2,
    items: [
      { id: 4, nome: 'Balancete Jan/2026', empresa: 'Empresa XYZ S/A', responsavel: 'Carlos Rocha', status: 'Aguardando', dataMeta: '09/04/2026' },
      { id: 5, nome: 'Demonstrações Financeiras', empresa: 'JKL Indústria', responsavel: 'Fernanda Lima', status: 'Aguardando', dataMeta: '10/04/2026' },
    ]
  },
];

const mockPontosAtencaoTabs: DrawerTab[] = [
  {
    id: 'docs-enviados',
    label: 'Documentos enviados',
    count: 210,
    items: [
      { id: 1, nome: 'DCTF Ago/25', empresa: 'Empresa ABC Ltda', responsavel: 'Maria Silva', status: 'Completa', dataMeta: '10/04/2026' },
      { id: 2, nome: 'REINF Out/25', empresa: 'GHI Serviços', responsavel: 'João Pereira', status: 'Completa', dataMeta: '12/04/2026' },
    ]
  },
  {
    id: 'docs-pendentes',
    label: 'Documentos pendentes',
    count: 120,
    items: [
      { id: 3, nome: 'ECF 2025', empresa: 'DEF Comércio', responsavel: 'Ana Torres', status: 'Pendente', dataMeta: '15/04/2026' },
      { id: 4, nome: 'SPED Fiscal', empresa: 'Empresa XYZ S/A', responsavel: 'Carlos Rocha', status: 'Pendente', dataMeta: '18/04/2026' },
    ]
  },
  {
    id: 'usuarios-pendentes',
    label: 'Usuários de clientes pendentes',
    count: 148,
    items: [
      { id: 5, nome: 'Folha Pagamento', empresa: 'JKL Indústria', responsavel: 'Fernanda Lima', status: 'Sem usuário', dataMeta: '20/04/2026' },
    ]
  },
];

const mockTarefasMultaTabs: DrawerTab[] = [
  {
    id: 'hoje',
    label: 'A concluir hoje',
    count: 12,
    items: [
      { id: 1, nome: 'DCTF Ago/25', empresa: 'Empresa ABC Ltda', responsavel: 'Maria Silva', status: 'Urgente', dataMeta: '09/04/2026' },
      { id: 2, nome: 'REINF Out/25', empresa: 'GHI Serviços', responsavel: 'João Pereira', status: 'Urgente', dataMeta: '09/04/2026' },
    ]
  },
  {
    id: '5-dias',
    label: 'A concluir em 5 dias',
    count: 150,
    items: [
      { id: 3, nome: 'ECF 2025', empresa: 'DEF Comércio', responsavel: 'Ana Torres', status: 'Urgente', dataMeta: '14/04/2026' },
    ]
  },
  {
    id: 'docs-hoje',
    label: 'Documentos não baixados hoje',
    count: 80,
    items: [
      { id: 4, nome: 'Balancete', empresa: 'Empresa XYZ S/A', responsavel: 'Carlos Rocha', status: 'Pendente', dataMeta: '09/04/2026' },
    ]
  },
  {
    id: 'docs-5-dias',
    label: 'Documentos não baixados 5 dias',
    count: 170,
    items: [
      { id: 5, nome: 'SPED Fiscal', empresa: 'JKL Indústria', responsavel: 'Fernanda Lima', status: 'Pendente', dataMeta: '14/04/2026' },
    ]
  },
];

// ─── Components ───────────────────────────────────────────────────────────────

function ProgressBar({ value, max, color = '#387C2B' }: { value: number; max: number; color?: string }) {
  const percentage = Math.round((value / max) * 100);

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 rounded-full" style={{ background: colors.neutral['background 01'] }}>
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${percentage}%`, background: color }}
        />
      </div>
      <span className="text-xs font-semibold" style={{ color, minWidth: '38px' }}>
        {percentage}%
      </span>
    </div>
  );
}

function TaskDrawer({
  isOpen,
  onClose,
  title,
  tasks,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  tasks: DrawerTarefa[];
}) {
  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className="fixed right-0 top-0 bottom-0 w-[600px] bg-white shadow-2xl z-50 flex flex-col"
        style={{ animation: 'slideInRight 0.3s ease-out' }}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
          <h2 className="font-semibold text-lg">{title}</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div>
            {tasks.map((task, index) => (
              <React.Fragment key={task.id}>
                <div
                  className="px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer flex items-center justify-between gap-4"
                >
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm mb-1">{task.nome}</h4>
                    <div className="flex items-center gap-4 text-xs text-gray-600">
                      <span>{task.empresa}</span>
                      {task.responsavel !== '-' && (
                        <>
                          <span>•</span>
                          <span>{task.responsavel}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <ChevronRight size={20} style={{ color: 'var(--muted-foreground)' }} />
                </div>
                {index < tasks.length - 1 && (
                  <div className="h-px bg-gray-200 mx-6" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t" style={{ borderColor: 'var(--border)' }}>
          <div className="text-sm text-gray-600">
            Total: <span className="font-semibold">{tasks.length}</span> tarefa{tasks.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>
    </>
  );
}

// Drawer com Abas
function DrawerWithTabs({
  isOpen,
  onClose,
  title,
  tabs,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  tabs: DrawerTab[];
}) {
  const [activeTab, setActiveTab] = useState(tabs[0]?.id || '');

  if (!isOpen) return null;

  const currentTab = tabs.find(t => t.id === activeTab);

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
      <div
        className="fixed right-0 top-0 bottom-0 w-[600px] bg-white shadow-2xl z-50 flex flex-col"
        style={{ animation: 'slideInRight 0.3s ease-out' }}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
          <h2 className="font-semibold text-lg">{title}</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b" style={{ borderColor: 'var(--border)' }}>
          <div className="flex px-6 gap-4">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="py-3 px-1 relative text-sm font-medium transition-colors"
                style={{
                  color: activeTab === tab.id ? 'var(--primary)' : 'var(--muted-foreground)',
                }}
              >
                {tab.label}
                {tab.count !== undefined && (
                  <span className="ml-2 text-xs">({tab.count})</span>
                )}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ background: 'var(--primary)' }} />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {currentTab?.items.map((task, index) => (
            <React.Fragment key={task.id}>
              <div className="px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer flex items-center justify-between gap-4">
                <div className="flex-1">
                  <h4 className="font-semibold text-sm mb-1">{task.nome}</h4>
                  <div className="flex items-center gap-4 text-xs text-gray-600">
                    <span>{task.empresa}</span>
                    {task.dataMeta && (
                      <>
                        <span>•</span>
                        <span>Data meta: {task.dataMeta}</span>
                      </>
                    )}
                  </div>
                </div>
                <button className="p-2 hover:bg-gray-200 rounded transition-colors">
                  <ChevronRight size={16} className="text-gray-600" />
                </button>
              </div>
              {index < (currentTab?.items.length || 0) - 1 && (
                <div className="h-px bg-gray-200 mx-6" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </>
  );
}

// Drawer com Cards Expansíveis
function DrawerWithExpandableCards({
  isOpen,
  onClose,
  title,
  cards,
  renderItem,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  cards: ExpandableCard[];
  renderItem: (item: DrawerTarefa, cardId: string) => React.ReactNode;
}) {
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());

  if (!isOpen) return null;

  const toggleCard = (cardId: string) => {
    setExpandedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(cardId)) {
        newSet.delete(cardId);
      } else {
        newSet.add(cardId);
      }
      return newSet;
    });
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
      <div
        className="fixed right-0 top-0 bottom-0 w-[600px] bg-white shadow-2xl z-50 flex flex-col"
        style={{ animation: 'slideInRight 0.3s ease-out' }}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
          <h2 className="font-semibold text-lg">{title}</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cards.map(card => {
            const isExpanded = expandedCards.has(card.id);
            return (
              <div key={card.id} className="border rounded-lg" style={{ borderColor: 'var(--border)' }}>
                {/* Card Header */}
                <div
                  onClick={() => toggleCard(card.id)}
                  className="px-4 py-3 cursor-pointer hover:bg-gray-50 flex items-center justify-between transition-colors"
                >
                  <div className="flex items-center gap-2">
                    {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                    <div>
                      <h3 className="font-semibold text-sm">{card.title}</h3>
                      {card.description && (
                        <p className="text-xs text-gray-600 mt-0.5">{card.description}</p>
                      )}
                    </div>
                  </div>
                  <span className="px-2 py-1 rounded-full bg-gray-100 text-xs font-semibold">
                    {card.count}
                  </span>
                </div>

                {/* Card Content */}
                {isExpanded && (
                  <div className="border-t" style={{ borderColor: 'var(--border)' }}>
                    {card.items.map((item, index) => (
                      <React.Fragment key={item.id}>
                        {renderItem(item, card.id)}
                        {index < card.items.length - 1 && (
                          <div className="h-px bg-gray-200 mx-4" />
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

function AlertBannerComponent({ type, message, action }: { type: 'warning' | 'info'; message: string; action: string }) {
  const bgColor = type === 'warning' ? 'rgba(254,166,1,0.12)' : 'rgba(254,166,1,0.08)';
  const textColor = type === 'warning' ? '#9a6a00' : '#9a6a00';

  return (
    <div
      className="flex items-center justify-between px-4 py-3 rounded-lg mb-4"
      style={{ background: bgColor }}
    >
      <div className="flex items-center gap-3">
        <AlertTriangle size={20} style={{ color: textColor }} />
        <span style={{ fontSize: '14px', fontWeight: '600', color: textColor }}>
          {message}
        </span>
      </div>
      <button
        className="flex items-center gap-1 text-sm font-semibold hover:underline"
        style={{ color: textColor }}
      >
        {action}
        <ArrowRight size={16} />
      </button>
    </div>
  );
}

function HighlightCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      className="rounded-lg p-4 border"
      style={{
        background: '#fff',
        borderColor: 'var(--border)',
      }}
    >
      <h3 className="font-semibold text-sm mb-3" style={{ color: 'var(--foreground)' }}>
        {title}
      </h3>
      {children}
    </div>
  );
}

function Avatar({ name, size = 24 }: { name: string; size?: number }) {
  const getInitials = (fullName: string) => {
    const names = fullName.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return fullName.substring(0, 2).toUpperCase();
  };

  const getColorFromName = (name: string) => {
    const colors = ['#0766c5', '#387C2B', '#904EB1', '#DC0A0A', '#FEA601', '#2E6B58'];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <div
      className="rounded-full flex items-center justify-center text-white font-semibold shrink-0"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: getColorFromName(name),
        fontSize: `${size * 0.4}px`,
      }}
    >
      {getInitials(name)}
    </div>
  );
}

function ActionButton({ label, icon: Icon, color, onClick }: { label: string; icon: any; color: string; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg border hover:shadow-md transition-all"
      style={{
        background: '#fff',
        borderColor: 'var(--border)',
        minHeight: '100px',
      }}
    >
      <Icon size={24} style={{ color }} />
      <span className="text-xs text-center font-medium" style={{ color: 'var(--foreground)' }}>
        {label}
      </span>
    </button>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export function VisaoGeral({ onNavigateTarefas }: VisaoGeralProps) {
  const [showDesempenhoResponsavelGrafico, setShowDesempenhoResponsavelGrafico] = useState(false);
  const [showDesempenhoDepartamentoGrafico, setShowDesempenhoDepartamentoGrafico] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState<DrawerType>(null);
  const [expandedEmpresaRows, setExpandedEmpresaRows] = useState<Set<number>>(new Set());
  const [expandedTarefaRows, setExpandedTarefaRows] = useState<Set<number>>(new Set());
  const [selectedLegendItem, setSelectedLegendItem] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'tarefa' | 'cliente' | 'data'>('tarefa');

  const getDrawerTitle = (type: DrawerType): string => {
    switch (type) {
      case 'pendentes': return 'Tarefas pendentes (800)';
      case 'concluidas': return 'Tarefas Concluídas (2000)';
      case 'total': return 'Todas as Tarefas (2800)';
      case 'falhas-envio': return 'Tarefas com Falha de Envio';
      case 'config-pendentes': return 'Configurações Pendentes';
      case 'tarefas-abertas': return 'Tarefas Abertas';
      case 'pontos-atencao': return 'Pontos de Atenção';
      case 'tarefas-multa': return 'Tarefas Sujeitas à Multa';
      case 'resumo-status': return 'Tarefas por Status';
      default: return 'Tarefas';
    }
  };

  // Render functions para drawers com cards expansíveis
  const renderFalhaItem = (item: DrawerTarefa, cardId: string) => (
    <div className="px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer flex items-center justify-between gap-4">
      <div className="flex-1">
        <h4 className="font-semibold text-sm mb-1">{item.nome}</h4>
        <div className="flex items-center gap-4 text-xs text-gray-600">
          <span>{item.empresa}</span>
          {item.tipoErro && (
            <>
              <span>•</span>
              <span className="text-red-600">{item.tipoErro}</span>
            </>
          )}
        </div>
      </div>
      <ChevronRight size={16} className="text-gray-400" />
    </div>
  );

  const renderConfigItem = (item: DrawerTarefa, cardId: string) => {
    if (cardId === 'funcionarios-inativos') {
      return (
        <div className="px-4 py-3 hover:bg-gray-50 transition-colors flex items-center justify-between gap-4">
          <div className="flex-1">
            <h4 className="font-semibold text-sm mb-1">{item.nome}</h4>
            <div className="flex items-center gap-4 text-xs text-gray-600">
              <span>{item.departamento}</span>
              <span>•</span>
              <span>{item.quantidadeTarefas} tarefas</span>
            </div>
          </div>
          <button className="text-xs font-semibold px-3 py-1.5 rounded border border-orange-500 text-orange-600 hover:bg-orange-50">
            Transferir tarefas
          </button>
        </div>
      );
    }

    if (cardId === 'tarefas-sem-responsavel') {
      return (
        <div className="px-4 py-3 hover:bg-gray-50 transition-colors flex items-center justify-between gap-4">
          <div className="flex-1">
            <h4 className="font-semibold text-sm mb-1">{item.nome}</h4>
            <div className="flex items-center gap-4 text-xs text-gray-600">
              <span>{item.empresa}</span>
              {item.dataMeta && (
                <>
                  <span>•</span>
                  <span>Meta: {item.dataMeta}</span>
                </>
              )}
            </div>
          </div>
          <button className="text-xs font-semibold px-3 py-1.5 rounded border border-orange-500 text-orange-600 hover:bg-orange-50">
            Atribuir responsável
          </button>
        </div>
      );
    }

    // documentos-sem-pasta
    return (
      <div className="px-4 py-3 hover:bg-gray-50 transition-colors flex items-center justify-between gap-4">
        <div className="flex-1">
          <h4 className="font-semibold text-sm">{item.nome}</h4>
        </div>
        <button className="text-xs font-semibold px-3 py-1.5 rounded border border-orange-500 text-orange-600 hover:bg-orange-50">
          Escolher pasta de destino
        </button>
      </div>
    );
  };

  const openDrawer = (type: Exclude<DrawerType, null>) => {
    setDrawerOpen(type);
  };

  const closeDrawer = () => {
    setDrawerOpen(null);
  };

  const toggleEmpresaRow = (index: number) => {
    setExpandedEmpresaRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const toggleTarefaRow = (index: number) => {
    setExpandedTarefaRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  return (
    <div className="px-6 overflow-auto" style={{ background: colors.neutral['background 01'], minHeight: '100vh' }}>
      {/* Page Title */}
      <h1 className="text-2xl font-bold pt-6 pb-4" style={{ color: 'var(--foreground)' }}>
        Visão Geral
      </h1>

      {/* Content blocks with 16px vertical spacing */}
      <div className="space-y-4 pb-6">

        {/* Header com Barra de Progresso */}
        <div className="bg-white rounded-lg p-6 border" style={{ borderColor: 'var(--border)' }}>
          {/* Tarefas vencendo hoje */}
          <div className="mb-3">
            <div className="text-4xl font-semibold mb-0.5">Tarefas vencendo hoje</div>
            <div
              className="flex items-center gap-2 cursor-pointer hover:opacity-70 transition-opacity w-fit"
              onClick={() => openDrawer('pendentes')}
            >
              <span className="text-lg font-bold" style={{ color: colors.colors.orange['600'] }}>
                800 pendentes
              </span>
              <ChevronRight size={20} style={{ color: colors.colors.orange['600'] }} />
            </div>
          </div>

          {/* Barra de Progresso */}
          <div className="mb-3">
            <ProgressBar value={2000} max={2800} color="#387C2B" />
          </div>

          {/* Tarefas concluídas e Total */}
          <div className="flex items-center justify-between text-sm">
            <div
              className="flex items-center gap-2 cursor-pointer hover:opacity-70 transition-opacity"
              onClick={() => openDrawer('concluidas')}
            >
              <span className="text-muted-foreground">Tarefas concluídas:</span>
              <span className="font-semibold" style={{ color: '#387C2B' }}>2000 {'>'}</span>
            </div>
            <div
              className="flex items-center gap-2 cursor-pointer hover:opacity-70 transition-opacity"
              onClick={() => openDrawer('total')}
            >
              <span className="text-muted-foreground">Total:</span>
              <span className="font-semibold">2800 {'>'}</span>
            </div>
          </div>
        </div>

        {/* Banners de Alerta */}
        {/* Alert tipo negative - Falhas de envio */}
        <div
          className="flex items-center justify-between px-4 py-3 rounded-lg"
          style={{ background: 'rgba(220,10,10,0.1)', borderLeft: `4px solid #DC0A0A` }}
        >
          <div className="flex items-center gap-3">
            <AlertTriangle size={20} style={{ color: '#DC0A0A' }} />
            <span style={{ fontSize: '14px', fontWeight: '600', color: '#DC0A0A' }}>
              12 Tarefas com falha de envio - últimos 30 dias
            </span>
          </div>
          <button
            onClick={() => openDrawer('falhas-envio')}
            className="text-sm font-semibold underline hover:opacity-70 transition-opacity"
            style={{ color: '#DC0A0A' }}
          >
            Exibir detalhes
          </button>
        </div>

        {/* Alert - Configurações */}
        <div
          className="flex items-center justify-between px-4 py-3 rounded-lg"
          style={{ background: 'rgba(254,166,1,0.1)' }}
        >
          <div className="flex items-center gap-3">
            <AlertTriangle size={20} style={{ color: '#9a6a00' }} />
            <span style={{ fontSize: '14px', fontWeight: '600', color: '#9a6a00' }}>
              07 configurações não realizadas
            </span>
          </div>
          <button
            onClick={() => openDrawer('config-pendentes')}
            className="text-sm font-semibold underline hover:opacity-70 transition-opacity"
            style={{ color: '#9a6a00' }}
          >
            Exibir detalhes
          </button>
        </div>

        {/* 3 Cards de Destaque */}
        <div className="grid grid-cols-3 gap-4">
          {/* Card 1: Tarefas abertas */}
          <div
            onClick={() => openDrawer('tarefas-abertas')}
            className="rounded-lg p-4 border cursor-pointer hover:shadow-lg transition-shadow"
            style={{ background: '#fff', borderColor: 'var(--border)' }}
          >
            <h3 className="font-semibold text-sm mb-2">Tarefas abertas</h3>
            <div className="mb-2">
              <div className="flex items-center justify-between mb-1 text-xs">
                <span style={{ color: 'var(--muted-foreground)' }}>Concluídas</span>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">50 de 58</span>
                  <span className="font-semibold">86%</span>
                </div>
              </div>
              <ProgressBar value={50} max={58} color="#D64000" />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs">
                <Circle size={8} fill="#904EB1" stroke="#904EB1" />
                <span>1 tarefa gerando multa</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <Circle size={8} fill="#DC0A0A" stroke="#DC0A0A" />
                <span>2 tarefas atrasadas</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <Circle size={8} fill="#FEA601" stroke="#FEA601" />
                <span>2 tarefas aguardando aprovação</span>
              </div>
            </div>
          </div>

          {/* Card 2: Pontos de atenção */}
          <div
            onClick={() => openDrawer('pontos-atencao')}
            className="rounded-lg p-4 border cursor-pointer hover:shadow-lg transition-shadow"
            style={{ background: '#fff', borderColor: 'var(--border)' }}
          >
            <div className="flex items-center justify-start mb-2">
              <Lightbulb size={32} style={{ color: 'var(--foreground)' }} />
            </div>
            <h3 className="font-semibold text-sm mb-2">Pontos de atenção</h3>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs">
                <Circle size={8} fill="#387C2B" stroke="#387C2B" />
                <span>210 tarefas abertas com documentos enviados</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <Circle size={8} fill="#DC0A0A" stroke="#DC0A0A" />
                <span>120 tarefas abertas com documentos pendentes</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <Circle size={8} fill="#E49E1B" stroke="#E49E1B" />
                <span>148 tarefas sem usuários de clientes vinculados</span>
              </div>
            </div>
          </div>

          {/* Card 3: Tarefas sujeitas à multa */}
          <div
            onClick={() => openDrawer('tarefas-multa')}
            className="rounded-lg p-4 border cursor-pointer hover:shadow-lg transition-shadow"
            style={{ background: '#fff', borderColor: 'var(--border)' }}
          >
            <h3 className="font-semibold text-sm mb-2">Tarefas sujeitas à multa</h3>
            <div className="mb-2">
              <div className="flex items-center justify-between mb-1 text-xs">
                <span style={{ color: 'var(--muted-foreground)' }}>Próximos 5 dias</span>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">200 de 400</span>
                  <span className="font-semibold">50%</span>
                </div>
              </div>
              <ProgressBar value={200} max={400} color="#D64000" />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs">
                <Circle size={8} fill="#562F6A" stroke="#562F6A" />
                <span>12 tarefas a concluir hoje</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <Circle size={8} fill="#B92F30" stroke="#B92F30" />
                <span>150 tarefas a concluir nos próximos 5 dias</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <Circle size={8} fill="#FEA601" stroke="#FEA601" />
                <span>250 arquivos não baixados</span>
              </div>
            </div>
          </div>
        </div>

        {/* Resumo de Tarefas - Gráfico de Donut */}
        <div className="bg-white rounded-lg p-6 border" style={{ borderColor: 'var(--border)' }}>
          <h3 className="font-semibold text-lg mb-4">Resumo de tarefas</h3>
          <div className="flex items-start gap-6">
            {/* Gráfico */}
            <div style={{ width: '250px', height: '250px', flexShrink: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={donutData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={120}
                    dataKey="value"
                    paddingAngle={2}
                  >
                    {donutData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Legendas verticais - now clickable */}
            <div style={{ width: '200px', flexShrink: 0 }} className="flex flex-col gap-2">
              {donutData.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 cursor-pointer hover:opacity-70 transition-opacity"
                  onClick={() => setSelectedLegendItem(selectedLegendItem === item.name ? null : item.name)}
                >
                  <div
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ background: item.color }}
                  />
                  <div className="flex-1">
                    <span className="text-xs whitespace-nowrap" style={{ color: 'var(--foreground)' }}>
                      {item.name}
                    </span>
                  </div>
                  <span className="text-xs font-semibold whitespace-nowrap">{item.value}</span>
                </div>
              ))}
            </div>

            {/* Tabela de tarefas - only shown when a legend item is selected */}
            {selectedLegendItem && (
              <div className="border rounded-lg overflow-hidden" style={{ borderColor: 'var(--border)', width: '720px', flexShrink: 0 }}>
                {/* Header with status and quantity */}
                <div className="bg-gray-50 p-3 border-b" style={{ borderColor: 'var(--border)' }}>
                  <span className="text-sm font-semibold">
                    {selectedLegendItem} - {mockTarefasPorStatus[selectedLegendItem]?.length || 0} tarefas
                  </span>
                </div>
                {/* Scrollable table */}
                <div className="max-h-[220px] overflow-y-auto">
                  <table className="w-full text-xs">
                    <thead className="bg-gray-50 sticky top-0">
                      <tr>
                        <th
                          className="text-left p-2 font-semibold cursor-pointer hover:bg-gray-100 select-none"
                          style={{ color: 'var(--muted-foreground)' }}
                          onClick={() => setSortBy('tarefa')}
                        >
                          <div className="flex items-center gap-1">
                            <span>Tarefa</span>
                            {sortBy === 'tarefa' ? <ArrowUp size={12} /> : <ArrowUpDown size={12} opacity={0.5} />}
                          </div>
                        </th>
                        <th
                          className="text-left p-2 font-semibold cursor-pointer hover:bg-gray-100 select-none"
                          style={{ color: 'var(--muted-foreground)' }}
                          onClick={() => setSortBy('cliente')}
                        >
                          <div className="flex items-center gap-1">
                            <span>Cliente</span>
                            {sortBy === 'cliente' ? <ArrowUp size={12} /> : <ArrowUpDown size={12} opacity={0.5} />}
                          </div>
                        </th>
                        <th
                          className="text-left p-2 font-semibold cursor-pointer hover:bg-gray-100 select-none"
                          style={{ color: 'var(--muted-foreground)' }}
                          onClick={() => setSortBy('data')}
                        >
                          <div className="flex items-center gap-1">
                            <span>Data Meta</span>
                            {sortBy === 'data' ? <ArrowUp size={12} /> : <ArrowUpDown size={12} opacity={0.5} />}
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {(() => {
                        const tasks = mockTarefasPorStatus[selectedLegendItem] || [];
                        const sortedTasks = [...tasks].sort((a, b) => {
                          if (sortBy === 'tarefa') return a.nome.localeCompare(b.nome);
                          if (sortBy === 'cliente') return a.empresa.localeCompare(b.empresa);
                          if (sortBy === 'data') {
                            const dateA = a.dataMeta || '';
                            const dateB = b.dataMeta || '';
                            return dateA.localeCompare(dateB);
                          }
                          return 0;
                        });
                        return sortedTasks.map((tarefa) => (
                          <tr key={tarefa.id} className="border-t hover:bg-gray-50 cursor-pointer" style={{ borderColor: 'var(--border)' }}>
                            <td className="p-2">{tarefa.nome}</td>
                            <td className="p-2">{tarefa.empresa}</td>
                            <td className="p-2">{tarefa.dataMeta}</td>
                          </tr>
                        ));
                      })()}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Ações Rápidas */}
        <div className="bg-white rounded-lg p-6 border" style={{ borderColor: 'var(--border)' }}>
          <h3 className="font-semibold text-lg mb-4">Ações rápidas</h3>
          <div className="grid grid-cols-6 gap-3">
            {acoesRapidas.map((acao, idx) => {
              let onClick: (() => void) | undefined = undefined;

              // Add navigation for the first 4 items
              if (idx === 0 && onNavigateTarefas) {
                onClick = () => onNavigateTarefas('calendario'); // Calendário de tarefas
              } else if (idx === 1 && onNavigateTarefas) {
                onClick = () => onNavigateTarefas('lista'); // Lista de tarefas
              } else if (idx === 2 && onNavigateTarefas) {
                onClick = () => onNavigateTarefas('kanban'); // Kanban
              } else if (idx === 3 && onNavigateTarefas) {
                onClick = () => onNavigateTarefas('fluxo'); // Fluxo de tarefas
              }

              return <ActionButton key={idx} {...acao} onClick={onClick} />;
            })}
          </div>
        </div>

        {/* Desempenho por Responsável e Departamento */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-6 border" style={{ borderColor: 'var(--border)' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg">Desempenho por responsável</h3>
              <button
                className="flex items-center gap-2 text-sm hover:underline"
                onClick={() => setShowDesempenhoResponsavelGrafico(!showDesempenhoResponsavelGrafico)}
              >
                <BarChart3 size={16} />
                {showDesempenhoResponsavelGrafico ? 'Exibir como lista' : 'Exibir como gráfico'}
              </button>
            </div>
            {!showDesempenhoResponsavelGrafico ? (
              // List mode (default)
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b" style={{ borderColor: 'var(--border)' }}>
                      <th className="text-left py-2 font-medium text-xs" style={{ color: 'var(--muted-foreground)' }}>Responsável</th>
                      <th className="text-center py-2 font-medium text-xs" style={{ color: 'var(--muted-foreground)' }}>Abertas total</th>
                      <th className="text-center py-2 font-medium text-xs" style={{ color: 'var(--muted-foreground)' }}>Abertas em atraso</th>
                      <th className="text-center py-2 font-medium text-xs" style={{ color: 'var(--muted-foreground)' }}>Abertas com multa</th>
                      <th className="text-center py-2 font-medium text-xs" style={{ color: 'var(--muted-foreground)' }}>Concluídas total</th>
                      <th className="text-center py-2 font-medium text-xs" style={{ color: 'var(--muted-foreground)' }}>Concluídas em atraso</th>
                      <th className="text-center py-2 font-medium text-xs" style={{ color: 'var(--muted-foreground)' }}>Concluídas com multa</th>
                      <th className="text-center py-2 font-medium text-xs" style={{ color: 'var(--muted-foreground)' }}>%</th>
                    </tr>
                  </thead>
                  <tbody>
                    {responsaveis.map((resp, idx) => (
                      <tr key={idx} className="border-b" style={{ borderColor: 'var(--border)' }}>
                        <td className="py-2">
                          <div className="flex items-center gap-2">
                            <Avatar name={resp.name} size={28} />
                            <span>{resp.name}</span>
                          </div>
                        </td>
                        <td className="text-center">{resp.abertas}</td>
                        <td className="text-center">
                          {resp.abertasAtraso > 0 && (
                            <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-semibold" style={{ background: 'rgba(220,10,10,0.1)', color: '#DC0A0A' }}>
                              {resp.abertasAtraso}
                            </span>
                          )}
                          {resp.abertasAtraso === 0 && <span className="text-gray-400">-</span>}
                        </td>
                        <td className="text-center">
                          {resp.abertasMulta > 0 && (
                            <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-semibold" style={{ background: 'rgba(86,47,106,0.1)', color: '#562F6A' }}>
                              {resp.abertasMulta}
                            </span>
                          )}
                          {resp.abertasMulta === 0 && <span className="text-gray-400">-</span>}
                        </td>
                        <td className="text-center">{resp.concluidas}</td>
                        <td className="text-center">
                          {resp.concluidasAtraso > 0 && (
                            <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-semibold" style={{ background: 'rgba(220,10,10,0.1)', color: '#DC0A0A' }}>
                              {resp.concluidasAtraso}
                            </span>
                          )}
                          {resp.concluidasAtraso === 0 && <span className="text-gray-400">-</span>}
                        </td>
                        <td className="text-center">
                          {resp.concluidasMulta > 0 && (
                            <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-semibold" style={{ background: 'rgba(86,47,106,0.1)', color: '#562F6A' }}>
                              {resp.concluidasMulta}
                            </span>
                          )}
                          {resp.concluidasMulta === 0 && <span className="text-gray-400">-</span>}
                        </td>
                        <td className="text-center">
                          <span className="text-xs font-semibold">{resp.progresso}%</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              // Chart mode
              <div className="max-h-[400px] overflow-y-auto space-y-4">
                {responsaveis.map((resp, idx) => {
                  const totalAbertas = resp.abertas;
                  const totalConcluidas = resp.concluidas;
                  const maxTotal = Math.max(totalAbertas, totalConcluidas);

                  // Calculate percentages for each segment
                  const abertasNoPrazo = totalAbertas - resp.abertasAtraso - resp.abertasMulta;
                  const concluidasNoPrazo = totalConcluidas - resp.concluidasAtraso - resp.concluidasMulta;

                  const abertasNoPrazoPercent = maxTotal > 0 ? (abertasNoPrazo / maxTotal) * 100 : 0;
                  const abertasAtrasoPercent = maxTotal > 0 ? (resp.abertasAtraso / maxTotal) * 100 : 0;
                  const abertasMultaPercent = maxTotal > 0 ? (resp.abertasMulta / maxTotal) * 100 : 0;

                  const concluidasNoPrazoPercent = maxTotal > 0 ? (concluidasNoPrazo / maxTotal) * 100 : 0;
                  const concluidasAtrasoPercent = maxTotal > 0 ? (resp.concluidasAtraso / maxTotal) * 100 : 0;
                  const concluidasMultaPercent = maxTotal > 0 ? (resp.concluidasMulta / maxTotal) * 100 : 0;

                  return (
                    <div key={idx} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Avatar name={resp.name} size={28} />
                          <span className="text-sm font-medium">{resp.name}</span>
                        </div>
                        <span className="text-xs text-gray-500">{resp.progresso}%</span>
                      </div>

                      {/* Bars side by side */}
                      <div className="grid grid-cols-2 gap-3">
                        {/* Open tasks bar */}
                        <div className="space-y-1">
                          <div className="text-xs text-gray-500">Abertas ({totalAbertas})</div>
                          <div
                            className="flex h-5 rounded overflow-hidden border cursor-help"
                            style={{ borderColor: 'var(--border)' }}
                            title={`Tarefas abertas:\n• Total: ${totalAbertas}\n• No prazo: ${abertasNoPrazo}\n• Atrasadas: ${resp.abertasAtraso}\n• Com multa: ${resp.abertasMulta}`}
                          >
                            {abertasNoPrazo > 0 && (
                              <div
                                style={{
                                  width: `${(abertasNoPrazo / totalAbertas) * 100}%`,
                                  backgroundColor: '#0766c5',
                                }}
                              />
                            )}
                            {resp.abertasAtraso > 0 && (
                              <div
                                style={{
                                  width: `${(resp.abertasAtraso / totalAbertas) * 100}%`,
                                  backgroundColor: '#DC0A0A',
                                }}
                              />
                            )}
                            {resp.abertasMulta > 0 && (
                              <div
                                style={{
                                  width: `${(resp.abertasMulta / totalAbertas) * 100}%`,
                                  backgroundColor: '#904EB1',
                                }}
                              />
                            )}
                          </div>
                        </div>

                        {/* Completed tasks bar */}
                        <div className="space-y-1">
                          <div className="text-xs text-gray-500">Concluídas ({totalConcluidas})</div>
                          <div
                            className="flex h-5 rounded overflow-hidden border cursor-help"
                            style={{ borderColor: 'var(--border)' }}
                            title={`Tarefas concluídas:\n• Total: ${totalConcluidas}\n• No prazo: ${concluidasNoPrazo}\n• Atrasadas: ${resp.concluidasAtraso}\n• Com multa: ${resp.concluidasMulta}`}
                          >
                            {concluidasNoPrazo > 0 && (
                              <div
                                style={{
                                  width: `${(concluidasNoPrazo / totalConcluidas) * 100}%`,
                                  backgroundColor: '#387C2B',
                                }}
                              />
                            )}
                            {resp.concluidasAtraso > 0 && (
                              <div
                                style={{
                                  width: `${(resp.concluidasAtraso / totalConcluidas) * 100}%`,
                                  backgroundColor: '#DC0A0A',
                                }}
                              />
                            )}
                            {resp.concluidasMulta > 0 && (
                              <div
                                style={{
                                  width: `${(resp.concluidasMulta / totalConcluidas) * 100}%`,
                                  backgroundColor: '#FEA601',
                                }}
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg p-6 border" style={{ borderColor: 'var(--border)' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg">Desempenho por departamento</h3>
              <button
                className="flex items-center gap-2 text-sm hover:underline"
                onClick={() => setShowDesempenhoDepartamentoGrafico(!showDesempenhoDepartamentoGrafico)}
              >
                <BarChart3 size={16} />
                {showDesempenhoDepartamentoGrafico ? 'Exibir como lista' : 'Exibir como gráfico'}
              </button>
            </div>
            {!showDesempenhoDepartamentoGrafico ? (
              // List mode (default)
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b" style={{ borderColor: 'var(--border)' }}>
                      <th className="text-left py-2 font-medium text-xs" style={{ color: 'var(--muted-foreground)' }}>Departamento</th>
                      <th className="text-center py-2 font-medium text-xs" style={{ color: 'var(--muted-foreground)' }}>Abertas total</th>
                      <th className="text-center py-2 font-medium text-xs" style={{ color: 'var(--muted-foreground)' }}>Abertas em atraso</th>
                      <th className="text-center py-2 font-medium text-xs" style={{ color: 'var(--muted-foreground)' }}>Abertas com multa</th>
                      <th className="text-center py-2 font-medium text-xs" style={{ color: 'var(--muted-foreground)' }}>Concluídas total</th>
                      <th className="text-center py-2 font-medium text-xs" style={{ color: 'var(--muted-foreground)' }}>Concluídas em atraso</th>
                      <th className="text-center py-2 font-medium text-xs" style={{ color: 'var(--muted-foreground)' }}>Concluídas com multa</th>
                      <th className="text-center py-2 font-medium text-xs" style={{ color: 'var(--muted-foreground)' }}>%</th>
                    </tr>
                  </thead>
                  <tbody>
                    {departamentos.map((dept, idx) => (
                      <tr key={idx} className="border-b" style={{ borderColor: 'var(--border)' }}>
                        <td className="py-2">{dept.name}</td>
                        <td className="text-center">{dept.abertas}</td>
                        <td className="text-center">
                          {dept.abertasAtraso > 0 && (
                            <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-semibold" style={{ background: 'rgba(220,10,10,0.1)', color: '#DC0A0A' }}>
                              {dept.abertasAtraso}
                            </span>
                          )}
                          {dept.abertasAtraso === 0 && <span className="text-gray-400">-</span>}
                        </td>
                        <td className="text-center">
                          {dept.abertasMulta > 0 && (
                            <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-semibold" style={{ background: 'rgba(86,47,106,0.1)', color: '#562F6A' }}>
                              {dept.abertasMulta}
                            </span>
                          )}
                          {dept.abertasMulta === 0 && <span className="text-gray-400">-</span>}
                        </td>
                        <td className="text-center">{dept.concluidas}</td>
                        <td className="text-center">
                          {dept.concluidasAtraso > 0 && (
                            <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-semibold" style={{ background: 'rgba(220,10,10,0.1)', color: '#DC0A0A' }}>
                              {dept.concluidasAtraso}
                            </span>
                          )}
                          {dept.concluidasAtraso === 0 && <span className="text-gray-400">-</span>}
                        </td>
                        <td className="text-center">
                          {dept.concluidasMulta > 0 && (
                            <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-semibold" style={{ background: 'rgba(86,47,106,0.1)', color: '#562F6A' }}>
                              {dept.concluidasMulta}
                            </span>
                          )}
                          {dept.concluidasMulta === 0 && <span className="text-gray-400">-</span>}
                        </td>
                        <td className="text-center">
                          <span className="text-xs font-semibold">{dept.progresso}%</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              // Chart mode
              <div className="max-h-[400px] overflow-y-auto space-y-4">
                {departamentos.map((dept, idx) => {
                  const totalAbertas = dept.abertas;
                  const totalConcluidas = dept.concluidas;
                  const maxTotal = Math.max(totalAbertas, totalConcluidas);

                  // Calculate percentages for each segment
                  const abertasNoPrazo = totalAbertas - dept.abertasAtraso - dept.abertasMulta;
                  const concluidasNoPrazo = totalConcluidas - dept.concluidasAtraso - dept.concluidasMulta;

                  const abertasNoPrazoPercent = maxTotal > 0 ? (abertasNoPrazo / maxTotal) * 100 : 0;
                  const abertasAtrasoPercent = maxTotal > 0 ? (dept.abertasAtraso / maxTotal) * 100 : 0;
                  const abertasMultaPercent = maxTotal > 0 ? (dept.abertasMulta / maxTotal) * 100 : 0;

                  const concluidasNoPrazoPercent = maxTotal > 0 ? (concluidasNoPrazo / maxTotal) * 100 : 0;
                  const concluidasAtrasoPercent = maxTotal > 0 ? (dept.concluidasAtraso / maxTotal) * 100 : 0;
                  const concluidasMultaPercent = maxTotal > 0 ? (dept.concluidasMulta / maxTotal) * 100 : 0;

                  return (
                    <div key={idx} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{dept.name}</span>
                        <span className="text-xs text-gray-500">{dept.progresso}%</span>
                      </div>

                      {/* Bars side by side */}
                      <div className="grid grid-cols-2 gap-3">
                        {/* Open tasks bar */}
                        <div className="space-y-1">
                          <div className="text-xs text-gray-500">Abertas ({totalAbertas})</div>
                          <div
                            className="flex h-5 rounded overflow-hidden border cursor-help"
                            style={{ borderColor: 'var(--border)' }}
                            title={`Tarefas abertas:\n• Total: ${totalAbertas}\n• No prazo: ${abertasNoPrazo}\n• Atrasadas: ${dept.abertasAtraso}\n• Com multa: ${dept.abertasMulta}`}
                          >
                            {abertasNoPrazo > 0 && (
                              <div
                                style={{
                                  width: `${(abertasNoPrazo / totalAbertas) * 100}%`,
                                  backgroundColor: '#0766c5',
                                }}
                              />
                            )}
                            {dept.abertasAtraso > 0 && (
                              <div
                                style={{
                                  width: `${(dept.abertasAtraso / totalAbertas) * 100}%`,
                                  backgroundColor: '#DC0A0A',
                                }}
                              />
                            )}
                            {dept.abertasMulta > 0 && (
                              <div
                                style={{
                                  width: `${(dept.abertasMulta / totalAbertas) * 100}%`,
                                  backgroundColor: '#904EB1',
                                }}
                              />
                            )}
                          </div>
                        </div>

                        {/* Completed tasks bar */}
                        <div className="space-y-1">
                          <div className="text-xs text-gray-500">Concluídas ({totalConcluidas})</div>
                          <div
                            className="flex h-5 rounded overflow-hidden border cursor-help"
                            style={{ borderColor: 'var(--border)' }}
                            title={`Tarefas concluídas:\n• Total: ${totalConcluidas}\n• No prazo: ${concluidasNoPrazo}\n• Atrasadas: ${dept.concluidasAtraso}\n• Com multa: ${dept.concluidasMulta}`}
                          >
                            {concluidasNoPrazo > 0 && (
                              <div
                                style={{
                                  width: `${(concluidasNoPrazo / totalConcluidas) * 100}%`,
                                  backgroundColor: '#387C2B',
                                }}
                              />
                            )}
                            {dept.concluidasAtraso > 0 && (
                              <div
                                style={{
                                  width: `${(dept.concluidasAtraso / totalConcluidas) * 100}%`,
                                  backgroundColor: '#DC0A0A',
                                }}
                              />
                            )}
                            {dept.concluidasMulta > 0 && (
                              <div
                                style={{
                                  width: `${(dept.concluidasMulta / totalConcluidas) * 100}%`,
                                  backgroundColor: '#FEA601',
                                }}
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Tarefas por Empresa */}
        <div className="bg-white rounded-lg p-6 border" style={{ borderColor: 'var(--border)' }}>
          <h3 className="font-semibold text-lg mb-4">Tarefas por empresa</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b" style={{ borderColor: 'var(--border)' }}>
                  <th className="text-left py-2 font-medium text-xs" style={{ color: 'var(--muted-foreground)' }}>Empresa</th>
                  <th className="text-right py-2 font-medium text-xs" style={{ color: 'var(--muted-foreground)' }}>Total</th>
                  <th className="text-right py-2 pl-8 font-medium text-xs" style={{ color: 'var(--muted-foreground)' }}>Abertas</th>
                  <th className="text-right py-2 font-medium text-xs" style={{ color: 'var(--muted-foreground)' }}>Aberta em atraso</th>
                  <th className="text-right py-2 font-medium text-xs" style={{ color: 'var(--muted-foreground)' }}>Aberta com multa</th>
                  <th className="text-right py-2 font-medium text-xs" style={{ color: 'var(--muted-foreground)' }}>Concluídas</th>
                  <th className="text-right py-2 font-medium text-xs" style={{ color: 'var(--muted-foreground)' }}>Concluídas em atraso</th>
                  <th className="text-right py-2 font-medium text-xs" style={{ color: 'var(--muted-foreground)' }}>Concluídas com multa</th>
                  <th className="text-right py-2 font-medium text-xs" style={{ color: 'var(--muted-foreground)' }}>Progresso</th>
                </tr>
              </thead>
              <tbody>
                {empresas.map((emp, idx) => {
                  const isExpanded = expandedEmpresaRows.has(idx);
                  return (
                    <React.Fragment key={idx}>
                      <tr
                        className="border-b hover:bg-gray-50 cursor-pointer"
                        style={{ borderColor: 'var(--border)' }}
                        onClick={() => toggleEmpresaRow(idx)}
                      >
                        <td className="py-2">
                          <div className="flex items-center gap-2">
                            <ChevronRight
                              size={16}
                              className="transition-transform"
                              style={{
                                transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                                color: 'var(--muted-foreground)',
                              }}
                            />
                            {emp.name}
                          </div>
                        </td>
                        <td className="text-right">{emp.total}</td>
                        <td className="text-right pl-8">{emp.abertas}</td>
                        <td className="text-right">{emp.abertasAtraso}</td>
                        <td className="text-right">{emp.abertasMulta}</td>
                        <td className="text-right">{emp.concluidas}</td>
                        <td className="text-right">{emp.concluidasAtraso}</td>
                        <td className="text-right">{emp.concluidasMulta}</td>
                        <td className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <div className="w-16 h-1.5 rounded-full" style={{ background: colors.neutral['background 01'] }}>
                              <div
                                className="h-full rounded-full"
                                style={{ width: `${emp.progresso}%`, background: '#387C2B' }}
                              />
                            </div>
                            <span className="text-xs font-semibold">{emp.progresso}%</span>
                          </div>
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr>
                          <td colSpan={9} className="px-0 py-0 border-b" style={{ borderColor: 'var(--border)' }}>
                            <div
                              className="px-12 py-3"
                              style={{ background: colors.neutral['background 01'] }}
                            >
                              <h4 className="font-semibold text-xs mb-2" style={{ color: 'var(--muted-foreground)' }}>
                                Tarefas desta empresa:
                              </h4>
                              <div className="space-y-2">
                                {emp.tarefas.map((tarefa, tIdx) => (
                                  <div
                                    key={tIdx}
                                    className="flex items-center justify-between p-2 bg-white rounded border"
                                    style={{ borderColor: 'var(--border)' }}
                                  >
                                    <div className="flex items-center gap-4 flex-1">
                                      <span className="font-medium text-xs">{tarefa.nome}</span>
                                      <span
                                        className="px-2 py-0.5 rounded text-xs"
                                        style={{
                                          background:
                                            tarefa.status === 'Concluída' ? 'rgba(56,124,43,0.1)' :
                                            tarefa.status === 'Em andamento' ? 'rgba(7,102,197,0.1)' :
                                            tarefa.status === 'Impedida' ? 'rgba(220,10,10,0.1)' :
                                            tarefa.status === 'Atrasada' ? 'rgba(144,78,177,0.1)' :
                                            tarefa.status === 'Aguardando aprovação' ? 'rgba(254,166,1,0.1)' :
                                            tarefa.status === 'Desconsiderada' ? 'rgba(139,141,143,0.1)' :
                                            'rgba(7,102,197,0.1)',
                                          color:
                                            tarefa.status === 'Concluída' ? '#387C2B' :
                                            tarefa.status === 'Em andamento' ? '#0766c5' :
                                            tarefa.status === 'Impedida' ? '#DC0A0A' :
                                            tarefa.status === 'Atrasada' ? '#904EB1' :
                                            tarefa.status === 'Aguardando aprovação' ? '#FEA601' :
                                            tarefa.status === 'Desconsiderada' ? '#8B8D8F' :
                                            '#0766c5',
                                        }}
                                      >
                                        {tarefa.status}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-4 text-xs" style={{ color: 'var(--muted-foreground)' }}>
                                      <span>Responsável: {tarefa.responsavel}</span>
                                      <span>Data Meta: {tarefa.dataMeta}</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Tarefas */}
        <div className="bg-white rounded-lg p-6 border" style={{ borderColor: 'var(--border)' }}>
          <h3 className="font-semibold text-lg mb-4">Tarefas</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b" style={{ borderColor: 'var(--border)' }}>
                  <th className="text-left py-2 font-medium text-xs" style={{ color: 'var(--muted-foreground)' }}>Tarefa</th>
                  <th className="text-left py-2 font-medium text-xs" style={{ color: 'var(--muted-foreground)' }}>Tipo</th>
                  <th className="text-right py-2 font-medium text-xs" style={{ color: 'var(--muted-foreground)' }}>Total</th>
                  <th className="text-right py-2 pl-8 font-medium text-xs" style={{ color: 'var(--muted-foreground)' }}>Abertas</th>
                  <th className="text-right py-2 font-medium text-xs" style={{ color: 'var(--muted-foreground)' }}>Aberta em atraso</th>
                  <th className="text-right py-2 font-medium text-xs" style={{ color: 'var(--muted-foreground)' }}>Aberta com multa</th>
                  <th className="text-right py-2 font-medium text-xs" style={{ color: 'var(--muted-foreground)' }}>Concluídas</th>
                  <th className="text-right py-2 font-medium text-xs" style={{ color: 'var(--muted-foreground)' }}>Concluídas em atraso</th>
                  <th className="text-right py-2 font-medium text-xs" style={{ color: 'var(--muted-foreground)' }}>Concluídas com multa</th>
                  <th className="text-right py-2 font-medium text-xs" style={{ color: 'var(--muted-foreground)' }}>Progresso</th>
                </tr>
              </thead>
              <tbody>
                {tarefas.map((tarefa, idx) => {
                  const isExpanded = expandedTarefaRows.has(idx);
                  return (
                    <React.Fragment key={idx}>
                      <tr
                        className="border-b hover:bg-gray-50 cursor-pointer"
                        style={{ borderColor: 'var(--border)' }}
                        onClick={() => toggleTarefaRow(idx)}
                      >
                        <td className="py-2">
                          <div className="flex items-center gap-2">
                            <ChevronRight
                              size={16}
                              className="transition-transform"
                              style={{
                                transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                                color: 'var(--muted-foreground)',
                              }}
                            />
                            {tarefa.nome}
                          </div>
                        </td>
                        <td className="py-2">
                          <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                            {tarefa.tipo}
                          </span>
                        </td>
                        <td className="text-right">{tarefa.total}</td>
                        <td className="text-right pl-8">{tarefa.abertas}</td>
                        <td className="text-right">{tarefa.abertasAtraso}</td>
                        <td className="text-right">{tarefa.abertasMulta}</td>
                        <td className="text-right">{tarefa.concluidas}</td>
                        <td className="text-right">{tarefa.concluidasAtraso}</td>
                        <td className="text-right">{tarefa.concluidasMulta}</td>
                        <td className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <div className="w-16 h-1.5 rounded-full" style={{ background: colors.neutral['background 01'] }}>
                              <div
                                className="h-full rounded-full"
                                style={{ width: `${tarefa.progresso}%`, background: '#387C2B' }}
                              />
                            </div>
                            <span className="text-xs font-semibold">{tarefa.progresso}%</span>
                          </div>
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr>
                          <td colSpan={10} className="px-0 py-0 border-b" style={{ borderColor: 'var(--border)' }}>
                            <div
                              className="px-12 py-3"
                              style={{ background: colors.neutral['background 01'] }}
                            >
                              <h4 className="font-semibold text-xs mb-2" style={{ color: 'var(--muted-foreground)' }}>
                                Empresas com esta tarefa:
                              </h4>
                              <div className="space-y-2">
                                {tarefa.empresas.map((empresa, eIdx) => (
                                  <div
                                    key={eIdx}
                                    className="flex items-center justify-between p-2 bg-white rounded border"
                                    style={{ borderColor: 'var(--border)' }}
                                  >
                                    <div className="flex items-center gap-4 flex-1">
                                      <span className="font-medium text-xs">{empresa.nome}</span>
                                      <span
                                        className="px-2 py-0.5 rounded text-xs"
                                        style={{
                                          background:
                                            empresa.status === 'Concluída' ? 'rgba(56,124,43,0.1)' :
                                            empresa.status === 'Em andamento' ? 'rgba(7,102,197,0.1)' :
                                            empresa.status === 'Impedida' ? 'rgba(220,10,10,0.1)' :
                                            empresa.status === 'Atrasada' ? 'rgba(144,78,177,0.1)' :
                                            empresa.status === 'Aguardando aprovação' ? 'rgba(254,166,1,0.1)' :
                                            empresa.status === 'Desconsiderada' ? 'rgba(139,141,143,0.1)' :
                                            'rgba(7,102,197,0.1)',
                                          color:
                                            empresa.status === 'Concluída' ? '#387C2B' :
                                            empresa.status === 'Em andamento' ? '#0766c5' :
                                            empresa.status === 'Impedida' ? '#DC0A0A' :
                                            empresa.status === 'Atrasada' ? '#904EB1' :
                                            empresa.status === 'Aguardando aprovação' ? '#FEA601' :
                                            empresa.status === 'Desconsiderada' ? '#8B8D8F' :
                                            '#0766c5',
                                        }}
                                      >
                                        {empresa.status}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-4 text-xs" style={{ color: 'var(--muted-foreground)' }}>
                                      <span>Responsável: {empresa.responsavel}</span>
                                      <span>Data Meta: {empresa.dataMeta}</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Drawers */}
      {/* Drawer simples com lista de tarefas */}
      {(drawerOpen === 'pendentes' || drawerOpen === 'concluidas' || drawerOpen === 'total' || drawerOpen === 'resumo-status') && (
        <TaskDrawer
          isOpen={drawerOpen !== null}
          onClose={closeDrawer}
          title={getDrawerTitle(drawerOpen)}
          tasks={mockTarefasDrawer[drawerOpen] || []}
        />
      )}

      {/* Drawer com abas - Tarefas abertas */}
      <DrawerWithTabs
        isOpen={drawerOpen === 'tarefas-abertas'}
        onClose={closeDrawer}
        title={getDrawerTitle('tarefas-abertas')}
        tabs={mockTarefasAbertasTabs}
      />

      {/* Drawer com abas - Pontos de atenção */}
      <DrawerWithTabs
        isOpen={drawerOpen === 'pontos-atencao'}
        onClose={closeDrawer}
        title={getDrawerTitle('pontos-atencao')}
        tabs={mockPontosAtencaoTabs}
      />

      {/* Drawer com abas - Tarefas sujeitas à multa */}
      <DrawerWithTabs
        isOpen={drawerOpen === 'tarefas-multa'}
        onClose={closeDrawer}
        title={getDrawerTitle('tarefas-multa')}
        tabs={mockTarefasMultaTabs}
      />

      {/* Drawer com cards expansíveis - Falhas de envio */}
      <DrawerWithExpandableCards
        isOpen={drawerOpen === 'falhas-envio'}
        onClose={closeDrawer}
        title={getDrawerTitle('falhas-envio')}
        cards={mockFalhasEnvio}
        renderItem={renderFalhaItem}
      />

      {/* Drawer com cards expansíveis - Configurações pendentes */}
      <DrawerWithExpandableCards
        isOpen={drawerOpen === 'config-pendentes'}
        onClose={closeDrawer}
        title={getDrawerTitle('config-pendentes')}
        cards={mockConfigPendentes}
        renderItem={renderConfigItem}
      />
    </div>
  );
}

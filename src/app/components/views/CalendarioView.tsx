import React, { useState } from 'react';
import { colors } from '../../../design-tokens';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface DepartamentoData {
  nome: string;
  abertas: number;
  impedidas: number;
  gerandoMultas: number;
  concluidas: number;
  total: number;
  percentualConcluido: number;
}

interface DiaData {
  dia: number;
  diaSemana: string;
  percentualConcluido: number;
  departamentos: DepartamentoData[];
}

interface TarefaDetalhe {
  nome: string;
  abertas: number;
  concluidas: number;
  impedidas: number;
  gerandoMultas: number;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const mockCalendarioData: DiaData[] = [
  {
    dia: 1,
    diaSemana: 'Segunda',
    percentualConcluido: 75,
    departamentos: [
      { nome: 'Contábil', abertas: 12, impedidas: 2, gerandoMultas: 3, concluidas: 25, total: 42, percentualConcluido: 60 },
      { nome: 'Fiscal', abertas: 8, impedidas: 1, gerandoMultas: 2, concluidas: 15, total: 26, percentualConcluido: 58 },
      { nome: 'Pessoal', abertas: 5, impedidas: 0, gerandoMultas: 1, concluidas: 20, total: 26, percentualConcluido: 77 },
      { nome: 'Administrativo', abertas: 3, impedidas: 0, gerandoMultas: 0, concluidas: 12, total: 15, percentualConcluido: 80 },
    ],
  },
  {
    dia: 2,
    diaSemana: 'Terça',
    percentualConcluido: 82,
    departamentos: [
      { nome: 'Contábil', abertas: 10, impedidas: 1, gerandoMultas: 2, concluidas: 30, total: 43, percentualConcluido: 70 },
      { nome: 'Fiscal', abertas: 6, impedidas: 0, gerandoMultas: 1, concluidas: 18, total: 25, percentualConcluido: 72 },
      { nome: 'Pessoal', abertas: 3, impedidas: 0, gerandoMultas: 0, concluidas: 22, total: 25, percentualConcluido: 88 },
    ],
  },
  {
    dia: 3,
    diaSemana: 'Quarta',
    percentualConcluido: 68,
    departamentos: [
      { nome: 'Contábil', abertas: 15, impedidas: 3, gerandoMultas: 4, concluidas: 20, total: 42, percentualConcluido: 48 },
      { nome: 'Fiscal', abertas: 12, impedidas: 2, gerandoMultas: 3, concluidas: 10, total: 27, percentualConcluido: 37 },
    ],
  },
  {
    dia: 4,
    diaSemana: 'Quinta',
    percentualConcluido: 90,
    departamentos: [
      { nome: 'Contábil', abertas: 5, impedidas: 0, gerandoMultas: 1, concluidas: 35, total: 41, percentualConcluido: 85 },
      { nome: 'Fiscal', abertas: 3, impedidas: 0, gerandoMultas: 0, concluidas: 20, total: 23, percentualConcluido: 87 },
    ],
  },
  {
    dia: 5,
    diaSemana: 'Sexta',
    percentualConcluido: 85,
    departamentos: [
      { nome: 'Contábil', abertas: 8, impedidas: 1, gerandoMultas: 2, concluidas: 28, total: 39, percentualConcluido: 72 },
    ],
  },
];

const mockTarefasDetalhe: TarefaDetalhe[] = [
  { nome: 'DCTF Ago/25', abertas: 5, concluidas: 12, impedidas: 1, gerandoMultas: 2 },
  { nome: 'REINF Out/25', abertas: 3, concluidas: 8, impedidas: 0, gerandoMultas: 1 },
  { nome: 'ECF 2025', abertas: 2, concluidas: 3, impedidas: 1, gerandoMultas: 0 },
  { nome: 'Folha Pagamento Mar/26', abertas: 2, concluidas: 2, impedidas: 0, gerandoMultas: 0 },
];

// ─── Components ───────────────────────────────────────────────────────────────

export function CalendarioView() {
  const [mesAtual, setMesAtual] = useState('Março 2026');
  const [tipoData, setTipoData] = useState<'meta' | 'legal'>('meta');
  const [tipoVisualizacao, setTipoVisualizacao] = useState<'mensal' | 'semanal'>('semanal');
  const [modalAberto, setModalAberto] = useState(false);
  const [diaSelecionado, setDiaSelecionado] = useState<DiaData | null>(null);
  const [departamentoSelecionado, setDepartamentoSelecionado] = useState<DepartamentoData | null>(null);

  const abrirModal = (dia: DiaData, departamento: DepartamentoData) => {
    setDiaSelecionado(dia);
    setDepartamentoSelecionado(departamento);
    setModalAberto(true);
  };

  return (
    <>
      <div className="flex-1 flex flex-col overflow-hidden" style={{ background: 'white' }}>
        {/* Controles do Calendário */}
        <div className="px-6 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center justify-between mb-4">
            {/* Navegação de Mês */}
            <div className="flex items-center gap-3">
              <button className="p-2 hover:bg-gray-100 rounded transition-colors">
                <ChevronLeft size={20} />
              </button>
              <span className="font-semibold text-lg">{mesAtual}</span>
              <button className="p-2 hover:bg-gray-100 rounded transition-colors">
                <ChevronRight size={20} />
              </button>
              <button
                className="px-3 py-1.5 rounded border hover:bg-gray-50 transition-colors text-sm"
                style={{ borderColor: 'var(--border)' }}
              >
                Hoje
              </button>
            </div>

            {/* Toggles */}
            <div className="flex items-center gap-4">
              {/* Toggle Data Meta / Data Legal */}
              <div className="flex rounded-lg border overflow-hidden" style={{ borderColor: 'var(--border)' }}>
                <button
                  onClick={() => setTipoData('meta')}
                  className="px-4 py-2 text-sm font-medium transition-colors"
                  style={{
                    background: tipoData === 'meta' ? 'var(--primary)' : 'white',
                    color: tipoData === 'meta' ? 'white' : 'var(--foreground)',
                  }}
                >
                  Data meta
                </button>
                <button
                  onClick={() => setTipoData('legal')}
                  className="px-4 py-2 text-sm font-medium transition-colors border-l"
                  style={{
                    background: tipoData === 'legal' ? 'var(--primary)' : 'white',
                    color: tipoData === 'legal' ? 'white' : 'var(--foreground)',
                    borderColor: 'var(--border)',
                  }}
                >
                  Data legal
                </button>
              </div>

              {/* Toggle Mensal / Semanal */}
              <div className="flex rounded-lg border overflow-hidden" style={{ borderColor: 'var(--border)' }}>
                <button
                  onClick={() => setTipoVisualizacao('mensal')}
                  className="px-4 py-2 text-sm font-medium transition-colors"
                  style={{
                    background: tipoVisualizacao === 'mensal' ? 'var(--primary)' : 'white',
                    color: tipoVisualizacao === 'mensal' ? 'white' : 'var(--foreground)',
                  }}
                >
                  Mensal
                </button>
                <button
                  onClick={() => setTipoVisualizacao('semanal')}
                  className="px-4 py-2 text-sm font-medium transition-colors border-l"
                  style={{
                    background: tipoVisualizacao === 'semanal' ? 'var(--primary)' : 'white',
                    color: tipoVisualizacao === 'semanal' ? 'white' : 'var(--foreground)',
                    borderColor: 'var(--border)',
                  }}
                >
                  Semanal
                </button>
              </div>
            </div>
          </div>

          {/* Legenda */}
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ background: '#0766c5' }}></div>
              <span>Abertas</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ background: '#DC0A0A' }}></div>
              <span>Impedidas</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ background: '#FEA601' }}></div>
              <span>Gerando multas</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ background: '#387C2B' }}></div>
              <span>Concluídas</span>
            </div>
          </div>
        </div>

        {/* Grade Semanal */}
        <div className="flex-1 overflow-auto p-6">
          <div className="min-w-max">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="text-left p-3 bg-gray-50 border font-semibold text-sm" style={{ borderColor: 'var(--border)', minWidth: '150px' }}>
                    Departamento
                  </th>
                  {mockCalendarioData.map((dia) => (
                    <th
                      key={dia.dia}
                      className="text-center p-3 bg-gray-50 border font-semibold text-sm"
                      style={{ borderColor: 'var(--border)', minWidth: '180px' }}
                    >
                      <div>{dia.dia.toString().padStart(2, '0')}</div>
                      <div className="text-xs font-normal text-gray-600">{dia.diaSemana}</div>
                      <div className="mt-1 text-xs font-semibold" style={{ color: colors.colors.mint['700'] }}>
                        {dia.percentualConcluido}% concluídas
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* Linhas por departamento */}
                {['Contábil', 'Fiscal', 'Pessoal', 'Administrativo'].map((nomeDept) => (
                  <tr key={nomeDept}>
                    <td className="p-3 border font-semibold text-sm" style={{ borderColor: 'var(--border)' }}>
                      {nomeDept}
                    </td>
                    {mockCalendarioData.map((dia) => {
                      const dept = dia.departamentos.find((d) => d.nome === nomeDept);
                      return (
                        <td
                          key={`${nomeDept}-${dia.dia}`}
                          className="p-3 border text-center cursor-pointer hover:bg-gray-50 transition-colors"
                          style={{ borderColor: 'var(--border)' }}
                          onClick={() => dept && abrirModal(dia, dept)}
                        >
                          {dept ? (
                            <div className="space-y-1">
                              <div className="flex items-center justify-center gap-2 text-xs">
                                <span style={{ color: '#0766c5' }}>🔵 {dept.abertas}</span>
                                {dept.impedidas > 0 && <span style={{ color: '#DC0A0A' }}>🔴 {dept.impedidas}</span>}
                                {dept.gerandoMultas > 0 && <span style={{ color: '#FEA601' }}>🟡 {dept.gerandoMultas}</span>}
                                <span style={{ color: '#387C2B' }}>🟢 {dept.concluidas}</span>
                              </div>
                              <div className="text-xs font-semibold" style={{ color: colors.colors.mint['700'] }}>
                                {dept.percentualConcluido}%
                              </div>
                            </div>
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal de Detalhes */}
      {modalAberto && diaSelecionado && departamentoSelecionado && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setModalAberto(false)}
        >
          <div
            className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[80vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)', background: colors.neutral['background 01'] }}>
              <div>
                <h3 className="font-semibold text-lg">
                  {diaSelecionado.dia.toString().padStart(2, '0')} {diaSelecionado.diaSemana} | {departamentoSelecionado.nome}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Abertas: {departamentoSelecionado.abertas} | Concluídas: {departamentoSelecionado.concluidas} | Total: {departamentoSelecionado.total}
                </p>
              </div>
              <button
                onClick={() => setModalAberto(false)}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(80vh - 140px)' }}>
              <div className="grid gap-4">
                {mockTarefasDetalhe.map((tarefa, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-4 rounded-lg border"
                    style={{ borderColor: 'var(--border)' }}
                  >
                    <div className="flex-1">
                      <h4 className="font-semibold mb-2">{tarefa.nome}</h4>
                      <div className="flex items-center gap-4 text-xs">
                        <span style={{ color: '#0766c5' }}>Abertas: {tarefa.abertas}</span>
                        {tarefa.impedidas > 0 && <span style={{ color: '#DC0A0A' }}>Impedidas: {tarefa.impedidas}</span>}
                        {tarefa.gerandoMultas > 0 && <span style={{ color: '#FEA601' }}>Multas: {tarefa.gerandoMultas}</span>}
                        <span style={{ color: '#387C2B' }}>Concluídas: {tarefa.concluidas}</span>
                      </div>
                    </div>
                    <div
                      className="text-right"
                      style={{
                        width: '80px',
                        padding: '12px',
                        background: colors.neutral['background 01'],
                        borderRadius: '8px',
                      }}
                    >
                      <div className="text-2xl font-bold" style={{ color: colors.colors.mint['700'] }}>
                        {Math.round((tarefa.concluidas / (tarefa.abertas + tarefa.concluidas)) * 100)}%
                      </div>
                      <div className="text-xs text-gray-600">concluídas</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t flex justify-end" style={{ borderColor: 'var(--border)' }}>
              <button
                onClick={() => setModalAberto(false)}
                className="px-4 py-2 rounded border hover:bg-gray-50 transition-colors"
                style={{ borderColor: 'var(--border)' }}
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

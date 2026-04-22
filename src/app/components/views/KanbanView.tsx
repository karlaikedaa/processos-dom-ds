import React, { useState } from 'react';
import { colors } from '../../../design-tokens';
import { Building2, Calendar as CalendarIcon, User, X } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

type KanbanStatus = 'Aberta' | 'Em andamento' | 'Aguardando aprovação' | 'Impedida' | 'Desconsiderada' | 'Concluída';

interface KanbanCard {
  id: string;
  nomeTarefa: string;
  quantidadeClientes: number;
  responsavel: string;
  dataMeta: string;
  tipoTarefa: string;
  empresas: Array<{
    nome: string;
    agrupadores: string[];
  }>;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const mockKanbanData: Record<KanbanStatus, KanbanCard[]> = {
  'Aberta': [
    {
      id: 'T-001',
      nomeTarefa: 'DCTF Ago/25',
      quantidadeClientes: 12,
      responsavel: 'Maria Silva',
      dataMeta: '15/04/2026',
      tipoTarefa: 'Recorrente',
      empresas: [
        { nome: 'Empresa ABC Ltda', agrupadores: ['Lucro Presumido', 'Comércio'] },
        { nome: 'Empresa XYZ S/A', agrupadores: ['Simples Nacional', 'Serviços'] },
      ],
    },
    {
      id: 'T-002',
      nomeTarefa: 'REINF Out/25',
      quantidadeClientes: 8,
      responsavel: 'João Pereira',
      dataMeta: '20/04/2026',
      tipoTarefa: 'Recorrente',
      empresas: [
        { nome: 'DEF Comércio', agrupadores: ['Lucro Real', 'Indústria'] },
      ],
    },
  ],
  'Em andamento': [
    {
      id: 'T-003',
      nomeTarefa: 'ECF 2025',
      quantidadeClientes: 15,
      responsavel: 'Ana Torres',
      dataMeta: '25/04/2026',
      tipoTarefa: 'Fluxo de tarefas',
      empresas: [
        { nome: 'GHI Serviços', agrupadores: ['Lucro Presumido', 'Serviços'] },
      ],
    },
  ],
  'Aguardando aprovação': [
    {
      id: 'T-004',
      nomeTarefa: 'Alteração Contratual',
      quantidadeClientes: 3,
      responsavel: 'Carlos Rocha',
      dataMeta: '18/04/2026',
      tipoTarefa: 'Esporádica',
      empresas: [
        { nome: 'JKL Indústria', agrupadores: ['Simples Nacional', 'Indústria'] },
      ],
    },
  ],
  'Impedida': [
    {
      id: 'T-005',
      nomeTarefa: 'SPED Fiscal Set/25',
      quantidadeClientes: 2,
      responsavel: 'Fernanda Lima',
      dataMeta: '10/04/2026',
      tipoTarefa: 'Recorrente',
      empresas: [],
    },
  ],
  'Desconsiderada': [],
  'Concluída': [
    {
      id: 'T-006',
      nomeTarefa: 'Folha de Pagamento Mar/26',
      quantidadeClientes: 25,
      responsavel: 'Maria Silva',
      dataMeta: '05/04/2026',
      tipoTarefa: 'Recorrente',
      empresas: [],
    },
  ],
};

// ─── Components ───────────────────────────────────────────────────────────────

export function KanbanView() {
  const [selectedCard, setSelectedCard] = useState<KanbanCard | null>(null);

  const kanbanColumns: Array<{ status: KanbanStatus; color: string }> = [
    { status: 'Aberta', color: '#B92F30' },
    { status: 'Em andamento', color: '#0766C5' },
    { status: 'Aguardando aprovação', color: '#E49E1B' },
    { status: 'Impedida', color: '#904EB1' },
    { status: 'Desconsiderada', color: '#737475' },
    { status: 'Concluída', color: '#2E6B58' },
  ];

  return (
    <>
      <div className="flex-1 overflow-x-auto overflow-y-hidden" style={{ background: colors.neutral['background 01'] }}>
        <div className="flex h-full gap-4 p-6" style={{ minWidth: 'max-content' }}>
          {kanbanColumns.map(({ status, color }) => (
            <div
              key={status}
              className="flex flex-col"
              style={{ width: '300px', minWidth: '300px' }}
            >
              {/* Column Header */}
              <div
                className="px-4 py-3 rounded-t-lg flex items-center justify-between mb-3"
                style={{ background: color, color: 'white' }}
              >
                <span className="font-semibold text-sm">{status}</span>
                <span className="px-2 py-0.5 rounded-full bg-white/20 text-xs font-semibold">
                  {mockKanbanData[status].length}
                </span>
              </div>

              {/* Cards */}
              <div className="flex-1 overflow-y-auto space-y-3">
                {mockKanbanData[status].map((card) => (
                  <div
                    key={card.id}
                    onClick={() => setSelectedCard(card)}
                    className="bg-white rounded-lg p-4 border cursor-pointer hover:shadow-md transition-shadow"
                    style={{ borderColor: 'var(--border)' }}
                  >
                    <h4 className="font-semibold text-sm mb-3">{card.nomeTarefa}</h4>

                    <div className="space-y-2 text-xs text-gray-600">
                      <div className="flex items-center gap-2">
                        <Building2 size={14} />
                        <span><strong>Empresas:</strong> {card.quantidadeClientes} clientes</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User size={14} />
                        <span><strong>Responsável:</strong> {card.responsavel}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CalendarIcon size={14} />
                        <span><strong>Data meta:</strong> {card.dataMeta}</span>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t" style={{ borderColor: 'var(--border)' }}>
                      <span
                        className="px-2 py-1 rounded text-xs font-medium"
                        style={{
                          background: 'rgba(7,102,197,0.1)',
                          color: '#0766c5',
                        }}
                      >
                        {card.tipoTarefa}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal de Detalhes */}
      {selectedCard && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setSelectedCard(null)}
        >
          <div
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
              <h3 className="font-semibold text-lg">
                {selectedCard.nomeTarefa} – {selectedCard.quantidadeClientes}
              </h3>
              <button
                onClick={() => setSelectedCard(null)}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content - Table Format */}
            <div className="overflow-y-auto" style={{ maxHeight: 'calc(80vh - 140px)' }}>
              <table className="w-full">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="text-left px-6 py-3 font-semibold text-sm" style={{ color: 'var(--muted-foreground)' }}>
                      Empresas com esta tarefa
                    </th>
                    <th className="text-left px-6 py-3 font-semibold text-sm" style={{ color: 'var(--muted-foreground)' }}>
                      Identificadores de clientes
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {selectedCard.empresas.length > 0 ? (
                    selectedCard.empresas.map((empresa, idx) => (
                      <tr key={idx} className="border-t" style={{ borderColor: 'var(--border)' }}>
                        <td className="px-6 py-4">
                          <button
                            className="text-blue-600 hover:underline font-medium"
                            onClick={() => {
                              // Navigate to task list with filter
                              console.log('Navigate to task for:', empresa.nome);
                            }}
                          >
                            {empresa.nome}
                          </button>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2 flex-wrap">
                            {empresa.agrupadores.map((agrupador, i) => (
                              <span
                                key={i}
                                className="px-2 py-1 rounded text-xs font-medium"
                                style={{
                                  background: '#E5E7EB',
                                  color: '#6B7280',
                                }}
                              >
                                {agrupador}
                              </span>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={2} className="px-6 py-8 text-center text-gray-500 text-sm">
                        Nenhuma empresa vinculada
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t flex justify-end gap-3" style={{ borderColor: 'var(--border)' }}>
              <button
                className="px-4 py-2 rounded text-white hover:opacity-90 transition-opacity"
                style={{ background: 'var(--primary)' }}
                onClick={() => {
                  // Navigate to task list with filtered status
                  console.log('Show all tasks with this status');
                  setSelectedCard(null);
                }}
              >
                Exibir todas
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

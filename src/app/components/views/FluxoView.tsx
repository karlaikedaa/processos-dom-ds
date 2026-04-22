import React, { useState } from 'react';
import { colors } from '../../../design-tokens';
import { ChevronDown, Building2, Users, Clock, TrendingUp, X } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

type FluxoStatus = 'Aberta' | 'Em andamento' | 'Impedida' | 'Concluída';

interface FluxoCard {
  id: string;
  departamento: string;
  empresa: string;
  quantidadeClientes: number;
  percentualProgresso: number;
  tempoMedioConclusao: number;
  status: FluxoStatus;
}

interface Etapa {
  nome: string;
  ordem: number;
  cards: FluxoCard[];
}

interface Fluxo {
  id: string;
  nome: string;
  etapas: Etapa[];
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const mockFluxos: Fluxo[] = [
  {
    id: 'F-001',
    nome: 'Fluxo Apuração Mensal',
    etapas: [
      {
        nome: 'Recebimento de Documentos',
        ordem: 1,
        cards: [
          {
            id: 'C-001',
            departamento: 'Contábil',
            empresa: 'Empresa ABC Ltda',
            quantidadeClientes: 12,
            percentualProgresso: 80,
            tempoMedioConclusao: 3,
            status: 'Em andamento',
          },
          {
            id: 'C-002',
            departamento: 'Fiscal',
            empresa: 'Empresa XYZ S/A',
            quantidadeClientes: 8,
            percentualProgresso: 100,
            tempoMedioConclusao: 2,
            status: 'Concluída',
          },
        ],
      },
      {
        nome: 'Classificação Contábil',
        ordem: 2,
        cards: [
          {
            id: 'C-003',
            departamento: 'Contábil',
            empresa: 'DEF Comércio',
            quantidadeClientes: 15,
            percentualProgresso: 60,
            tempoMedioConclusao: 5,
            status: 'Em andamento',
          },
        ],
      },
      {
        nome: 'Apuração de Impostos',
        ordem: 3,
        cards: [
          {
            id: 'C-004',
            departamento: 'Fiscal',
            empresa: 'GHI Serviços',
            quantidadeClientes: 10,
            percentualProgresso: 45,
            tempoMedioConclusao: 4,
            status: 'Em andamento',
          },
          {
            id: 'C-005',
            departamento: 'Fiscal',
            empresa: 'JKL Indústria',
            quantidadeClientes: 5,
            percentualProgresso: 0,
            tempoMedioConclusao: 6,
            status: 'Impedida',
          },
        ],
      },
      {
        nome: 'Revisão e Aprovação',
        ordem: 4,
        cards: [
          {
            id: 'C-006',
            departamento: 'Contábil',
            empresa: 'MNO Comércio',
            quantidadeClientes: 20,
            percentualProgresso: 90,
            tempoMedioConclusao: 2,
            status: 'Em andamento',
          },
        ],
      },
      {
        nome: 'Envio ao Cliente',
        ordem: 5,
        cards: [],
      },
    ],
  },
  {
    id: 'F-002',
    nome: 'Fluxo Folha de Pagamento',
    etapas: [
      {
        nome: 'Coleta de Informações',
        ordem: 1,
        cards: [
          {
            id: 'C-007',
            departamento: 'Pessoal',
            empresa: 'Empresa PQR Ltda',
            quantidadeClientes: 25,
            percentualProgresso: 70,
            tempoMedioConclusao: 2,
            status: 'Em andamento',
          },
        ],
      },
      {
        nome: 'Cálculo da Folha',
        ordem: 2,
        cards: [
          {
            id: 'C-008',
            departamento: 'Pessoal',
            empresa: 'STU S/A',
            quantidadeClientes: 18,
            percentualProgresso: 55,
            tempoMedioConclusao: 3,
            status: 'Em andamento',
          },
        ],
      },
      {
        nome: 'Apuração de Encargos',
        ordem: 3,
        cards: [],
      },
      {
        nome: 'Conferência',
        ordem: 4,
        cards: [],
      },
      {
        nome: 'Envio e Arquivamento',
        ordem: 5,
        cards: [],
      },
    ],
  },
  {
    id: 'F-003',
    nome: 'Fluxo Abertura de Empresa',
    etapas: [
      {
        nome: 'Consulta Prévia',
        ordem: 1,
        cards: [
          {
            id: 'C-009',
            departamento: 'Administrativo',
            empresa: 'Nova Empresa VWX',
            quantidadeClientes: 1,
            percentualProgresso: 100,
            tempoMedioConclusao: 1,
            status: 'Concluída',
          },
        ],
      },
      {
        nome: 'Registro na Junta',
        ordem: 2,
        cards: [
          {
            id: 'C-010',
            departamento: 'Administrativo',
            empresa: 'Nova Empresa YZ',
            quantidadeClientes: 1,
            percentualProgresso: 30,
            tempoMedioConclusao: 7,
            status: 'Em andamento',
          },
        ],
      },
      {
        nome: 'Inscrições Fiscais',
        ordem: 3,
        cards: [],
      },
      {
        nome: 'Alvarás e Licenças',
        ordem: 4,
        cards: [],
      },
    ],
  },
];

// ─── Helper Functions ─────────────────────────────────────────────────────────

const getStatusColor = (status: FluxoStatus): string => {
  switch (status) {
    case 'Aberta':
      return '#0766c5';
    case 'Em andamento':
      return '#FEA601';
    case 'Impedida':
      return '#DC0A0A';
    case 'Concluída':
      return '#387C2B';
  }
};

const getStatusBgColor = (status: FluxoStatus): string => {
  switch (status) {
    case 'Aberta':
      return 'rgba(7,102,197,0.1)';
    case 'Em andamento':
      return 'rgba(254,166,1,0.1)';
    case 'Impedida':
      return 'rgba(220,10,10,0.1)';
    case 'Concluída':
      return 'rgba(56,124,43,0.1)';
  }
};

// ─── Components ───────────────────────────────────────────────────────────────

export function FluxoView() {
  const [fluxoSelecionado, setFluxoSelecionado] = useState<string>('');
  const [cardSelecionado, setCardSelecionado] = useState<FluxoCard | null>(null);

  const fluxoAtual = mockFluxos.find((f) => f.id === fluxoSelecionado);

  return (
    <>
      <div className="flex-1 flex flex-col overflow-hidden" style={{ background: colors.neutral['background 01'] }}>
        {/* Seletor de Fluxo */}
        <div className="px-6 py-4 border-b bg-white" style={{ borderColor: 'var(--border)' }}>
          <label className="block text-sm font-medium mb-2">Selecione um fluxo:</label>
          <div className="relative inline-block w-80">
            <select
              value={fluxoSelecionado}
              onChange={(e) => setFluxoSelecionado(e.target.value)}
              className="w-full px-4 py-2 pr-10 border rounded-lg appearance-none cursor-pointer hover:border-gray-400 transition-colors"
              style={{ borderColor: 'var(--border)' }}
            >
              <option value="">-- Selecione um fluxo --</option>
              {mockFluxos.map((fluxo) => (
                <option key={fluxo.id} value={fluxo.id}>
                  {fluxo.nome}
                </option>
              ))}
            </select>
            <ChevronDown
              className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
              size={20}
              style={{ color: '#737475' }}
            />
          </div>
        </div>

        {/* Grade de Etapas */}
        {fluxoAtual ? (
          <div className="flex-1 overflow-x-auto overflow-y-hidden p-6">
            <div className="flex h-full gap-4" style={{ minWidth: 'max-content' }}>
              {fluxoAtual.etapas
                .sort((a, b) => a.ordem - b.ordem)
                .map((etapa) => (
                  <div
                    key={etapa.ordem}
                    className="flex flex-col"
                    style={{ width: '320px', minWidth: '320px' }}
                  >
                    {/* Etapa Header */}
                    <div
                      className="px-4 py-3 rounded-t-lg mb-3"
                      style={{
                        background: colors.colors.mint['700'],
                        color: 'white',
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-sm">
                          {etapa.ordem}. {etapa.nome}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-white/20 text-xs font-semibold">
                          {etapa.cards.length}
                        </span>
                      </div>
                    </div>

                    {/* Cards */}
                    <div className="flex-1 overflow-y-auto space-y-3">
                      {etapa.cards.length > 0 ? (
                        etapa.cards.map((card) => (
                          <div
                            key={card.id}
                            onClick={() => setCardSelecionado(card)}
                            className="bg-white rounded-lg p-4 border cursor-pointer hover:shadow-md transition-shadow"
                            style={{ borderColor: 'var(--border)' }}
                          >
                            {/* Departamento e Empresa */}
                            <div className="mb-3">
                              <h4 className="font-semibold text-sm mb-1">{card.departamento}</h4>
                              <p className="text-xs text-gray-600">{card.empresa}</p>
                            </div>

                            {/* Informações */}
                            <div className="space-y-2 text-xs">
                              <div className="flex items-center gap-2 text-gray-700">
                                <Users size={14} />
                                <span>{card.quantidadeClientes} clientes</span>
                              </div>
                              <div className="flex items-center gap-2 text-gray-700">
                                <Clock size={14} />
                                <span>{card.tempoMedioConclusao} dias (média)</span>
                              </div>
                              <div className="flex items-center gap-2 text-gray-700">
                                <TrendingUp size={14} />
                                <span>{card.percentualProgresso}% concluído</span>
                              </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="mt-3 mb-3">
                              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                  className="h-full transition-all duration-300"
                                  style={{
                                    width: `${card.percentualProgresso}%`,
                                    background: colors.colors.mint['700'],
                                  }}
                                />
                              </div>
                            </div>

                            {/* Status Badge */}
                            <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: 'var(--border)' }}>
                              <span
                                className="px-2 py-1 rounded text-xs font-medium"
                                style={{
                                  background: getStatusBgColor(card.status),
                                  color: getStatusColor(card.status),
                                }}
                              >
                                {card.status}
                              </span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div
                          className="bg-white rounded-lg p-4 border text-center text-sm text-gray-400"
                          style={{ borderColor: 'var(--border)' }}
                        >
                          Nenhuma tarefa nesta etapa
                        </div>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-500 text-sm">Selecione um fluxo para visualizar as etapas</p>
          </div>
        )}
      </div>

      {/* Modal de Detalhes do Card */}
      {cardSelecionado && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setCardSelecionado(null)}
        >
          <div
            className="bg-white rounded-lg shadow-xl max-w-xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
              <div>
                <h3 className="font-semibold text-lg">{cardSelecionado.departamento}</h3>
                <p className="text-sm text-gray-600 mt-1">{cardSelecionado.empresa}</p>
              </div>
              <button
                onClick={() => setCardSelecionado(null)}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <span className="text-sm text-gray-600">Quantidade de Clientes</span>
                  <p className="font-semibold text-lg mt-1">{cardSelecionado.quantidadeClientes}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Tempo Médio de Conclusão</span>
                  <p className="font-semibold text-lg mt-1">{cardSelecionado.tempoMedioConclusao} dias</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Percentual de Progresso</span>
                  <p className="font-semibold text-lg mt-1">{cardSelecionado.percentualProgresso}%</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Status</span>
                  <div className="mt-2">
                    <span
                      className="px-3 py-1.5 rounded text-sm font-medium"
                      style={{
                        background: getStatusBgColor(cardSelecionado.status),
                        color: getStatusColor(cardSelecionado.status),
                      }}
                    >
                      {cardSelecionado.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Progresso da tarefa</span>
                  <span className="text-sm font-semibold" style={{ color: colors.colors.mint['700'] }}>
                    {cardSelecionado.percentualProgresso}%
                  </span>
                </div>
                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full transition-all duration-300"
                    style={{
                      width: `${cardSelecionado.percentualProgresso}%`,
                      background: colors.colors.mint['700'],
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t flex justify-end" style={{ borderColor: 'var(--border)' }}>
              <button
                onClick={() => setCardSelecionado(null)}
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

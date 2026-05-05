import React from 'react';

interface GeracaoTabProps {
  mesInicio: number;
  anoInicio: number;
  onMesChange: (mes: number) => void;
  onAnoChange: (ano: number) => void;
}

const MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
] as const;

const generateYears = () => {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: 10 }, (_, i) => currentYear - 1 + i);
};

export function GeracaoTab({ mesInicio, anoInicio, onMesChange, onAnoChange }: GeracaoTabProps) {
  const anos = generateYears();

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6">
        <div className="mb-6">
          <h3 className="text-base font-semibold mb-2">
            Geração de fluxo
          </h3>
          <p className="text-sm text-gray-600">
            Configure a partir de qual mês este fluxo será considerado
          </p>
        </div>

        {/* Warning */}
        <div className="bg-orange-50 border-l-4 border-orange-500 p-4 mb-6 rounded">
          <div className="flex gap-3">
            <span role="img" aria-label="Atenção" className="text-xl">⚠️</span>
            <div>
              <div className="text-sm font-semibold text-orange-900 mb-1">
                Atenção
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                Esta ação ignora qualquer fluxo com tarefas cadastradas anteriormente,
                cobranças de documentos e ações em seu histórico na área de cadastro de clientes.
                Isso quer dizer que os clientes já iniciados nos fluxos anteriores{' '}
                <strong>não ficarão bloqueados</strong> e, a exclusão das tarefas geradas
                anteriormente, permanecerá com você.
              </p>
            </div>
          </div>
        </div>

        {/* Período de geração */}
        <div className="mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-600 mb-2">
                Mês
              </label>
              <select
                value={mesInicio}
                onChange={(e) => onMesChange(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {MESES.map((mes, index) => (
                  <option key={index} value={index + 1}>
                    {mes}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs text-gray-600 mb-2">
                Ano
              </label>
              <select
                value={anoInicio}
                onChange={(e) => onAnoChange(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {anos.map(ano => (
                  <option key={ano} value={ano}>
                    {ano}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
          <div className="flex gap-3">
            <span role="img" aria-label="Informação" className="text-xl">💡</span>
            <p className="text-sm text-blue-900 leading-relaxed">
              A partir do mês selecionado, este fluxo recorrente será gerado automaticamente
              para todos os clientes selecionados na aba "Clientes".
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

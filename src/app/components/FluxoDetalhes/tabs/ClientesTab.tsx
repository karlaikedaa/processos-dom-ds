import React, { useState, useMemo } from 'react';

interface Cliente {
  id: number;
  nome: string;
  cnpj: string;
}

interface ClientesTabProps {
  clientesSelecionados: number[];
  onClientesChange: (clienteIds: number[]) => void;
}

// Mock client data
const MOCK_CLIENTES: Cliente[] = [
  { id: 1, nome: 'Acme Corporation', cnpj: '12.345.678/0001-90' },
  { id: 2, nome: 'TechStart Ltda', cnpj: '98.765.432/0001-10' },
  { id: 3, nome: 'Global Industries', cnpj: '11.222.333/0001-44' },
  { id: 4, nome: 'Innovate Solutions', cnpj: '55.666.777/0001-88' },
  { id: 5, nome: 'Prime Services', cnpj: '99.888.777/0001-66' },
];

export const ClientesTab: React.FC<ClientesTabProps> = ({
  clientesSelecionados,
  onClientesChange,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter clients based on search
  const filteredClientes = useMemo(() => {
    if (!searchTerm.trim()) {
      return MOCK_CLIENTES;
    }

    const term = searchTerm.toLowerCase();
    return MOCK_CLIENTES.filter(
      (cliente) =>
        cliente.nome.toLowerCase().includes(term) ||
        cliente.cnpj.includes(term)
    );
  }, [searchTerm]);

  // Check if all visible clients are selected
  const allVisibleSelected = useMemo(() => {
    if (filteredClientes.length === 0) return false;
    return filteredClientes.every((cliente) =>
      clientesSelecionados.includes(cliente.id)
    );
  }, [filteredClientes, clientesSelecionados]);

  // Toggle individual client
  const handleToggleCliente = (clienteId: number) => {
    if (clientesSelecionados.includes(clienteId)) {
      onClientesChange(clientesSelecionados.filter((id) => id !== clienteId));
    } else {
      onClientesChange([...clientesSelecionados, clienteId]);
    }
  };

  // Toggle all visible clients
  const handleToggleAll = () => {
    if (allVisibleSelected) {
      // Deselect all visible
      const visibleIds = filteredClientes.map((c) => c.id);
      onClientesChange(
        clientesSelecionados.filter((id) => !visibleIds.includes(id))
      );
    } else {
      // Select all visible
      const visibleIds = filteredClientes.map((c) => c.id);
      const newSelection = [
        ...clientesSelecionados,
        ...visibleIds.filter((id) => !clientesSelecionados.includes(id)),
      ];
      onClientesChange(newSelection);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* Search bar */}
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar por nome ou CNPJ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <svg
            className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Select all header */}
      {filteredClientes.length > 0 && (
        <div
          className="px-4 py-3 border-b border-gray-200 bg-gray-50 cursor-pointer hover:bg-gray-100"
          onClick={handleToggleAll}
        >
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={allVisibleSelected}
              onChange={handleToggleAll}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
              onClick={(e) => e.stopPropagation()}
            />
            <span className="ml-3 text-sm font-medium text-gray-700">
              Selecionar todos
            </span>
          </label>
        </div>
      )}

      {/* Client list */}
      <div className="divide-y divide-gray-200">
        {filteredClientes.length === 0 ? (
          <div className="px-4 py-8 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <p className="mt-2 text-sm text-gray-500">
              Nenhum cliente encontrado
            </p>
          </div>
        ) : (
          filteredClientes.map((cliente) => {
            const isSelected = clientesSelecionados.includes(cliente.id);
            return (
              <div
                key={cliente.id}
                className="px-4 py-3 hover:bg-gray-50 cursor-pointer"
                onClick={() => handleToggleCliente(cliente.id)}
              >
                <label className="flex items-start cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleToggleCliente(cliente.id)}
                    className="h-4 w-4 mt-0.5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <div className="ml-3 flex-1">
                    <div className="text-sm font-medium text-gray-900">
                      {cliente.nome}
                    </div>
                    <div className="text-sm text-gray-500">{cliente.cnpj}</div>
                  </div>
                </label>
              </div>
            );
          })
        )}
      </div>

      {/* Footer with count */}
      <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
        <p className="text-sm text-gray-600">
          {clientesSelecionados.length === 0 ? (
            'Nenhum cliente selecionado'
          ) : clientesSelecionados.length === 1 ? (
            '1 cliente selecionado'
          ) : (
            `${clientesSelecionados.length} clientes selecionados`
          )}
        </p>
      </div>
    </div>
  );
};

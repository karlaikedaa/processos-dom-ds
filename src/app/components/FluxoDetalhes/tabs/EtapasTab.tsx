import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Etapa, TarefaEtapa, ConfigEtapa } from '../../../types/fluxo';
import { EtapaColumn } from '../components/EtapaColumn';
import { AddTarefaModal } from '../components/AddTarefaModal';
import { ConfigEtapaModal } from '../components/ConfigEtapaModal';

interface EtapasTabProps {
  etapas: Etapa[];
  onEtapasChange: (etapas: Etapa[]) => void;
}

export const EtapasTab: React.FC<EtapasTabProps> = ({ etapas, onEtapasChange }) => {
  const [addTarefaEtapaId, setAddTarefaEtapaId] = useState<string | null>(null);
  const [configEtapaId, setConfigEtapaId] = useState<string | null>(null);

  // Add new etapa
  const handleAddEtapa = () => {
    const newOrdem = etapas.length + 1;
    const newEtapa: Etapa = {
      id: `etapa-${Date.now()}`,
      ordem: newOrdem,
      nome: `Etapa ${newOrdem}`,
      tarefas: [],
      configuracoes: {}
    };

    onEtapasChange([...etapas, newEtapa]);
  };

  // Update etapa
  const handleUpdateEtapa = (etapaId: string, updates: Partial<Etapa>) => {
    const updated = etapas.map(etapa =>
      etapa.id === etapaId ? { ...etapa, ...updates } : etapa
    );
    onEtapasChange(updated);
  };

  // Delete etapa and renumber
  const handleDeleteEtapa = (etapaId: string) => {
    const filtered = etapas.filter(e => e.id !== etapaId);
    const renumbered = filtered.map((etapa, index) => ({
      ...etapa,
      ordem: index + 1,
      nome: etapa.nome.replace(/Etapa \d+/, `Etapa ${index + 1}`)
    }));
    onEtapasChange(renumbered);
  };

  // Add tarefa to etapa
  const handleAddTarefa = (etapaId: string, tarefa: TarefaEtapa) => {
    const updated = etapas.map(etapa =>
      etapa.id === etapaId
        ? { ...etapa, tarefas: [...etapa.tarefas, tarefa] }
        : etapa
    );
    onEtapasChange(updated);
    setAddTarefaEtapaId(null);
  };

  // Save etapa config
  const handleSaveConfig = (etapaId: string, config: ConfigEtapa) => {
    const updated = etapas.map(etapa =>
      etapa.id === etapaId
        ? { ...etapa, configuracoes: config }
        : etapa
    );
    onEtapasChange(updated);
    setConfigEtapaId(null);
  };

  // Remove tarefa
  const handleRemoveTarefa = (etapaId: string, tarefaId: string) => {
    const updated = etapas.map(etapa =>
      etapa.id === etapaId
        ? { ...etapa, tarefas: etapa.tarefas.filter(t => t.id !== tarefaId) }
        : etapa
    );
    onEtapasChange(updated);
  };

  // Empty state
  if (etapas.length === 0) {
    return (
      <div className="bg-white rounded-lg p-12 flex flex-col items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-indigo-50 flex items-center justify-center">
            <Plus className="w-12 h-12 text-indigo-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Nenhuma etapa criada
          </h3>
          <p className="text-gray-500 mb-6 max-w-md">
            Crie a primeira etapa do fluxo para começar a organizar as tarefas
          </p>
          <button
            onClick={handleAddEtapa}
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Primeira Etapa
          </button>
        </div>
      </div>
    );
  }

  // Kanban layout with etapas
  return (
    <>
      <div className="bg-white rounded-lg border border-gray-200">
        {/* Header with add button */}
        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Etapas do Fluxo
          </h2>
          <button
            onClick={handleAddEtapa}
            className="inline-flex items-center px-3 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nova Etapa
          </button>
        </div>

        {/* Horizontal scrolling kanban */}
        <div className="overflow-x-auto">
          <div className="inline-flex gap-4 p-6 min-h-[500px]">
            {etapas.map((etapa) => (
              <EtapaColumn
                key={etapa.id}
                etapa={etapa}
                onUpdate={(updates) => handleUpdateEtapa(etapa.id, updates)}
                onDelete={() => handleDeleteEtapa(etapa.id)}
                onAddTarefa={() => setAddTarefaEtapaId(etapa.id)}
                onRemoveTarefa={(tarefaId) => handleRemoveTarefa(etapa.id, tarefaId)}
                onConfig={() => setConfigEtapaId(etapa.id)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Add Tarefa Modal */}
      {addTarefaEtapaId && (
        <AddTarefaModal
          onClose={() => setAddTarefaEtapaId(null)}
          onAdd={(tarefa) => handleAddTarefa(addTarefaEtapaId, tarefa)}
        />
      )}

      {/* Config Etapa Modal */}
      {configEtapaId && (
        <ConfigEtapaModal
          etapa={etapas.find(e => e.id === configEtapaId)!}
          onClose={() => setConfigEtapaId(null)}
          onSave={(config) => handleSaveConfig(configEtapaId, config)}
        />
      )}
    </>
  );
};

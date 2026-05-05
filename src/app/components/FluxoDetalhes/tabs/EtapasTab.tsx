import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
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
    const etapa = etapas.find(e => e.id === etapaId);

    if (etapa && etapa.tarefas.length > 0) {
      if (!confirm(`A etapa "${etapa.nome || 'Sem nome'}" possui ${etapa.tarefas.length} tarefa(s). Deseja excluir?`)) {
        return;
      }
    }

    // Remove and renumber
    const filtered = etapas.filter(e => e.id !== etapaId);
    const renumbered = filtered.map((e, index) => ({ ...e, ordem: index + 1 }));
    onEtapasChange(renumbered);
    toast.success('Etapa excluída com sucesso');
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
    toast.success('Tarefa adicionada com sucesso');
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
    toast.success('Configurações salvas');
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
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: '600', margin: 0 }}>
              Etapas do fluxo
            </h3>
            <p style={{ fontSize: '13px', color: '#666', margin: '4px 0 0 0' }}>
              Configure as etapas e tarefas deste fluxo
            </p>
          </div>
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
                onConfigEtapa={() => setConfigEtapaId(etapa.id)}
              />
            ))}
            {/* Placeholder add column */}
            {etapas.length > 0 && (
              <div
                onClick={handleAddEtapa}
                style={{
                  minWidth: '280px',
                  background: 'transparent',
                  border: '2px dashed #ccc',
                  borderRadius: '8px',
                  padding: '60px 40px',
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#999',
                  fontSize: '14px',
                  cursor: 'pointer',
                  textAlign: 'center'
                }}
              >
                <div>
                  <div style={{ fontSize: '32px', marginBottom: '8px' }}>+</div>
                  <div>Adicionar nova etapa</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Tarefa Modal */}
      {addTarefaEtapaId && (
        <AddTarefaModal
          open={true}
          onClose={() => setAddTarefaEtapaId(null)}
          onAdd={(tarefa) => handleAddTarefa(addTarefaEtapaId, tarefa)}
        />
      )}

      {/* Config Etapa Modal */}
      {configEtapaId && (() => {
        const etapa = etapas.find(e => e.id === configEtapaId);
        return etapa ? (
          <ConfigEtapaModal
            open={true}
            config={etapa.configuracoes}
            onClose={() => setConfigEtapaId(null)}
            onSave={(config) => handleSaveConfig(configEtapaId, config)}
          />
        ) : null;
      })()}
    </>
  );
};

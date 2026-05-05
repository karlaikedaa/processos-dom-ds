import React, { useState } from 'react';
import { Etapa, TarefaEtapa } from '../../../types/fluxo';
import { TarefaCard } from './TarefaCard';

interface EtapaColumnProps {
  etapa: Etapa;
  onUpdate: (updated: Etapa) => void;
  onDelete: () => void;
  onAddTarefa: () => void;
  onConfigEtapa: () => void;
}

export function EtapaColumn({ etapa, onUpdate, onDelete, onAddTarefa, onConfigEtapa }: EtapaColumnProps) {
  const [isEditingNome, setIsEditingNome] = useState(false);
  const [nomeTemp, setNomeTemp] = useState(etapa.nome);

  const handleNomeSave = () => {
    if (nomeTemp.trim()) {
      onUpdate({ ...etapa, nome: nomeTemp.trim() });
    }
    setIsEditingNome(false);
  };

  const handleDeleteTarefa = (tarefaId: string) => {
    const updatedTarefas = etapa.tarefas.filter(t => t.id !== tarefaId);
    onUpdate({ ...etapa, tarefas: updatedTarefas });
  };

  return (
    <div style={{
      minWidth: '320px',
      maxWidth: '320px',
      background: '#f8f9fa',
      borderRadius: '8px',
      padding: 0,
      flexShrink: 0
    }}>
      {/* Header */}
      <div style={{
        background: '#387c2b',
        color: 'white',
        padding: '12px 16px',
        borderRadius: '8px 8px 0 0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
          {isEditingNome ? (
            <input
              type="text"
              value={nomeTemp}
              onChange={(e) => setNomeTemp(e.target.value)}
              onBlur={handleNomeSave}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleNomeSave();
                if (e.key === 'Escape') {
                  setNomeTemp(etapa.nome);
                  setIsEditingNome(false);
                }
              }}
              autoFocus
              style={{
                background: 'white',
                color: 'black',
                border: 'none',
                borderRadius: '4px',
                padding: '4px 8px',
                fontSize: '14px',
                fontWeight: '600',
                flex: 1
              }}
            />
          ) : (
            <span
              style={{ fontWeight: '600', fontSize: '14px', flex: 1, cursor: 'pointer' }}
              onClick={() => setIsEditingNome(true)}
            >
              {etapa.ordem}. {etapa.nome || 'Sem nome'}
            </span>
          )}
          <span style={{
            background: 'rgba(255,255,255,0.3)',
            padding: '2px 8px',
            borderRadius: '12px',
            fontSize: '12px'
          }}>
            {etapa.tarefas.length}
          </span>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={onConfigEtapa}
            style={{
              border: 'none',
              background: 'transparent',
              color: 'white',
              cursor: 'pointer',
              fontSize: '16px',
              padding: 0
            }}
          >
            ⚙️
          </button>
          <button
            onClick={onDelete}
            style={{
              border: 'none',
              background: 'transparent',
              color: 'white',
              cursor: 'pointer',
              fontSize: '16px',
              padding: 0
            }}
          >
            🗑️
          </button>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {etapa.tarefas.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '20px',
            color: '#999',
            fontSize: '13px',
            border: '2px dashed #ddd',
            borderRadius: '6px'
          }}>
            Nenhuma tarefa nesta etapa
          </div>
        ) : (
          etapa.tarefas.map(tarefa => (
            <TarefaCard
              key={tarefa.id}
              tarefa={tarefa}
              onEdit={() => {/* TODO: open edit modal */}}
              onDelete={() => handleDeleteTarefa(tarefa.id)}
            />
          ))
        )}

        <button
          onClick={onAddTarefa}
          style={{
            width: '100%',
            padding: '8px',
            border: '1px dashed #999',
            background: 'white',
            borderRadius: '6px',
            fontSize: '12px',
            color: '#666',
            cursor: 'pointer'
          }}
        >
          + Adicionar tarefa
        </button>
      </div>
    </div>
  );
}

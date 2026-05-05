import React from 'react';
import { TarefaEtapa } from '../../../types/fluxo';

interface TarefaCardProps {
  tarefa: TarefaEtapa;
  onEdit: () => void;
  onDelete: () => void;
}

export function TarefaCard({ tarefa, onEdit, onDelete }: TarefaCardProps) {
  return (
    <div style={{
      background: 'white',
      padding: '12px',
      borderRadius: '6px',
      border: '1px solid #e0e0e0'
    }}>
      <div style={{ fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>
        {tarefa.nome}
      </div>
      <div style={{ fontSize: '11px', color: '#666', marginBottom: '4px' }}>
        📋 {tarefa.departamento}
      </div>
      <div style={{ fontSize: '11px', color: '#666', marginBottom: '8px' }}>
        <div>👤 {tarefa.responsavelNome}</div>
        {tarefa.aprovadorNome && (
          <div style={{ marginTop: '2px' }}>✓ Aprovador: {tarefa.aprovadorNome}</div>
        )}
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          onClick={onEdit}
          style={{
            border: 'none',
            background: '#f5f5f5',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '11px',
            cursor: 'pointer'
          }}
        >
          Editar
        </button>
        <button
          onClick={onDelete}
          style={{
            border: 'none',
            background: 'transparent',
            color: '#999',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          🗑️
        </button>
      </div>
    </div>
  );
}

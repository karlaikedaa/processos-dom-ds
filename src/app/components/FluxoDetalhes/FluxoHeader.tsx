import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { colors, spacing } from '../../../design-tokens';
import { Button } from '../ui/button';

interface FluxoHeaderProps {
  fluxoNome?: string;
  onSave: () => void;
  onCancel: () => void;
  saving?: boolean;
}

export function FluxoHeader({ fluxoNome, onSave, onCancel, saving = false }: FluxoHeaderProps) {
  const navigate = useNavigate();

  return (
    <>
      {/* Breadcrumb */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: spacing['1x'],
        marginBottom: spacing['1x'],
        fontSize: '14px',
        color: colors.colors.gray['600']
      }}>
        <span
          onClick={() => navigate('/configuracoes')}
          style={{ cursor: 'pointer' }}
          onMouseEnter={(e) => e.currentTarget.style.color = colors.link.label.default}
          onMouseLeave={(e) => e.currentTarget.style.color = colors.colors.gray['600']}
        >
          Configurações
        </span>
        <ChevronDown size={16} style={{ transform: 'rotate(-90deg)' }} />
        <span
          onClick={() => navigate('/configuracoes/fluxos-de-tarefa')}
          style={{ cursor: 'pointer' }}
          onMouseEnter={(e) => e.currentTarget.style.color = colors.link.label.default}
          onMouseLeave={(e) => e.currentTarget.style.color = colors.colors.gray['600']}
        >
          Fluxos de tarefa
        </span>
        <ChevronDown size={16} style={{ transform: 'rotate(-90deg)' }} />
        <span style={{ color: '#000', fontWeight: '600' }}>
          {fluxoNome || 'Novo fluxo'}
        </span>
      </div>

      {/* Title and Buttons */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing['2x']
      }}>
        <div>
          <h1 style={{
            fontSize: '24px',
            fontWeight: '700',
            color: '#000',
            margin: 0
          }}>
            {fluxoNome ? 'Edição de fluxo' : 'Novo fluxo'}
          </h1>
          {fluxoNome && (
            <p style={{
              fontSize: '14px',
              color: colors.colors.gray['600'],
              margin: '4px 0 0 0'
            }}>
              {fluxoNome}
            </p>
          )}
        </div>

        <div style={{ display: 'flex', gap: spacing['1_5x'] }}>
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={saving}
            style={{ minWidth: '120px' }}
          >
            CANCELAR
          </Button>
          <Button
            onClick={onSave}
            disabled={saving}
            style={{
              backgroundColor: saving ? '#ccc' : colors.action.primary.background,
              minWidth: '120px'
            }}
          >
            {saving ? 'SALVANDO...' : 'SALVAR'}
          </Button>
        </div>
      </div>
    </>
  );
}

import React from 'react';
import { Label } from '../../ui/label';

interface GeracaoTabProps {
  mesInicio: number;
  anoInicio: number;
  onMesChange: (mes: number) => void;
  onAnoChange: (ano: number) => void;
}

export function GeracaoTab({ mesInicio, anoInicio, onMesChange, onAnoChange }: GeracaoTabProps) {
  const meses = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const anos = [2024, 2025, 2026, 2027, 2028];

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '600', margin: '0 0 8px 0' }}>
          Geração de fluxo
        </h3>
        <p style={{ fontSize: '13px', color: '#666', margin: 0 }}>
          Configure a partir de qual mês este fluxo será considerado
        </p>
      </div>

      {/* Warning */}
      <div style={{
        background: '#fff3e0',
        borderLeft: '4px solid #ff9800',
        padding: '16px',
        marginBottom: '24px',
        borderRadius: '4px'
      }}>
        <div style={{ display: 'flex', gap: '12px' }}>
          <span style={{ fontSize: '20px' }}>⚠️</span>
          <div>
            <div style={{ fontSize: '14px', fontWeight: '600', color: '#e65100', marginBottom: '4px' }}>
              Atenção
            </div>
            <p style={{ margin: 0, fontSize: '13px', color: '#666', lineHeight: '1.5' }}>
              Esta ação ignora qualquer fluxo com tarefas cadastradas anteriormente, cobranças de documentos e ações em seu histórico na área de cadastro de clientes. Isso quer dizer que os clientes já iniciados nos fluxos anteriores <strong>não ficarão bloqueados</strong> e, a exclusão das tarefas geradas anteriormente, permanecerá com você.
            </p>
          </div>
        </div>
      </div>

      {/* Período de geração */}
      <div style={{ marginBottom: '24px' }}>
        <Label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>
          Período de geração do workflow
        </Label>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          {/* Mês */}
          <div>
            <label style={{ display: 'block', fontSize: '12px', color: '#666', marginBottom: '6px' }}>
              Mês
            </label>
            <select
              value={mesInicio}
              onChange={(e) => onMesChange(Number(e.target.value))}
              className="w-full px-3 py-2 border rounded-md"
              style={{ fontSize: '14px' }}
            >
              {meses.map((mes, index) => (
                <option key={index} value={index + 1}>
                  {mes}
                </option>
              ))}
            </select>
          </div>

          {/* Ano */}
          <div>
            <label style={{ display: 'block', fontSize: '12px', color: '#666', marginBottom: '6px' }}>
              Ano
            </label>
            <select
              value={anoInicio}
              onChange={(e) => onAnoChange(Number(e.target.value))}
              className="w-full px-3 py-2 border rounded-md"
              style={{ fontSize: '14px' }}
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
      <div style={{
        background: '#e3f2fd',
        borderLeft: '4px solid #2196f3',
        padding: '16px',
        borderRadius: '4px'
      }}>
        <div style={{ display: 'flex', gap: '12px' }}>
          <span style={{ fontSize: '20px' }}>💡</span>
          <div>
            <p style={{ margin: 0, fontSize: '13px', color: '#1565c0', lineHeight: '1.5' }}>
              A partir do mês selecionado, este fluxo recorrente será gerado automaticamente para todos os clientes selecionados na aba "Clientes".
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

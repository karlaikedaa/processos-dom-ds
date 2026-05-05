import React from 'react';
import { Fluxo, Frequencia, DiaSemana, MetaTarefa } from '../../../types/fluxo';

interface DetalhesTabProps {
  fluxo: Fluxo;
  onChange: (fluxo: Fluxo) => void;
}

export function DetalhesTab({ fluxo, onChange }: DetalhesTabProps) {
  const handleNomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...fluxo,
      nome: e.target.value
    });
  };

  const handleTipoChange = (tipo: 'recorrente' | 'esporadico') => {
    const updated = {
      ...fluxo,
      tipo
    };

    // Se mudar para esporádico, limpar campos específicos de recorrente
    if (tipo === 'esporadico') {
      updated.metaTarefa = undefined;
      updated.frequencia = undefined;
      updated.diaInicio = undefined;
      updated.diaSemana = undefined;
      updated.considerarDiasUteis = undefined;
      updated.adiarFimSemana = undefined;
    }

    onChange(updated);
  };

  const handleMetaTarefaChange = (metaTarefa: MetaTarefa) => {
    onChange({
      ...fluxo,
      metaTarefa
    });
  };

  const handleFrequenciaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const frequencia = e.target.value as Frequencia;
    const updated = {
      ...fluxo,
      frequencia
    };

    // Limpar diaInicio se não for semanal
    if (frequencia !== 'semanal') {
      updated.diaSemana = undefined;
    }

    onChange(updated);
  };

  const handleDiaInicioChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value ? Number(e.target.value) : undefined;
    onChange({
      ...fluxo,
      diaInicio: value
    });
  };

  const handleDiaSemanaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const diaSemana = e.target.value as DiaSemana;
    onChange({
      ...fluxo,
      diaSemana: diaSemana || undefined
    });
  };

  const handleCompetenciaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...fluxo,
      competencia: Number(e.target.value) || 0
    });
  };

  const handleConsiderarDiasUteisChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...fluxo,
      considerarDiasUteis: e.target.checked
    });
  };

  const handleAdiarFimSemanaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...fluxo,
      adiarFimSemana: e.target.checked
    });
  };

  return (
    <div className="detalhes-tab">
      <form className="fluxo-form">
        {/* Nome */}
        <div className="form-group">
          <label htmlFor="nome">
            Nome <span className="required">*</span>
          </label>
          <input
            id="nome"
            type="text"
            placeholder="Digite o nome do fluxo"
            value={fluxo.nome}
            onChange={handleNomeChange}
            className="form-input"
            required
          />
        </div>

        {/* Tipo de Fluxo */}
        <div className="form-group">
          <label>
            Tipo de fluxo <span className="required">*</span>
          </label>
          <div className="radio-group">
            <label className="radio-label">
              <input
                type="radio"
                name="tipo"
                value="recorrente"
                checked={fluxo.tipo === 'recorrente'}
                onChange={() => handleTipoChange('recorrente')}
              />
              <span>Recorrente</span>
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="tipo"
                value="esporadico"
                checked={fluxo.tipo === 'esporadico'}
                onChange={() => handleTipoChange('esporadico')}
              />
              <span>Esporádico</span>
            </label>
          </div>
        </div>

        {/* Campos específicos para recorrente */}
        {fluxo.tipo === 'recorrente' && (
          <>
            {/* Meta das Tarefas */}
            <div className="form-group">
              <label>
                Meta das tarefas <span className="required">*</span>
              </label>
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="metaTarefa"
                    value="abertura"
                    checked={fluxo.metaTarefa === 'abertura'}
                    onChange={() => handleMetaTarefaChange('abertura')}
                  />
                  <span>Abertura</span>
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="metaTarefa"
                    value="conclusao"
                    checked={fluxo.metaTarefa === 'conclusao'}
                    onChange={() => handleMetaTarefaChange('conclusao')}
                  />
                  <span>Conclusão</span>
                </label>
              </div>
            </div>

            {/* Frequência */}
            <div className="form-group">
              <label htmlFor="frequencia">
                Frequência <span className="required">*</span>
              </label>
              <select
                id="frequencia"
                value={fluxo.frequencia || ''}
                onChange={handleFrequenciaChange}
                className="form-select"
              >
                <option value="">Selecione a frequência</option>
                {renderFrequenciaOptions()}
              </select>
            </div>

            {/* Início do Fluxo - Condicional baseado em frequência */}
            {fluxo.frequencia && (
              <div className="form-group">
                <label htmlFor="diaInicio">
                  Início do fluxo <span className="required">*</span>
                </label>
                {fluxo.frequencia === 'semanal' ? (
                  <select
                    id="diaInicio"
                    value={fluxo.diaSemana || ''}
                    onChange={handleDiaSemanaChange}
                    className="form-select"
                  >
                    <option value="">Selecione o dia da semana</option>
                    {renderDiaOptions()}
                  </select>
                ) : (
                  <input
                    id="diaInicio"
                    type="number"
                    min="1"
                    max="31"
                    placeholder="Dia do mês"
                    value={fluxo.diaInicio || ''}
                    onChange={handleDiaInicioChange}
                    className="form-input"
                  />
                )}
              </div>
            )}

            {/* Considerar apenas dias úteis */}
            <div className="form-group toggle-group">
              <label className="toggle-label">
                <input
                  type="checkbox"
                  checked={fluxo.considerarDiasUteis || false}
                  onChange={handleConsiderarDiasUteisChange}
                  className="form-checkbox"
                />
                <span>Considerar apenas dias úteis</span>
              </label>
            </div>

            {/* Adiar fim de semana */}
            <div className="form-group toggle-group">
              <label className="toggle-label">
                <input
                  type="checkbox"
                  checked={fluxo.adiarFimSemana || false}
                  onChange={handleAdiarFimSemanaChange}
                  className="form-checkbox"
                />
                <span>Adiar fim de semana</span>
              </label>
            </div>
          </>
        )}

        {/* Competência - Sempre aparece */}
        <div className="form-group">
          <label htmlFor="competencia">
            Competência <span className="required">*</span>
          </label>
          <input
            id="competencia"
            type="number"
            placeholder="Digite o competência"
            value={fluxo.competencia}
            onChange={handleCompetenciaChange}
            className="form-input"
            required
          />
        </div>
      </form>

      <style jsx>{`
        .detalhes-tab {
          padding: 24px;
          max-width: 600px;
        }

        .fluxo-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .toggle-group {
          gap: 12px;
        }

        label {
          font-size: 14px;
          font-weight: 500;
          color: #333;
        }

        .required {
          color: #dc0a0a;
          margin-left: 2px;
        }

        .form-input,
        .form-select {
          padding: 8px 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
          font-family: inherit;
          transition: border-color 0.2s;
        }

        .form-input:focus,
        .form-select:focus {
          outline: none;
          border-color: #0766c5;
          box-shadow: 0 0 0 2px rgba(7, 102, 197, 0.1);
        }

        .radio-group {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .radio-label,
        .toggle-label {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          font-weight: 400;
          color: #333;
        }

        .radio-label input[type="radio"],
        .toggle-label input[type="checkbox"] {
          cursor: pointer;
          width: 18px;
          height: 18px;
        }

        .radio-label span,
        .toggle-label span {
          font-size: 14px;
        }
      `}</style>
    </div>
  );
}

/**
 * Helper function to render dia da semana options
 */
function renderDiaOptions() {
  const dias: { value: DiaSemana; label: string }[] = [
    { value: 'segunda', label: 'Segunda-feira' },
    { value: 'terca', label: 'Terça-feira' },
    { value: 'quarta', label: 'Quarta-feira' },
    { value: 'quinta', label: 'Quinta-feira' },
    { value: 'sexta', label: 'Sexta-feira' },
    { value: 'sabado', label: 'Sábado' },
    { value: 'domingo', label: 'Domingo' }
  ];

  return dias.map(dia => (
    <option key={dia.value} value={dia.value}>
      {dia.label}
    </option>
  ));
}

/**
 * Helper function to render frequência options
 */
function renderFrequenciaOptions() {
  const frequencias: { value: Frequencia; label: string }[] = [
    { value: 'semanal', label: 'Semanal' },
    { value: 'decendial', label: 'Decendial' },
    { value: 'mensal', label: 'Mensal' },
    { value: 'bimestral', label: 'Bimestral' },
    { value: 'trimestral', label: 'Trimestral' },
    { value: 'semestral', label: 'Semestral' },
    { value: 'anual', label: 'Anual' }
  ];

  return frequencias.map(freq => (
    <option key={freq.value} value={freq.value}>
      {freq.label}
    </option>
  ));
}

/**
 * Helper function to render competência options
 */
function renderCompetenciaOptions() {
  // Pode ser expandido conforme necessidade
  // Por enquanto retorna um array vazio ou valores predefinidos
  const competencias: { value: number; label: string }[] = [];
  return competencias.map(comp => (
    <option key={comp.value} value={comp.value}>
      {comp.label}
    </option>
  ));
}

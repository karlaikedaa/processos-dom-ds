import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Clock, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { useTimer } from '../contexts/TimerContext';
import { getWeek, formatDayHeader, formatWeekRange, parseDuration, formatDuration } from '../utils/time';
import { TimeInput } from './ui/time-input';
import { WhiteBlock } from './ui/white-block';
import { ConfigBreadcrumb } from './ui/config-breadcrumb';
import { colors } from '../../design-tokens';

const NOOP = () => {};

export function Apontar() {
  const { timesheetRows, entries, getTotalPorDia, updateTimeEntry } = useTimer();

  const [weekOffset, setWeekOffset] = useState(0);
  const [clienteFiltro, setClienteFiltro] = useState<string | null>(null);
  const [tarefaFiltro, setTarefaFiltro] = useState<number | null>(null);
  const [responsavelFiltro, setResponsavelFiltro] = useState<string | null>(null);

  const week = useMemo(() => getWeek(weekOffset), [weekOffset]);
  const weekDates = useMemo(() => week.dias.map(d => format(d, 'yyyy-MM-dd')), [week]);

  // Compute available filter options
  const clientesDisponiveis = useMemo(() => {
    const clientes = new Set<string>();
    timesheetRows.forEach(row => clientes.add(row.clienteNome));
    return Array.from(clientes).sort();
  }, [timesheetRows]);

  const tarefasDisponiveis = useMemo(() => {
    if (!clienteFiltro) return [];

    const tarefas = timesheetRows
      .filter(row => row.clienteNome === clienteFiltro)
      .map(row => ({ id: row.tarefaId, nome: row.tarefaNome }));

    return tarefas;
  }, [timesheetRows, clienteFiltro]);

  const responsaveisDisponiveis = useMemo(() => {
    let rows = timesheetRows;

    if (clienteFiltro) {
      rows = rows.filter(row => row.clienteNome === clienteFiltro);
    }

    if (tarefaFiltro) {
      rows = rows.filter(row => row.tarefaId === tarefaFiltro);
    }

    const responsaveis = new Set<string>();
    rows.forEach(row => responsaveis.add(row.responsavel));
    return Array.from(responsaveis).sort();
  }, [timesheetRows, clienteFiltro, tarefaFiltro]);

  // Filter rows based on cascading filters
  const rowsFiltradas = useMemo(() => {
    let rows = timesheetRows;

    if (clienteFiltro) {
      rows = rows.filter(row => row.clienteNome === clienteFiltro);
    }

    if (tarefaFiltro) {
      rows = rows.filter(row => row.tarefaId === tarefaFiltro);
    }

    if (responsavelFiltro) {
      rows = rows.filter(row => row.responsavel === responsavelFiltro);
    }

    return rows;
  }, [timesheetRows, clienteFiltro, tarefaFiltro, responsavelFiltro]);

  // Handle filter changes with cascading
  const handleClienteChange = (cliente: string) => {
    if (cliente === '') {
      setClienteFiltro(null);
      setTarefaFiltro(null);
      setResponsavelFiltro(null);
    } else {
      setClienteFiltro(cliente);
      setTarefaFiltro(null);
      setResponsavelFiltro(null);
    }
  };

  const handleTarefaChange = (tarefaId: string) => {
    if (tarefaId === '') {
      setTarefaFiltro(null);
      setResponsavelFiltro(null);
    } else {
      setTarefaFiltro(parseInt(tarefaId, 10));
      setResponsavelFiltro(null);
    }
  };

  const handleResponsavelChange = (responsavel: string) => {
    if (responsavel === '') {
      setResponsavelFiltro(null);
    } else {
      setResponsavelFiltro(responsavel);
    }
  };

  // Handle time entry confirmation
  const handleTimeConfirm = (tarefaId: number, data: string) => {
    return (oldValue: string, newValue: string) => {
      const confirma = window.confirm(
        `Atualizar apontamento?\n\nDe: ${oldValue}\nPara: ${newValue}`
      );

      if (confirma) {
        updateTimeEntry(tarefaId, data, newValue);
      }

      return confirma;
    };
  };

  // Calculate total for each day
  const totaisPorDia = useMemo(() => {
    return weekDates.map(data => {
      const totalStr = getTotalPorDia(data);
      const totalSegundos = parseDuration(totalStr);
      const excede8h = totalSegundos > 28800; // 8 horas = 28800 segundos

      return {
        data,
        total: totalStr,
        excede8h
      };
    });
  }, [weekDates, getTotalPorDia]);

  // Calculate row total for the week
  const calcularTotalLinha = (row: typeof rowsFiltradas[0]) => {
    let totalSegundos = 0;

    weekDates.forEach(data => {
      const duracao = row.horas[data] || '00:00:00';
      totalSegundos += parseDuration(duracao);
    });

    return formatDuration(totalSegundos);
  };

  return (
    <div style={{
      backgroundColor: colors.colors.gray['100'],
      minHeight: '100vh',
      padding: '24px'
    }}>
      {/* Breadcrumb */}
      <div style={{ marginBottom: '24px' }}>
        <ConfigBreadcrumb
          menuLabel="Apontar Horas"
          onNavigateToConfig={NOOP}
        />
      </div>

      {/* Filters */}
      <WhiteBlock style={{ marginBottom: '16px' }}>
        <div style={{
          display: 'flex',
          gap: '16px',
          alignItems: 'center',
          flexWrap: 'wrap'
        }}>
          {/* Cliente Filter */}
          <div style={{ flex: '1 1 200px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: 500,
              marginBottom: '4px',
              color: '#333'
            }}>
              Cliente
            </label>
            <select
              value={clienteFiltro || ''}
              onChange={(e) => handleClienteChange(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d0d0d0',
                borderRadius: '4px',
                fontSize: '14px',
                backgroundColor: 'white',
                cursor: 'pointer'
              }}
            >
              <option value="">Todos os clientes</option>
              {clientesDisponiveis.map(cliente => (
                <option key={cliente} value={cliente}>
                  {cliente}
                </option>
              ))}
            </select>
          </div>

          {/* Tarefa Filter */}
          <div style={{ flex: '1 1 200px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: 500,
              marginBottom: '4px',
              color: '#333'
            }}>
              Tarefa
            </label>
            <select
              value={tarefaFiltro || ''}
              onChange={(e) => handleTarefaChange(e.target.value)}
              disabled={!clienteFiltro}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d0d0d0',
                borderRadius: '4px',
                fontSize: '14px',
                backgroundColor: clienteFiltro ? 'white' : '#f5f5f5',
                cursor: clienteFiltro ? 'pointer' : 'not-allowed',
                opacity: clienteFiltro ? 1 : 0.6
              }}
            >
              <option value="">Todas as tarefas</option>
              {tarefasDisponiveis.map(tarefa => (
                <option key={tarefa.id} value={tarefa.id}>
                  {tarefa.nome}
                </option>
              ))}
            </select>
          </div>

          {/* Responsável Filter */}
          <div style={{ flex: '1 1 200px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: 500,
              marginBottom: '4px',
              color: '#333'
            }}>
              Responsável
            </label>
            <select
              value={responsavelFiltro || ''}
              onChange={(e) => handleResponsavelChange(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d0d0d0',
                borderRadius: '4px',
                fontSize: '14px',
                backgroundColor: 'white',
                cursor: 'pointer'
              }}
            >
              <option value="">Todos os responsáveis</option>
              {responsaveisDisponiveis.map(responsavel => (
                <option key={responsavel} value={responsavel}>
                  {responsavel}
                </option>
              ))}
            </select>
          </div>
        </div>
      </WhiteBlock>

      {/* Timesheet Table */}
      <WhiteBlock>
        {/* Week Navigation */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px',
          paddingBottom: '16px',
          borderBottom: '1px solid #e0e0e0'
        }}>
          <button
            onClick={() => setWeekOffset(prev => prev - 1)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '8px 12px',
              border: '1px solid #d0d0d0',
              borderRadius: '4px',
              backgroundColor: 'white',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            <ChevronLeft size={16} />
            Semana anterior
          </button>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '16px',
            fontWeight: 600,
            color: '#333'
          }}>
            <Clock size={20} />
            {formatWeekRange(week)}
          </div>

          <button
            onClick={() => setWeekOffset(prev => prev + 1)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '8px 12px',
              border: '1px solid #d0d0d0',
              borderRadius: '4px',
              backgroundColor: 'white',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Próxima semana
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '14px'
          }}>
            <thead>
              <tr style={{ backgroundColor: '#f9f9f9' }}>
                <th style={{
                  padding: '12px',
                  textAlign: 'left',
                  fontWeight: 600,
                  borderBottom: '2px solid #e0e0e0',
                  minWidth: '200px'
                }}>
                  Tarefa
                </th>
                <th style={{
                  padding: '12px',
                  textAlign: 'left',
                  fontWeight: 600,
                  borderBottom: '2px solid #e0e0e0',
                  minWidth: '150px'
                }}>
                  Cliente
                </th>
                <th style={{
                  padding: '12px',
                  textAlign: 'left',
                  fontWeight: 600,
                  borderBottom: '2px solid #e0e0e0',
                  minWidth: '120px'
                }}>
                  Responsável
                </th>
                {week.dias.map((dia, idx) => (
                  <th key={idx} style={{
                    padding: '12px',
                    textAlign: 'center',
                    fontWeight: 600,
                    borderBottom: '2px solid #e0e0e0',
                    minWidth: '100px'
                  }}>
                    <div style={{ fontSize: '12px', color: '#666', marginBottom: '2px' }}>
                      {format(dia, 'EEE', { locale: require('date-fns/locale/pt-BR') }).toUpperCase()}
                    </div>
                    <div>{formatDayHeader(dia)}</div>
                  </th>
                ))}
                <th style={{
                  padding: '12px',
                  textAlign: 'center',
                  fontWeight: 600,
                  borderBottom: '2px solid #e0e0e0',
                  minWidth: '100px',
                  backgroundColor: '#f0f0f0'
                }}>
                  Total
                </th>
              </tr>
            </thead>

            <tbody>
              {/* Totals Row */}
              <tr style={{
                backgroundColor: '#fffbf0',
                fontWeight: 600
              }}>
                <td colSpan={3} style={{
                  padding: '12px',
                  borderBottom: '1px solid #e0e0e0'
                }}>
                  Total por dia
                </td>
                {totaisPorDia.map(({ data, total, excede8h }) => (
                  <td key={data} style={{
                    padding: '12px',
                    textAlign: 'center',
                    borderBottom: '1px solid #e0e0e0'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px'
                    }}>
                      {excede8h && (
                        <AlertTriangle
                          size={16}
                          color={colors.colors.yellow['500']}
                          title="Mais de 8 horas apontadas"
                        />
                      )}
                      <span style={{
                        color: excede8h ? colors.colors.yellow['500'] : '#333'
                      }}>
                        {total}
                      </span>
                    </div>
                  </td>
                ))}
                <td style={{
                  padding: '12px',
                  textAlign: 'center',
                  borderBottom: '1px solid #e0e0e0',
                  backgroundColor: '#f0f0f0'
                }}>
                  -
                </td>
              </tr>

              {/* Task Rows */}
              {rowsFiltradas.length === 0 ? (
                <tr>
                  <td colSpan={10} style={{
                    padding: '40px',
                    textAlign: 'center',
                    color: '#666',
                    fontStyle: 'italic'
                  }}>
                    Nenhum apontamento encontrado para os filtros selecionados.
                  </td>
                </tr>
              ) : (
                rowsFiltradas.map(row => (
                  <tr key={row.tarefaId} style={{
                    borderBottom: '1px solid #f0f0f0'
                  }}>
                    <td style={{ padding: '12px' }}>
                      {row.tarefaNome}
                    </td>
                    <td style={{ padding: '12px', color: '#666' }}>
                      {row.clienteNome}
                    </td>
                    <td style={{ padding: '12px', color: '#666' }}>
                      {row.responsavel}
                    </td>
                    {weekDates.map(data => (
                      <td key={data} style={{
                        padding: '12px',
                        textAlign: 'center'
                      }}>
                        <TimeInput
                          value={row.horas[data] || '00:00:00'}
                          onChange={(newValue) => updateTimeEntry(row.tarefaId, data, newValue)}
                          onConfirm={handleTimeConfirm(row.tarefaId, data)}
                        />
                      </td>
                    ))}
                    <td style={{
                      padding: '12px',
                      textAlign: 'center',
                      fontWeight: 600,
                      backgroundColor: '#f9f9f9'
                    }}>
                      {calcularTotalLinha(row)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </WhiteBlock>
    </div>
  );
}

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { colors, spacing } from '../../design-tokens';
import { ChevronDown, Search, Plus, Info } from 'lucide-react';
import { WhiteBlock } from './ui/white-block';
import { Input } from './ui/input';
import { Button } from './ui/button';

// ─── Types ────────────────────────────────────────────────────────────────────

type TipoFluxo = 'recorrente' | 'esporadico';
type Frequencia = 'semanal' | 'decendial' | 'mensal' | 'bimestral' | 'trimestral' | 'semestral' | 'anual';
type MetaTarefa = 'abertura' | 'conclusao';
type DiaSemana = 'segunda' | 'terca' | 'quarta' | 'quinta' | 'sexta' | 'sabado' | 'domingo';

interface Fluxo {
  id: number;
  nome: string;
  tipo: TipoFluxo;
  competencia: number;
  etapas: number;
  totalTarefas: number;
  clientes: number;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const mockFluxos: Fluxo[] = [
  { id: 1, nome: 'Fluxo 1', tipo: 'recorrente', competencia: 7, etapas: 3, totalTarefas: 9, clientes: 3 },
  { id: 2, nome: 'Fluxo 2', tipo: 'esporadico', competencia: -7, etapas: 2, totalTarefas: 10, clientes: 2 },
  { id: 3, nome: 'Fluxo 3', tipo: 'recorrente', competencia: -1, etapas: 4, totalTarefas: 4, clientes: 4 },
];

// ─── Components ───────────────────────────────────────────────────────────────

export function FluxosDeTarefaLista() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredFluxos = mockFluxos.filter(fluxo =>
    fluxo.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleNovoFluxo = () => {
    navigate('/configuracoes/fluxos-de-tarefa/novo');
  };

  return (
    <div style={{
      backgroundColor: colors.elements['background 02'],
      minHeight: '100vh',
      padding: spacing['3x']
    }}>
      {/* Breadcrumb */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: spacing['1x'],
        marginBottom: spacing['1x'],
        fontSize: '14px',
        color: colors.colors.gray['600']
      }}>
        <span>Configurações</span>
        <ChevronDown size={16} style={{ transform: 'rotate(-90deg)' }} />
        <span>Fluxos de tarefa</span>
      </div>

      {/* Page Title */}
      <h1 style={{
        fontSize: '24px',
        fontWeight: '700',
        color: '#000',
        marginBottom: spacing['2x']
      }}>
        Configurações - Fluxos de tarefa
      </h1>

      {/* Info Block */}
      <WhiteBlock style={{ marginBottom: spacing['2x'] }}>
        <div style={{ display: 'flex', alignItems: 'start', gap: spacing['1_5x'], padding: spacing['2x'] }}>
          <Info size={20} style={{ color: colors.link.label.default, flexShrink: 0, marginTop: '2px' }} />
          <p style={{ fontSize: '14px', color: '#333', lineHeight: '1.5' }}>
            Fluxos de tarefas são agrupamentos de tarefas recorrentes ou esporádicas de diferentes departamentos.
            <strong> Antes de criar um fluxo, é necessário criar as tarefas acessando a opção "Gerenciar tarefas" do menu Configurações.</strong>
          </p>
        </div>
      </WhiteBlock>

      {/* Header with count and search */}
      <WhiteBlock style={{ marginBottom: spacing['2x'] }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: spacing['2x'],
          flexWrap: 'wrap',
          padding: spacing['2x']
        }}>
          <h2 style={{
            fontSize: '16px',
            fontWeight: '600',
            color: '#000'
          }}>
            {mockFluxos.length} Fluxos de tarefa
          </h2>

          <div style={{ display: 'flex', gap: spacing['1_5x'], alignItems: 'center' }}>
            <div style={{ position: 'relative' }}>
              <Search
                size={16}
                style={{
                  position: 'absolute',
                  left: spacing['1_5x'],
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: colors['text color'].placeholder
                }}
              />
              <Input
                type="text"
                placeholder="Pesquisar pelo nome do fluxo"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  paddingLeft: '36px',
                  width: '300px'
                }}
              />
            </div>

            <Button
              onClick={handleNovoFluxo}
              style={{
                backgroundColor: colors.action.primary.background,
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                gap: spacing['1x'],
                whiteSpace: 'nowrap'
              }}
            >
              <Plus size={16} />
              NOVO FLUXO DE TAREFA
            </Button>
          </div>
        </div>
      </WhiteBlock>

      {/* Table */}
      <WhiteBlock>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '14px'
        }}>
          <thead>
            <tr style={{ borderBottom: `1px solid #e0e0e0` }}>
              <th style={{
                padding: spacing['1_5x'],
                textAlign: 'left',
                fontWeight: '600',
                color: '#333'
              }}>
                Nome
                <ChevronDown size={14} style={{ marginLeft: '4px', verticalAlign: 'middle' }} />
              </th>
              <th style={{
                padding: spacing['1_5x'],
                textAlign: 'left',
                fontWeight: '600',
                color: '#333'
              }}>
                Tipo de fluxo
                <ChevronDown size={14} style={{ marginLeft: '4px', verticalAlign: 'middle' }} />
              </th>
              <th style={{
                padding: spacing['1_5x'],
                textAlign: 'left',
                fontWeight: '600',
                color: '#333'
              }}>
                Competência
                <ChevronDown size={14} style={{ marginLeft: '4px', verticalAlign: 'middle' }} />
              </th>
              <th style={{
                padding: spacing['1_5x'],
                textAlign: 'left',
                fontWeight: '600',
                color: '#333'
              }}>
                Etapas
                <ChevronDown size={14} style={{ marginLeft: '4px', verticalAlign: 'middle' }} />
              </th>
              <th style={{
                padding: spacing['1_5x'],
                textAlign: 'left',
                fontWeight: '600',
                color: '#333'
              }}>
                Total de tarefas do fluxo
                <ChevronDown size={14} style={{ marginLeft: '4px', verticalAlign: 'middle' }} />
              </th>
              <th style={{
                padding: spacing['1_5x'],
                textAlign: 'left',
                fontWeight: '600',
                color: '#333'
              }}>
                Cliente com o fluxo
                <ChevronDown size={14} style={{ marginLeft: '4px', verticalAlign: 'middle' }} />
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredFluxos.map((fluxo) => (
              <tr
                key={fluxo.id}
                style={{
                  borderBottom: `1px solid #f0f0f0`,
                  cursor: 'pointer'
                }}
                onClick={() => {
                  navigate(`/configuracoes/fluxos-de-tarefa/${fluxo.id}`);
                }}
              >
                <td style={{ padding: spacing['1_5x'] }}>
                  <span style={{ color: colors.link.label.default, textDecoration: 'underline' }}>
                    {fluxo.nome}
                  </span>
                </td>
                <td style={{ padding: spacing['1_5x'], color: '#666' }}>
                  {fluxo.tipo === 'recorrente' ? 'Recorrente' : 'Esporádico'}
                </td>
                <td style={{ padding: spacing['1_5x'], color: '#666' }}>
                  {fluxo.competencia}
                </td>
                <td style={{ padding: spacing['1_5x'], color: '#666' }}>
                  {fluxo.etapas}
                </td>
                <td style={{ padding: spacing['1_5x'], color: '#666' }}>
                  {fluxo.totalTarefas}
                </td>
                <td style={{ padding: spacing['1_5x'], color: '#666' }}>
                  {fluxo.clientes}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </WhiteBlock>
    </div>
  );
}

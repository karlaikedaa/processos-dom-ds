import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import FluxoDetalhes from '../index';

// Mock child components
vi.mock('../FluxoHeader', () => ({
  default: ({ fluxoNome, onSave, onCancel }: any) => (
    <div data-testid="fluxo-header">
      <span>{fluxoNome || 'Novo fluxo'}</span>
      <button onClick={onSave}>Salvar</button>
      <button onClick={onCancel}>Cancelar</button>
    </div>
  )
}));

vi.mock('../FluxoTabs', () => ({
  default: ({ activeTab, onTabChange, tipoFluxo }: any) => (
    <div data-testid="fluxo-tabs">
      <button onClick={() => onTabChange('detalhes')}>Detalhes</button>
      {tipoFluxo === 'recorrente' && (
        <>
          <button onClick={() => onTabChange('clientes')}>Clientes</button>
          <button onClick={() => onTabChange('geracao')}>Geração</button>
        </>
      )}
    </div>
  )
}));

vi.mock('../tabs/DetalhesTab', () => ({
  default: ({ fluxo, onChange }: any) => (
    <div data-testid="detalhes-tab">
      <input
        value={fluxo.nome}
        onChange={(e) => onChange({ ...fluxo, nome: e.target.value })}
        data-testid="nome-input"
      />
    </div>
  )
}));

const renderWithRouter = (id: string = 'novo') => {
  return render(
    <BrowserRouter>
      <Routes>
        <Route path="/configuracoes/fluxos-de-tarefa/:id" element={<FluxoDetalhes />} />
      </Routes>
    </BrowserRouter>,
    { wrapper: ({ children }) => <BrowserRouter>{children}</BrowserRouter> }
  );
};

describe('FluxoDetalhes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render FluxoDetalhes container', async () => {
    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByTestId('fluxo-header')).toBeInTheDocument();
      expect(screen.getByTestId('fluxo-tabs')).toBeInTheDocument();
      expect(screen.getByTestId('detalhes-tab')).toBeInTheDocument();
    });
  });
});

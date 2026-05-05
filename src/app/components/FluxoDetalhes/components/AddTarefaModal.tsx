import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '../../ui/dialog';
import { Button } from '../../ui/button';
import { Label } from '../../ui/label';
import { TarefaEtapa } from '../../../types/fluxo';
import { toast } from 'sonner';

// Mock data - would come from API
const mockTarefasDisponiveis = [
  { id: 1, nome: 'Conferência Mensal', departamento: 'Telemarketing 1' },
  { id: 2, nome: 'Calendário Mensal das Obrigações', departamento: 'Publicação' },
  { id: 3, nome: 'Alteração de cliente', departamento: 'Contabil da Contabil' }
];

const mockFuncionarios = [
  { id: 1, nome: 'Felipe Brandão BR' },
  { id: 2, nome: 'João Pacheco' },
  { id: 3, nome: 'Maria Silva' }
];

interface AddTarefaModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (tarefa: TarefaEtapa) => void;
}

export function AddTarefaModal({ open, onClose, onAdd }: AddTarefaModalProps) {
  const [selectedTarefa, setSelectedTarefa] = useState<typeof mockTarefasDisponiveis[0] | null>(null);
  const [responsavel, setResponsavel] = useState<typeof mockFuncionarios[0] | null>(null);
  const [aprovador, setAprovador] = useState<typeof mockFuncionarios[0] | null>(null);

  const handleAdd = () => {
    if (!selectedTarefa) {
      toast.error('Selecione uma tarefa');
      return;
    }

    if (!responsavel) {
      toast.error('Selecione um responsável');
      return;
    }

    const novaTarefa: TarefaEtapa = {
      id: `tarefa-${Date.now()}`,
      tarefaId: selectedTarefa.id,
      nome: selectedTarefa.nome,
      departamento: selectedTarefa.departamento,
      responsavelId: responsavel.id,
      responsavelNome: responsavel.nome,
      aprovadorId: aprovador?.id,
      aprovadorNome: aprovador?.nome
    };

    onAdd(novaTarefa);
    onClose();

    // Reset form
    setSelectedTarefa(null);
    setResponsavel(null);
    setAprovador(null);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar tarefa à etapa</DialogTitle>
        </DialogHeader>

        <div className="space-y-4" style={{ padding: '16px 0' }}>
          {/* Select Tarefa */}
          <div className="space-y-2">
            <Label htmlFor="tarefa">
              Tarefa <span style={{ color: '#dc0a0a' }}>*</span>
            </Label>
            <select
              id="tarefa"
              value={selectedTarefa?.id || ''}
              onChange={(e) => {
                const tarefa = mockTarefasDisponiveis.find(t => t.id === Number(e.target.value));
                setSelectedTarefa(tarefa || null);
              }}
              className="w-full px-3 py-2 border rounded-md"
              style={{ fontSize: '14px' }}
            >
              <option value="">Selecione uma tarefa</option>
              {mockTarefasDisponiveis.map(tarefa => (
                <option key={tarefa.id} value={tarefa.id}>
                  {tarefa.nome} - {tarefa.departamento}
                </option>
              ))}
            </select>
          </div>

          {/* Select Responsável */}
          <div className="space-y-2">
            <Label htmlFor="responsavel">
              Responsável <span style={{ color: '#dc0a0a' }}>*</span>
            </Label>
            <select
              id="responsavel"
              value={responsavel?.id || ''}
              onChange={(e) => {
                const func = mockFuncionarios.find(f => f.id === Number(e.target.value));
                setResponsavel(func || null);
              }}
              className="w-full px-3 py-2 border rounded-md"
              style={{ fontSize: '14px' }}
            >
              <option value="">Selecione um responsável</option>
              {mockFuncionarios.map(func => (
                <option key={func.id} value={func.id}>
                  {func.nome}
                </option>
              ))}
            </select>
          </div>

          {/* Select Aprovador (opcional) */}
          <div className="space-y-2">
            <Label htmlFor="aprovador">
              Aprovador (opcional)
            </Label>
            <select
              id="aprovador"
              value={aprovador?.id || ''}
              onChange={(e) => {
                const func = mockFuncionarios.find(f => f.id === Number(e.target.value));
                setAprovador(func || null);
              }}
              className="w-full px-3 py-2 border rounded-md"
              style={{ fontSize: '14px' }}
            >
              <option value="">Nenhum</option>
              {mockFuncionarios.map(func => (
                <option key={func.id} value={func.id}>
                  {func.nome}
                </option>
              ))}
            </select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleAdd}>
            Adicionar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

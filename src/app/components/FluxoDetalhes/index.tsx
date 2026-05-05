import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Fluxo, createEmptyFluxo, TipoFluxo } from '../../types/fluxo';
import { FluxoHeader } from './FluxoHeader';
import { FluxoTabs } from './FluxoTabs';
import { DetalhesTab } from './tabs/DetalhesTab';
import { EtapasTab } from './tabs/EtapasTab';
import { ClientesTab } from './tabs/ClientesTab';
import { GeracaoTab } from './tabs/GeracaoTab';
import { toast } from 'sonner';

// Mock API functions
const getFluxo = async (id: number | 'novo'): Promise<Fluxo> => {
  await new Promise(resolve => setTimeout(resolve, 500));

  if (id === 'novo') {
    return createEmptyFluxo();
  }

  // Mock data for existing fluxo
  return {
    id: Number(id),
    nome: `Fluxo ${id}`,
    tipo: 'recorrente' as TipoFluxo,
    ativo: true,
    metaTarefa: 'abertura',
    frequencia: 'mensal',
    diaInicio: 5,
    competencia: 0,
    considerarDiasUteis: true,
    adiarFimSemana: false,
    etapas: [],
    clientesSelecionados: [],
    mesInicio: 4,
    anoInicio: 2026,
    criadoEm: new Date().toISOString(),
    duracaoEstimada: 30
  };
};

const saveFluxo = async (fluxo: Fluxo): Promise<Fluxo> => {
  await new Promise(resolve => setTimeout(resolve, 1000));

  if (fluxo.id === 'novo') {
    return { ...fluxo, id: Math.floor(Math.random() * 10000) };
  }

  return fluxo;
};

const validateFluxo = (fluxo: Fluxo): string[] => {
  const errors: string[] = [];

  if (!fluxo.nome.trim()) {
    errors.push('Nome do fluxo é obrigatório');
  }

  if (fluxo.tipo === 'recorrente') {
    if (!fluxo.metaTarefa) {
      errors.push('Meta das tarefas é obrigatória para fluxos recorrentes');
    }
    if (!fluxo.frequencia) {
      errors.push('Frequência é obrigatória para fluxos recorrentes');
    }
    if (fluxo.diaInicio === undefined) {
      errors.push('Dia de início é obrigatório para fluxos recorrentes');
    }
  }

  return errors;
};

const FluxoDetalhes: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [activeTab, setActiveTab] = useState('detalhes');
  const [fluxoData, setFluxoData] = useState<Fluxo>(createEmptyFluxo());

  // Load fluxo data
  useEffect(() => {
    const loadFluxo = async () => {
      try {
        setLoading(true);
        const data = await getFluxo(id === 'novo' ? 'novo' : Number(id));
        setFluxoData(data);
      } catch (error) {
        toast.error('Erro ao carregar fluxo');
        navigate('/configuracoes/fluxos-de-tarefa');
      } finally {
        setLoading(false);
      }
    };

    loadFluxo();
  }, [id, navigate]);

  // Warn on unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  const handleFluxoChange = (updatedFluxo: Fluxo) => {
    setFluxoData(updatedFluxo);
    setIsDirty(true);
  };

  const handleSave = async () => {
    const errors = validateFluxo(fluxoData);

    if (errors.length > 0) {
      errors.forEach(error => toast.error(error));
      return;
    }

    try {
      setSaving(true);
      const saved = await saveFluxo(fluxoData);
      toast.success('Fluxo salvo com sucesso');
      setIsDirty(false);

      if (fluxoData.id === 'novo') {
        navigate(`/configuracoes/fluxos-de-tarefa/${saved.id}`);
      }
    } catch (error) {
      toast.error('Erro ao salvar fluxo');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (isDirty) {
      if (confirm('Descartar alterações não salvas?')) {
        navigate('/configuracoes/fluxos-de-tarefa');
      }
    } else {
      navigate('/configuracoes/fluxos-de-tarefa');
    }
  };

  const handleTabChange = (tab: string) => {
    // Prevent switching to recorrente-only tabs when tipo is esporadico
    if (fluxoData.tipo === 'esporadico' && (tab === 'clientes' || tab === 'geracao')) {
      return;
    }
    setActiveTab(tab);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <FluxoHeader
        fluxoNome={fluxoData.id !== 'novo' ? fluxoData.nome : undefined}
        onSave={handleSave}
        onCancel={handleCancel}
        saving={saving}
      />

      <div className="container mx-auto px-6 py-6">
        <FluxoTabs
          activeTab={activeTab}
          onTabChange={handleTabChange}
          tipoFluxo={fluxoData.tipo}
        />

        <div className="mt-6">
          {activeTab === 'detalhes' && (
            <DetalhesTab
              fluxo={fluxoData}
              onChange={handleFluxoChange}
            />
          )}

          {activeTab === 'etapas' && (
            <EtapasTab
              etapas={fluxoData.etapas}
              onEtapasChange={(etapas) => handleFluxoChange({ ...fluxoData, etapas })}
            />
          )}

          {activeTab === 'clientes' && fluxoData.tipo === 'recorrente' && (
            <ClientesTab
              clientesSelecionados={fluxoData.clientesSelecionados || []}
              onClientesChange={(clientes) => handleFluxoChange({ ...fluxoData, clientesSelecionados: clientes })}
            />
          )}

          {activeTab === 'geracao' && fluxoData.tipo === 'recorrente' && (
            <GeracaoTab
              mesInicio={fluxoData.mesInicio || new Date().getMonth() + 1}
              anoInicio={fluxoData.anoInicio || new Date().getFullYear()}
              onMesChange={(mes) => handleFluxoChange({ ...fluxoData, mesInicio: mes })}
              onAnoChange={(ano) => handleFluxoChange({ ...fluxoData, anoInicio: ano })}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default FluxoDetalhes;

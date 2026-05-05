import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';
import { TipoFluxo } from '../../types/fluxo';

interface FluxoTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  tipoFluxo: TipoFluxo;
}

export function FluxoTabs({ activeTab, onTabChange, tipoFluxo }: FluxoTabsProps) {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange}>
      <TabsList
        className="grid w-full"
        style={{
          gridTemplateColumns: tipoFluxo === 'recorrente' ? 'repeat(4, 1fr)' : 'repeat(2, 1fr)'
        }}
      >
        <TabsTrigger value="detalhes">Detalhes</TabsTrigger>
        <TabsTrigger value="etapas">Etapas</TabsTrigger>
        {tipoFluxo === 'recorrente' && (
          <>
            <TabsTrigger value="clientes">Clientes</TabsTrigger>
            <TabsTrigger value="geracao">Geração</TabsTrigger>
          </>
        )}
      </TabsList>
    </Tabs>
  );
}

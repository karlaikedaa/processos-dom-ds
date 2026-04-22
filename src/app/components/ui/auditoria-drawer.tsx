"use client";

import * as React from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from './sheet';
import { ScrollArea } from './scroll-area';

interface AuditoriaEvent {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  details?: string;
}

/**
 * A side drawer that displays an audit history timeline for configuration changes.
 * Shows chronological events with user, timestamp, action, and optional details.
 */
interface AuditoriaDrawerProps {
  /** Whether the drawer is open */
  isOpen: boolean;
  /** Callback to close the drawer */
  onClose: () => void;
  /** Configuration name to display in the drawer title */
  configName: string;
  /** Optional configuration ID for filtering audit logs */
  configId?: string;
}

function AuditoriaDrawer({
  isOpen,
  onClose,
  configName,
  configId
}: AuditoriaDrawerProps) {
  const [events, setEvents] = React.useState<AuditoriaEvent[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (isOpen) {
      setLoading(true);
      setError(null);
      // TODO: Replace with actual API call
      // fetchAuditoriaHistory(configName, configId).then(setEvents).catch((err) => setError(err.message)).finally(() => setLoading(false));

      // Mock data for now
      const timeoutId = setTimeout(() => {
        setEvents([
          {
            id: '1',
            timestamp: '16/04/2026 às 14:30',
            user: 'João Silva (usuário ativo)',
            action: 'Configuração criada',
            details: 'Primeira configuração do módulo'
          },
          {
            id: '2',
            timestamp: '16/04/2026 às 15:45',
            user: 'Maria Santos (usuário ativo)',
            action: 'Configuração alterada',
            details: 'Atualização de permissões de acesso'
          }
        ]);
        setLoading(false);
      }, 500);

      return () => clearTimeout(timeoutId);
    } else {
      // Reset state when drawer closes
      setEvents([]);
      setLoading(false);
      setError(null);
    }
  }, [isOpen, configName, configId]);

  return (
    <Sheet open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <SheetContent side="right" className="w-[500px]">
        <SheetHeader>
          <SheetTitle>
            Histórico de Alterações - {configName}
          </SheetTitle>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-120px)] mt-6">
          {loading ? (
            <p className="text-muted-foreground text-center py-8">
              Carregando histórico...
            </p>
          ) : error ? (
            <p className="text-destructive text-center py-8">{error}</p>
          ) : events.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              Nenhuma alteração registrada
            </p>
          ) : (
            <div className="space-y-4">
              {events.map(event => (
                <div key={event.id} className="border-l-2 border-primary pl-4 pb-4">
                  <p className="text-sm font-semibold">{event.action}</p>
                  <p className="text-xs text-muted-foreground">
                    {event.user} • {event.timestamp}
                  </p>
                  {event.details && (
                    <p className="text-xs mt-1">{event.details}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

AuditoriaDrawer.displayName = "AuditoriaDrawer";

export { AuditoriaDrawer };

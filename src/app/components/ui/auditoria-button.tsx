"use client";

import * as React from "react";
import { Button } from './button';
import { AuditoriaDrawer } from './auditoria-drawer';

/**
 * A button that opens an audit history drawer for configuration changes.
 * Manages the drawer's open/close state internally.
 */
interface AuditoriaButtonProps {
  /** Configuration name to display in the audit history */
  configName: string;
  /** Optional configuration ID for filtering audit logs */
  configId?: string;
}

function AuditoriaButton({ configName, configId }: AuditoriaButtonProps) {
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  return (
    <>
      <Button
        variant="secondary"
        size="sm"
        onClick={() => setDrawerOpen(true)}
        aria-label="Ver histórico de alterações desta configuração"
      >
        Auditoria de configuração
      </Button>

      <AuditoriaDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        configName={configName}
        configId={configId}
      />
    </>
  );
}

AuditoriaButton.displayName = "AuditoriaButton";

export { AuditoriaButton };

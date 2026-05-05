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
import { Input } from '../../ui/input';
import { ConfigEtapa } from '../../../types/fluxo';

interface ConfigEtapaModalProps {
  open: boolean;
  onClose: () => void;
  config: ConfigEtapa;
  onSave: (config: ConfigEtapa) => void;
}

export function ConfigEtapaModal({ open, onClose, config, onSave }: ConfigEtapaModalProps) {
  const [prazo, setPrazo] = useState(config.prazo || 0);

  const handleSave = () => {
    onSave({ prazo });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Configurações da etapa</DialogTitle>
        </DialogHeader>

        <div className="space-y-4" style={{ padding: '16px 0' }}>
          <div className="space-y-2">
            <Label htmlFor="prazo">
              Prazo (dias)
            </Label>
            <Input
              id="prazo"
              type="number"
              min="0"
              value={prazo}
              onChange={(e) => setPrazo(Number(e.target.value))}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

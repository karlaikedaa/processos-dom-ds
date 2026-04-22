import React, { useState, useEffect } from 'react';
import { validateTimeInput } from '@/app/utils/time';
import { cn } from './utils';

interface TimeInputProps {
  value: string;
  onChange: (newValue: string) => void;
  onConfirm?: (oldValue: string, newValue: string) => boolean;
  className?: string;
}

export function TimeInput({ value, onChange, onConfirm, className }: TimeInputProps) {
  const [inputValue, setInputValue] = useState(value);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleBlur = () => {
    if (!inputValue || inputValue === value) {
      setInputValue(value);
      return;
    }

    const validation = validateTimeInput(inputValue);

    if (!validation.valid) {
      setError(validation.error || 'Formato inválido');
      setInputValue(value);
      return;
    }

    // Guard against missing normalized value
    if (!validation.normalized) {
      setInputValue(value);
      return;
    }

    const normalized = validation.normalized;

    // Se valor mudou e existe onConfirm, pedir confirmação
    if (normalized !== value && onConfirm) {
      const confirma = onConfirm(value, normalized);
      if (!confirma) {
        setInputValue(value);
        return;
      }
    }

    setInputValue(normalized);
    onChange(normalized);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur();
    }
    if (e.key === 'Escape') {
      setInputValue(value);
      e.currentTarget.blur();
    }
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onFocus={() => setError(null)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        placeholder="00:00:00"
        className={cn(
          "w-20 px-2 py-1 text-sm text-center",
          "border rounded",
          "focus:outline-none focus:ring-2 focus:ring-primary",
          error && "border-red-500",
          className
        )}
      />
      {error && (
        <div className="absolute z-10 mt-1 px-2 py-1 bg-red-50 border border-red-200 rounded text-xs text-red-600">
          {error}
        </div>
      )}
    </div>
  );
}

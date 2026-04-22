"use client";

import * as React from "react";
import { useState, useMemo, useCallback, useRef } from "react";
import { Search, ChevronDown } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Input } from "./input";
import { Checkbox } from "./checkbox";
import { Badge } from "./badge";
import { cn } from "./utils";

// Type definitions
export interface MultiSelectFilterItem {
  id: string | number;
  [key: string]: any;
}

export interface MultiSelectFilterColumn {
  key: string;
  header: string;
  width?: string;
}

export interface MultiSelectFilterProps {
  label: string;
  placeholder: string;
  items: MultiSelectFilterItem[];
  selectedItems: MultiSelectFilterItem[];
  onSelectionChange: (items: MultiSelectFilterItem[]) => void;
  columns: MultiSelectFilterColumn[];
  searchKeys?: string[];
  className?: string;
  clearAllText?: string;
}

export function MultiSelectFilter({
  label,
  placeholder,
  items,
  selectedItems,
  onSelectionChange,
  columns,
  searchKeys,
  className,
  clearAllText,
}: MultiSelectFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredItems = useMemo(() => {
    if (!searchTerm) return items;

    const keys = searchKeys || Object.keys(items[0] || {}).filter(k => k !== 'id');

    return items.filter(item =>
      keys.some(key =>
        String(item[key])
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      )
    );
  }, [items, searchTerm, searchKeys]);

  const handleToggleItem = useCallback((item: MultiSelectFilterItem) => {
    const isSelected = selectedItems.some(s => s.id === item.id);

    if (isSelected) {
      onSelectionChange(selectedItems.filter(s => s.id !== item.id));
    } else {
      onSelectionChange([...selectedItems, item]);
    }
  }, [selectedItems, onSelectionChange]);

  const handleClearAll = useCallback(() => {
    onSelectionChange([]);
    setSearchTerm(''); // Also clear search
  }, [onSelectionChange]);

  const getTriggerText = () => {
    if (selectedItems.length === 0) {
      return placeholder;
    }

    if (selectedItems.length === 1) {
      const displayKey = columns[0]?.key;
      if (!displayKey || !selectedItems[0]) return placeholder;
      return selectedItems[0][displayKey] || placeholder;
    }

    // 2 or more selected
    const displayKey = columns[0]?.key;
    if (!displayKey || !selectedItems[0]) return placeholder;
    const firstName = selectedItems[0][displayKey] || 'Item';
    const count = selectedItems.length - 1;
    return `${firstName} +${count}`;
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <div className={cn("relative inline-flex", className)}>
          {selectedItems.length > 0 ? (
            <Badge
              variant="default"
              className="rounded-full px-3 py-1.5 cursor-pointer hover:opacity-90 flex items-center gap-2"
            >
              {getTriggerText()}
              <ChevronDown className="size-4" />
            </Badge>
          ) : (
            <button
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border transition-colors hover:bg-accent"
              style={{
                borderColor: 'var(--border)',
                fontSize: 'var(--text-label)',
                color: 'var(--muted-foreground)'
              }}
            >
              {placeholder}
              <ChevronDown className="size-4" />
            </button>
          )}
        </div>
      </PopoverTrigger>

      <PopoverContent
        className="w-[400px] p-4"
        align="start"
        onOpenAutoFocus={(e) => {
          e.preventDefault();
          inputRef.current?.focus();
        }}
      >
        {/* Search Input */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            ref={inputRef}
            placeholder="Buscar"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Table */}
        <div className="max-h-[300px] overflow-auto border rounded-md">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-muted">
              <tr>
                <th className="w-10 p-2">
                  <Checkbox disabled />
                </th>
                {columns.map(col => (
                  <th key={col.key} className="p-2 text-left font-semibold text-muted-foreground">
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredItems.length === 0 && items.length > 0 && (
                <tr>
                  <td colSpan={columns.length + 1} className="p-4 text-center text-muted-foreground">
                    Nenhum item encontrado
                  </td>
                </tr>
              )}
              {items.length === 0 && (
                <tr>
                  <td colSpan={columns.length + 1} className="p-4 text-center text-muted-foreground">
                    Nenhum item disponível
                  </td>
                </tr>
              )}
              {filteredItems.map(item => {
                const isSelected = selectedItems.some(s => s.id === item.id);
                return (
                  <tr
                    key={item.id}
                    onClick={() => handleToggleItem(item)}
                    className="cursor-pointer hover:bg-accent transition-colors border-t"
                  >
                    <td className="p-2">
                      <Checkbox checked={isSelected} />
                    </td>
                    {columns.map(col => (
                      <td key={col.key} className="p-2 truncate">
                        {item[col.key]}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="mt-3 text-sm">
          <button
            onClick={handleClearAll}
            className="text-primary hover:opacity-80 transition-opacity"
            type="button"
          >
            {clearAllText || `Todas as ${label.toLowerCase()}s`}
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

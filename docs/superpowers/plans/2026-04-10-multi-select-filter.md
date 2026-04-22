# MultiSelectFilter Component Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create reusable MultiSelectFilter component with checkbox table selection and integrate into Tarefas filters

**Architecture:** Controlled React component using Popover + Checkbox + Badge from design system. Trigger shows selected count as badge, popover contains searchable table with checkboxes. Parent manages selection state.

**Tech Stack:** React, TypeScript, Radix UI (Popover, Checkbox), Tailwind CSS, lucide-react icons

---

## File Structure

**Files to create:**
- `src/app/components/ui/multi-select-filter.tsx` - New reusable MultiSelectFilter component

**Files to modify:**
- `src/app/components/Tarefas.tsx` - Replace native filters with MultiSelectFilter instances

**Dependencies (existing):**
- `src/app/components/ui/input.tsx`
- `src/app/components/ui/popover.tsx`
- `src/app/components/ui/checkbox.tsx`
- `src/app/components/ui/badge.tsx`

---

## Task 1: Create MultiSelectFilter Component Skeleton

**Files:**
- Create: `src/app/components/ui/multi-select-filter.tsx`

- [ ] **Step 1: Create file with TypeScript interfaces**

```tsx
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
  // Component implementation will go here
  return (
    <div className={cn("relative inline-flex", className)}>
      <span>MultiSelectFilter Placeholder</span>
    </div>
  );
}
```

- [ ] **Step 2: Verify file compiles**

Run: `npm run dev` (should already be running)
Expected: No TypeScript errors, dev server continues running

- [ ] **Step 3: Commit**

```bash
git add src/app/components/ui/multi-select-filter.tsx
git commit -m "feat: add MultiSelectFilter component skeleton with TypeScript interfaces"
```

---

## Task 2: Implement Trigger Logic and Badge Display

**Files:**
- Modify: `src/app/components/ui/multi-select-filter.tsx`

- [ ] **Step 1: Add state and helper function for trigger text**

Add inside the component function (replace the placeholder return):

```tsx
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

  const getTriggerText = () => {
    if (selectedItems.length === 0) {
      return placeholder;
    }
    
    if (selectedItems.length === 1) {
      const displayKey = columns[0].key;
      return selectedItems[0][displayKey];
    }
    
    // 2 or more selected
    const displayKey = columns[0].key;
    const firstName = selectedItems[0][displayKey];
    const count = selectedItems.length - 1;
    return `${firstName} +${count}`;
  };

  return (
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
  );
}
```

- [ ] **Step 2: Test trigger display**

Open browser to http://localhost:5174 (dev server)
Expected: Component shows placeholder button when no selection

- [ ] **Step 3: Commit**

```bash
git add src/app/components/ui/multi-select-filter.tsx
git commit -m "feat: add trigger badge with dynamic text formatting"
```

---

## Task 3: Add Popover with Search Input

**Files:**
- Modify: `src/app/components/ui/multi-select-filter.tsx`

- [ ] **Step 1: Add search state and filtered items logic**

Add after the `isOpen` state:

```tsx
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
```

- [ ] **Step 2: Wrap trigger in Popover**

Replace the entire return statement:

```tsx
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
      
      {/* Placeholder for table - will add next */}
      <div className="border rounded-md p-4 text-sm text-muted-foreground">
        {filteredItems.length} itens encontrados
      </div>
    </PopoverContent>
  </Popover>
);
```

- [ ] **Step 3: Test popover and search**

Click trigger in browser
Expected: Popover opens, search input has focus, typing filters (shows count)

- [ ] **Step 4: Commit**

```bash
git add src/app/components/ui/multi-select-filter.tsx
git commit -m "feat: add Popover with search input and filtering logic"
```

---

## Task 4: Add Table with Checkboxes

**Files:**
- Modify: `src/app/components/ui/multi-select-filter.tsx`

- [ ] **Step 1: Replace placeholder with table structure**

Replace the placeholder div (`<div className="border rounded-md...`) with:

```tsx
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
      {filteredItems.length === 0 && (
        <tr>
          <td colSpan={columns.length + 1} className="p-4 text-center text-muted-foreground">
            Nenhum item encontrado
          </td>
        </tr>
      )}
      {filteredItems.map(item => {
        const isSelected = selectedItems.some(s => s.id === item.id);
        return (
          <tr 
            key={item.id}
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
```

- [ ] **Step 2: Test table display**

Open popover in browser
Expected: Table shows with headers, checkboxes, and data rows

- [ ] **Step 3: Commit**

```bash
git add src/app/components/ui/multi-select-filter.tsx
git commit -m "feat: add table with dynamic columns and checkboxes"
```

---

## Task 5: Implement Selection Logic

**Files:**
- Modify: `src/app/components/ui/multi-select-filter.tsx`

- [ ] **Step 1: Add selection handler**

Add after the `filteredItems` useMemo:

```tsx
const handleToggleItem = useCallback((item: MultiSelectFilterItem) => {
  const isSelected = selectedItems.some(s => s.id === item.id);
  
  if (isSelected) {
    onSelectionChange(selectedItems.filter(s => s.id !== item.id));
  } else {
    onSelectionChange([...selectedItems, item]);
  }
}, [selectedItems, onSelectionChange]);
```

- [ ] **Step 2: Add onClick to table row**

Update the `<tr>` element in the table body:

```tsx
<tr 
  key={item.id}
  onClick={() => handleToggleItem(item)}
  className="cursor-pointer hover:bg-accent transition-colors border-t"
>
```

- [ ] **Step 3: Test selection**

This won't work yet because we need parent state. We'll test in Task 7.
Verify no TypeScript errors.

- [ ] **Step 4: Commit**

```bash
git add src/app/components/ui/multi-select-filter.tsx
git commit -m "feat: add selection toggle logic for checkboxes"
```

---

## Task 6: Add Clear All Functionality

**Files:**
- Modify: `src/app/components/ui/multi-select-filter.tsx`

- [ ] **Step 1: Add clear all handler**

Add after `handleToggleItem`:

```tsx
const handleClearAll = useCallback(() => {
  onSelectionChange([]);
  setSearchTerm(''); // Also clear search
}, [onSelectionChange]);
```

- [ ] **Step 2: Add footer with clear all link**

Add after the table closing `</div>`, still inside PopoverContent:

```tsx
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
```

- [ ] **Step 3: Verify code compiles**

Check dev server for errors
Expected: No TypeScript errors

- [ ] **Step 4: Commit**

```bash
git add src/app/components/ui/multi-select-filter.tsx
git commit -m "feat: add clear all functionality with footer link"
```

---

## Task 7: Add Mock Data to Tarefas for Testing

**Files:**
- Modify: `src/app/components/Tarefas.tsx`

- [ ] **Step 1: Add import for MultiSelectFilter**

Add after line 13 (after the Tabs import):

```tsx
import { MultiSelectFilter } from './ui/multi-select-filter';
```

- [ ] **Step 2: Add selection states**

Add after line 252 (after the viewMode state):

```tsx
// Filter selection states
const [selectedEmpresas, setSelectedEmpresas] = useState<any[]>([]);
const [selectedResponsaveis, setSelectedResponsaveis] = useState<any[]>([]);
const [selectedTarefas, setSelectedTarefas] = useState<any[]>([]);
const [selectedFluxos, setSelectedFluxos] = useState<any[]>([]);
```

- [ ] **Step 3: Add mock data arrays**

Add after the states (around line 260):

```tsx
// Mock data for filters
const mockEmpresas = [
  { id: 1, codigo: '002', apelido: 'NexGen', nome: 'NexGen Soluções' },
  { id: 2, codigo: '003', apelido: 'Innova', nome: 'Innovate Tech' },
  { id: 3, codigo: '004', apelido: 'Acme', nome: 'Acme Corp' },
  { id: 4, codigo: '005', apelido: 'Aquarela', nome: 'Cores Brasil' },
];

const mockResponsaveis = [
  { id: 1, nome: 'Maria Silva', email: 'maria@example.com' },
  { id: 2, nome: 'João Pereira', email: 'joao@example.com' },
  { id: 3, nome: 'Ana Costa', email: 'ana@example.com' },
];

const mockTarefasFilter = [
  { id: 1, nome: 'DCTF Ago/25', tipo: 'Fiscal' },
  { id: 2, nome: 'REINF Out/25', tipo: 'Fiscal' },
  { id: 3, nome: 'Folha Set/25', tipo: 'Pessoal' },
];

const mockFluxos = [
  { id: 1, nome: 'Fluxo Fiscal' },
  { id: 2, nome: 'Fluxo Contábil' },
  { id: 3, nome: 'Fluxo Pessoal' },
];
```

- [ ] **Step 4: Verify no compilation errors**

Check dev server
Expected: File compiles, no errors

- [ ] **Step 5: Commit**

```bash
git add src/app/components/Tarefas.tsx
git commit -m "feat: add MultiSelectFilter import, states, and mock data"
```

---

## Task 8: Replace Native Search Input with DS Input

**Files:**
- Modify: `src/app/components/Tarefas.tsx:327-350`

- [ ] **Step 1: Find and replace search input**

Find the search input block (lines ~327-350):

```tsx
<div className="flex-1 relative" style={{ minWidth: '250px', maxWidth: '400px' }}>
  <Search
    size={14}
    style={{
      position: 'absolute',
      left: '12px',
      top: '50%',
      transform: 'translateY(-50%)',
      color: 'var(--muted-foreground)',
    }}
  />
  <input
    type="text"
    placeholder="Buscar complemento/protocolo"
    className="w-full rounded-md px-10 py-2 outline-none"
    style={{
      border: '1px solid var(--border)',
      background: 'white',
      fontSize: 'var(--text-label)',
      color: 'var(--foreground)',
    }}
  />
</div>
```

Replace with:

```tsx
<Input 
  type="text"
  placeholder="Busque por complemento/protocolo"
  className="flex-1 min-w-[250px] max-w-[400px]"
/>
```

- [ ] **Step 2: Test search input in browser**

Expected: Input uses DS styling, simpler code

- [ ] **Step 3: Commit**

```bash
git add src/app/components/Tarefas.tsx
git commit -m "refactor: replace native search input with DS Input component"
```

---

## Task 9: Replace Native Select Filters with MultiSelectFilter

**Files:**
- Modify: `src/app/components/Tarefas.tsx:351-411`

- [ ] **Step 1: Remove all native select elements**

Delete lines ~351-411 (all four `<select>` elements).

The div structure should now be:

```tsx
<div className="flex items-center gap-3 flex-wrap">
  <Input 
    type="text"
    placeholder="Busque por complemento/protocolo"
    className="flex-1 min-w-[250px] max-w-[400px]"
  />
  
  {/* MultiSelectFilters will be added next */}
</div>
```

- [ ] **Step 2: Add Empresa filter**

Add after the Input:

```tsx
<MultiSelectFilter
  label="Empresa"
  placeholder="Todas as empresas"
  items={mockEmpresas}
  selectedItems={selectedEmpresas}
  onSelectionChange={setSelectedEmpresas}
  columns={[
    { key: 'codigo', header: 'Código' },
    { key: 'apelido', header: 'Apelido' },
    { key: 'nome', header: 'Nome' },
  ]}
  searchKeys={['codigo', 'apelido', 'nome']}
/>
```

- [ ] **Step 3: Add Responsável filter**

Add after Empresa filter:

```tsx
<MultiSelectFilter
  label="Responsável"
  placeholder="Todos"
  items={mockResponsaveis}
  selectedItems={selectedResponsaveis}
  onSelectionChange={setSelectedResponsaveis}
  columns={[
    { key: 'nome', header: 'Nome' },
    { key: 'email', header: 'E-mail' },
  ]}
/>
```

- [ ] **Step 4: Add Tarefa filter**

Add after Responsável filter:

```tsx
<MultiSelectFilter
  label="Tarefa"
  placeholder="Todas"
  items={mockTarefasFilter}
  selectedItems={selectedTarefas}
  onSelectionChange={setSelectedTarefas}
  columns={[
    { key: 'nome', header: 'Nome' },
    { key: 'tipo', header: 'Tipo' },
  ]}
/>
```

- [ ] **Step 5: Add Fluxo filter**

Add after Tarefa filter:

```tsx
<MultiSelectFilter
  label="Fluxo de tarefas"
  placeholder="Todos"
  items={mockFluxos}
  selectedItems={selectedFluxos}
  onSelectionChange={setSelectedFluxos}
  columns={[
    { key: 'nome', header: 'Fluxo' },
  ]}
/>
```

- [ ] **Step 6: Verify in browser**

Open http://localhost:5174
Navigate to Tarefas page
Expected: Four MultiSelectFilter components visible with placeholders

- [ ] **Step 7: Commit**

```bash
git add src/app/components/Tarefas.tsx
git commit -m "feat: replace native select filters with MultiSelectFilter components"
```

---

## Task 10: Test MultiSelectFilter Functionality

**Files:**
- Test: `src/app/components/Tarefas.tsx` (browser testing only)

- [ ] **Step 1: Test Empresa filter - open popover**

Actions:
1. Open http://localhost:5174
2. Navigate to Tarefas page
3. Click on "Todas as empresas" button

Expected:
- Popover opens
- Search input has focus
- Table shows 4 companies
- All checkboxes unchecked

- [ ] **Step 2: Test Empresa filter - selection**

Actions:
1. Click on "NexGen" row (or checkbox)
2. Verify checkbox becomes checked
3. Close popover (click outside)

Expected:
- Trigger changes to orange badge showing "NexGen"
- Badge has chevron icon

- [ ] **Step 3: Test Empresa filter - multiple selection**

Actions:
1. Click badge to reopen
2. Click "Innova" row
3. Close popover

Expected:
- Badge shows "NexGen +1"
- Both items checked when reopening

- [ ] **Step 4: Test Empresa filter - search**

Actions:
1. Open popover
2. Type "acme" in search
3. Verify only Acme Corp shows
4. Clear search
5. Verify all 4 items show again

Expected:
- Search filters in real-time
- Case-insensitive
- Clears properly

- [ ] **Step 5: Test Empresa filter - clear all**

Actions:
1. With items selected, open popover
2. Click "Todas as empresas" link at bottom
3. Verify all checkboxes unchecked
4. Close popover

Expected:
- Badge changes back to placeholder button
- Shows "Todas as empresas"

- [ ] **Step 6: Test other filters**

Repeat steps 1-5 for:
- Responsável filter
- Tarefa filter
- Fluxo de tarefas filter

Expected:
- All filters work independently
- Each maintains its own selection
- No cross-filter interference

- [ ] **Step 7: Test responsive layout**

Actions:
1. Resize browser window to 1366px wide
2. Resize to 1920px wide
3. Verify filters wrap properly

Expected:
- Filters wrap to new line when needed
- Search input flex-grows appropriately

- [ ] **Step 8: Document any issues found**

If issues found:
- Note them down
- Create separate tasks to fix
- Don't commit yet

Expected:
- All tests pass OR issues documented

- [ ] **Step 9: Commit if all tests pass**

```bash
git add .
git commit -m "test: verify MultiSelectFilter integration and functionality"
```

---

## Task 11: Fix Empty State and Edge Cases

**Files:**
- Modify: `src/app/components/ui/multi-select-filter.tsx`

- [ ] **Step 1: Handle empty items array**

Find the `getTriggerText` function and update it to handle edge cases:

```tsx
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
```

- [ ] **Step 2: Add empty state message when no items**

Update the table empty state (in the tbody):

```tsx
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
```

- [ ] **Step 3: Test edge cases**

Test in browser:
1. Filter with search that returns no results → Shows "Nenhum item encontrado"
2. All filters work with different data shapes
3. Long names truncate properly in table

Expected: No errors, graceful handling

- [ ] **Step 4: Commit**

```bash
git add src/app/components/ui/multi-select-filter.tsx
git commit -m "fix: handle edge cases and empty states in MultiSelectFilter"
```

---

## Task 12: Add Console Logging for Selection State (Debugging Aid)

**Files:**
- Modify: `src/app/components/Tarefas.tsx`

- [ ] **Step 1: Add useEffect to log selections**

Add after the mock data (around line 290):

```tsx
// Debug: Log filter selections
React.useEffect(() => {
  console.log('Filtros selecionados:', {
    empresas: selectedEmpresas.map(e => e.apelido),
    responsaveis: selectedResponsaveis.map(r => r.nome),
    tarefas: selectedTarefas.map(t => t.nome),
    fluxos: selectedFluxos.map(f => f.nome),
  });
}, [selectedEmpresas, selectedResponsaveis, selectedTarefas, selectedFluxos]);
```

- [ ] **Step 2: Test logging in browser**

Open browser console
Select/deselect items in filters
Expected: Console logs show current selections

- [ ] **Step 3: Commit**

```bash
git add src/app/components/Tarefas.tsx
git commit -m "debug: add console logging for filter selections"
```

---

## Implementation Complete

All tasks finished when:
- [ ] MultiSelectFilter component created and functional
- [ ] Trigger shows correct badge/placeholder
- [ ] Popover opens with search and table
- [ ] Checkboxes toggle selection correctly
- [ ] Clear all removes all selections
- [ ] All 4 filters integrated in Tarefas
- [ ] Native select elements removed
- [ ] Browser testing passes
- [ ] Edge cases handled
- [ ] No TypeScript errors

**Next Steps:** 
1. Test thoroughly in browser
2. Verify all filters work independently
3. Check responsive layout
4. Consider removing debug logging if not needed
5. Optional: Add more mock data for testing

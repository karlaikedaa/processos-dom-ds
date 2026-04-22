# Tabs Migration: Empresas and Gerador de Tarefas

**Date:** 2026-04-14  
**Status:** Approved

## Overview

Migrate tabs in Empresas and Gerador de Tarefas pages from custom pill-style buttons to the design system tabs component (underline style) to match the Figma specification.

**Figma Reference:**
https://www.figma.com/design/Q2p5d5mIahsEPxXYMOA16V/Dom-DS-Core-Web?node-id=6129-2272

**Design System Component:**
`src/app/components/ui/tabs.tsx`

## Scope

Two pages require migration:

1. **Empresas.tsx** - "Ativos/Inativos" tabs (lines 734-752)
2. **GeradorTarefas.tsx** - "Gerar tarefas/Remover tarefas" tabs (lines 207-217)

## Approach

**Selected Approach:** Direct Substitution

Replace custom tab implementations with design system components while preserving all existing functionality and state management. No additional refactoring or abstraction.

### Why This Approach

- Simple and low-risk
- Minimal code changes
- Fast to implement
- Preserves all existing behavior

### Alternatives Considered

- **Standardization Approach:** Include visual consistency improvements - rejected as unnecessary scope expansion
- **Wrapper Component Approach:** Create reusable StatusTabs component - rejected as over-engineering for 2 use cases

## Implementation Details

### Empresas.tsx Changes

**Current Implementation (lines 733-753):**
```jsx
<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
  {[
    { key: 'ativo', label: `Ativos (${ativos})` },
    { key: 'inativo', label: `Inativos (${inativos})` },
  ].map(opt => (
    <button key={opt.key} onClick={() => setStatusFilter(opt.key as EmpresaStatus)}
      style={{ /* pill button styles */ }}>
      {opt.label}
    </button>
  ))}
</div>
```

**New Implementation:**
```jsx
<Tabs value={statusFilter} onValueChange={(v) => setStatusFilter(v as EmpresaStatus)}>
  <TabsList>
    <TabsTrigger value="ativo">Ativos ({ativos})</TabsTrigger>
    <TabsTrigger value="inativo">Inativos ({inativos})</TabsTrigger>
  </TabsList>
</Tabs>
```

**State:**
- `statusFilter: EmpresaStatus` ('ativo' | 'inativo')
- Controls table filtering, not content switching

**Import Required:**
```jsx
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';
```

### GeradorTarefas.tsx Changes

**Current Implementation (lines 207-217):**
```jsx
<div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
  {([
    { key: 'gerar', label: 'Gerar tarefas' },
    { key: 'remover', label: 'Remover tarefas' },
  ] as { key: MainTab; label: string }[]).map(t => (
    <button key={t.key} onClick={() => setTab(t.key)}
      style={{ /* pill button styles */ }}>
      {t.label}
    </button>
  ))}
</div>
```

**New Implementation:**
```jsx
<Tabs value={tab} onValueChange={(v) => setTab(v as MainTab)}>
  <TabsList>
    <TabsTrigger value="gerar">Gerar tarefas</TabsTrigger>
    <TabsTrigger value="remover">Remover tarefas</TabsTrigger>
  </TabsList>
</Tabs>
```

**State:**
- `tab: MainTab` ('gerar' | 'remover')
- Controls content switching via conditional rendering

**Import Required:**
```jsx
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';
```

### Design System Component Characteristics

From `src/app/components/ui/tabs.tsx`:

- **Style:** Underline (not pill/background)
- **Active indicator:** 1.6px bottom border in #d64000 (orange)
- **Height:** 40px (5x)
- **Min width:** 80px (10x)
- **Gap:** 8px (1x)
- **Active text color:** #d64000
- **Inactive text color:** var(--muted-foreground)

### Note on TabsContent

Neither implementation requires `TabsContent` component:
- **Empresas:** Only filtering data, not switching content
- **GeradorTarefas:** Already uses conditional rendering (`{tab === 'gerar' ? ... : ...}`)

## Verification

### Functional Testing

**Empresas.tsx:**
1. ✓ Tabs appear with underline style (not pill)
2. ✓ Active tab shows orange bottom border (1.6px, #d64000)
3. ✓ Clicking "Ativos" filters to active companies only
4. ✓ Clicking "Inativos" filters to inactive companies only
5. ✓ Counters in parentheses display correctly

**GeradorTarefas.tsx:**
1. ✓ Tabs appear with underline style
2. ✓ Active tab shows orange bottom border
3. ✓ Clicking "Gerar tarefas" shows generation form
4. ✓ Clicking "Remover tarefas" shows removal form
5. ✓ All form functionality remains intact

### Visual Testing

1. ✓ Compare against Figma spec (height 40px, min-width 80px, gap 8px, border 1.6px)
2. ✓ Visual consistency between both pages
3. ✓ No layout breaks at different screen sizes
4. ✓ Active/inactive states clearly distinguishable

### Build Testing

1. ✓ TypeScript compilation passes
2. ✓ No console errors or warnings
3. ✓ Application starts successfully

## Success Criteria

- Both pages use design system tabs component
- All existing functionality preserved
- Visual appearance matches Figma specification
- No regressions in behavior or performance
- Code is cleaner (removes custom button styles)

## Out of Scope

- Other pages or components using custom tabs
- Refactoring or cleanup beyond the tab replacement
- Additional visual consistency improvements
- Creating reusable wrapper components
- Changes to the design system tabs component itself

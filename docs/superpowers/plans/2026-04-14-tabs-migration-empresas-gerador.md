# Tabs Migration: Empresas and Gerador de Tarefas Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace custom pill-style tabs with design system underline tabs in Empresas and GeradorTarefas pages.

**Architecture:** Direct component substitution - replace custom button-based tabs with the existing `Tabs`, `TabsList`, and `TabsTrigger` components from the design system. No changes to state management or business logic.

**Tech Stack:** React, TypeScript, existing design system components

---

## File Structure

**Files to modify:**
- `src/app/components/Empresas.tsx` - Lines 733-753 (status filter tabs)
- `src/app/components/GeradorTarefas.tsx` - Lines 207-217 (main navigation tabs)

**Files to reference:**
- `src/app/components/ui/tabs.tsx` - Design system tabs component (no changes needed)

---

### Task 1: Migrate Empresas.tsx Tabs

**Files:**
- Modify: `src/app/components/Empresas.tsx:6,733-753`

**Goal:** Replace custom "Ativos/Inativos" tabs with design system components.

- [ ] **Step 1: Add tabs import to Empresas.tsx**

At line 6, the file already imports from `./ui/tabs` for the edit modal. Verify the import includes all needed components:

```typescript
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';
```

If the import is missing `TabsList` or `TabsTrigger`, update it. The current import should already be complete.

- [ ] **Step 2: Replace status tabs implementation (lines 733-753)**

Replace the entire div block containing the custom tab buttons with the design system tabs:

**Remove (lines 733-753):**
```tsx
<div>
  <p style={{ fontSize: 'var(--text-label)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', marginBottom: 10, marginTop: 0 }}>
    {MOCK_EMPRESAS.length} empresas
  </p>
  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
    {[
      { key: 'ativo', label: `Ativos (${ativos})` },
      { key: 'inativo', label: `Inativos (${inativos})` },
    ].map(opt => (
      <button key={opt.key} onClick={() => setStatusFilter(opt.key as EmpresaStatus)}
        style={{
          border: 'none',
          background: statusFilter === opt.key ? 'var(--foreground)' : 'white',
          color: statusFilter === opt.key ? 'white' : 'var(--foreground)',
          fontSize: 'var(--text-label)',
          fontWeight: statusFilter === opt.key ? 'var(--font-weight-semibold)' : 'var(--font-weight-regular)',
          padding: '6px 16px', borderRadius: 'var(--radius-button)', cursor: 'pointer',
          boxShadow: statusFilter !== opt.key ? '0 0 0 1px var(--border)' : 'none',
          transition: 'background 0.15s',
        }}>
        {opt.label}
      </button>
    ))}
  </div>
</div>
```

**Replace with:**
```tsx
<div>
  <p style={{ fontSize: 'var(--text-label)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', marginBottom: 10, marginTop: 0 }}>
    {MOCK_EMPRESAS.length} empresas
  </p>
  <Tabs value={statusFilter} onValueChange={(v) => setStatusFilter(v as EmpresaStatus)}>
    <TabsList>
      <TabsTrigger value="ativo">Ativos ({ativos})</TabsTrigger>
      <TabsTrigger value="inativo">Inativos ({inativos})</TabsTrigger>
    </TabsList>
  </Tabs>
</div>
```

- [ ] **Step 3: Verify TypeScript compilation**

Run the TypeScript compiler to check for errors:

```bash
cd "c:\00. Processos - DOM DS"
npm run build
```

Expected: Build completes successfully with no TypeScript errors related to Empresas.tsx.

- [ ] **Step 4: Visual verification in browser**

Start the development server:

```bash
npm run dev
```

Navigate to the Empresas page and verify:
- Tabs appear with underline style (not pill/filled buttons)
- Active tab shows orange bottom border (1.6px, #d64000)
- Clicking "Ativos" filters to show only active companies
- Clicking "Inativos" filters to show only inactive companies
- Counter numbers (e.g., "Ativos (7)") display correctly

- [ ] **Step 5: Commit changes**

```bash
git add src/app/components/Empresas.tsx
git commit -m "feat(empresas): migrate status tabs to design system

Replace custom pill-style tabs with design system underline tabs component
for Ativos/Inativos filter.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

### Task 2: Migrate GeradorTarefas.tsx Tabs

**Files:**
- Modify: `src/app/components/GeradorTarefas.tsx:3,207-217`

**Goal:** Replace custom "Gerar tarefas/Remover tarefas" tabs with design system components.

- [ ] **Step 1: Add tabs import to GeradorTarefas.tsx**

Add the import statement after the existing imports (after line 3):

```typescript
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';
```

The file should now have imports like:
```typescript
import React, { useState } from 'react';
import { Info, ChevronDown, AlertTriangle } from 'lucide-react';
import { ConfigBreadcrumb } from './ui/config-breadcrumb';
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';
```

- [ ] **Step 2: Replace main tabs implementation (lines 207-217)**

Locate the InfoBanner and tabs section. Replace only the tabs div block:

**Remove (lines 207-217):**
```tsx
{/* Tabs */}
<div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
  {([
    { key: 'gerar', label: 'Gerar tarefas' },
    { key: 'remover', label: 'Remover tarefas' },
  ] as { key: MainTab; label: string }[]).map(t => (
    <button key={t.key} onClick={() => setTab(t.key)}
      style={{ border: 'none', background: tab === t.key ? 'var(--foreground)' : 'white', color: tab === t.key ? 'white' : 'var(--foreground)', fontSize: 'var(--text-label)', fontWeight: tab === t.key ? 'var(--font-weight-semibold)' : 'var(--font-weight-regular)', padding: '7px 20px', borderRadius: 'var(--radius-button)', cursor: 'pointer', boxShadow: tab !== t.key ? '0 0 0 1px var(--border)' : 'none', transition: 'background 0.15s' }}>
      {t.label}
    </button>
  ))}
</div>
```

**Replace with:**
```tsx
{/* Tabs */}
<Tabs value={tab} onValueChange={(v) => setTab(v as MainTab)}>
  <TabsList>
    <TabsTrigger value="gerar">Gerar tarefas</TabsTrigger>
    <TabsTrigger value="remover">Remover tarefas</TabsTrigger>
  </TabsList>
</Tabs>
```

- [ ] **Step 3: Verify TypeScript compilation**

Run the TypeScript compiler to check for errors:

```bash
cd "c:\00. Processos - DOM DS"
npm run build
```

Expected: Build completes successfully with no TypeScript errors related to GeradorTarefas.tsx.

- [ ] **Step 4: Visual verification in browser**

With the development server running, navigate to the Gerador de Tarefas page and verify:
- Tabs appear with underline style (not pill/filled buttons)
- Active tab shows orange bottom border (1.6px, #d64000)
- Clicking "Gerar tarefas" displays the generation form (SelectField components for day, month, department)
- Clicking "Remover tarefas" displays the removal form (SelectField components for initial month, final month, department, task type)
- All form fields and buttons remain functional
- The InfoBanner above the tabs still displays correctly

- [ ] **Step 5: Commit changes**

```bash
git add src/app/components/GeradorTarefas.tsx
git commit -m "feat(gerador-tarefas): migrate tabs to design system

Replace custom pill-style tabs with design system underline tabs component
for Gerar tarefas/Remover tarefas navigation.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

### Task 3: Final Verification and Documentation

**Files:**
- Read: `src/app/components/Empresas.tsx`
- Read: `src/app/components/GeradorTarefas.tsx`
- Read: `src/app/components/ui/tabs.tsx`

**Goal:** Comprehensive verification that both migrations match design system specifications.

- [ ] **Step 1: Visual comparison against Figma spec**

Open the Figma design system reference:
https://www.figma.com/design/Q2p5d5mIahsEPxXYMOA16V/Dom-DS-Core-Web?node-id=6129-2272

With both pages open in the browser, verify against Figma specifications:

**Empresas page "Ativos/Inativos" tabs:**
- Height: 40px (measure with browser dev tools)
- Min width: 80px per tab
- Gap between tabs: 8px
- Active tab border: 1.6px solid #d64000 (bottom border)
- Active tab text color: #d64000
- Inactive tab text color: muted foreground color
- Border style: underline (not pill/background)

**GeradorTarefas page "Gerar tarefas/Remover tarefas" tabs:**
- Same specifications as above
- Visual consistency with Empresas tabs

- [ ] **Step 2: Functional regression testing**

Test all functionality to ensure no regressions:

**Empresas page:**
1. Click "Ativos" → verify table shows only companies with status 'ativo' (7 companies: E1-E7)
2. Click "Inativos" → verify table shows only companies with status 'inativo' (3 companies: E8-E10)
3. Verify search box still filters results correctly
4. Verify regime federal dropdown still filters correctly
5. Verify "Nova Empresa" button is clickable
6. Click on a company row → verify edit modal opens with its own tabs working correctly

**GeradorTarefas page:**
1. Click "Gerar tarefas" → verify generation form displays with all fields
2. Fill form and click "GERAR TAREFAS" → verify success message appears
3. Click "Remover tarefas" → verify removal form displays with all fields
4. Fill form (select department and task type) → verify buttons become enabled
5. Click removal buttons → verify confirmation messages appear

- [ ] **Step 3: Cross-browser testing**

Test in multiple browsers (if available):
- Chrome/Edge
- Firefox
- Safari (if on Mac)

Verify tabs render correctly and function properly in all browsers.

- [ ] **Step 4: Responsive design check**

Test at different viewport widths:
- Desktop (1920px)
- Tablet (768px)
- Mobile (375px)

Verify:
- Tabs don't break layout at narrow widths
- Text remains readable
- Tabs remain clickable
- No horizontal overflow issues

- [ ] **Step 5: Final build and validation**

Run a production build to ensure everything works in production mode:

```bash
cd "c:\00. Processos - DOM DS"
npm run build
```

Expected: Build completes successfully with no errors or warnings related to the modified files.

If build succeeds, the migration is complete.

---

## Success Criteria Checklist

- [x] Empresas.tsx uses design system tabs component
- [x] GeradorTarefas.tsx uses design system tabs component
- [x] Custom pill-style tab code removed from both files
- [x] All tabs display underline style (not pill)
- [x] Active tabs show orange border (1.6px, #d64000)
- [x] All existing functionality preserved
- [x] No TypeScript errors
- [x] Visual appearance matches Figma specification
- [x] Production build succeeds
- [x] Changes committed with clear messages

---

## Rollback Plan

If issues are discovered after implementation:

1. Revert both commits:
```bash
git revert HEAD~1..HEAD
```

2. Or revert individually:
```bash
git revert <commit-hash-gerador-tarefas>
git revert <commit-hash-empresas>
```

3. The custom pill-style tabs will be restored.

# Tabs Migration to Design System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate all custom tab buttons to design system Tabs component across 4 configuration screens.

**Architecture:** Replace custom-styled button tabs with Radix UI Tabs component from design system. Use two patterns: (A) Content Switcher with TabsContent for distinct panels, (B) Filter Tabs without TabsContent when tabs filter the same content.

**Tech Stack:** React, TypeScript, Radix UI Tabs, Tailwind CSS

---

## File Structure

**Modified Files:**
- `src/app/components/UsuariosCliente.tsx` - Remove TabToggle, use design system Tabs (Pattern B - Filter)
- `src/app/components/Empresas.tsx` - Replace modal tabs with design system Tabs (Pattern B - Filter)
- `src/app/components/GerenciarTarefas.tsx` - Replace custom tabs with design system Tabs (Pattern A - Content Switcher)
- `src/app/components/PersonalizarAssinatura.tsx` - Replace custom tabs with design system Tabs (Pattern A - Content Switcher)

**Referenced Files (no changes):**
- `src/app/components/ui/tabs.tsx` - Design system Tabs component (already exists)

---

## Task 1: Migrate UsuariosCliente Tabs

**Files:**
- Modify: `src/app/components/UsuariosCliente.tsx:2,124-145,366-373`

**Pattern:** Filter Tabs (Pattern B) - tabs filter the user list, do NOT use TabsContent

- [ ] **Step 1: Add Tabs import**

Add to imports section (after line 1):

```tsx
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';
```

- [ ] **Step 2: Locate TabToggle component definition**

Find the `TabToggle` function at lines 124-145. This entire function will be deleted after migration.

- [ ] **Step 3: Locate TabToggle usage**

Find TabToggle usage around line 366-373:

```tsx
<TabToggle
  active={statusFilter}
  options={[
    { key: 'ativo', label: `Ativos (${ativos})` },
    { key: 'inativo', label: `Inativos (${inativos})` },
  ]}
  onChange={k => setStatusFilter(k as UserStatus)}
/>
```

- [ ] **Step 4: Replace TabToggle with Tabs component**

Replace the TabToggle usage with:

```tsx
<Tabs value={statusFilter} onValueChange={(v) => setStatusFilter(v as UserStatus)}>
  <TabsList>
    <TabsTrigger value="ativo">Ativos ({ativos})</TabsTrigger>
    <TabsTrigger value="inativo">Inativos ({inativos})</TabsTrigger>
  </TabsList>
</Tabs>
```

Note: Do NOT add TabsContent - this is a filter, not a content switcher.

- [ ] **Step 5: Delete TabToggle function**

Remove the entire `TabToggle` function definition (lines 124-145):

```tsx
function TabToggle({ active, options, onChange }: { active: string; options: { key: string; label: string }[]; onChange: (k: string) => void }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      {options.map(opt => (
        <button
          key={opt.key}
          onClick={() => onChange(opt.key)}
          style={{
            border: 'none',
            background: active === opt.key ? 'var(--foreground)' : 'white',
            color: active === opt.key ? 'white' : 'var(--foreground)',
            fontSize: 'var(--text-label)',
            fontWeight: active === opt.key ? 'var(--font-weight-semibold)' : 'var(--font-weight-regular)',
            padding: '6px 16px',
            borderRadius: 'var(--radius-button)',
            cursor: 'pointer',
            boxShadow: active !== opt.key ? '0 0 0 1px var(--border)' : 'none',
            transition: 'background 0.15s',
          }}>
          {opt.label}
        </button>
      ))}
    </div>
  );
}
```

Delete this entire function.

- [ ] **Step 6: Test in browser**

Run: `npm run dev` (if not running)
Navigate to: Configurações → Usuários de clientes

Verify:
- Tabs render with design system styling (muted background, active tab highlighted)
- Tab labels show dynamic counts: "Ativos (7)" and "Inativos (3)"
- Clicking "Ativos" filters to active users
- Clicking "Inativos" filters to inactive users
- User table updates correctly based on tab selection
- No console errors about TabToggle

- [ ] **Step 7: Commit**

```bash
git add src/app/components/UsuariosCliente.tsx
git commit -m "feat(usuarios-cliente): migrate to design system Tabs component

Replace custom TabToggle component with design system Tabs.
Remove TabToggle function definition.
Use Pattern B (Filter Tabs) - tabs filter user list without TabsContent.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 2: Migrate Empresas Modal Tabs

**Files:**
- Modify: `src/app/components/Empresas.tsx:2,656-670`

**Pattern:** Filter Tabs (Pattern B) - tabs filter modal content, do NOT use TabsContent

- [ ] **Step 1: Add Tabs import**

Add to imports section (after line 1):

```tsx
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';
```

Note: Only import Tabs, TabsList, TabsTrigger (not TabsContent) for filter tabs.

- [ ] **Step 2: Locate custom tab buttons in modal**

Find the custom tab buttons in the EditEmpresa component around lines 656-670:

```tsx
<div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
  {EDIT_TABS.map(t => (
    <button key={t.key} onClick={() => setTab(t.key)}
      style={{
        border: 'none',
        background: tab === t.key ? 'var(--foreground)' : 'white',
        color: tab === t.key ? 'white' : 'var(--foreground)',
        fontSize: 'var(--text-caption)',
        fontWeight: tab === t.key ? 'var(--font-weight-semibold)' : 'var(--font-weight-regular)',
        padding: '6px 14px',
        borderRadius: 'var(--radius-button)',
        cursor: 'pointer',
        boxShadow: tab !== t.key ? '0 0 0 1px var(--border)' : 'none',
        transition: 'background 0.15s',
      }}>
      {t.label}
    </button>
  ))}
</div>
```

- [ ] **Step 3: Find EDIT_TABS constant**

Search for `EDIT_TABS` definition to understand tab structure. It should look like:

```tsx
const EDIT_TABS = [
  { key: 'ativos', label: 'Ativos (...)' },
  { key: 'inativos', label: 'Inativos (...)' },
];
```

Note the dynamic count pattern in labels.

- [ ] **Step 4: Replace custom buttons with Tabs component**

Replace the entire `<div>` block containing the custom buttons with:

```tsx
<Tabs value={tab} onValueChange={(v) => setTab(v as EditTab)}>
  <TabsList>
    <TabsTrigger value="ativos">Ativos ({ativosCount})</TabsTrigger>
    <TabsTrigger value="inativos">Inativos ({inativosCount})</TabsTrigger>
  </TabsList>
</Tabs>
```

Important:
- Find the actual variable names for counts (might be different from `ativosCount`)
- Use the same count variables that were in `EDIT_TABS.map()`
- Do NOT add TabsContent - this is a filter tab

- [ ] **Step 5: Test in browser**

Run: `npm run dev` (if not running)
Navigate to: Configurações → Empresas → Click "Editar" on any company

Verify:
- Modal opens correctly
- Tabs render inside modal with design system styling
- Tab labels show dynamic counts
- Clicking tabs filters the modal content
- Modal save/cancel buttons still work
- No visual regressions in modal layout

- [ ] **Step 6: Commit**

```bash
git add src/app/components/Empresas.tsx
git commit -m "feat(empresas): migrate modal tabs to design system Tabs

Replace custom tab buttons in EditEmpresa modal with design system Tabs.
Use Pattern B (Filter Tabs) - tabs filter modal content without TabsContent.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 3: Migrate GerenciarTarefas Tabs

**Files:**
- Modify: `src/app/components/GerenciarTarefas.tsx:2,366-382`

**Pattern:** Content Switcher (Pattern A) - tabs switch between different tables, USE TabsContent

- [ ] **Step 1: Add Tabs import**

Add to imports section (after line 1):

```tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';
```

Note: Import TabsContent for content switcher pattern.

- [ ] **Step 2: Locate custom tab buttons**

Find the custom tab buttons section around lines 366-372:

```tsx
{/* Tab buttons */}
<div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
  {TASK_TABS.map(t => (
    <button key={t.key} onClick={() => setTab(t.key)}
      style={{
        border: 'none',
        background: tab === t.key ? 'var(--foreground)' : 'white',
        color: tab === t.key ? 'white' : 'var(--foreground)',
        fontSize: 'var(--text-label)',
        fontWeight: tab === t.key ? 'var(--font-weight-semibold)' : 'var(--font-weight-regular)',
        padding: '7px 18px',
        borderRadius: 'var(--radius-button)',
        cursor: 'pointer',
        boxShadow: tab !== t.key ? '0 0 0 1px var(--border)' : 'none',
        transition: 'background 0.15s',
      }}>
      {t.label}
    </button>
  ))}
</div>
```

- [ ] **Step 3: Locate conditional rendering**

Find the conditional rendering section around lines 380-382:

```tsx
{tab === 'recorrentes' && <TableRecorrentes items={filteredRec} setItems={setRecorrentes} />}
{tab === 'esporadicas' && <TableEsporadicas items={filteredEsp} setItems={setEsporadicas} />}
{tab === 'fluxo' && <TableFluxo items={filteredFluxo} />}
```

- [ ] **Step 4: Replace custom buttons with Tabs wrapper**

Replace the custom buttons div with:

```tsx
{/* Tabs */}
<Tabs value={tab} onValueChange={(v) => setTab(v as TaskTab)}>
  <TabsList>
    <TabsTrigger value="recorrentes">Tarefas recorrentes</TabsTrigger>
    <TabsTrigger value="esporadicas">Tarefas esporádicas</TabsTrigger>
    <TabsTrigger value="fluxo">Tarefas de fluxo</TabsTrigger>
  </TabsList>
</Tabs>
```

- [ ] **Step 5: Replace conditional rendering with TabsContent**

Replace the three conditional render lines with:

```tsx
<Tabs value={tab} onValueChange={(v) => setTab(v as TaskTab)}>
  {/* TabsList from Step 4 above */}
  
  <TabsContent value="recorrentes" className="mt-0">
    <TableRecorrentes items={filteredRec} setItems={setRecorrentes} />
  </TabsContent>
  
  <TabsContent value="esporadicas" className="mt-0">
    <TableEsporadicas items={filteredEsp} setItems={setEsporadicas} />
  </TabsContent>
  
  <TabsContent value="fluxo" className="mt-0">
    <TableFluxo items={filteredFluxo} />
  </TabsContent>
</Tabs>
```

Important: The Tabs wrapper should wrap BOTH the TabsList and all TabsContent elements.

- [ ] **Step 6: Combine TabsList and TabsContent in single Tabs wrapper**

Ensure the structure is:

```tsx
<Tabs value={tab} onValueChange={(v) => setTab(v as TaskTab)}>
  <TabsList>
    <TabsTrigger value="recorrentes">Tarefas recorrentes</TabsTrigger>
    <TabsTrigger value="esporadicas">Tarefas esporádicas</TabsTrigger>
    <TabsTrigger value="fluxo">Tarefas de fluxo</TabsTrigger>
  </TabsList>
  
  <TabsContent value="recorrentes" className="mt-0">
    <TableRecorrentes items={filteredRec} setItems={setRecorrentes} />
  </TabsContent>
  
  <TabsContent value="esporadicas" className="mt-0">
    <TableEsporadicas items={filteredEsp} setItems={setEsporadicas} />
  </TabsContent>
  
  <TabsContent value="fluxo" className="mt-0">
    <TableFluxo items={filteredFluxo} />
  </TabsContent>
</Tabs>
```

Note: `className="mt-0"` removes default top margin from TabsContent.

- [ ] **Step 7: Test in browser**

Run: `npm run dev` (if not running)
Navigate to: Configurações → Gerenciar Tarefas

Verify:
- All 3 tabs render with design system styling
- Clicking "Tarefas recorrentes" shows TableRecorrentes
- Clicking "Tarefas esporádicas" shows TableEsporadicas
- Clicking "Tarefas de fluxo" shows TableFluxo
- Only one table visible at a time
- Default tab is "Tarefas recorrentes"
- Search and filters still work
- No console errors

- [ ] **Step 8: Commit**

```bash
git add src/app/components/GerenciarTarefas.tsx
git commit -m "feat(gerenciar-tarefas): migrate to design system Tabs component

Replace custom tab buttons with design system Tabs.
Use Pattern A (Content Switcher) with TabsContent for each table.
Remove conditional rendering in favor of TabsContent.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 4: Migrate PersonalizarAssinatura Tabs

**Files:**
- Modify: `src/app/components/PersonalizarAssinatura.tsx:2,379-400`

**Pattern:** Content Switcher (Pattern A) - tabs switch between different forms, USE TabsContent

- [ ] **Step 1: Add Tabs import**

Add to imports section (after line 1):

```tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';
```

- [ ] **Step 2: Locate custom tab buttons**

Find the custom tab buttons section around lines 380-395:

```tsx
{/* Sub tabs */}
<div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginTop: '16px', marginBottom: '24px' }}>
  {SUB_TABS.map(t => (
    <button key={t.key} onClick={() => setTab(t.key)}
      style={{
        border: 'none',
        background: tab === t.key ? 'var(--foreground)' : 'white',
        color: tab === t.key ? 'white' : 'var(--foreground)',
        fontSize: 'var(--text-label)',
        fontWeight: tab === t.key ? 'var(--font-weight-semibold)' : 'var(--font-weight-regular)',
        padding: '6px 16px',
        borderRadius: 'var(--radius-button)',
        cursor: 'pointer',
        boxShadow: tab !== t.key ? '0 0 0 1px var(--border)' : 'none',
        transition: 'background 0.15s',
      }}>
      {t.label}
    </button>
  ))}
</div>
```

- [ ] **Step 3: Locate conditional rendering**

Find the conditional rendering section around lines 398-400:

```tsx
{tab === 'assinatura' && <TabAssinatura />}
{tab === 'endereco' && <TabEnderecoEmail />}
{tab === 'smtp' && <TabSMTP />}
```

- [ ] **Step 4: Replace entire section with Tabs component**

Replace both the custom buttons AND conditional rendering with:

```tsx
{/* Tabs */}
<Tabs value={tab} onValueChange={(v) => setTab(v as SubTab)}>
  <TabsList className="mt-4">
    <TabsTrigger value="assinatura">Personalizar assinatura</TabsTrigger>
    <TabsTrigger value="endereco">Personalizar endereço de e-mail</TabsTrigger>
    <TabsTrigger value="smtp">SMTP</TabsTrigger>
  </TabsList>
  
  <TabsContent value="assinatura" className="mt-0">
    <TabAssinatura />
  </TabsContent>
  
  <TabsContent value="endereco" className="mt-0">
    <TabEnderecoEmail />
  </TabsContent>
  
  <TabsContent value="smtp" className="mt-0">
    <TabSMTP />
  </TabsContent>
</Tabs>
```

Note: 
- `className="mt-4"` on TabsList provides spacing from element above
- `className="mt-0"` on TabsContent removes default top margin
- Tabs wrapper must wrap BOTH TabsList and all TabsContent elements

- [ ] **Step 5: Verify spacing**

Check that the Tabs component has appropriate spacing:
- Top margin from breadcrumb/title above (mt-4 on TabsList)
- No extra margin between TabsList and TabsContent (mt-0 on TabsContent)
- Existing container padding is preserved

- [ ] **Step 6: Test in browser**

Run: `npm run dev` (if not running)
Navigate to: Configurações → Personalizar Assinatura e E-mail

Verify:
- All 3 tabs render with design system styling
- Clicking "Personalizar assinatura" shows signature form
- Clicking "Personalizar endereço de e-mail" shows email address form
- Clicking "SMTP" shows SMTP configuration form
- Only one form visible at a time
- Default tab is "Personalizar assinatura"
- Form state preserved when switching tabs (if user typed something)
- No console errors

- [ ] **Step 7: Test form functionality**

For each tab, verify form inputs work:
- Personalizar assinatura: logo upload, signature editor
- Personalizar endereço: email input field
- SMTP: all SMTP configuration fields

- [ ] **Step 8: Commit**

```bash
git add src/app/components/PersonalizarAssinatura.tsx
git commit -m "feat(personalizar-assinatura): migrate to design system Tabs component

Replace custom tab buttons with design system Tabs.
Use Pattern A (Content Switcher) with TabsContent for each form.
Remove conditional rendering in favor of TabsContent.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 5: Visual Verification and Cross-Component Testing

**Files:**
- Test: All 4 modified components

- [ ] **Step 1: Build verification**

Run TypeScript compilation and build:

```bash
npm run build
```

Expected: Build succeeds with no errors or warnings

- [ ] **Step 2: Visual regression test - UsuariosCliente**

Navigate to: Configurações → Usuários de clientes

Verify:
- [ ] Tabs have muted background (gray)
- [ ] Active tab has highlighted bg-card appearance (white on gray)
- [ ] Hover states work (inactive tabs change color on hover)
- [ ] Tab labels show dynamic counts: "Ativos (N)" and "Inativos (N)"
- [ ] Clicking tabs filters user list correctly
- [ ] ChevronRight separators appear between tabs (design system default)
- [ ] No custom styling remnants visible

- [ ] **Step 3: Visual regression test - Empresas**

Navigate to: Configurações → Empresas → Click "Editar" on any company

Verify:
- [ ] Modal opens correctly
- [ ] Tabs render inside modal with design system styling
- [ ] Tabs have muted background (same as other screens)
- [ ] Active tab highlighted
- [ ] Tab labels show counts
- [ ] Clicking tabs filters modal content
- [ ] Modal layout unchanged (save/cancel buttons position)
- [ ] No layout shifts or visual regressions

- [ ] **Step 4: Visual regression test - GerenciarTarefas**

Navigate to: Configurações → Gerenciar Tarefas

Verify:
- [ ] All 3 tabs render correctly
- [ ] Design system styling applied (muted bg, active highlight)
- [ ] Tab labels: "Tarefas recorrentes", "Tarefas esporádicas", "Tarefas de fluxo"
- [ ] Only one table visible at a time
- [ ] Smooth transition when switching tabs (no flash of content)
- [ ] Default tab is "Tarefas recorrentes"
- [ ] Spacing between tabs and table is appropriate

- [ ] **Step 5: Visual regression test - PersonalizarAssinatura**

Navigate to: Configurações → Personalizar Assinatura e E-mail

Verify:
- [ ] All 3 tabs render correctly
- [ ] Design system styling consistent with other screens
- [ ] Tab labels: "Personalizar assinatura", "Personalizar endereço de e-mail", "SMTP"
- [ ] Only one form visible at a time
- [ ] Default tab is "Personalizar assinatura"
- [ ] Spacing from breadcrumb to tabs looks good (mt-4)
- [ ] No extra margin between tabs and form content

- [ ] **Step 6: Consistency check across all screens**

Open all 4 screens in separate browser tabs and compare:

- [ ] All tabs use same muted background color
- [ ] All active tabs use same highlight color
- [ ] All tabs have same border radius (rounded-xl)
- [ ] All tabs have same height (h-9 / 36px)
- [ ] All tabs have same padding and spacing
- [ ] All tabs have same hover effect
- [ ] All tabs have same focus ring (try keyboard navigation with Tab key)

- [ ] **Step 7: Functional testing**

Test all scenarios:

**UsuariosCliente:**
- [ ] Filter by Ativos, verify user list updates
- [ ] Filter by Inativos, verify user list updates
- [ ] Use search while on each tab filter
- [ ] Use empresa dropdown while on each tab filter
- [ ] Verify counts update when data changes

**Empresas:**
- [ ] Open edit modal for a company
- [ ] Switch between Ativos/Inativos tabs in modal
- [ ] Verify content filters correctly
- [ ] Save/cancel modal (verify tabs don't break modal flow)

**GerenciarTarefas:**
- [ ] Click each tab (Recorrentes, Esporádicas, Fluxo)
- [ ] Verify correct table shows for each tab
- [ ] Use search while on each tab
- [ ] Toggle "Integrado" filter while on each tab
- [ ] Verify table data persists correctly

**PersonalizarAssinatura:**
- [ ] Click each tab (Assinatura, Endereço, SMTP)
- [ ] Verify correct form shows for each tab
- [ ] Type in a form field, switch tabs, switch back - verify input preserved
- [ ] Test form submission (if applicable)

- [ ] **Step 8: Keyboard navigation test**

For each screen:
- [ ] Press Tab key to focus first tab
- [ ] Press Arrow Right to move to next tab
- [ ] Press Arrow Left to move to previous tab
- [ ] Press Enter/Space on focused tab to activate it
- [ ] Verify focus ring visible and clear

- [ ] **Step 9: Accessibility check**

Open browser dev tools → Accessibility tab:
- [ ] Tabs have proper ARIA attributes (role="tab", aria-selected, etc.)
- [ ] TabsList has role="tablist"
- [ ] TabsContent has role="tabpanel"
- [ ] No accessibility violations reported
- [ ] Screen reader announces tab changes (if possible to test)

- [ ] **Step 10: Browser console check**

Open dev tools console on each screen:
- [ ] No React warnings
- [ ] No console errors
- [ ] No warnings about deprecated APIs
- [ ] No "Warning: Cannot update a component" errors

- [ ] **Step 11: No regressions verification**

Verify unrelated functionality still works:
- [ ] All breadcrumbs still work (click "Configurações")
- [ ] All "Voltar" navigation still works where applicable
- [ ] Search inputs work
- [ ] Dropdowns work
- [ ] Tables sort/filter correctly
- [ ] Modal open/close works (Empresas)
- [ ] No broken layouts anywhere

- [ ] **Step 12: Final commit (if any fixes needed)**

If minor adjustments were needed during testing:

```bash
git add src/app/components/
git commit -m "fix: address visual/functional issues from tabs migration testing

[Describe what was fixed]

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

Otherwise, no commit needed for this task.

---

## Implementation Complete

All tasks are finished when:
- [ ] All 4 components migrated to design system Tabs
- [ ] Pattern A (Content Switcher) used for GerenciarTarefas and PersonalizarAssinatura
- [ ] Pattern B (Filter Tabs) used for Empresas and UsuariosCliente
- [ ] TabToggle component removed from UsuariosCliente
- [ ] All tabs have consistent design system styling
- [ ] All functionality preserved (filtering, content switching, state management)
- [ ] Build succeeds with no errors
- [ ] All visual and functional tests pass
- [ ] No console errors or warnings
- [ ] No accessibility violations

**Next Steps:** Tabs migration complete! All configuration screens now use the design system Tabs component with consistent styling and behavior.

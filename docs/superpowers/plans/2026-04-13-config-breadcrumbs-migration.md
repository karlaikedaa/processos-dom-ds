# Configuration Breadcrumbs Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace "Voltar" and "Fechar" buttons in 14 configuration screens with functional breadcrumbs from the design system

**Architecture:** Create shared `ConfigBreadcrumb` wrapper component that renders 2 or 3-level breadcrumbs using design system components, then migrate each configuration screen to use it

**Tech Stack:** React, TypeScript, Radix UI Breadcrumb (design system), lucide-react icons

---

## File Structure

**New Files:**
- `src/app/components/ui/config-breadcrumb.tsx` - Shared breadcrumb wrapper component

**Modified Files (14 screens):**
- `src/app/components/Responsabilidades.tsx` - Pilot migration
- `src/app/components/FeriadosHorarios.tsx`
- `src/app/components/AgrupadorTarefasClientes.tsx`
- `src/app/components/ModelosDocumento.tsx`
- `src/app/components/GeradorTarefas.tsx`
- `src/app/components/PersonalizarAssinatura.tsx`
- `src/app/components/InboxConfig.tsx`
- `src/app/components/TemplatesEmailWhatsapp.tsx`
- `src/app/components/FuncionariosEscritorio.tsx`
- `src/app/components/Empresas.tsx`
- `src/app/components/UsuariosCliente.tsx`
- `src/app/components/AdequacaoAgrupadores.tsx`
- `src/app/components/GerenciarTarefas.tsx`

**Referenced Files (no changes):**
- `src/app/components/ui/breadcrumb.tsx` - Existing design system breadcrumb components

---

## Task 1: Create ConfigBreadcrumb Component

**Files:**
- Create: `src/app/components/ui/config-breadcrumb.tsx`

- [ ] **Step 1: Create component file with TypeScript interface**

Create `src/app/components/ui/config-breadcrumb.tsx`:

```tsx
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from './breadcrumb';

interface ConfigBreadcrumbProps {
  /**
   * Label do menu de configuração
   * Ex: "Empresas", "Feriados e horários"
   */
  menuLabel: string;

  /**
   * Label do item específico (opcional)
   * Ex: "Acme Corp", "João Silva"
   * Se fornecido, breadcrumb tem 3 níveis
   */
  itemLabel?: string;

  /**
   * Callback para navegar de volta para Configurações
   */
  onNavigateToConfig: () => void;

  /**
   * Callback para navegar de volta ao menu (lista)
   * Só usado quando itemLabel existe
   */
  onNavigateToMenu?: () => void;
}

export function ConfigBreadcrumb({
  menuLabel,
  itemLabel,
  onNavigateToConfig,
  onNavigateToMenu,
}: ConfigBreadcrumbProps) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {/* Nível 1: Configurações (sempre clicável) */}
        <BreadcrumbItem>
          <BreadcrumbLink onClick={onNavigateToConfig}>
            Configurações
          </BreadcrumbLink>
        </BreadcrumbItem>
        
        <BreadcrumbSeparator />
        
        {/* Nível 2: Menu - clicável SE itemLabel existe, senão é página atual */}
        <BreadcrumbItem>
          {itemLabel ? (
            <BreadcrumbLink onClick={onNavigateToMenu}>
              {menuLabel}
            </BreadcrumbLink>
          ) : (
            <BreadcrumbPage>{menuLabel}</BreadcrumbPage>
          )}
        </BreadcrumbItem>
        
        {/* Nível 3: Item (condicional, sempre página atual) */}
        {itemLabel && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{itemLabel}</BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
```

- [ ] **Step 2: Verify TypeScript compilation**

Run: `npm run build`
Expected: Build succeeds without TypeScript errors in config-breadcrumb.tsx

- [ ] **Step 3: Commit**

```bash
git add src/app/components/ui/config-breadcrumb.tsx
git commit -m "feat: add ConfigBreadcrumb wrapper component for configuration screens"
```

---

## Task 2: Migrate Responsabilidades (Pilot Screen)

**Files:**
- Modify: `src/app/components/Responsabilidades.tsx`

- [ ] **Step 1: Locate current navigation button**

Search for "Voltar" or "Fechar" button in `src/app/components/Responsabilidades.tsx`

Expected: Find button with ArrowLeft or X icon around line with `onBack` callback

- [ ] **Step 2: Add ConfigBreadcrumb import**

At the top of file after existing imports, add:

```tsx
import { ConfigBreadcrumb } from './ui/config-breadcrumb';
```

- [ ] **Step 3: Replace navigation button with ConfigBreadcrumb**

Find the navigation button (likely similar to):
```tsx
<button onClick={onBack} ...>
  <ArrowLeft size={13} /> Voltar para Configurações
</button>
```

Replace entire button with:
```tsx
<div className="mt-2">
  <ConfigBreadcrumb 
    menuLabel="Responsabilidades"
    onNavigateToConfig={onBack}
  />
</div>
```

Position it in the same location (below title and description).

- [ ] **Step 4: Remove unused ArrowLeft import if applicable**

Check if `ArrowLeft` is used elsewhere in the file.
If NOT used elsewhere, remove from lucide-react imports:

```tsx
// BEFORE
import { ArrowLeft, Plus, Search, ... } from 'lucide-react';

// AFTER (if ArrowLeft not used elsewhere)
import { Plus, Search, ... } from 'lucide-react';
```

- [ ] **Step 5: Test in browser**

Run: `npm run dev` (if not already running)
Navigate to: Configurações → Responsabilidades

Expected:
- Breadcrumb "Configurações > Responsabilidades" appears
- "Configurações" is clickable (blue/underlined on hover)
- "Responsabilidades" is NOT clickable (darker text, no hover effect)
- No "Voltar" button visible
- Clicking "Configurações" closes the screen

- [ ] **Step 6: Verify TypeScript and build**

Run: `npm run build`
Expected: Build succeeds, no TypeScript errors

- [ ] **Step 7: Commit**

```bash
git add src/app/components/Responsabilidades.tsx
git commit -m "feat(responsabilidades): replace Voltar button with breadcrumb navigation"
```

---

## Task 3: Migrate FeriadosHorarios

**Files:**
- Modify: `src/app/components/FeriadosHorarios.tsx` (~line 782)

- [ ] **Step 1: Add import**

```tsx
import { ConfigBreadcrumb } from './ui/config-breadcrumb';
```

- [ ] **Step 2: Replace button (around line 779-783)**

Find:
```tsx
<button onClick={onBack}
  className="flex items-center gap-1.5 mt-2 cursor-pointer hover:opacity-75"
  style={{ background: 'none', border: 'none', padding: 0, fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>
  <ArrowLeft size={13} /> Voltar para Configurações
</button>
```

Replace with:
```tsx
<div className="mt-2">
  <ConfigBreadcrumb 
    menuLabel="Feriados e horários"
    onNavigateToConfig={onBack}
  />
</div>
```

- [ ] **Step 3: Remove ArrowLeft from imports if unused elsewhere**

Check file for other uses of `<ArrowLeft`. If none, remove from imports.

- [ ] **Step 4: Test navigation**

Navigate to: Configurações → Feriados e horários
Verify: Breadcrumb works, click "Configurações" closes screen

- [ ] **Step 5: Commit**

```bash
git add src/app/components/FeriadosHorarios.tsx
git commit -m "feat(feriados): replace Voltar button with breadcrumb navigation"
```

---

## Task 4: Migrate AgrupadorTarefasClientes

**Files:**
- Modify: `src/app/components/AgrupadorTarefasClientes.tsx`

- [ ] **Step 1: Add import**

```tsx
import { ConfigBreadcrumb } from './ui/config-breadcrumb';
```

- [ ] **Step 2: Locate and replace navigation button**

Find "Voltar" or "Fechar" button, replace with:

```tsx
<div className="mt-2">
  <ConfigBreadcrumb 
    menuLabel="Agrupadores de tarefas e clientes"
    onNavigateToConfig={onBack}
  />
</div>
```

Note: Use exact callback name from existing button (might be `onBack`, `onClose`, or similar).

- [ ] **Step 3: Remove unused icon imports**

Remove `ArrowLeft` or `X` from lucide-react imports if not used elsewhere.

- [ ] **Step 4: Test**

Navigate to screen, verify breadcrumb renders and navigation works.

- [ ] **Step 5: Commit**

```bash
git add src/app/components/AgrupadorTarefasClientes.tsx
git commit -m "feat(agrupadores): replace Voltar button with breadcrumb navigation"
```

---

## Task 5: Migrate ModelosDocumento

**Files:**
- Modify: `src/app/components/ModelosDocumento.tsx`

- [ ] **Step 1: Add import**

```tsx
import { ConfigBreadcrumb } from './ui/config-breadcrumb';
```

- [ ] **Step 2: Replace navigation button**

```tsx
<div className="mt-2">
  <ConfigBreadcrumb 
    menuLabel="Modelos de documento"
    onNavigateToConfig={onBack}
  />
</div>
```

- [ ] **Step 3: Clean up imports**

Remove `ArrowLeft` or `X` if unused.

- [ ] **Step 4: Test**

Verify breadcrumb and navigation.

- [ ] **Step 5: Commit**

```bash
git add src/app/components/ModelosDocumento.tsx
git commit -m "feat(modelos-documento): replace Voltar button with breadcrumb navigation"
```

---

## Task 6: Migrate GeradorTarefas

**Files:**
- Modify: `src/app/components/GeradorTarefas.tsx`

- [ ] **Step 1: Add import**

```tsx
import { ConfigBreadcrumb } from './ui/config-breadcrumb';
```

- [ ] **Step 2: Replace navigation button**

```tsx
<div className="mt-2">
  <ConfigBreadcrumb 
    menuLabel="Gerador de tarefas"
    onNavigateToConfig={onBack}
  />
</div>
```

- [ ] **Step 3: Clean up imports**

Remove unused navigation icons.

- [ ] **Step 4: Test**

Verify breadcrumb renders correctly.

- [ ] **Step 5: Commit**

```bash
git add src/app/components/GeradorTarefas.tsx
git commit -m "feat(gerador-tarefas): replace Voltar button with breadcrumb navigation"
```

---

## Task 7: Migrate PersonalizarAssinatura

**Files:**
- Modify: `src/app/components/PersonalizarAssinatura.tsx`

- [ ] **Step 1: Add import**

```tsx
import { ConfigBreadcrumb } from './ui/config-breadcrumb';
```

- [ ] **Step 2: Replace navigation button**

```tsx
<div className="mt-2">
  <ConfigBreadcrumb 
    menuLabel="Personalizar assinatura e e-mail"
    onNavigateToConfig={onBack}
  />
</div>
```

- [ ] **Step 3: Clean up imports**

Remove unused icons.

- [ ] **Step 4: Test**

Verify breadcrumb.

- [ ] **Step 5: Commit**

```bash
git add src/app/components/PersonalizarAssinatura.tsx
git commit -m "feat(personalizar-assinatura): replace Voltar button with breadcrumb navigation"
```

---

## Task 8: Migrate InboxConfig

**Files:**
- Modify: `src/app/components/InboxConfig.tsx`

- [ ] **Step 1: Add import**

```tsx
import { ConfigBreadcrumb } from './ui/config-breadcrumb';
```

- [ ] **Step 2: Replace navigation button**

```tsx
<div className="mt-2">
  <ConfigBreadcrumb 
    menuLabel="Inbox"
    onNavigateToConfig={onBack}
  />
</div>
```

- [ ] **Step 3: Clean up imports**

- [ ] **Step 4: Test**

- [ ] **Step 5: Commit**

```bash
git add src/app/components/InboxConfig.tsx
git commit -m "feat(inbox): replace Voltar button with breadcrumb navigation"
```

---

## Task 9: Migrate TemplatesEmailWhatsapp

**Files:**
- Modify: `src/app/components/TemplatesEmailWhatsapp.tsx`

- [ ] **Step 1: Add import**

```tsx
import { ConfigBreadcrumb } from './ui/config-breadcrumb';
```

- [ ] **Step 2: Replace navigation button**

```tsx
<div className="mt-2">
  <ConfigBreadcrumb 
    menuLabel="Modelos de e-mail e WhatsApp"
    onNavigateToConfig={onBack}
  />
</div>
```

- [ ] **Step 3: Clean up imports**

- [ ] **Step 4: Test**

- [ ] **Step 5: Commit**

```bash
git add src/app/components/TemplatesEmailWhatsapp.tsx
git commit -m "feat(templates): replace Voltar button with breadcrumb navigation"
```

---

## Task 10: Migrate FuncionariosEscritorio

**Files:**
- Modify: `src/app/components/FuncionariosEscritorio.tsx`

**Note:** This screen may have detail/edit views. Check if there are modals or detail sections that need itemLabel.

- [ ] **Step 1: Add import**

```tsx
import { ConfigBreadcrumb } from './ui/config-breadcrumb';
```

- [ ] **Step 2: Replace list view navigation button**

In the main list view:
```tsx
<div className="mt-2">
  <ConfigBreadcrumb 
    menuLabel="Funcionários do escritório"
    onNavigateToConfig={onBack}
  />
</div>
```

- [ ] **Step 3: Check for detail/edit view**

Search for modal or detail section that shows when editing a specific employee.
If found, add breadcrumb with itemLabel:

```tsx
<div className="mt-2">
  <ConfigBreadcrumb 
    menuLabel="Funcionários do escritório"
    itemLabel={funcionario.nome}
    onNavigateToConfig={onBack}
    onNavigateToMenu={() => setFuncionarioSelecionado(null)}
  />
</div>
```

Adjust state variable names as needed (might be `selectedFuncionario`, `funcionarioAtual`, etc.).

- [ ] **Step 4: Clean up imports**

- [ ] **Step 5: Test both views**

- List view: "Configurações > Funcionários do escritório"
- Detail view (if applicable): "Configurações > Funcionários do escritório > [Nome]"
- Click navigation works in both views

- [ ] **Step 6: Commit**

```bash
git add src/app/components/FuncionariosEscritorio.tsx
git commit -m "feat(funcionarios): replace Voltar/Fechar buttons with breadcrumb navigation"
```

---

## Task 11: Migrate Empresas

**Files:**
- Modify: `src/app/components/Empresas.tsx`

**Note:** Empresas has list + modal edit view. Check around line 651-665 for modal breadcrumb.

- [ ] **Step 1: Add import**

```tsx
import { ConfigBreadcrumb } from './ui/config-breadcrumb';
```

- [ ] **Step 2: Find list view navigation button**

Look for main screen "Voltar" button. Replace with:

```tsx
<div className="mt-2">
  <ConfigBreadcrumb 
    menuLabel="Empresas"
    onNavigateToConfig={onBack}
  />
</div>
```

- [ ] **Step 3: Find modal/detail view navigation**

Search for "Fechar" button inside edit modal (likely has `selectedEmpresa` or similar state).
Replace with:

```tsx
<div className="mt-2">
  <ConfigBreadcrumb 
    menuLabel="Empresas"
    itemLabel={selectedEmpresa.nome}
    onNavigateToConfig={onBack}
    onNavigateToMenu={() => setSelectedEmpresa(null)}
  />
</div>
```

Adjust variable names to match actual state (`empresaSelecionada`, `currentEmpresa`, etc.).

- [ ] **Step 4: Remove X and ArrowLeft from imports if unused**

- [ ] **Step 5: Test both views**

- List: "Configurações > Empresas", click Configurações closes
- Edit modal: "Configurações > Empresas > [Nome da Empresa]"
  - Click "Empresas" closes modal, stays in list
  - Click "Configurações" closes everything

- [ ] **Step 6: Commit**

```bash
git add src/app/components/Empresas.tsx
git commit -m "feat(empresas): replace Voltar/Fechar buttons with breadcrumb navigation"
```

---

## Task 12: Migrate UsuariosCliente

**Files:**
- Modify: `src/app/components/UsuariosCliente.tsx`

**Note:** May have list + detail views.

- [ ] **Step 1: Add import**

```tsx
import { ConfigBreadcrumb } from './ui/config-breadcrumb';
```

- [ ] **Step 2: Replace list view button**

```tsx
<div className="mt-2">
  <ConfigBreadcrumb 
    menuLabel="Usuários de clientes"
    onNavigateToConfig={onBack}
  />
</div>
```

- [ ] **Step 3: Check for detail/edit view**

If exists, add breadcrumb with itemLabel:

```tsx
<div className="mt-2">
  <ConfigBreadcrumb 
    menuLabel="Usuários de clientes"
    itemLabel={usuario.nome}
    onNavigateToConfig={onBack}
    onNavigateToMenu={() => setUsuarioSelecionado(null)}
  />
</div>
```

- [ ] **Step 4: Clean up imports**

- [ ] **Step 5: Test**

- [ ] **Step 6: Commit**

```bash
git add src/app/components/UsuariosCliente.tsx
git commit -m "feat(usuarios-cliente): replace navigation buttons with breadcrumbs"
```

---

## Task 13: Migrate AdequacaoAgrupadores

**Files:**
- Modify: `src/app/components/AdequacaoAgrupadores.tsx`

- [ ] **Step 1: Add import**

```tsx
import { ConfigBreadcrumb } from './ui/config-breadcrumb';
```

- [ ] **Step 2: Replace navigation button**

Check if this screen has detail views. If just a list:

```tsx
<div className="mt-2">
  <ConfigBreadcrumb 
    menuLabel="Adequação de agrupadores"
    onNavigateToConfig={onBack}
  />
</div>
```

If it has detail views, also add itemLabel version where applicable.

- [ ] **Step 3: Clean up imports**

- [ ] **Step 4: Test**

- [ ] **Step 5: Commit**

```bash
git add src/app/components/AdequacaoAgrupadores.tsx
git commit -m "feat(adequacao-agrupadores): replace navigation buttons with breadcrumbs"
```

---

## Task 14: Migrate GerenciarTarefas

**Files:**
- Modify: `src/app/components/GerenciarTarefas.tsx` (~line 364-369)

**Note:** This screen likely has list + detail views for tasks.

- [ ] **Step 1: Add import**

```tsx
import { ConfigBreadcrumb } from './ui/config-breadcrumb';
```

- [ ] **Step 2: Replace list view button**

```tsx
<div className="mt-2">
  <ConfigBreadcrumb 
    menuLabel="Gerenciar tarefas"
    onNavigateToConfig={onBack}
  />
</div>
```

- [ ] **Step 3: Find task detail/edit view**

If there's a view that shows when editing a specific task, add:

```tsx
<div className="mt-2">
  <ConfigBreadcrumb 
    menuLabel="Gerenciar tarefas"
    itemLabel={tarefa.nome}
    onNavigateToConfig={onBack}
    onNavigateToMenu={() => setTarefaSelecionada(null)}
  />
</div>
```

- [ ] **Step 4: Clean up imports**

- [ ] **Step 5: Test all views**

- [ ] **Step 6: Commit**

```bash
git add src/app/components/GerenciarTarefas.tsx
git commit -m "feat(gerenciar-tarefas): replace navigation buttons with breadcrumbs"
```

---

## Task 15: Final Verification and Testing

**Files:**
- Test: All 14 modified screens

- [ ] **Step 1: Build verification**

Run: `npm run build`
Expected: Build succeeds with no TypeScript errors

- [ ] **Step 2: Visual regression test**

For each of the 14 screens, verify in browser:

**Checklist per screen:**
- [ ] Responsabilidades
- [ ] FeriadosHorarios
- [ ] AgrupadorTarefasClientes
- [ ] ModelosDocumento
- [ ] GeradorTarefas
- [ ] PersonalizarAssinatura
- [ ] InboxConfig
- [ ] TemplatesEmailWhatsapp
- [ ] FuncionariosEscritorio
- [ ] Empresas
- [ ] UsuariosCliente
- [ ] AdequacaoAgrupadores
- [ ] GerenciarTarefas

**For each screen verify:**
- Breadcrumb renders below title/description
- Correct labels (check against spec table)
- ChevronRight separators appear
- "Configurações" is clickable and works
- Current page is NOT clickable
- No "Voltar" or "Fechar" buttons visible
- Hover states work (clickable items change color)

- [ ] **Step 3: Functional navigation test**

Test navigation paths:
1. Open any config screen → breadcrumb shows → click "Configurações" → closes
2. For screens with details (Empresas, etc.):
   - Open list → open item → breadcrumb has 3 levels
   - Click menu name → returns to list
   - Click "Configurações" → closes all

- [ ] **Step 4: Edge case testing**

- Long item names (test text wrapping)
- Rapid navigation (click multiple times quickly)
- All 14 screens still function as before (no regressions)

- [ ] **Step 5: Code quality check**

Search across all modified files:
- No unused `ArrowLeft` or `X` imports
- All `ConfigBreadcrumb` have correct props
- No console errors when navigating

Run: `grep -r "ArrowLeft\|import.*X" src/app/components/*.tsx | grep -E "(Feriados|Empresas|Responsabilidades|...)"`

Expected: Only see ArrowLeft/X in files that still use them for other purposes (not navigation)

- [ ] **Step 6: Final commit**

If any fixes were made during testing:

```bash
git add <modified files>
git commit -m "fix: address issues found in breadcrumb navigation testing"
```

---

## Implementation Complete

All tasks finished when:
- [ ] ConfigBreadcrumb component created and tested
- [ ] All 14 configuration screens migrated
- [ ] All "Voltar" and "Fechar" buttons removed
- [ ] Navigation works correctly in all screens
- [ ] Build succeeds without errors
- [ ] Visual verification passed for all screens
- [ ] No unused imports remain

**Next Steps:** 
- Deploy to staging environment
- Conduct user acceptance testing
- Monitor for any navigation issues
- Consider adding breadcrumbs to other sections if successful

# Breadcrumb Standardization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Standardize breadcrumb positioning and spacing across all 13 configuration screens - move breadcrumbs above titles with consistent 24px spacing.

**Architecture:** Direct modification approach - restructure each component to separate breadcrumb into its own section (24px top/bottom padding) above the title section.

**Tech Stack:** React, TypeScript, inline styles

---

## File Structure

**Files to Modify (13 total):**
- `src/app/components/GeradorTarefas.tsx` - Lines ~188-200
- `src/app/components/Empresas.tsx` - Lines ~712-720
- `src/app/components/PersonalizarAssinatura.tsx` - Lines ~353-368
- `src/app/components/GerenciarTarefas.tsx`
- `src/app/components/UsuariosCliente.tsx`
- `src/app/components/AdequacaoAgrupadores.tsx`
- `src/app/components/FuncionariosEscritorio.tsx`
- `src/app/components/TemplatesEmailWhatsapp.tsx`
- `src/app/components/InboxConfig.tsx`
- `src/app/components/ModelosDocumento.tsx`
- `src/app/components/AgrupadorTarefasClientes.tsx`
- `src/app/components/FeriadosHorarios.tsx`
- `src/app/components/Responsabilidades.tsx`

**Standard Pattern:**
Each file will transform from:
```tsx
<div style={{ paddingTop: '24px', paddingBottom: '16px' }}>
  <h1>Title</h1>
  <p>Description</p>
  <div className="mt-2">
    <ConfigBreadcrumb ... />
  </div>
</div>
```

To:
```tsx
{/* Breadcrumb */}
<div style={{ paddingTop: '24px', paddingBottom: '24px' }}>
  <ConfigBreadcrumb ... />
</div>

{/* Title and Description */}
<div style={{ paddingBottom: '16px' }}>
  <h1>Title</h1>
  <p>Description</p>
</div>
```

---

### Task 1: Standardize GeradorTarefas

**Files:**
- Modify: `src/app/components/GeradorTarefas.tsx:188-200`

- [ ] **Step 1: Read current file structure**

```bash
cd "c:\00. Processos - DOM DS"
```

Read the file to locate the current breadcrumb position (lines 188-200).

- [ ] **Step 2: Replace breadcrumb section in GeradorTarefas**

In `src/app/components/GeradorTarefas.tsx`, find this code (lines ~188-200):

```tsx
      {/* Page Title */}
      <div style={{ paddingTop: '24px', paddingBottom: '16px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'var(--font-weight-bold)', color: 'var(--foreground)', marginBottom: '8px' }}>
          Gerador de Tarefas
        </h1>
        <p style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>
          Gere ou remova tarefas em lote
        </p>
        <div className="mt-2">
          <ConfigBreadcrumb
            menuLabel="Gerador de tarefas"
            onNavigateToConfig={onBack}
          />
        </div>
      </div>
```

Replace with:

```tsx
      {/* Breadcrumb */}
      <div style={{ paddingTop: '24px', paddingBottom: '24px' }}>
        <ConfigBreadcrumb
          menuLabel="Gerador de tarefas"
          onNavigateToConfig={onBack}
        />
      </div>

      {/* Page Title */}
      <div style={{ paddingBottom: '16px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'var(--font-weight-bold)', color: 'var(--foreground)', marginBottom: '8px' }}>
          Gerador de Tarefas
        </h1>
        <p style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>
          Gere ou remova tarefas em lote
        </p>
      </div>
```

- [ ] **Step 3: Commit GeradorTarefas changes**

```bash
git add src/app/components/GeradorTarefas.tsx
git commit -m "$(cat <<'EOF'
feat(gerador-tarefas): standardize breadcrumb positioning

Move breadcrumb above title with 24px top/bottom spacing for consistent
visual hierarchy across configuration screens.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 2: Standardize Empresas

**Files:**
- Modify: `src/app/components/Empresas.tsx:712-720`

- [ ] **Step 1: Replace breadcrumb section in Empresas**

In `src/app/components/Empresas.tsx`, find this code (lines ~712-720):

```tsx
      {/* Page Title */}
      <div style={{ paddingTop: '24px', paddingBottom: '16px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'var(--font-weight-bold)', color: 'var(--foreground)', marginBottom: '8px' }}>
          Empresas
        </h1>
        <p style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>
          Gerencie as empresas do escritório
        </p>
        <div className="mt-2">
          <ConfigBreadcrumb menuLabel="Empresas" onNavigateToConfig={onBack} />
        </div>
      </div>
```

Replace with:

```tsx
      {/* Breadcrumb */}
      <div style={{ paddingTop: '24px', paddingBottom: '24px' }}>
        <ConfigBreadcrumb menuLabel="Empresas" onNavigateToConfig={onBack} />
      </div>

      {/* Page Title */}
      <div style={{ paddingBottom: '16px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'var(--font-weight-bold)', color: 'var(--foreground)', marginBottom: '8px' }}>
          Empresas
        </h1>
        <p style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>
          Gerencie as empresas do escritório
        </p>
      </div>
```

- [ ] **Step 2: Commit Empresas changes**

```bash
git add src/app/components/Empresas.tsx
git commit -m "$(cat <<'EOF'
feat(empresas): standardize breadcrumb positioning

Move breadcrumb above title with 24px top/bottom spacing for consistent
visual hierarchy across configuration screens.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 3: Standardize PersonalizarAssinatura and GerenciarTarefas

**Files:**
- Modify: `src/app/components/PersonalizarAssinatura.tsx:353-368`
- Modify: `src/app/components/GerenciarTarefas.tsx`

- [ ] **Step 1: Replace breadcrumb section in PersonalizarAssinatura**

In `src/app/components/PersonalizarAssinatura.tsx`, find this code (lines ~353-368):

```tsx
      {/* Page Title */}
      <div style={{ paddingTop: '24px', paddingBottom: '16px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'var(--font-weight-bold)', color: 'var(--foreground)', marginBottom: '8px' }}>
          Personalizar Assinatura e E-mail
        </h1>
        <p style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>
          Configure assinatura, endereço de e-mail e servidor SMTP
        </p>
        <div className="mt-2">
          <ConfigBreadcrumb
            menuLabel="Personalizar assinatura e e-mail"
            onNavigateToConfig={onBack}
          />
        </div>
      </div>
```

Replace with:

```tsx
      {/* Breadcrumb */}
      <div style={{ paddingTop: '24px', paddingBottom: '24px' }}>
        <ConfigBreadcrumb
          menuLabel="Personalizar assinatura e e-mail"
          onNavigateToConfig={onBack}
        />
      </div>

      {/* Page Title */}
      <div style={{ paddingBottom: '16px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'var(--font-weight-bold)', color: 'var(--foreground)', marginBottom: '8px' }}>
          Personalizar Assinatura e E-mail
        </h1>
        <p style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>
          Configure assinatura, endereço de e-mail e servidor SMTP
        </p>
      </div>
```

- [ ] **Step 2: Find and replace breadcrumb section in GerenciarTarefas**

Search for the pattern in GerenciarTarefas.tsx:

```bash
grep -n "paddingTop.*24px.*paddingBottom.*16px" src/app/components/GerenciarTarefas.tsx
```

Apply the same transformation:
- Extract breadcrumb into its own section with `paddingTop: '24px', paddingBottom: '24px'`
- Remove `className="mt-2"` wrapper
- Change title section to `paddingBottom: '16px'` only (remove paddingTop)
- Preserve all existing props and content

- [ ] **Step 3: Commit both files**

```bash
git add src/app/components/PersonalizarAssinatura.tsx src/app/components/GerenciarTarefas.tsx
git commit -m "$(cat <<'EOF'
feat(personalizar-assinatura,gerenciar-tarefas): standardize breadcrumb positioning

Move breadcrumbs above titles with 24px top/bottom spacing for consistent
visual hierarchy across configuration screens.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 4: Standardize UsuariosCliente and AdequacaoAgrupadores

**Files:**
- Modify: `src/app/components/UsuariosCliente.tsx`
- Modify: `src/app/components/AdequacaoAgrupadores.tsx`

- [ ] **Step 1: Find breadcrumb sections in both files**

```bash
grep -n "ConfigBreadcrumb" src/app/components/UsuariosCliente.tsx
grep -n "ConfigBreadcrumb" src/app/components/AdequacaoAgrupadores.tsx
```

- [ ] **Step 2: Transform UsuariosCliente**

Locate the section containing:
- `<div style={{ paddingTop: '24px', paddingBottom: '16px' }}>`
- Title h1
- Description p
- `<div className="mt-2">` with ConfigBreadcrumb

Apply the standard transformation:
1. Create new breadcrumb section: `<div style={{ paddingTop: '24px', paddingBottom: '24px' }}>`
2. Move ConfigBreadcrumb into it (remove mt-2 wrapper)
3. Update title section to `<div style={{ paddingBottom: '16px' }}>`
4. Keep h1 and p inside title section

- [ ] **Step 3: Transform AdequacaoAgrupadores**

Apply the same transformation pattern as Step 2.

- [ ] **Step 4: Commit both files**

```bash
git add src/app/components/UsuariosCliente.tsx src/app/components/AdequacaoAgrupadores.tsx
git commit -m "$(cat <<'EOF'
feat(usuarios-cliente,adequacao-agrupadores): standardize breadcrumb positioning

Move breadcrumbs above titles with 24px top/bottom spacing for consistent
visual hierarchy across configuration screens.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 5: Standardize FuncionariosEscritorio and TemplatesEmailWhatsapp

**Files:**
- Modify: `src/app/components/FuncionariosEscritorio.tsx`
- Modify: `src/app/components/TemplatesEmailWhatsapp.tsx`

- [ ] **Step 1: Find breadcrumb sections in both files**

```bash
grep -n "ConfigBreadcrumb" src/app/components/FuncionariosEscritorio.tsx
grep -n "ConfigBreadcrumb" src/app/components/TemplatesEmailWhatsapp.tsx
```

- [ ] **Step 2: Transform FuncionariosEscritorio**

Apply the standard transformation:
- Extract breadcrumb into `<div style={{ paddingTop: '24px', paddingBottom: '24px' }}>`
- Remove `className="mt-2"` wrapper from breadcrumb
- Update title section to `<div style={{ paddingBottom: '16px' }}>`
- Preserve all ConfigBreadcrumb props (menuLabel, itemLabel if present, callbacks)

- [ ] **Step 3: Transform TemplatesEmailWhatsapp**

Apply the same transformation as Step 2.

- [ ] **Step 4: Commit both files**

```bash
git add src/app/components/FuncionariosEscritorio.tsx src/app/components/TemplatesEmailWhatsapp.tsx
git commit -m "$(cat <<'EOF'
feat(funcionarios-escritorio,templates-email-whatsapp): standardize breadcrumb positioning

Move breadcrumbs above titles with 24px top/bottom spacing for consistent
visual hierarchy across configuration screens.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 6: Standardize InboxConfig and ModelosDocumento

**Files:**
- Modify: `src/app/components/InboxConfig.tsx`
- Modify: `src/app/components/ModelosDocumento.tsx`

- [ ] **Step 1: Find breadcrumb sections in both files**

```bash
grep -n "ConfigBreadcrumb" src/app/components/InboxConfig.tsx
grep -n "ConfigBreadcrumb" src/app/components/ModelosDocumento.tsx
```

- [ ] **Step 2: Transform InboxConfig**

Apply the standard transformation:
- Create breadcrumb section: `<div style={{ paddingTop: '24px', paddingBottom: '24px' }}>`
- Move ConfigBreadcrumb (remove mt-2 wrapper)
- Title section becomes: `<div style={{ paddingBottom: '16px' }}>`

- [ ] **Step 3: Transform ModelosDocumento**

Apply the same transformation as Step 2.

- [ ] **Step 4: Commit both files**

```bash
git add src/app/components/InboxConfig.tsx src/app/components/ModelosDocumento.tsx
git commit -m "$(cat <<'EOF'
feat(inbox-config,modelos-documento): standardize breadcrumb positioning

Move breadcrumbs above titles with 24px top/bottom spacing for consistent
visual hierarchy across configuration screens.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 7: Standardize AgrupadorTarefasClientes, FeriadosHorarios, and Responsabilidades

**Files:**
- Modify: `src/app/components/AgrupadorTarefasClientes.tsx`
- Modify: `src/app/components/FeriadosHorarios.tsx`
- Modify: `src/app/components/Responsabilidades.tsx`

- [ ] **Step 1: Find breadcrumb sections in all three files**

```bash
grep -n "ConfigBreadcrumb" src/app/components/AgrupadorTarefasClientes.tsx
grep -n "ConfigBreadcrumb" src/app/components/FeriadosHorarios.tsx
grep -n "ConfigBreadcrumb" src/app/components/Responsabilidades.tsx
```

- [ ] **Step 2: Transform AgrupadorTarefasClientes**

Apply standard transformation to move breadcrumb above title with 24px spacing.

- [ ] **Step 3: Transform FeriadosHorarios**

**Note:** This file might use Tailwind classes instead of inline styles:
```tsx
<div className="pt-6 pb-4">  {/* 24px top, 16px bottom */}
```

Transform to:
```tsx
{/* Breadcrumb */}
<div style={{ paddingTop: '24px', paddingBottom: '24px' }}>
  <ConfigBreadcrumb ... />
</div>

{/* Title */}
<div style={{ paddingBottom: '16px' }}>
  {/* h1 and p */}
</div>
```

Remove the `className="mt-2"` wrapper from breadcrumb.

- [ ] **Step 4: Transform Responsabilidades**

Apply the same standard transformation.

- [ ] **Step 5: Commit all three files**

```bash
git add src/app/components/AgrupadorTarefasClientes.tsx src/app/components/FeriadosHorarios.tsx src/app/components/Responsabilidades.tsx
git commit -m "$(cat <<'EOF'
feat(agrupador-tarefas,feriados-horarios,responsabilidades): standardize breadcrumb positioning

Move breadcrumbs above titles with 24px top/bottom spacing for consistent
visual hierarchy across configuration screens. Standardize FeriadosHorarios
from Tailwind classes to inline styles for consistency.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 8: Build Verification and Visual Testing

**Files:**
- Verify: All 13 modified components

- [ ] **Step 1: TypeScript compilation check**

```bash
cd "c:\00. Processos - DOM DS"
npm run build
```

Expected: Build completes successfully with no TypeScript errors.

- [ ] **Step 2: Start development server**

```bash
npm run dev
```

Wait for server to start (usually http://localhost:3000 or similar).

- [ ] **Step 3: Visual verification - Sample screens**

Open browser and navigate to these representative screens:

1. **GeradorTarefas:** Navigate to Configurações → Gerador de Tarefas
   - Verify: Breadcrumb appears **above** title
   - Verify: Visual spacing looks consistent (24px gaps)

2. **Empresas:** Navigate to Configurações → Empresas
   - Verify: Same visual hierarchy as GeradorTarefas
   - Verify: Breadcrumb clickable and navigates correctly

3. **PersonalizarAssinatura:** Navigate to Configurações → Personalizar Assinatura
   - Verify: Breadcrumb above title
   - Verify: All form functionality still works

4. **FeriadosHorarios:** Navigate to Configurações → Feriados e Horários
   - Verify: Breadcrumb positioning matches other screens
   - Verify: Converted from Tailwind to inline styles correctly

- [ ] **Step 4: Spacing measurement with DevTools**

For one screen (e.g., GeradorTarefas):

1. Right-click breadcrumb container → Inspect
2. Check computed styles:
   - `padding-top`: should be **24px**
   - `padding-bottom`: should be **24px**
3. Measure visual distance from navigation bar to breadcrumb: **~24px**
4. Measure visual distance from breadcrumb to title: **~24px**

- [ ] **Step 5: Functional testing - Breadcrumb navigation**

Click breadcrumbs on 2-3 different screens:
- Verify: "Configurações" link navigates back to config menu
- Verify: Menu-specific links (if 3-level breadcrumb) navigate correctly
- Verify: No console errors

- [ ] **Step 6: Consistency check across all 13 screens**

Quickly open all 13 configuration screens and verify:
- All breadcrumbs appear **above** titles (visual order correct)
- Spacing looks visually consistent across all screens
- No layout breaks or overflow issues

**Screens to check:**
1. Gerador de Tarefas ✓
2. Empresas ✓
3. Personalizar Assinatura ✓
4. Gerenciar Tarefas
5. Usuários Cliente
6. Adequação Agrupadores
7. Funcionários Escritório
8. Templates Email/WhatsApp
9. Inbox Config
10. Modelos de Documento
11. Agrupador Tarefas Clientes
12. Feriados e Horários ✓
13. Responsabilidades

- [ ] **Step 7: Final verification - Build and no errors**

Stop dev server (Ctrl+C) and run final build:

```bash
npm run build
```

Expected: Clean build, no errors, no warnings related to the 13 modified files.

---

## Success Criteria Checklist

After completing all tasks, verify:

- [x] All 13 files modified with breadcrumb repositioned above title
- [x] Breadcrumb sections use `paddingTop: '24px', paddingBottom: '24px'`
- [x] Title sections use `paddingBottom: '16px'` only (no paddingTop)
- [x] All `className="mt-2"` wrappers removed from breadcrumbs
- [x] Visual hierarchy consistent: Nav Bar → Breadcrumb → Title → Description → Content
- [x] TypeScript compilation succeeds
- [x] All breadcrumb navigation links functional
- [x] No layout regressions or visual breaks
- [x] FeriadosHorarios converted from Tailwind to inline styles (if applicable)
- [x] 7 commits total (one per task)

---

## Rollback Plan

If issues are discovered:

```bash
# View recent commits
git log --oneline -7

# Revert all breadcrumb standardization commits
git revert <commit-hash-task-7>..<commit-hash-task-1>

# Or revert specific file
git checkout <previous-commit> -- src/app/components/[ComponentName].tsx
```

All changes are isolated to spacing and structure - no business logic affected.

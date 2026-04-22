# Tabs Design System Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Substituir botões customizados de tabs por componente Tabs do design system em 6 componentes

**Architecture:** Usar Radix UI Tabs component com TabsList, TabsTrigger e TabsContent. Manter estados existentes, preservar 100% da funcionalidade, remover estilos inline customizados.

**Tech Stack:** React, TypeScript, Radix UI Tabs, Tailwind CSS

---

## File Structure

**Modified Files:**
- `src/app/components/PersonalizarAssinatura.tsx` - Substituir 3 tabs customizadas
- `src/app/components/GeradorTarefas.tsx` - Substituir 2 tabs customizadas
- `src/app/components/UsuariosCliente.tsx` - Substituir 2 tabs de filtro
- `src/app/components/Empresas.tsx` - Substituir 2 tabs de filtro (lista) e 4 tabs (modal)
- `src/app/components/GerenciarTarefas.tsx` - Substituir 3 tabs customizadas

**Referenced Files (no changes):**
- `src/app/components/ui/tabs.tsx` - Componente Tabs do design system (já existe)

---

## Task 1: PersonalizarAssinatura - Migrar Tabs (3 tabs)

**Files:**
- Modify: `src/app/components/PersonalizarAssinatura.tsx:1,347-398`

- [ ] **Step 1: Add Tabs import**

Add after lucide-react import (line ~2):

```tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';
```

- [ ] **Step 2: Locate tab buttons block**

Find lines 377-393 (the `.map` that renders 3 buttons):
```tsx
<div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginTop: '16px', marginBottom: '24px' }}>
  {SUB_TABS.map(t => (
    <button key={t.key} onClick={() => setTab(t.key)}
      style={{ ... }}>
      {t.label}
    </button>
  ))}
</div>
```

- [ ] **Step 3: Replace buttons with Tabs component**

Replace entire block (lines 377-393) with:

```tsx
<Tabs value={tab} onValueChange={setTab} className="mt-4 mb-6">
  <TabsList>
    <TabsTrigger value="assinatura">Personalizar assinatura</TabsTrigger>
    <TabsTrigger value="endereco">Personalizar endereço de e-mail</TabsTrigger>
    <TabsTrigger value="smtp">SMTP</TabsTrigger>
  </TabsList>
  
  <TabsContent value="assinatura">
    <TabAssinatura />
  </TabsContent>
  
  <TabsContent value="endereco">
    <TabEnderecoEmail />
  </TabsContent>
  
  <TabsContent value="smtp">
    <TabSMTP />
  </TabsContent>
</Tabs>
```

- [ ] **Step 4: Remove old conditional rendering**

Delete lines 395-397:
```tsx
{tab === 'assinatura' && <TabAssinatura />}
{tab === 'endereco' && <TabEnderecoEmail />}
{tab === 'smtp' && <TabSMTP />}
```

(These are now inside TabsContent)

- [ ] **Step 5: Verify in browser**

Run: `npm run dev` (if not already running)
Navigate to: PersonalizarAssinatura page
Expected: 
- 3 tabs visible with muted background
- Active tab has white background
- Content switches when clicking tabs
- No console errors

- [ ] **Step 6: Test functionality**

Test:
- Click each tab - content switches correctly
- Fill form in one tab, switch to another, return - data preserved
- All save/cancel buttons work

- [ ] **Step 7: Commit**

```bash
git add src/app/components/PersonalizarAssinatura.tsx
git commit -m "feat: replace custom tabs with DS Tabs in PersonalizarAssinatura"
```

---

## Task 2: GeradorTarefas - Migrar Tabs (2 tabs)

**Files:**
- Modify: `src/app/components/GeradorTarefas.tsx:1,202-218`

- [ ] **Step 1: Add Tabs import**

Add after lucide-react import (line ~2):

```tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';
```

- [ ] **Step 2: Locate tab buttons block**

Find lines 202-213 (array with tab definitions + map):
```tsx
<div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
  {([
    { key: 'gerar', label: 'Gerar tarefas' },
    { key: 'remover', label: 'Remover tarefas' },
  ] as { key: MainTab; label: string }[]).map(t => (
    <button key={t.key} onClick={() => setTab(t.key)} ... >
      {t.label}
    </button>
  ))}
</div>
```

- [ ] **Step 3: Replace buttons with Tabs component**

Replace entire block (lines 202-213) with:

```tsx
<Tabs value={tab} onValueChange={setTab}>
  <TabsList>
    <TabsTrigger value="gerar">Gerar tarefas</TabsTrigger>
    <TabsTrigger value="remover">Remover tarefas</TabsTrigger>
  </TabsList>
  
  <TabsContent value="gerar">
    <TabGerarTarefas />
  </TabsContent>
  
  <TabsContent value="remover">
    <TabRemoverTarefas />
  </TabsContent>
</Tabs>
```

- [ ] **Step 4: Remove old conditional rendering**

Delete lines ~215-216:
```tsx
{tab === 'gerar' && <TabGerarTarefas />}
{tab === 'remover' && <TabRemoverTarefas />}
```

- [ ] **Step 5: Verify in browser**

Navigate to: GeradorTarefas page
Expected: 
- 2 tabs visible
- Switching between "Gerar tarefas" and "Remover tarefas" works
- Forms maintain state when switching tabs

- [ ] **Step 6: Commit**

```bash
git add src/app/components/GeradorTarefas.tsx
git commit -m "feat: replace custom tabs with DS Tabs in GeradorTarefas"
```

---

## Task 3: UsuariosCliente - Migrar Tabs de Filtro (2 tabs)

**Files:**
- Modify: `src/app/components/UsuariosCliente.tsx`

- [ ] **Step 1: Read file to locate tab structure**

```bash
# Find where the Ativos/Inativos buttons are
grep -n "Ativos\|Inativos" src/app/components/UsuariosCliente.tsx
```

- [ ] **Step 2: Add Tabs import**

Add after other imports:

```tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';
```

- [ ] **Step 3: Add or locate status filter state**

If state doesn't exist, add after other useState declarations:

```tsx
const [statusFilter, setStatusFilter] = useState<'ativo' | 'inativo'>('ativo');
```

If it exists with different name, note the variable names to use in next steps.

- [ ] **Step 4: Calculate filtered arrays**

Add useMemo for filtered users:

```tsx
const usuariosAtivos = useMemo(() => 
  usuarios.filter(u => u.status === 'ativo'), 
  [usuarios]
);

const usuariosInativos = useMemo(() => 
  usuarios.filter(u => u.status === 'inativo'), 
  [usuarios]
);
```

Adjust based on actual data structure in component.

- [ ] **Step 5: Replace filter buttons with Tabs**

Find the button block for Ativos/Inativos and replace with:

```tsx
<Tabs value={statusFilter} onValueChange={setStatusFilter}>
  <TabsList>
    <TabsTrigger value="ativo">
      Ativos ({usuariosAtivos.length})
    </TabsTrigger>
    <TabsTrigger value="inativo">
      Inativos ({usuariosInativos.length})
    </TabsTrigger>
  </TabsList>
  
  <TabsContent value="ativo">
    {/* Move existing table/list for active users here */}
  </TabsContent>
  
  <TabsContent value="inativo">
    {/* Move existing table/list for inactive users here */}
  </TabsContent>
</Tabs>
```

- [ ] **Step 6: Move table rendering into TabsContent**

Take the existing table/list code and place inside appropriate TabsContent.
Use `usuariosAtivos` for ativo tab, `usuariosInativos` for inativo tab.

- [ ] **Step 7: Verify in browser**

Navigate to: UsuariosCliente page
Expected:
- 2 tabs with counts: "Ativos (N)" and "Inativos (M)"
- Counts update dynamically
- Table shows correct filtered data for each tab
- Search/filters still work within each tab

- [ ] **Step 8: Commit**

```bash
git add src/app/components/UsuariosCliente.tsx
git commit -m "feat: replace custom filter tabs with DS Tabs in UsuariosCliente"
```

---

## Task 4: Empresas Lista - Migrar Tabs de Filtro (2 tabs)

**Files:**
- Modify: `src/app/components/Empresas.tsx` (lista principal, NÃO o modal)

- [ ] **Step 1: Add Tabs import**

Add after other imports (if not already added):

```tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';
```

- [ ] **Step 2: Locate filter buttons in main list**

Find around lines 560-580 where Ativos/Inativos buttons are rendered.
Do NOT confuse with modal tabs (those are lines 651-665).

- [ ] **Step 3: Add status filter state**

Add after other useState declarations in main component:

```tsx
const [statusFilter, setStatusFilter] = useState<EmpresaStatus>('ativo');
```

- [ ] **Step 4: Calculate filtered arrays**

Add useMemo:

```tsx
const empresasAtivas = useMemo(() => 
  empresas.filter(e => e.status === 'ativo'), 
  [empresas]
);

const empresasInativas = useMemo(() => 
  empresas.filter(e => e.status === 'inativo'), 
  [empresas]
);
```

- [ ] **Step 5: Replace filter buttons with Tabs**

Replace the Ativos/Inativos button block with:

```tsx
<Tabs value={statusFilter} onValueChange={setStatusFilter}>
  <TabsList>
    <TabsTrigger value="ativo">
      Ativos ({empresasAtivas.length})
    </TabsTrigger>
    <TabsTrigger value="inativo">
      Inativos ({empresasInativas.length})
    </TabsTrigger>
  </TabsList>
  
  <TabsContent value="ativo">
    {/* Move table for active empresas here */}
  </TabsContent>
  
  <TabsContent value="inativo">
    {/* Move table for inactive empresas here */}
  </TabsContent>
</Tabs>
```

- [ ] **Step 6: Move table into TabsContent**

Move the existing empresas table inside appropriate TabsContent blocks.
Use filtered arrays for each tab.

- [ ] **Step 7: Verify in browser**

Navigate to: Empresas page
Expected:
- 2 tabs with counts
- Filtered table for each status
- Search still works
- Modal opens correctly when clicking empresa row

- [ ] **Step 8: Commit**

```bash
git add src/app/components/Empresas.tsx
git commit -m "feat: replace custom filter tabs with DS Tabs in Empresas list"
```

---

## Task 5: GerenciarTarefas - Migrar Tabs (3 tabs)

**Files:**
- Modify: `src/app/components/GerenciarTarefas.tsx:1,363-379`

- [ ] **Step 1: Add Tabs import**

Add after lucide-react import:

```tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';
```

- [ ] **Step 2: Locate tab buttons block**

Find lines 364-369 (the .map that renders 3 buttons):
```tsx
<div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
  {TASK_TABS.map(t => (
    <button key={t.key} onClick={() => setTab(t.key)} ...>
      {t.label}
    </button>
  ))}
</div>
```

- [ ] **Step 3: Replace buttons with Tabs**

Replace entire block (lines 363-370) with:

```tsx
<Tabs value={tab} onValueChange={setTab}>
  <TabsList>
    <TabsTrigger value="recorrentes">Tarefas recorrentes</TabsTrigger>
    <TabsTrigger value="esporadicas">Tarefas esporádicas</TabsTrigger>
    <TabsTrigger value="fluxo">Tarefas de fluxo</TabsTrigger>
  </TabsList>
  
  <TabsContent value="recorrentes">
    <p style={{ fontSize: 'var(--text-h3)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', margin: '16px 0' }}>
      {recorrentes.length} Tarefas recorrentes
    </p>
    <Toolbar search={search} setSearch={setSearch} integrado={integrado} setIntegrado={setIntegrado} />
    <TableRecorrentes items={filteredRec} setItems={setRecorrentes} />
  </TabsContent>
  
  <TabsContent value="esporadicas">
    <p style={{ fontSize: 'var(--text-h3)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', margin: '16px 0' }}>
      {esporadicas.length} Tarefas esporádicas
    </p>
    <Toolbar search={search} setSearch={setSearch} integrado={integrado} setIntegrado={setIntegrado} />
    <TableEsporadicas items={filteredEsp} setItems={setEsporadicas} />
  </TabsContent>
  
  <TabsContent value="fluxo">
    <p style={{ fontSize: 'var(--text-h3)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', margin: '16px 0' }}>
      {MOCK_FLUXO.length} Tarefas de fluxo
    </p>
    <Toolbar search={search} setSearch={setSearch} integrado={integrado} setIntegrado={setIntegrado} />
    <TableFluxo items={filteredFluxo} />
  </TabsContent>
</Tabs>
```

- [ ] **Step 4: Remove old conditional rendering**

Delete lines ~376-378:
```tsx
{tab === 'recorrentes' && <TableRecorrentes items={filteredRec} setItems={setRecorrentes} />}
{tab === 'esporadicas' && <TableEsporadicas items={filteredEsp} setItems={setEsporadicas} />}
{tab === 'fluxo' && <TableFluxo items={filteredFluxo} />}
```

Also remove the standalone title (line 372) since it's now inside each TabsContent:
```tsx
<p style={{ fontSize: 'var(--text-h3)', ... }}>100 Tarefas recorrentes</p>
```

Also remove standalone Toolbar (line 374) since it's now inside each TabsContent:
```tsx
<Toolbar search={search} setSearch={setSearch} integrado={integrado} setIntegrado={setIntegrado} />
```

- [ ] **Step 5: Verify in browser**

Navigate to: GerenciarTarefas page
Expected:
- 3 tabs visible
- Each tab shows correct title with count
- Toolbar appears in each tab
- Tables switch correctly
- Search and toggle integrado work in each tab

- [ ] **Step 6: Commit**

```bash
git add src/app/components/GerenciarTarefas.tsx
git commit -m "feat: replace custom tabs with DS Tabs in GerenciarTarefas"
```

---

## Task 6: Empresas Modal - Migrar Tabs (4 tabs)

**Files:**
- Modify: `src/app/components/Empresas.tsx:651-677` (modal EditEmpresaPanel)

- [ ] **Step 1: Ensure Tabs import exists**

Verify Tabs import at top of file (should be added in Task 4):

```tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';
```

- [ ] **Step 2: Locate modal tab buttons**

Find lines 651-665 inside EditEmpresaPanel:
```tsx
<div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
  {EDIT_TABS.map(t => (
    <button key={t.key} onClick={() => setTab(t.key)} ...>
      {t.label}
    </button>
  ))}
</div>
```

**IMPORTANT:** This is INSIDE the modal, separate from the list tabs from Task 4.

- [ ] **Step 3: Replace modal tab buttons with Tabs**

Replace the button block (lines 650-666) with:

```tsx
<Tabs value={tab} onValueChange={setTab}>
  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '10px 24px', borderBottom: '1px solid var(--border)', background: 'var(--input-background)', flexShrink: 0 }}>
    <TabsList>
      <TabsTrigger value="cadastrais">Informações cadastrais</TabsTrigger>
      <TabsTrigger value="tarefas">Tarefas do cliente</TabsTrigger>
      <TabsTrigger value="senhas">Senhas</TabsTrigger>
      <TabsTrigger value="certidoes">Certidões e certificados</TabsTrigger>
    </TabsList>
    
    <div style={{ display: 'flex', gap: 8 }}>
      <button onClick={onClose} style={{ padding: '6px 20px', border: '1px solid var(--border)', borderRadius: 'var(--radius-button)', background: 'white', fontSize: 'var(--text-label)', color: 'var(--foreground)', fontWeight: 'var(--font-weight-semibold)', cursor: 'pointer' }}>CANCELAR</button>
      <button onClick={onClose} style={{ padding: '6px 20px', border: 'none', borderRadius: 'var(--radius-button)', background: 'var(--primary)', fontSize: 'var(--text-label)', color: 'white', fontWeight: 'var(--font-weight-semibold)', cursor: 'pointer' }}>SALVAR</button>
    </div>
  </div>
  
  <div style={{ flex: 1, overflowY: 'auto', background: '#f9fafc' }}>
    <TabsContent value="cadastrais" className="mt-0">
      <TabCadastrais empresa={empresa} onChange={setEmpresa} />
    </TabsContent>
    
    <TabsContent value="tarefas" className="mt-0">
      <TabTarefasCliente empresaId={empresa.id} />
    </TabsContent>
    
    <TabsContent value="senhas" className="mt-0">
      <TabSenhas empresaId={empresa.id} senhas={senhas} setSenhas={setSenhas} />
    </TabsContent>
    
    <TabsContent value="certidoes" className="mt-0">
      <TabCertidoes empresaId={empresa.id} certificados={certificados} setCertificados={setCertificados} />
    </TabsContent>
  </div>
</Tabs>
```

Note: TabsContent uses `className="mt-0"` to remove default margin-top.

- [ ] **Step 4: Remove old tab content container**

Delete the old `<div style={{ flex: 1, overflowY: 'auto', background: '#f9fafc' }}>` that wraps the conditional rendering (line ~673).

This div is now inside the Tabs structure (Step 3).

- [ ] **Step 5: Remove old conditional rendering**

Delete lines ~675-678:
```tsx
{tab === 'cadastrais' && <TabCadastrais empresa={empresa} onChange={setEmpresa} />}
{tab === 'tarefas' && <TabTarefasCliente empresaId={empresa.id} />}
{tab === 'senhas' && <TabSenhas empresaId={empresa.id} senhas={senhas} setSenhas={setSenhas} />}
{tab === 'certidoes' && <TabCertidoes empresaId={empresa.id} certificados={certificados} setCertificados={setCertificados} />}
```

- [ ] **Step 6: Verify in browser**

Navigate to: Empresas page
Click any empresa to open modal
Expected:
- Modal opens correctly
- 4 tabs visible inside modal
- CANCELAR/SALVAR buttons appear next to tabs
- Clicking tabs switches content
- Forms maintain state when switching tabs
- Modal closes correctly

- [ ] **Step 7: Test complex scenarios**

Test:
- Fill form in "Informações cadastrais", switch to "Senhas", return - data preserved
- Add senha, switch tabs, return - senha still there
- All CRUD operations work in each tab
- Modal scroll works in each tab

- [ ] **Step 8: Commit**

```bash
git add src/app/components/Empresas.tsx
git commit -m "feat: replace custom tabs with DS Tabs in Empresas modal"
```

---

## Implementation Complete

All tasks finished when:
- [ ] All 6 components migrated to Tabs from design system
- [ ] Zero custom tab buttons with inline styles remaining
- [ ] All tests pass (browser testing per task)
- [ ] No TypeScript errors
- [ ] No console warnings
- [ ] Visual consistency across all components

**Next Steps:** 
After all tabs are migrated, move to breadcrumbs implementation (separate plan), then gray backgrounds (separate plan).

**Testing Summary:**
Each component tested individually as implemented. Final verification should test:
1. Navigation between all pages works
2. All tabs function correctly
3. State preservation works everywhere
4. Visual consistency across components
5. Accessibility (keyboard navigation with Tab/Arrow keys)

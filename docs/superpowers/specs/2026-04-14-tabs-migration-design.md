# Design: Tabs Migration to Design System

**Date:** 2026-04-14  
**Components:** GerenciarTarefas, PersonalizarAssinatura, Empresas, UsuariosCliente  
**Objective:** Migrate all custom tabs to design system Tabs component (Radix UI)

## Context

Multiple configuration screens currently use custom-styled tab buttons that don't match the design system. The Tarefas main menu has already been migrated to use the design system Tabs component successfully. This spec covers migrating the remaining screens to achieve visual consistency and maintain the design system across the application.

## Requirements

### Functional
- Preserve all existing tab behavior (content switching vs filtering)
- Maintain all state management logic
- Keep dynamic tab counts where applicable
- No breaking changes to component APIs

### Visual
- Replace custom tab buttons with design system Tabs component
- Match Figma design system specification: https://www.figma.com/design/Q2p5d5mIahsEPxXYMOA16V/Dom-DS-Core-Web?node-id=6129-2272
- Consistent styling across all tabs (muted background, active state highlighting)
- Proper hover and focus states from design system

## Scope

**4 screens requiring tabs migration:**

1. **GerenciarTarefas** - Content switcher tabs (3 tabs: Recorrentes, Esporádicas, Fluxo)
2. **PersonalizarAssinatura** - Content switcher tabs (3 tabs: Assinatura, Endereço, SMTP)
3. **Empresas** - Filter tabs in edit modal (2 tabs: Ativos, Inativos)
4. **UsuariosCliente** - Filter tabs with custom TabToggle component (2 tabs: Ativos, Inativos)

**Out of scope:**
- Tarefas main menu tabs (already migrated)
- Any tabs in other areas of the application

## Approach

**Component-by-Component Migration**

Migrate each screen's tabs independently while matching their current behavior. This approach balances safety with proper design system adoption, allowing each migration to be implemented and tested independently.

### Alternative Approaches Considered

**Unified Tabs Pattern:** Create a single wrapper component for all tab behaviors
- ❌ Rejected: Over-engineering for simple use cases, adds unnecessary abstraction

**Direct Replacement:** Replace all tabs in one pass with minimal planning
- ❌ Rejected: Higher risk of breaking filtering logic, harder to test incrementally

## Design Detailsailed

### 1. Architecture Overview

**Design System Component:**
- Using existing `src/app/components/ui/tabs.tsx`
- Built on Radix UI Tabs primitives: `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent`
- Already styled with design system tokens (muted background, active state, hover states)

**Two Implementation Patterns:**

**Pattern A - Content Switcher** (for screens with distinct content panels):
```tsx
<Tabs value={currentTab} onValueChange={setCurrentTab}>
  <TabsList>
    <TabsTrigger value="tab1">Label 1</TabsTrigger>
    <TabsTrigger value="tab2">Label 2</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">
    {/* Content panel 1 */}
  </TabsContent>
  <TabsContent value="tab2">
    {/* Content panel 2 */}
  </TabsContent>
</Tabs>
```

**Pattern B - Filter Tabs** (for screens where tabs filter the same content):
```tsx
<Tabs value={filterState} onValueChange={setFilterState}>
  <TabsList>
    <TabsTrigger value="active">Ativos (7)</TabsTrigger>
    <TabsTrigger value="inactive">Inativos (3)</TabsTrigger>
  </TabsList>
</Tabs>
{/* Content filtered based on filterState, not wrapped in TabsContent */}
```

**Key Principle:** Use `TabsContent` only when switching between distinct content panels. Use tabs without `TabsContent` when tabs act as filters for the same underlying content.

### 2. Component-Specific Implementations

#### 2.1 GerenciarTarefas

**File:** `src/app/components/GerenciarTarefas.tsx`

**Current implementation:**
- Custom button tabs at lines 368-372
- Conditional rendering at lines 380-382: `{tab === 'recorrentes' && <TableRecorrentes />}`
- State: `const [tab, setTab] = useState<TaskTab>('recorrentes')`

**Migration approach:**
- **Pattern:** Content Switcher (Pattern A)
- Replace custom buttons with `<Tabs>` wrapper + `<TabsList>` + 3 `<TabsTrigger>` elements
- Wrap each table component (`<TableRecorrentes>`, `<TableEsporadicas>`, `<TableFluxo>`) in `<TabsContent>`
- Remove conditional rendering (Radix Tabs handles show/hide automatically)
- Keep existing state variable and type

**Tab configuration:**
```tsx
<Tabs value={tab} onValueChange={(v) => setTab(v as TaskTab)}>
  <TabsList>
    <TabsTrigger value="recorrentes">Tarefas recorrentes</TabsTrigger>
    <TabsTrigger value="esporadicas">Tarefas esporádicas</TabsTrigger>
    <TabsTrigger value="fluxo">Tarefas de fluxo</TabsTrigger>
  </TabsList>
  <TabsContent value="recorrentes">
    <TableRecorrentes items={filteredRec} setItems={setRecorrentes} />
  </TabsContent>
  <TabsContent value="esporadicas">
    <TableEsporadicas items={filteredEsp} setItems={setEsporadicas} />
  </TabsContent>
  <TabsContent value="fluxo">
    <TableFluxo items={filteredFluxo} />
  </TabsContent>
</Tabs>
```

**Why this pattern:** Each tab shows a completely different table component with different data and columns. This is content switching, not filtering.

---

#### 2.2 PersonalizarAssinatura

**File:** `src/app/components/PersonalizarAssinatura.tsx`

**Current implementation:**
- Custom button tabs at lines 380-395
- Conditional rendering at lines 398-400: `{tab === 'assinatura' && <TabAssinatura />}`
- State: `const [tab, setTab] = useState<SubTab>('assinatura')`
- Type: `type SubTab = 'assinatura' | 'endereco' | 'smtp'`

**Migration approach:**
- **Pattern:** Content Switcher (Pattern A)
- Replace custom buttons with `<Tabs>` wrapper + `<TabsList>` + 3 `<TabsTrigger>` elements
- Wrap each tab component (`<TabAssinatura>`, `<TabEnderecoEmail>`, `<TabSMTP>`) in `<TabsContent>`
- Remove conditional rendering
- Keep existing state variable and type

**Tab configuration:**
```tsx
<Tabs value={tab} onValueChange={(v) => setTab(v as SubTab)}>
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

**Why this pattern:** Each tab shows a different configuration form with completely different fields and behavior. This is content switching.

---

#### 2.3 Empresas (Edit Modal)

**File:** `src/app/components/Empresas.tsx`

**Current implementation:**
- Custom button tabs at lines 656-670, inside edit modal
- Tabs are part of modal's action bar
- State: `const [tab, setTab] = useState<EditTab>('ativos')`
- Type: `type EditTab = 'ativos' | 'inativos'`
- Content is filtered based on `tab` state in the modal's content area

**Migration approach:**
- **Pattern:** Filter Tabs (Pattern B)
- Replace custom buttons with `<Tabs>` wrapper + `<TabsList>` + 2 `<TabsTrigger>` elements
- **Do NOT use `<TabsContent>`** - this is a filter, not a content switcher
- Content below tabs is filtered based on `tab` state (existing filtering logic unchanged)
- Keep existing state variable and type
- Tab labels include dynamic counts

**Tab configuration:**
```tsx
<Tabs value={tab} onValueChange={(v) => setTab(v as EditTab)}>
  <TabsList>
    <TabsTrigger value="ativos">Ativos ({ativosCount})</TabsTrigger>
    <TabsTrigger value="inativos">Inativos ({inativosCount})</TabsTrigger>
  </TabsList>
</Tabs>
```

**Why this pattern:** Both tabs show the same modal content structure (form fields, etc.), just filtered by active/inactive status. The content is not switched; it's filtered.

**Note:** This is inside a modal dialog (`EditEmpresa` component). The tabs styling will match the design system even in modal context.

---

#### 2.4 UsuariosCliente

**File:** `src/app/components/UsuariosCliente.tsx`

**Current implementation:**
- Custom `TabToggle` component defined at lines 124-145
- Used at lines 366-373: `<TabToggle active={statusFilter} options={...} onChange={...} />`
- State: `const [statusFilter, setStatusFilter] = useState<UserStatus>('ativo')`
- Type: `type UserStatus = 'ativo' | 'inativo'`
- Tab labels include dynamic counts: `Ativos (${ativos})`, `Inativos (${inativos})`

**Migration approach:**
- **Pattern:** Filter Tabs (Pattern B)
- Replace `<TabToggle>` usage with `<Tabs>` wrapper + `<TabsList>` + 2 `<TabsTrigger>` elements
- **Do NOT use `<TabsContent>`** - this is a filter
- Remove entire `TabToggle` function definition (lines 124-145)
- Keep existing state variable and type
- Preserve dynamic count labels

**Tab configuration:**
```tsx
<Tabs value={statusFilter} onValueChange={(v) => setStatusFilter(v as UserStatus)}>
  <TabsList>
    <TabsTrigger value="ativo">Ativos ({ativos})</TabsTrigger>
    <TabsTrigger value="inativo">Inativos ({inativos})</TabsTrigger>
  </TabsList>
</Tabs>
```

**Why this pattern:** Both tabs show the same user table, just filtered by active/inactive status. The underlying content (table structure, columns, actions) is identical; only the data rows change based on the filter.

**Cleanup:** After migration, the `TabToggle` function can be safely deleted as it will no longer be used anywhere in the file.

---

### 3. Common Changes for All Components

**Imports:**
Add to each file:
```tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';
```

Note: Only import `TabsContent` for components using Pattern A (GerenciarTarefas, PersonalizarAssinatura). Pattern B components (Empresas, UsuariosCliente) only need `Tabs`, `TabsList`, `TabsTrigger`.

**Removals:**
- Delete custom button elements with onClick handlers
- Remove custom inline styles for tab buttons
- Remove conditional rendering logic (for Pattern A only)
- Delete `TabToggle` component (UsuariosCliente only)

**Preserved:**
- All state variables and types
- All state update logic
- Dynamic count calculations
- Existing filtering logic (for Pattern B)
- All other component functionality

### 4. Visual Specification

**Design system styles (from ui/tabs.tsx):**

**TabsList:**
- Background: `bg-muted` (light gray background)
- Height: `h-9` (36px)
- Padding: `p-[3px]` (3px inner padding)
- Border radius: `rounded-xl`
- Display: Inline flex with items centered

**TabsTrigger:**
- **Inactive state:**
  - Background: Transparent
  - Text color: `text-foreground` (normal text color)
  - Border: Transparent
  - Font weight: Medium
  
- **Active state (`data-[state=active]`):**
  - Background: `bg-card` (white/card background)
  - Text color: `text-foreground`
  - Border: Transparent
  - Font weight: Medium (same as inactive)
  - Slight elevation from muted background

- **Hover state:**
  - Subtle color transition
  
- **Focus state:**
  - Ring with `focus-visible:ring-ring/50`
  - Border with `focus-visible:border-ring`

**TabsContent:**
- Flex: `flex-1` (takes available space)
- Outline: None
- Additional classes can be added (e.g., `className="mt-0"` to remove top margin)

**Spacing:**
- Gap between tabs: Handled by TabsList internal spacing
- Gap between TabsList and content: `gap-2` from Tabs root (8px)

**Text:**
- Font size: `text-sm` (14px)
- Font weight: `font-medium`
- Icons: `size-4` (16px) when used alongside text

### 5. Implementation Order

Recommended implementation order (from simplest to most complex):

1. **UsuariosCliente** - Simple filter tabs, includes removing custom component
2. **Empresas** - Filter tabs in modal context
3. **GerenciarTarefas** - Content switcher with 3 tabs
4. **PersonalizarAssinatura** - Content switcher with 3 complex forms

Rationale: Start with filter tabs (simpler, no TabsContent) before tackling content switchers. Build confidence with simpler patterns first.

## Testing Strategy

### Build Verification
- Run TypeScript compilation after each migration
- Verify no type errors or missing imports
- Confirm design system Tabs components are properly imported

### Functional Testing Per Screen

**GerenciarTarefas:**
- All 3 tabs render with correct labels
- Clicking each tab shows the correct table (Recorrentes/Esporádicas/Fluxo)
- Only one table visible at a time
- Default tab is "Tarefas recorrentes"
- Tab state persists when using search/filters

**PersonalizarAssinatura:**
- All 3 tabs render with correct labels
- Clicking each tab shows the correct form (Assinatura/Endereço/SMTP)
- Only one form visible at a time
- Default tab is "Personalizar assinatura"
- Form state preserved when switching tabs

**Empresas (Edit Modal):**
- Tabs render inside edit modal with design system styling
- Tab counts update dynamically (Ativos/Inativos)
- Clicking tabs filters the displayed content
- Content below tabs updates based on selected filter
- Modal functionality unchanged (save/cancel buttons work)

**UsuariosCliente:**
- Tabs render with dynamic counts (Ativos/Inativos)
- Clicking tabs filters the user list correctly
- User count updates when filtering
- Search and empresa filter work together with tab filter
- No errors about missing TabToggle component
- TabToggle function successfully removed from file

### Visual Verification
- Tabs have muted background (design system style)
- Active tab has highlighted bg-card appearance (white on muted gray)
- Hover states work on inactive tabs (subtle color transition)
- Focus states show ring and border (keyboard navigation)
- Icons (if any) align properly with text at 16px size
- Consistent spacing and padding across all screens
- Tabs match the Figma design system spec: https://www.figma.com/design/Q2p5d5mIahsEPxXYMOA16V/Dom-DS-Core-Web?node-id=6129-2272

### Regression Testing
- All navigation still works (breadcrumbs, back buttons)
- No console errors or warnings in browser
- State management unchanged (tab switching doesn't reset other state)
- All existing functionality preserved (forms, tables, filtering, search)
- Modal dialogs still open/close correctly (Empresas)

## Impact and Risks

### Low Risk
- ✅ Using existing design system component (already proven in Tarefas)
- ✅ No changes to state management or data flow
- ✅ No changes to component props or APIs
- ✅ Each migration is independent and can be tested separately
- ✅ Easy to rollback individual migrations if needed

### Medium Risk
- ⚠️ **Pattern B (Filter tabs):** Ensuring filter logic still works without TabsContent wrapper
  - **Mitigation:** Tabs component is just a styled wrapper; state management is unchanged
  - **Testing:** Verify filtering works correctly in both Empresas and UsuariosCliente

- ⚠️ **Empresas modal context:** Tabs inside modal might have different styling needs
  - **Mitigation:** Design system tabs work in any context; modal is just another container
  - **Testing:** Verify tabs render correctly inside modal dialog

### Points of Attention
- **Dynamic counts:** Ensure tab labels with counts (e.g., "Ativos (7)") update correctly when data changes
- **Type safety:** Cast tab values when needed (e.g., `(v) => setTab(v as TabType)`)
- **Focus management:** Verify keyboard navigation works correctly with new tabs
- **Screen readers:** Radix UI Tabs includes proper ARIA attributes automatically

## Dependencies

- ✅ `@radix-ui/react-tabs` - Already installed (used by Tarefas)
- ✅ Design system Tabs component - Already exists at `src/app/components/ui/tabs.tsx`
- ✅ Design tokens - Already defined and in use
- ✅ Tailwind CSS - Already configured

**No new dependencies required.**

## References

- Design System Tabs: `src/app/components/ui/tabs.tsx`
- Figma Design Spec: https://www.figma.com/design/Q2p5d5mIahsEPxXYMOA16V/Dom-DS-Core-Web?node-id=6129-2272
- Existing Migration Example: `src/app/components/Tarefas.tsx` (lines 421-445 for tabs, 481-520 for content)
- Radix UI Tabs Documentation: https://www.radix-ui.com/primitives/docs/components/tabs

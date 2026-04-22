# Tarefas Layout Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restructure the Tarefas component to use the design system Tabs component and ensure proper three-block white layout over gray background.

**Architecture:** Replace custom tab buttons with Radix UI Tabs component while preserving all existing functionality. Organize content in three distinct white blocks (filters, tabs, content) with consistent spacing over a full-height gray background.

**Tech Stack:** React, TypeScript, Radix UI Tabs, Tailwind CSS

---

## File Structure

**Modified Files:**
- `src/app/components/Tarefas.tsx` - Main component requiring restructuring

**Referenced Files (no changes):**
- `src/app/components/ui/tabs.tsx` - Design system Tabs component
- `src/app/components/views/KanbanView.tsx` - Kanban visualization
- `src/app/components/views/CalendarioView.tsx` - Calendar visualization
- `src/app/components/views/FluxoView.tsx` - Flow visualization

---

## Task 1: Add Tabs Import and Adjust Container

**Files:**
- Modify: `src/app/components/Tarefas.tsx:1-15`

- [ ] **Step 1: Add Tabs import**

Add the import after existing lucide-react icons import:

```tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';
```

Expected location: After line 12 (after lucide-react imports)

- [ ] **Step 2: Find main container div**

Search for the line containing:
```tsx
<div className="flex flex-col h-full" style={{ background: 'var(--background)' }}>
```

This should be around line 281.

- [ ] **Step 3: Replace container with min-h-screen**

Replace:
```tsx
<div className="flex flex-col h-full" style={{ background: 'var(--background)' }}>
```

With:
```tsx
<div className="flex flex-col min-h-screen" style={{ background: '#f6f6f6' }}>
```

Changes:
- `h-full` → `min-h-screen` (ensures full viewport height)
- `var(--background)` → `#f6f6f6` (explicit gray background)

- [ ] **Step 4: Test in browser**

Run: `npm run dev` (if not running)
Navigate to: http://localhost:5173
Expected: Gray background should cover entire screen height

- [ ] **Step 5: Commit**

```bash
git add src/app/components/Tarefas.tsx
git commit -m "feat: add Tabs import and ensure full-height gray background"
```

---

## Task 2: Replace Custom Tab Buttons with Tabs Component

**Files:**
- Modify: `src/app/components/Tarefas.tsx:415-478`

- [ ] **Step 1: Locate the tabs header block**

Find the section starting with comment `{/* Tabs Header */}` around line 418.

The block contains four button elements for Kanban, Lista, Calendário, and Fluxo.

- [ ] **Step 2: Replace custom buttons with Tabs wrapper**

Replace the entire `<div className="flex items-center gap-2">` block (lines ~421-478) that contains the four tab buttons.

Old code starts with:
```tsx
<div className="flex items-center gap-2">
  <button
    onClick={() => setViewMode('kanban')}
    className="flex items-center gap-2 px-4 py-2 rounded-md transition-all"
```

Replace with:
```tsx
<Tabs value={viewMode} onValueChange={setViewMode}>
  <TabsList>
    <TabsTrigger value="kanban">
      <LayoutGrid size={16} />
      Kanban
    </TabsTrigger>
    <TabsTrigger value="lista">
      <List size={16} />
      Lista de tarefas
    </TabsTrigger>
    <TabsTrigger value="calendario">
      <Calendar size={16} />
      Calendário
    </TabsTrigger>
    <TabsTrigger value="fluxo">
      <ArrowRight size={16} />
      Fluxo de tarefas
    </TabsTrigger>
  </TabsList>
</Tabs>
```

Note: Keep the action buttons section (Exportar Excel, Filtros Avançados) that comes after - don't modify it yet.

- [ ] **Step 3: Verify in browser**

Expected: Tabs should render with design system styles (muted background, active tab with bg-card)
Test: Click each tab - viewMode should update and content should switch

- [ ] **Step 4: Commit**

```bash
git add src/app/components/Tarefas.tsx
git commit -m "feat: replace custom tab buttons with design system Tabs component"
```

---

## Task 3: Remove Duplicate Action Buttons

**Files:**
- Modify: `src/app/components/Tarefas.tsx:510-533`

- [ ] **Step 1: Locate duplicate buttons block**

After the tabs block, find the duplicate buttons section (around lines 510-533):

```tsx
<div className="flex items-center gap-2">
  <button
    className="flex items-center gap-1.5 px-3 py-1.5 rounded cursor-pointer hover:opacity-80 transition-opacity"
    style={{
      fontSize: 'var(--text-label)',
      color: 'var(--foreground)',
      border: '1px solid var(--border)',
      background: 'white',
    }}
  >
    <Download size={13} /> Exportar Excel
  </button>
  <button
    className="flex items-center gap-1.5 px-3 py-1.5 rounded cursor-pointer hover:opacity-80 transition-opacity"
    style={{
      fontSize: 'var(--text-label)',
      color: 'var(--foreground)',
      border: '1px solid var(--border)',
      background: 'white',
    }}
  >
    <Filter size={13} /> Filtros avançados
  </button>
</div>
```

- [ ] **Step 2: Delete entire duplicate block**

Remove the entire `<div className="flex items-center gap-2">` block containing the two buttons (Exportar Excel and Filtros avançados).

This block is separate from and comes after the main tabs header block.

- [ ] **Step 3: Verify in browser**

Expected: Only one set of action buttons visible (inside the white tabs block)
No duplicate buttons below the tabs

- [ ] **Step 4: Commit**

```bash
git add src/app/components/Tarefas.tsx
git commit -m "refactor: remove duplicate action buttons"
```

---

## Task 4: Wrap Content in Third White Block with TabsContent

**Files:**
- Modify: `src/app/components/Tarefas.tsx:536-540`

- [ ] **Step 1: Locate main content section**

Find the section with conditional rendering (around line 537):

```tsx
{/* Main Content */}
{viewMode === 'kanban' && <KanbanView />}
{viewMode === 'calendario' && <CalendarioView />}
{viewMode === 'fluxo' && <FluxoView />}
```

- [ ] **Step 2: Replace with third white block wrapper**

Replace the conditional rendering section with:

```tsx
{/* Bloco 3: Content Block */}
<div className="mx-6 mt-4 mb-6">
  <Tabs value={viewMode} onValueChange={setViewMode}>
    <TabsContent value="kanban" className="mt-0">
      <div className="bg-white rounded-lg border p-6" style={{ borderColor: 'var(--border)' }}>
        <KanbanView />
      </div>
    </TabsContent>
    
    <TabsContent value="lista" className="mt-0">
      <div className="bg-white rounded-lg border" style={{ borderColor: 'var(--border)' }}>
```

- [ ] **Step 3: Handle Lista view content**

The Lista view has complex structure (lines ~542-1560). Keep the entire content block but wrap it in TabsContent and update the container.

Find the existing block:
```tsx
{viewMode === 'lista' && (
  <div className="flex-1 flex overflow-hidden bg-white" ...>
    {/* Three-column structure with task list, details, and activity panel */}
  </div>
)}
```

Replace with:
```tsx
    <TabsContent value="lista" className="mt-0">
      <div className="flex-1 flex overflow-hidden bg-white rounded-lg border" 
           style={{ 
             borderColor: 'var(--border)',
             borderBottomLeftRadius: selectedTask ? '0' : '8px', 
             borderBottomRightRadius: selectedTask ? '0' : '8px' 
           }}>
        {/* IMPORTANT: Move the entire existing lista content here */}
        {/* This includes all three columns: */}
        {/* - Column 1: w-80 task list with groupedTasks.map */}
        {/* - Column 2: flex-1 task details panel */}
        {/* - Column 3: w-80 activity sidebar */}
        {/* Do NOT rewrite this content - just move it inside this div */}
      </div>
    </TabsContent>
```

Note: The existing lista content (the three `<div>` columns) should be moved unchanged into the new wrapper div. Only add `rounded-lg border` and `borderColor` to the container.

- [ ] **Step 4: Wrap remaining views**

Add TabsContent for calendario and fluxo:

```tsx
    <TabsContent value="calendario" className="mt-0">
      <div className="bg-white rounded-lg border p-6" style={{ borderColor: 'var(--border)' }}>
        <CalendarioView />
      </div>
    </TabsContent>
    
    <TabsContent value="fluxo" className="mt-0">
      <div className="bg-white rounded-lg border p-6" style={{ borderColor: 'var(--border)' }}>
        <FluxoView />
      </div>
    </TabsContent>
  </Tabs>
</div>
```

- [ ] **Step 5: Close the Tabs wrapper**

Ensure the `</Tabs>` closing tag is after all TabsContent elements and before the `</div>` container closing tag.

- [ ] **Step 6: Verify in browser**

Test each view:
- Click "Kanban" tab → KanbanView should appear in white block
- Click "Lista de tarefas" → Lista content should appear
- Click "Calendário" → CalendarioView in white block
- Click "Fluxo de tarefas" → FluxoView in white block

Expected: Content appears in separate white block below tabs block, with proper spacing

- [ ] **Step 7: Commit**

```bash
git add src/app/components/Tarefas.tsx
git commit -m "feat: wrap tab content in third white block using TabsContent"
```

---

## Task 5: Adjust Action Buttons Styling

**Files:**
- Modify: `src/app/components/Tarefas.tsx:480-507`

- [ ] **Step 1: Locate action buttons in tabs block**

Find the buttons "Exportar Excel" and "Filtros Avançados" inside the tabs header (around lines 481-506), within the `{/* Action Buttons */}` section.

- [ ] **Step 2: Update button styles**

Replace each button's style object:

Old style:
```tsx
style={{
  background: viewMode === 'kanban' ? 'var(--primary)' : 'white',
  color: viewMode === 'kanban' ? 'white' : 'var(--foreground)',
  border: '1px solid var(--border)',
  fontSize: 'var(--text-label)',
}}
```

New style (remove conditional styling):
```tsx
style={{
  background: 'white',
  color: 'var(--foreground)',
  border: '1px solid var(--border)',
  fontSize: 'var(--text-label)',
}}
```

Apply to both "Exportar Excel" and "Filtros Avançados" buttons.

- [ ] **Step 3: Verify in browser**

Expected: Both buttons have white background, foreground text color, and border outline style regardless of which tab is active.

- [ ] **Step 4: Commit**

```bash
git add src/app/components/Tarefas.tsx
git commit -m "style: apply consistent outline style to action buttons"
```

---

## Task 6: Visual Verification and Testing

**Files:**
- Test: `src/app/components/Tarefas.tsx` (no changes, verification only)

- [ ] **Step 1: Verify full-height gray background**

Open browser to http://localhost:5173
Navigate to Tarefas page

Check:
- Gray background (#f6f6f6) covers entire viewport height
- No white showing below content on short screens
- Scrollable if content exceeds viewport

- [ ] **Step 2: Verify three white blocks structure**

Check layout has three distinct white blocks:
1. First block: Filters (search + dropdowns)
2. Second block: Tabs + Action buttons
3. Third block: Selected tab content

Each block:
- Has white background
- Has rounded corners (rounded-lg)
- Has border
- Has 16px spacing (mt-4) between blocks
- Has 24px horizontal margin (mx-6)

- [ ] **Step 3: Verify tabs styling**

Check Tabs component:
- TabsList has muted background
- Active TabsTrigger has bg-card (white/highlighted)
- Inactive TabsTriggers are styled appropriately
- Icons appear next to text in each tab
- Smooth transition when switching tabs

- [ ] **Step 4: Verify action buttons**

Check buttons:
- "Exportar Excel" and "Filtros Avançados" appear in second white block
- Both have outline style (white bg, border, foreground text)
- No duplicate buttons visible elsewhere
- Buttons are aligned to the right, next to tabs

- [ ] **Step 5: Test all tab views**

Test navigation:
- Click "Kanban" → KanbanView renders in third block
- Click "Lista de tarefas" → Lista view with three columns appears
- Click "Calendário" → CalendarioView renders
- Click "Fluxo de tarefas" → FluxoView renders

Verify:
- Content switches correctly
- No errors in console
- Selected task state preserved when switching back to Lista
- Smooth transitions between views

- [ ] **Step 6: Test functionality**

Click through each view and verify:
- Filters still work (search, dropdowns)
- Task selection works in Lista view
- Action buttons are clickable (even if not fully functional)
- No broken layouts or overlapping elements
- Scrolling works properly in each view

- [ ] **Step 7: Responsive check**

Resize browser window:
- Test at 1920x1080
- Test at 1366x768
- Verify margins respect container width
- Verify tabs don't break or overflow

- [ ] **Step 8: Final commit if any fixes needed**

If minor adjustments were needed during testing:

```bash
git add src/app/components/Tarefas.tsx
git commit -m "fix: address visual issues found in testing"
```

Otherwise, this task completes without a commit.

---

## Implementation Complete

All tasks are finished when:
- [ ] Gray background covers full screen height
- [ ] Three white blocks visible with proper spacing
- [ ] Tabs component from design system in use
- [ ] No duplicate buttons
- [ ] All four views (Kanban, Lista, Calendário, Fluxo) work correctly
- [ ] Action buttons have correct styling
- [ ] All functionality preserved from original implementation

**Next Steps:** Review the implementation in the browser, test all interactions, and ensure the design matches the reference screenshot provided.

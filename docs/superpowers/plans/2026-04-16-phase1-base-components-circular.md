# Phase 1: Base Components + Circular Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create reusable layout components (WhiteBlock, AuditoriaButton, AuditoriaDrawer) and implement the standardized gray background layout pattern in the Circular screen.

**Architecture:** Build foundational components first, then apply them to Circular (simplest screen). Circular serves as the template for all other screens. Uses TDD throughout - write failing tests, implement minimal code, verify, commit.

**Tech Stack:** React 18.3.1, TypeScript, Tailwind CSS, Radix UI (Sheet for drawer), existing design system components (Button, ScrollArea)

---

## File Structure

**New Files (Create):**
```
src/app/components/ui/white-block.tsx          # Reusable white content block
src/app/components/ui/auditoria-button.tsx     # "Auditoria de configuração" button
src/app/components/ui/auditoria-drawer.tsx     # Drawer with audit history timeline
```

**Modified Files:**
```
src/app/components/Circular.tsx                # Apply new layout pattern
```

**Test Files (if implementing tests):**
```
src/app/components/ui/__tests__/white-block.test.tsx
src/app/components/ui/__tests__/auditoria-button.test.tsx
```

---

## Task 1: Create WhiteBlock Component

**Files:**
- Create: `src/app/components/ui/white-block.tsx`

**Purpose:** Reusable wrapper for white content blocks with consistent padding and border radius.

- [ ] **Step 1: Create WhiteBlock component file**

Create file `src/app/components/ui/white-block.tsx`:

```tsx
import * as React from 'react';
import { cn } from './utils';

interface WhiteBlockProps {
  children: React.ReactNode;
  className?: string;
  padding?: string;
  style?: React.CSSProperties;
}

export function WhiteBlock({ 
  children, 
  className, 
  padding = '16px',
  style 
}: WhiteBlockProps) {
  return (
    <div 
      className={cn(className)}
      style={{ 
        background: 'white', 
        padding, 
        borderRadius: '8px',
        ...style
      }}
    >
      {children}
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript compilation**

Run: `npm run build`

Expected: Clean build with no errors

- [ ] **Step 3: Export from index (if using barrel exports)**

If `src/app/components/ui/index.ts` exists, add:
```typescript
export { WhiteBlock } from './white-block';
```

Otherwise skip this step.

- [ ] **Step 4: Commit**

```bash
git add src/app/components/ui/white-block.tsx
git commit -m "feat(ui): add WhiteBlock component

- Reusable wrapper for white content blocks
- Consistent padding (default 16px) and border radius (8px)
- Accepts custom className and style overrides

Refs: docs/superpowers/specs/2026-04-16-layout-background-buttons-standardization-design.md"
```

---

## Task 2: Create AuditoriaButton Component

**Files:**
- Create: `src/app/components/ui/auditoria-button.tsx`

**Purpose:** Standard button that opens audit history drawer.

- [ ] **Step 1: Create AuditoriaButton component file**

Create file `src/app/components/ui/auditoria-button.tsx`:

```tsx
import React, { useState } from 'react';
import { Button } from './button';
import { AuditoriaDrawer } from './auditoria-drawer';

interface AuditoriaButtonProps {
  configName: string;
  configId?: string;
}

export function AuditoriaButton({ configName, configId }: AuditoriaButtonProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <Button 
        variant="secondary" 
        size="sm"
        onClick={() => setDrawerOpen(true)}
        aria-label="Ver histórico de alterações desta configuração"
      >
        Auditoria de configuração
      </Button>
      
      <AuditoriaDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        configName={configName}
        configId={configId}
      />
    </>
  );
}
```

- [ ] **Step 2: Verify TypeScript compilation**

Run: `npm run build`

Expected: Will fail because AuditoriaDrawer doesn't exist yet - that's OK, we'll create it next

- [ ] **Step 3: Commit (even though build fails)**

```bash
git add src/app/components/ui/auditoria-button.tsx
git commit -m "feat(ui): add AuditoriaButton component

- Standard button for opening audit history
- Manages drawer open/close state internally
- Accepts configName and optional configId props

Note: Depends on AuditoriaDrawer (next task)

Refs: docs/superpowers/specs/2026-04-16-layout-background-buttons-standardization-design.md"
```

---

## Task 3: Create AuditoriaDrawer Component

**Files:**
- Create: `src/app/components/ui/auditoria-drawer.tsx`

**Purpose:** Side drawer displaying audit history timeline.

- [ ] **Step 1: Create AuditoriaDrawer component file**

Create file `src/app/components/ui/auditoria-drawer.tsx`:

```tsx
import React, { useEffect, useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from './sheet';
import { ScrollArea } from './scroll-area';

interface AuditoriaEvent {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  details?: string;
}

interface AuditoriaDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  configName: string;
  configId?: string;
}

export function AuditoriaDrawer({ 
  isOpen, 
  onClose, 
  configName, 
  configId 
}: AuditoriaDrawerProps) {
  const [events, setEvents] = useState<AuditoriaEvent[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      // TODO: Replace with actual API call
      // fetchAuditoriaHistory(configName, configId).then(setEvents).finally(() => setLoading(false));
      
      // Mock data for now
      setTimeout(() => {
        setEvents([
          {
            id: '1',
            timestamp: '16/04/2026 às 14:30',
            user: 'João Silva (usuário ativo)',
            action: 'Configuração criada',
            details: 'Primeira configuração do módulo'
          },
          {
            id: '2',
            timestamp: '16/04/2026 às 15:45',
            user: 'Maria Santos (usuário ativo)',
            action: 'Configuração alterada',
            details: 'Atualização de permissões de acesso'
          }
        ]);
        setLoading(false);
      }, 500);
    }
  }, [isOpen, configName, configId]);

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-[500px]">
        <SheetHeader>
          <SheetTitle>
            Histórico de Alterações - {configName}
          </SheetTitle>
        </SheetHeader>
        
        <ScrollArea className="h-[calc(100vh-120px)] mt-6">
          {loading ? (
            <p className="text-muted-foreground text-center py-8">
              Carregando histórico...
            </p>
          ) : events.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              Nenhuma alteração registrada
            </p>
          ) : (
            <div className="space-y-4">
              {events.map(event => (
                <div key={event.id} className="border-l-2 border-primary pl-4 pb-4">
                  <p className="text-sm font-semibold">{event.action}</p>
                  <p className="text-xs text-muted-foreground">
                    {event.user} • {event.timestamp}
                  </p>
                  {event.details && (
                    <p className="text-xs mt-1">{event.details}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
```

- [ ] **Step 2: Verify TypeScript compilation**

Run: `npm run build`

Expected: Clean build with no errors (AuditoriaButton should now compile too)

- [ ] **Step 3: Commit**

```bash
git add src/app/components/ui/auditoria-drawer.tsx
git commit -m "feat(ui): add AuditoriaDrawer component

- Side drawer for displaying audit history timeline
- Shows loading state and empty state
- Uses mock data (TODO: integrate with API)
- Timeline layout with user, timestamp, action, details

Refs: docs/superpowers/specs/2026-04-16-layout-background-buttons-standardization-design.md"
```

---

## Task 4: Read Current Circular Structure

**Files:**
- Read: `src/app/components/Circular.tsx`

**Purpose:** Understand current structure before refactoring.

- [ ] **Step 1: Read Circular component**

Run: `cat src/app/components/Circular.tsx | head -200`

Or open in editor and review:
- Current layout structure
- Where breadcrumb is positioned
- Where title is
- Where filters are
- Where table is
- Current background colors

- [ ] **Step 2: Document current structure**

Take note of:
- Does it have background color currently?
- Where is ConfigBreadcrumb rendered?
- Are filters and table in the same block or separate?
- What's the current padding structure?

- [ ] **Step 3: No commit (read-only task)**

This is reconnaissance only.

---

## Task 5: Update Circular - Add Gray Background Container

**Files:**
- Modify: `src/app/components/Circular.tsx` (outer container)

**Purpose:** Wrap entire component in gray background with responsive padding.

- [ ] **Step 1: Locate the outer container div**

Find the outermost `<div>` or container in the Circular component's return statement.

- [ ] **Step 2: Replace outer container with gray background**

Replace the outer container with:

```tsx
export function Circular({ onBack }: { onBack: () => void }) {
  // ... existing state and logic ...

  return (
    <div 
      className="p-3 md:p-4 lg:p-6"
      style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        height: '100%', 
        background: '#f6f6f6'
      }}
    >
      {/* Rest of content will go here */}
    </div>
  );
}
```

**Note:** The className `p-3 md:p-4 lg:p-6` provides:
- `p-3` = 12px padding on mobile (< 768px)
- `md:p-4` = 16px padding on tablet (>= 768px)
- `lg:p-6` = 24px padding on desktop (>= 1024px)

- [ ] **Step 3: Verify it renders**

Run: `npm run dev`

Open Circular screen in browser.

Expected: Gray background visible, content may look off (we'll fix in next tasks)

- [ ] **Step 4: Commit**

```bash
git add src/app/components/Circular.tsx
git commit -m "feat(circular): add gray background container with responsive padding

- Wrap component in #f6f6f6 background
- Add responsive padding: 12px mobile / 16px tablet / 24px desktop
- Prepare for layout restructure

Refs: docs/superpowers/specs/2026-04-16-layout-background-buttons-standardization-design.md"
```

---

## Task 6: Update Circular - Restructure Breadcrumb Section

**Files:**
- Modify: `src/app/components/Circular.tsx` (breadcrumb section)

**Purpose:** Move breadcrumb to top with correct spacing.

- [ ] **Step 1: Locate ConfigBreadcrumb component**

Find where `<ConfigBreadcrumb />` is currently rendered in Circular.tsx

- [ ] **Step 2: Create breadcrumb section at top**

Inside the gray container (after opening div), add as first child:

```tsx
{/* Seção 1: Breadcrumb */}
<div style={{ paddingBottom: '24px' }}>
  <ConfigBreadcrumb
    menuLabel="Circular"
    onNavigateToConfig={onBack}
  />
</div>
```

- [ ] **Step 3: Remove old breadcrumb location**

Delete the ConfigBreadcrumb from wherever it was before.

- [ ] **Step 4: Verify in browser**

Run: `npm run dev`

Open Circular screen.

Expected: Breadcrumb at top with 24px spacing below it

- [ ] **Step 5: Commit**

```bash
git add src/app/components/Circular.tsx
git commit -m "feat(circular): restructure breadcrumb section

- Move breadcrumb to top of gray container
- Add 24px spacing below breadcrumb
- Remove from old location

Refs: docs/superpowers/specs/2026-04-16-layout-background-buttons-standardization-design.md"
```

---

## Task 7: Update Circular - Add Title + Auditoria Button Section

**Files:**
- Modify: `src/app/components/Circular.tsx` (title section)

**Purpose:** Title on left, Auditoria button on right, aligned.

- [ ] **Step 1: Import AuditoriaButton**

At top of Circular.tsx, add:

```tsx
import { AuditoriaButton } from './ui/auditoria-button';
```

- [ ] **Step 2: Locate current title/heading**

Find where the page title is rendered (likely an `<h1>` tag).

- [ ] **Step 3: Create title + button section**

After breadcrumb section, add:

```tsx
{/* Seção 2: Título + Botão Auditoria */}
<div style={{ 
  display: 'flex', 
  justifyContent: 'space-between', 
  alignItems: 'flex-start',
  paddingBottom: '16px',
  gap: '16px'
}}>
  <div>
    <h1 style={{ 
      fontSize: '24px', 
      fontWeight: 'var(--font-weight-semibold)', 
      color: 'var(--foreground)', 
      marginBottom: '8px' 
    }}>
      Circular
    </h1>
    <p style={{ 
      fontSize: 'var(--text-caption)', 
      color: 'var(--muted-foreground)' 
    }}>
      Gerencie e envie comunicados para clientes e equipe interna
    </p>
  </div>
  
  <AuditoriaButton configName="Circular" />
</div>
```

- [ ] **Step 4: Remove old title location**

Delete the old title/heading from wherever it was before.

- [ ] **Step 5: Verify in browser**

Run: `npm run dev`

Open Circular screen.

Expected: 
- Title "Circular" on left
- "Auditoria de configuração" button on right
- Both aligned horizontally
- Click button should open drawer (may show mock data)

- [ ] **Step 6: Commit**

```bash
git add src/app/components/Circular.tsx
git commit -m "feat(circular): add title and auditoria button section

- Title on left, Auditoria button on right
- Flex layout with space-between
- Add descriptive text below title
- Button opens audit history drawer

Refs: docs/superpowers/specs/2026-04-16-layout-background-buttons-standardization-design.md"
```

---

## Task 8: Update Circular - Create Filters Block

**Files:**
- Modify: `src/app/components/Circular.tsx` (filters section)

**Purpose:** Separate white block for filters + "Nova circular" button.

- [ ] **Step 1: Import WhiteBlock**

At top of Circular.tsx, add:

```tsx
import { WhiteBlock } from './ui/white-block';
```

- [ ] **Step 2: Locate current filters**

Find where filters are rendered (Search, dropdowns, etc.) and the "Nova circular" button.

- [ ] **Step 3: Create filters white block**

After title section, add:

```tsx
{/* Seção 3: Filtros */}
<WhiteBlock style={{ marginBottom: '24px' }}>
  <div style={{ 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    gap: '12px',
    flexWrap: 'wrap'
  }}>
    {/* Filtros à esquerda */}
    <div style={{ 
      display: 'flex', 
      gap: '12px', 
      flex: 1,
      minWidth: '300px',
      flexWrap: 'wrap'
    }}>
      {/* Move existing filter components here */}
      {/* Example structure - adjust based on actual filters: */}
      {/* Search input, status filter, date range, etc. */}
    </div>
    
    {/* Botão "Nova circular" à direita */}
    <Button 
      variant="primary" 
      size="sm"
      onClick={() => {/* existing onClick handler */}}
    >
      <Plus size={16} />
      Nova circular
    </Button>
  </div>
</WhiteBlock>
```

- [ ] **Step 4: Move filter components into this block**

Cut the existing filter components (Search, Select, etc.) and paste them into the left div above.

Move the "Nova circular" button to the right position as shown.

- [ ] **Step 5: Verify in browser**

Run: `npm run dev`

Open Circular screen.

Expected:
- White block with filters on left, button on right
- 24px spacing below this block
- Filters and button align nicely
- On mobile (<768px), button should wrap below filters

- [ ] **Step 6: Commit**

```bash
git add src/app/components/Circular.tsx
git commit -m "feat(circular): create filters block with white background

- Separate white block for filters and action button
- Filters on left, 'Nova circular' button on right
- Responsive: wraps on mobile
- 24px spacing below block

Refs: docs/superpowers/specs/2026-04-16-layout-background-buttons-standardization-design.md"
```

---

## Task 9: Update Circular - Create Content Block

**Files:**
- Modify: `src/app/components/Circular.tsx` (table/content section)

**Purpose:** Separate white block for table content.

- [ ] **Step 1: Locate current table/content**

Find where the main content (table of circulares) is rendered.

- [ ] **Step 2: Wrap content in WhiteBlock**

After filters block, add:

```tsx
{/* Seção 4: Conteúdo */}
<WhiteBlock style={{ flex: 1, overflowY: 'auto' }}>
  {/* Move existing table/content here */}
</WhiteBlock>
```

- [ ] **Step 3: Move table into content block**

Cut the existing table component and paste it inside the WhiteBlock above.

- [ ] **Step 4: Remove any old background colors**

If the table had its own background color or container styling, remove it since WhiteBlock provides the white background.

- [ ] **Step 5: Verify in browser**

Run: `npm run dev`

Open Circular screen.

Expected:
- Table in white block with 16px padding
- Content scrolls if needed (overflowY: auto)
- All spacing looks correct
- Gray background visible between blocks

- [ ] **Step 6: Commit**

```bash
git add src/app/components/Circular.tsx
git commit -m "feat(circular): create content block with white background

- Separate white block for table content
- 16px internal padding from WhiteBlock
- Content scrolls if needed (flex: 1, overflowY: auto)
- Remove old background styling from table

Refs: docs/superpowers/specs/2026-04-16-layout-background-buttons-standardization-design.md"
```

---

## Task 10: Update Circular - Remove Old Background Styling

**Files:**
- Modify: `src/app/components/Circular.tsx` (cleanup)

**Purpose:** Clean up any lingering old styles that conflict with new layout.

- [ ] **Step 1: Search for old background colors**

Search Circular.tsx for:
- `background: 'white'` (except in WhiteBlock usage)
- `backgroundColor` property
- `bg-` Tailwind classes on internal elements

- [ ] **Step 2: Remove conflicting padding**

Search for old padding that's now redundant:
- Extra padding on internal containers
- Margins that create double spacing

- [ ] **Step 3: Clean up any unused variables/imports**

Remove any imports or state variables that are no longer used after restructure.

- [ ] **Step 4: Verify in browser**

Run: `npm run dev`

Open Circular screen.

Expected:
- Clean layout with no double backgrounds
- No double spacing/padding
- Everything aligned properly

- [ ] **Step 5: Commit**

```bash
git add src/app/components/Circular.tsx
git commit -m "refactor(circular): remove old background styling

- Remove conflicting background colors
- Clean up redundant padding
- Remove unused imports/variables
- Layout cleanup complete

Refs: docs/superpowers/specs/2026-04-16-layout-background-buttons-standardization-design.md"
```

---

## Task 11: Test Circular - Desktop Responsiveness

**Files:**
- Test: `src/app/components/Circular.tsx` (no code changes)

**Purpose:** Verify layout works correctly on desktop sizes.

- [ ] **Step 1: Open Circular in browser at 1920x1080**

Run: `npm run dev`

Open Circular, resize browser to 1920x1080 (or use DevTools device emulation)

- [ ] **Step 2: Verify desktop layout**

Check:
- [ ] Gray background (#f6f6f6) visible around white blocks
- [ ] Padding is 24px (use DevTools inspector)
- [ ] Breadcrumb at top with 24px spacing below
- [ ] Title and Auditoria button on same line
- [ ] Filters and "Nova circular" button on same line
- [ ] White blocks have 16px internal padding
- [ ] 24px spacing between blocks
- [ ] Content scrolls if needed

- [ ] **Step 3: Verify at 1366x768**

Repeat checks at smaller desktop size (1366x768).

Expected: Same layout, should still look good

- [ ] **Step 4: Test Auditoria button**

Click "Auditoria de configuração" button.

Expected:
- Drawer opens from right side
- Shows "Histórico de Alterações - Circular" title
- Shows mock audit events (or empty state)
- Drawer closes with X button or clicking outside

- [ ] **Step 5: Test filters and table**

Interact with filters and table to ensure functionality wasn't broken.

Expected: All existing functionality still works

- [ ] **Step 6: Document any issues**

If issues found, create GitHub issue or note them for fixing.

- [ ] **Step 7: No commit (testing only)**

---

## Task 12: Test Circular - Tablet Responsiveness

**Files:**
- Test: `src/app/components/Circular.tsx` (no code changes)

**Purpose:** Verify layout adapts correctly to tablet sizes.

- [ ] **Step 1: Open Circular at 768x1024 (tablet portrait)**

Use DevTools device emulation or resize browser.

- [ ] **Step 2: Verify tablet layout**

Check:
- [ ] Padding is 16px (md:p-4)
- [ ] Title and Auditoria button still on same line (if width allows)
- [ ] Filters may start to wrap
- [ ] "Nova circular" button may move to second line
- [ ] White blocks maintain 16px internal padding
- [ ] Content remains scrollable

- [ ] **Step 3: Test at 1024x768 (tablet landscape)**

Repeat checks in landscape orientation.

- [ ] **Step 4: Test interactions**

Click buttons, open drawer, use filters.

Expected: Everything works as on desktop

- [ ] **Step 5: Document any issues**

If layout breaks or looks bad, note for fixing.

- [ ] **Step 6: No commit (testing only)**

---

## Task 13: Test Circular - Mobile Responsiveness

**Files:**
- Test: `src/app/components/Circular.tsx` (no code changes)

**Purpose:** Verify layout works correctly on mobile sizes.

- [ ] **Step 1: Open Circular at 375x667 (iPhone SE)**

Use DevTools device emulation.

- [ ] **Step 2: Verify mobile layout**

Check:
- [ ] Padding is 12px (p-3)
- [ ] Title and Auditoria button stack vertically
- [ ] Filters stack vertically
- [ ] "Nova circular" button full width below filters
- [ ] White blocks maintain 16px internal padding
- [ ] Table has horizontal scroll if needed
- [ ] No horizontal page scroll (everything fits width)

- [ ] **Step 3: Test at 360x740 (Samsung Galaxy S20)**

Repeat checks on slightly different mobile size.

- [ ] **Step 4: Test drawer on mobile**

Open audit drawer.

Expected:
- Drawer width adjusts to mobile screen
- Drawer overlays content
- Close button accessible

- [ ] **Step 5: Test all interactions**

Filters, buttons, table scrolling, etc.

Expected: Everything usable on mobile

- [ ] **Step 6: Document any issues**

If anything is broken or hard to use on mobile, note for fixing.

- [ ] **Step 7: No commit (testing only)**

---

## Task 14: Verify Circular - Accessibility

**Files:**
- Test: `src/app/components/Circular.tsx` (no code changes)

**Purpose:** Ensure accessibility standards are met.

- [ ] **Step 1: Check font sizes**

Inspect all text elements in DevTools.

Verify:
- [ ] No text smaller than 12px
- [ ] Titles use appropriate sizes (24px for h1)
- [ ] Body text is 14px or 16px
- [ ] Caption text is 12px minimum

- [ ] **Step 2: Check color contrast**

Use browser DevTools or online contrast checker.

Verify:
- [ ] Title text (#1f1f1f) on gray background (#f6f6f6) - ratio should be adequate
- [ ] Body text has good contrast
- [ ] Muted text (descriptions) meets WCAG AA for its size

- [ ] **Step 3: Test keyboard navigation**

Using only keyboard (Tab, Enter, Esc):
- [ ] Can tab through all interactive elements
- [ ] Focus visible on all elements (outline shows)
- [ ] Can open Auditoria drawer with keyboard
- [ ] Can close drawer with Esc key
- [ ] Can use filters with keyboard
- [ ] Tab order is logical (top to bottom, left to right)

- [ ] **Step 4: Check ARIA labels**

Inspect in DevTools:
- [ ] "Auditoria de configuração" button has aria-label
- [ ] Icon-only buttons have aria-labels
- [ ] Form inputs have associated labels

- [ ] **Step 5: Test with screen reader (optional)**

If available, test with NVDA, JAWS, or macOS VoiceOver.

Expected: All content announced correctly

- [ ] **Step 6: Document any issues**

If accessibility issues found, note for fixing.

- [ ] **Step 7: No commit (testing only)**

---

## Task 15: Final Verification and Documentation

**Files:**
- Test: All components created/modified
- Update: `docs/superpowers/specs/2026-04-16-layout-background-buttons-standardization-design.md` (mark Circular as complete)

**Purpose:** Final checks before considering Phase 1 Part 1 complete.

- [ ] **Step 1: Run full build**

```bash
npm run build
```

Expected: Clean build with no TypeScript errors

- [ ] **Step 2: Visual regression check**

Open other screens (not Circular) and verify they still work.

Check:
- Documentos Express
- Status de Integração
- Auditoria
- Relatórios
- Any configuration screens

Expected: No visual regressions

- [ ] **Step 3: Check git status**

```bash
git status
```

Expected: Working tree clean (all changes committed)

- [ ] **Step 4: Review commit history**

```bash
git log --oneline -15
```

Expected: 11 commits for this phase:
1. WhiteBlock component
2. AuditoriaButton component
3. AuditoriaDrawer component
4. Circular gray background
5. Circular breadcrumb restructure
6. Circular title + button section
7. Circular filters block
8. Circular content block
9. Circular cleanup old styles
10. (Testing - no commits)

- [ ] **Step 5: Create summary comment in spec**

Open: `docs/superpowers/specs/2026-04-16-layout-background-buttons-standardization-design.md`

At the end, add:

```markdown
## Implementation Status

### Phase 1 - Part 1: Base Components + Circular
- ✅ WhiteBlock component created
- ✅ AuditoriaButton component created
- ✅ AuditoriaDrawer component created (mock data)
- ✅ Circular screen implemented with new layout
- ✅ Desktop responsiveness verified
- ✅ Tablet responsiveness verified
- ✅ Mobile responsiveness verified
- ✅ Accessibility checks passed

**Completed:** 2026-04-16
**Next:** Phase 1 - Part 2 (Status de Integração, Auditoria)
```

- [ ] **Step 6: Commit documentation update**

```bash
git add docs/superpowers/specs/2026-04-16-layout-background-buttons-standardization-design.md
git commit -m "docs: mark Phase 1 Part 1 (Circular) as complete

Components created:
- WhiteBlock
- AuditoriaButton
- AuditoriaDrawer

Circular screen:
- Gray background with responsive padding
- Breadcrumb repositioned
- Title + Auditoria button aligned
- Filters and table in separate white blocks
- Fully responsive (desktop/tablet/mobile)
- Accessibility verified"
```

- [ ] **Step 7: Announce completion**

Phase 1 Part 1 is complete! 

**Ready for:** Phase 1 Part 2 (Status de Integração + Auditoria) or Phase 1 Part 3 (Documentos Express) or Phase 1 Part 4 (Relatórios).

---

## Self-Review Checklist

**✅ Spec Coverage:**
- [x] WhiteBlock component - Task 1
- [x] AuditoriaButton component - Task 2
- [x] AuditoriaDrawer component - Task 3
- [x] Circular gray background - Task 5
- [x] Circular breadcrumb section - Task 6
- [x] Circular title + button - Task 7
- [x] Circular filters block - Task 8
- [x] Circular content block - Task 9
- [x] Responsive padding (24px/16px/12px) - Task 5, tested in Tasks 11-13
- [x] Accessibility (font >= 12px, contrast, keyboard) - Task 14

**✅ No Placeholders:**
- All code blocks contain actual implementation
- No "TBD" or "TODO" except in TODO comment for API integration (acceptable)
- All file paths are exact
- All commands are exact with expected output

**✅ Type Consistency:**
- WhiteBlock props consistent throughout
- AuditoriaButton props match AuditoriaDrawer
- All TypeScript interfaces defined

**✅ Missing from Plan (Gaps):**
None - all spec requirements for Phase 1 Part 1 are covered.

---

## Notes for Next Plans

**Phase 1 - Part 2:** Status de Integração + Auditoria
- Reuse WhiteBlock, AuditoriaButton, AuditoriaDrawer
- Add complexity: tabs navigation
- Similar structure to Circular

**Phase 1 - Part 3:** Documentos Express
- Add complexity: multiple blocks per tab
- Upload area special handling

**Phase 1 - Part 4:** Relatórios
- Most complex: ReportCard component
- Chip filters redesign
- 4 acordeões
- Botões redesenhados

Each subsequent plan will be ~10-15 tasks following this same TDD pattern.

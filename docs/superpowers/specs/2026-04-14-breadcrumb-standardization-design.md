# Breadcrumb Standardization in Configuration Screens

**Date:** 2026-04-14  
**Status:** Approved

## Overview

Standardize the positioning and spacing of breadcrumbs across all configuration screens to ensure consistent visual hierarchy and spacing from the navigation bar.

**Current Problem:** Breadcrumbs are positioned inconsistently across configuration screens - some appear below the page title, spacing varies, and the visual hierarchy is unclear.

**Goal:** Move breadcrumbs above page titles and enforce consistent 24px spacing:
- 24px below the horizontal navigation bar (top spacing)
- 24px above the page title (bottom spacing)

## Scope

**13 configuration screen components** will be modified:

1. `src/app/components/GeradorTarefas.tsx`
2. `src/app/components/Empresas.tsx`
3. `src/app/components/PersonalizarAssinatura.tsx`
4. `src/app/components/GerenciarTarefas.tsx`
5. `src/app/components/UsuariosCliente.tsx`
6. `src/app/components/AdequacaoAgrupadores.tsx`
7. `src/app/components/FuncionariosEscritorio.tsx`
8. `src/app/components/TemplatesEmailWhatsapp.tsx`
9. `src/app/components/InboxConfig.tsx`
10. `src/app/components/ModelosDocumento.tsx`
11. `src/app/components/AgrupadorTarefasClientes.tsx`
12. `src/app/components/FeriadosHorarios.tsx`
13. `src/app/components/Responsabilidades.tsx`

## Current State Analysis

**Current Structure (Inconsistent):**

Most screens follow this pattern:
```tsx
<div style={{ paddingTop: '24px', paddingBottom: '16px' }}>
  <h1>Page Title</h1>
  <p>Description</p>
  <div className="mt-2">  {/* 8px margin-top */}
    <ConfigBreadcrumb ... />
  </div>
</div>
```

Some screens use:
```tsx
<div className="pt-6 pb-4">  {/* 24px top, 16px bottom */}
  <h1>Page Title</h1>
  <p>Description</p>
  <div className="mt-2">
    <ConfigBreadcrumb ... />
  </div>
</div>
```

**Problems:**
- Breadcrumb appears **below** title and description (incorrect semantic order)
- Spacing from navigation bar is inconsistent (some 24px, varies by implementation)
- Spacing above title is too small (only 8px via mt-2)
- No clear visual hierarchy

## Approach

**Selected Approach:** Direct Modification

Modify each of the 13 components individually following an exact standardized pattern. This approach was chosen because:
- The requirement is specifically about spacing standardization
- The change is straightforward and mechanical
- No need for new abstractions for this specific task
- Easy to verify consistency across all screens
- Least invasive approach

**Alternatives Considered:**
- **ConfigPageHeader Component:** Extract header (breadcrumb + title + description) into shared component - rejected as over-engineering for a spacing fix
- **ConfigPageLayout Wrapper:** Full layout component for all config pages - rejected as too invasive and reduces flexibility

## Standardized Component Structure

Every configuration screen will follow this exact structure:

```tsx
export function ConfigScreen({ onBack }: { onBack: () => void }) {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100%', 
      paddingLeft: '24px', 
      paddingRight: '24px', 
      background: 'var(--background)' 
    }}>
      
      {/* Section 1: Breadcrumb - 24px from top, 24px from title */}
      <div style={{ paddingTop: '24px', paddingBottom: '24px' }}>
        <ConfigBreadcrumb
          menuLabel="Menu Label"
          onNavigateToConfig={onBack}
          // Optional: itemLabel and onNavigateToMenu for 3-level breadcrumbs
        />
      </div>

      {/* Section 2: Title and Description */}
      <div style={{ paddingBottom: '16px' }}>
        <h1 style={{ 
          fontSize: '24px', 
          fontWeight: 'var(--font-weight-bold)', 
          color: 'var(--foreground)', 
          marginBottom: '8px' 
        }}>
          Page Title
        </h1>
        <p style={{ 
          fontSize: 'var(--text-caption)', 
          color: 'var(--muted-foreground)' 
        }}>
          Page description text
        </p>
      </div>

      {/* Section 3: Content Area - varies by page */}
      <div style={{ 
        flex: 1, 
        overflowY: 'auto', 
        padding: '24px', 
        background: 'white', 
        borderRadius: '8px',
        // ... other page-specific styles
      }}>
        {/* Page-specific content */}
      </div>
      
    </div>
  );
}
```

## Key Changes

**1. Breadcrumb Positioning:**
- **Before:** Inside title section, below description, with `className="mt-2"` (8px spacing)
- **After:** Separate section above title, with `paddingTop: '24px', paddingBottom: '24px'`

**2. Visual Hierarchy:**
```
[Horizontal Navigation Bar]
    ↓ 24px (paddingTop on breadcrumb container)
[Breadcrumb: Configurações > Menu Label]
    ↓ 24px (paddingBottom on breadcrumb container)
[Page Title]
    ↓ 8px (marginBottom on h1)
[Description]
    ↓ 16px (paddingBottom on title container)
[Content Area]
```

**3. Spacing Values:**
- Navigation to Breadcrumb: **24px** (via `paddingTop: '24px'` on breadcrumb container)
- Breadcrumb to Title: **24px** (via `paddingBottom: '24px'` on breadcrumb container)
- Title to Description: **8px** (via `marginBottom: '8px'` on h1)
- Description to Content: **16px** (via `paddingBottom: '16px'` on title container)

## Implementation Details

**For each of the 13 files:**

1. Locate the current page structure (usually starts with outer container div)
2. Identify where ConfigBreadcrumb is currently rendered
3. Restructure to follow the standardized pattern:
   - Create breadcrumb section with `paddingTop: '24px', paddingBottom: '24px'`
   - Move `<ConfigBreadcrumb />` into this section
   - Remove any `className="mt-2"` or similar spacing from breadcrumb
   - Ensure title section follows immediately after
   - Preserve all existing ConfigBreadcrumb props (menuLabel, itemLabel, callbacks)

4. Preserve all page-specific functionality:
   - State management
   - Event handlers
   - Content area implementation
   - Any custom styling in content area

**No Changes To:**
- ConfigBreadcrumb component itself (`src/app/components/ui/config-breadcrumb.tsx`)
- Business logic or functionality of any page
- Content area structure (tables, forms, etc.)
- Any components outside the 13 configuration screens

## Verification

**1. Visual Inspection:**
- Open each of the 13 configuration screens in browser
- Verify breadcrumb appears **above** the page title
- Verify visual order: Navigation Bar → Breadcrumb → Title → Description → Content

**2. Spacing Measurement (Browser DevTools):**
- For each screen, inspect the breadcrumb container
- Measure `paddingTop`: should be exactly **24px**
- Measure `paddingBottom`: should be exactly **24px**
- Measure distance from navigation bar to breadcrumb: should be **24px**
- Measure distance from breadcrumb to title: should be **24px**

**3. TypeScript Compilation:**
```bash
npm run build
```
Expected: Clean build with no TypeScript errors or warnings related to the modified files.

**4. Functional Testing:**
- Click breadcrumb links on each page → should navigate correctly
- All page-specific functionality should work unchanged
- No visual regressions in content areas
- Responsive behavior maintained at different viewport sizes

**5. Consistency Check:**
- All 13 screens use identical breadcrumb container structure
- All spacing values match exactly across all screens
- No page deviates from the standard pattern

## Success Criteria

- ✅ Breadcrumb positioned above title on all 13 screens
- ✅ Exactly 24px spacing below navigation bar (via paddingTop)
- ✅ Exactly 24px spacing above page title (via paddingBottom)
- ✅ Consistent structure across all configuration screens
- ✅ All existing functionality preserved
- ✅ TypeScript compilation succeeds
- ✅ Visual consistency verified in browser

## Out of Scope

- Modifying the ConfigBreadcrumb component itself
- Changing breadcrumb navigation behavior
- Updating non-configuration screens
- Refactoring into shared layout components
- Changing content area structures or styling
- Responsive design modifications (beyond preserving existing behavior)

## Rollback Plan

If issues are discovered after implementation:

1. Revert commits for affected files:
```bash
git revert <commit-hash-range>
```

2. Or selectively revert individual files:
```bash
git checkout <previous-commit> -- src/app/components/[ComponentName].tsx
```

3. The changes are isolated to spacing and structure - no data or business logic affected, so rollback is safe.

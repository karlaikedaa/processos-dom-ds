# Dashboard Spacing and Font Size Adjustments Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Adjust font sizes in the "Tarefas vencendo hoje" header and table width in the donut chart to match Figma specifications.

**Architecture:** Direct CSS class modifications in the VisaoGeral.tsx component. Two font size changes using Tailwind classes and one inline style width adjustment.

**Tech Stack:** React, TypeScript, Tailwind CSS

---

## File Map

**Modified Files:**
- `src/app/components/VisaoGeral.tsx` - Dashboard component with visual adjustments

**No new files created. No test files needed (visual-only CSS changes).**

---

### Task 1: Adjust Header Font Sizes

**Files:**
- Modify: `src/app/components/VisaoGeral.tsx:983` (title)
- Modify: `src/app/components/VisaoGeral.tsx:988` (number)

**Changes:**
- Title "Tarefas vencendo hoje": `text-sm` → `text-4xl` (14px → 36px)
- Number "800 pendentes": `text-2xl` → `text-lg` (24px → 18px)

---

- [ ] **Step 1: Read current code to locate exact lines**

Run:
```bash
cd "c:/00. Processos - DOM DS"
```

Read the file to confirm line numbers:
```bash
head -n 993 src/app/components/VisaoGeral.tsx | tail -n 12
```

Expected output should show lines 982-993 containing:
```tsx
<div className="text-sm font-semibold mb-0.5">Tarefas vencendo hoje</div>
...
<span className="text-2xl font-bold" style={{ color: colors.colors.orange['600'] }}>
  800 pendentes
</span>
```

---

- [ ] **Step 2: Update title font size class**

In `src/app/components/VisaoGeral.tsx` line 983, change:

**From:**
```tsx
<div className="text-sm font-semibold mb-0.5">Tarefas vencendo hoje</div>
```

**To:**
```tsx
<div className="text-4xl font-semibold mb-0.5">Tarefas vencendo hoje</div>
```

Use the Edit tool with exact string replacement:
- old_string: `<div className="text-sm font-semibold mb-0.5">Tarefas vencendo hoje</div>`
- new_string: `<div className="text-4xl font-semibold mb-0.5">Tarefas vencendo hoje</div>`

---

- [ ] **Step 3: Update number font size class**

In `src/app/components/VisaoGeral.tsx` line 988, change:

**From:**
```tsx
<span className="text-2xl font-bold" style={{ color: colors.colors.orange['600'] }}>
```

**To:**
```tsx
<span className="text-lg font-bold" style={{ color: colors.colors.orange['600'] }}>
```

Use the Edit tool with exact string replacement:
- old_string: `<span className="text-2xl font-bold" style={{ color: colors.colors.orange['600'] }}>`
- new_string: `<span className="text-lg font-bold" style={{ color: colors.colors.orange['600'] }}>`

---

- [ ] **Step 4: Verify changes with diff**

Run:
```bash
git diff src/app/components/VisaoGeral.tsx | grep -A2 -B2 "text-4xl\|text-lg"
```

Expected: See both changes in the diff output showing `text-sm` → `text-4xl` and `text-2xl` → `text-lg`

---

- [ ] **Step 5: Commit header font size changes**

```bash
git add src/app/components/VisaoGeral.tsx
git commit -m "feat(dashboard): adjust header font sizes

- Increase title 'Tarefas vencendo hoje' from 14px to 36px
- Decrease number '800 pendentes' from 24px to 18px
- Improves visual hierarchy per Figma specs

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

### Task 2: Adjust Donut Chart Table Width

**Files:**
- Modify: `src/app/components/VisaoGeral.tsx:1205`

**Changes:**
- Table width: `350px` → `720px`

---

- [ ] **Step 1: Read current code to locate exact line**

Read the file to confirm line 1205:
```bash
head -n 1210 src/app/components/VisaoGeral.tsx | tail -n 10
```

Expected output should show line 1205 containing:
```tsx
<div className="border rounded-lg overflow-hidden" style={{ borderColor: 'var(--border)', width: '350px', flexShrink: 0 }}>
```

---

- [ ] **Step 2: Update table width**

In `src/app/components/VisaoGeral.tsx` line 1205, change:

**From:**
```tsx
<div className="border rounded-lg overflow-hidden" style={{ borderColor: 'var(--border)', width: '350px', flexShrink: 0 }}>
```

**To:**
```tsx
<div className="border rounded-lg overflow-hidden" style={{ borderColor: 'var(--border)', width: '720px', flexShrink: 0 }}>
```

Use the Edit tool with exact string replacement:
- old_string: `<div className="border rounded-lg overflow-hidden" style={{ borderColor: 'var(--border)', width: '350px', flexShrink: 0 }}>`
- new_string: `<div className="border rounded-lg overflow-hidden" style={{ borderColor: 'var(--border)', width: '720px', flexShrink: 0 }}>`

---

- [ ] **Step 3: Verify changes with diff**

Run:
```bash
git diff src/app/components/VisaoGeral.tsx | grep "width:"
```

Expected: See the change showing `width: '350px'` → `width: '720px'`

---

- [ ] **Step 4: Commit table width change**

```bash
git add src/app/components/VisaoGeral.tsx
git commit -m "feat(dashboard): increase donut chart table width

- Change table width from 350px to 720px
- Provides more space for task details
- Improves readability per Figma specs

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

### Task 3: Visual Verification and Final Check

**Files:**
- Review: `src/app/components/VisaoGeral.tsx`

---

- [ ] **Step 1: Start development server**

Run:
```bash
npm run dev
```

Expected: Dev server starts successfully (usually on http://localhost:5173 or similar)

---

- [ ] **Step 2: Visual verification checklist**

Open the dashboard in browser and verify:

**Header "Tarefas vencendo hoje":**
- [ ] Title "Tarefas vencendo hoje" is **significantly larger** (36px)
- [ ] Number "800 pendentes" is **slightly smaller** (18px)
- [ ] Title is now visually more prominent than the number
- [ ] Orange color (#ff7033) is unchanged
- [ ] Hover effect still works on clickable elements

**Gráfico Donut Table:**
- [ ] Click on any legend item (e.g., "Atrasadas")
- [ ] Table appears and is **noticeably wider** (720px vs 350px)
- [ ] All three columns (Tarefa, Cliente, Data Meta) are visible
- [ ] Table content is readable and well-spaced
- [ ] Scrolling works if content exceeds max-height

**Other Components:**
- [ ] Cards de destaque (Tarefas abertas, Pontos de atenção, etc.) are **unchanged**
- [ ] No layout breaking or overlapping elements
- [ ] Page scrolling works normally

---

- [ ] **Step 3: Check for console errors**

Open browser DevTools Console and verify:
- No React errors
- No TypeScript compilation errors
- No CSS warnings

Expected: Clean console with no errors related to the changes

---

- [ ] **Step 4: Verify changes match spec**

Compare visual output against spec requirements:

**Spec Requirement** | **Implementation** | **Status**
--- | --- | ---
Title: 36px | `text-4xl` (2.25rem = 36px) | ✓
Number: 18px | `text-lg` (1.125rem = 18px) | ✓
Table width: 720px | `width: '720px'` | ✓
Cards unchanged | No modifications | ✓
Colors unchanged | No color modifications | ✓

---

- [ ] **Step 5: Final commit (if any fixes needed)**

If any issues were found and fixed during verification:

```bash
git add src/app/components/VisaoGeral.tsx
git commit -m "fix(dashboard): address visual verification feedback

[Describe any fixes made]

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

If no issues: Skip this step

---

- [ ] **Step 6: Stop development server**

Press `Ctrl+C` in the terminal where dev server is running

---

## Completion Checklist

- [ ] All code changes committed
- [ ] Visual verification passed
- [ ] No console errors
- [ ] All spec requirements met
- [ ] No unintended side effects on other components

---

## Rollback Instructions

If changes need to be reverted:

```bash
# Revert all commits from this implementation
git log --oneline | head -n 3  # Identify commit hashes
git revert <commit-hash-3> <commit-hash-2> <commit-hash-1>
```

Or restore specific changes:

```bash
# Restore header fonts
# Change text-4xl back to text-sm, text-lg back to text-2xl

# Restore table width
# Change width: '720px' back to width: '350px'
```

---

## Notes

- **No automated tests:** These are visual-only CSS changes. Testing is manual/visual.
- **No breaking changes:** All changes are non-functional styling adjustments.
- **Tailwind classes used:** `text-4xl` and `text-lg` are standard Tailwind utilities.
- **Inline style pattern:** Follows existing codebase pattern for width specification.

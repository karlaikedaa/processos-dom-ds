# Tabs Migration - Manual Testing Checklist

**Task:** Task 3 - Final Verification and Documentation  
**Date:** 2026-04-14  
**Tester:** _________________  
**Browser:** _________________  
**Viewport:** ________________

## Pre-Testing Setup

- [ ] Open the application in browser
- [ ] Open browser DevTools (F12)
- [ ] Have Figma design system open: [Tabs Specification](https://www.figma.com/design/Q2p5d5mIahsEPxXYMOA16V/Dom-DS-Core-Web?node-id=6129-2272)

## 1. Visual Verification - Empresas Page (Main Tabs)

**Location:** Navigate to Empresas page → "Ativos/Inativos" tabs

### Visual Measurements

- [ ] **Tab Height:** Measure with DevTools → Should be **40px**
  - Actual: ______px

- [ ] **Min Width:** Measure each tab → Should be minimum **80px**
  - "Ativos" width: ______px
  - "Inativos" width: ______px

- [ ] **Gap Between Tabs:** Measure spacing → Should be **8px**
  - Actual: ______px

### Active Tab Styling ("Ativos" is active by default)

- [ ] **Text Color:** Use color picker → Should be **#d64000**
  - Actual: ____________

- [ ] **Border:** Bottom border only → Should be **1.6px solid #d64000**
  - Border width: ______px
  - Border color: ____________
  - Border position: [ ] Bottom only

- [ ] **No Background:** Active tab should have NO background color change
  - Background color: ____________ (should be transparent/white)

### Inactive Tab Styling (Click "Inativos" to make "Ativos" inactive)

- [ ] **Text Color:** Should be muted/gray
  - Actual: ____________

- [ ] **Border:** Should be transparent (no visible border)
  - Border visible: [ ] Yes [ ] No

- [ ] **No Background:** Inactive tab should have NO background color
  - Background color: ____________ (should be transparent/white)

### Style Confirmation

- [ ] **Underline Style:** Tabs use underline style (bottom border only)
- [ ] **NOT Pill Style:** Tabs do NOT have rounded background shapes
- [ ] **NOT Background Style:** Tabs do NOT change background color on hover/active

## 2. Functional Testing - Empresas Page (Main Tabs)

### Tab Switching

- [ ] Click "Ativos" → Tab becomes active
  - Visual state changes: [ ] Yes [ ] No
  - Orange bottom border appears: [ ] Yes [ ] No

- [ ] Click "Inativos" → Tab becomes active
  - Visual state changes: [ ] Yes [ ] No
  - Orange bottom border appears: [ ] Yes [ ] No
  - "Ativos" becomes inactive: [ ] Yes [ ] No

### Data Filtering

- [ ] "Ativos" tab selected → Table shows 7 companies (E1-E7)
  - Companies shown: ______
  - All have status "ativo": [ ] Yes [ ] No

- [ ] "Inativos" tab selected → Table shows 3 companies (E8-E10)
  - Companies shown: ______
  - All have status "inativo": [ ] Yes [ ] No

### Other Functionality

- [ ] Search box still works correctly
  - Tested: [ ] Yes [ ] No

- [ ] Regime federal dropdown still filters correctly
  - Tested: [ ] Yes [ ] No

- [ ] "Nova Empresa" button is clickable
  - Clicked and works: [ ] Yes [ ] No

## 3. Visual Verification - Empresas Edit Modal Tabs

**Location:** Empresas page → Click any company row → Edit modal opens

### Visual Measurements

- [ ] **Tab Height:** Measure with DevTools → Should be **40px**
  - Actual: ______px

- [ ] **Min Width:** Each tab should be minimum **80px**
  - "Informações cadastrais": ______px
  - "Tarefas do cliente": ______px
  - "Senhas": ______px
  - "Certidões e certificados": ______px

- [ ] **Gap Between Tabs:** Should be **8px**
  - Actual: ______px

### Styling (same as main tabs)

- [ ] Active tab has #d64000 bottom border
- [ ] Active tab text color is #d64000
- [ ] Inactive tabs have transparent border
- [ ] No background color changes
- [ ] Underline style (not pill style)

## 4. Functional Testing - Empresas Edit Modal Tabs

- [ ] Click "Informações cadastrais" → Form displays
  - Displays correctly: [ ] Yes [ ] No

- [ ] Click "Tarefas do cliente" → Task list displays
  - Displays correctly: [ ] Yes [ ] No

- [ ] Click "Senhas" → Password list displays
  - Displays correctly: [ ] Yes [ ] No

- [ ] Click "Certidões e certificados" → Certificates list displays
  - Displays correctly: [ ] Yes [ ] No

- [ ] Tab switching is smooth with no glitches
  - Smooth: [ ] Yes [ ] No

- [ ] Modal SALVAR and CANCELAR buttons still work
  - Tested: [ ] Yes [ ] No

## 5. Visual Verification - GeradorTarefas Page

**Location:** Navigate to GeradorTarefas page → "Gerar tarefas/Remover tarefas" tabs

### Visual Measurements

- [ ] **Tab Height:** Should be **40px**
  - Actual: ______px

- [ ] **Min Width:** Each tab minimum **80px**
  - "Gerar tarefas": ______px
  - "Remover tarefas": ______px

- [ ] **Gap Between Tabs:** Should be **8px**
  - Actual: ______px

### Styling

- [ ] Active tab has #d64000 bottom border (1.6px)
- [ ] Active tab text is #d64000
- [ ] Inactive tab has transparent border
- [ ] No background color changes
- [ ] Underline style confirmed

## 6. Functional Testing - GeradorTarefas Page

### "Gerar tarefas" Tab

- [ ] Click "Gerar tarefas" → Generation form displays
  - Form visible: [ ] Yes [ ] No
  - All fields present: [ ] Yes [ ] No

- [ ] Fill out form (select day, month, department)
  - All fields work: [ ] Yes [ ] No

- [ ] Click "GERAR TAREFAS" button
  - Success message appears: [ ] Yes [ ] No

### "Remover tarefas" Tab

- [ ] Click "Remover tarefas" → Removal form displays
  - Form visible: [ ] Yes [ ] No
  - Warning banner shows: [ ] Yes [ ] No

- [ ] Select "Mês final" → Field value updates
  - Works: [ ] Yes [ ] No

- [ ] Select "Departamentos" (not "Selecione") → Field value updates
  - Works: [ ] Yes [ ] No

- [ ] Select "Tipo da tarefa" (not "Selecione") → Field value updates
  - Works: [ ] Yes [ ] No

- [ ] After selecting department and task type, buttons become enabled
  - "REMOVER TAREFAS ABERTAS E SUAS INTERAÇÕES" enabled: [ ] Yes [ ] No
  - "REMOVER TAREFAS ABERTAS SEM INTERAÇÕES" enabled: [ ] Yes [ ] No

- [ ] Click "REMOVER TAREFAS ABERTAS E SUAS INTERAÇÕES"
  - Confirmation message appears: [ ] Yes [ ] No

- [ ] Click "REMOVER TAREFAS ABERTAS SEM INTERAÇÕES"
  - Confirmation message appears: [ ] Yes [ ] No

## 7. Responsive Design Testing

### Desktop (1920px width)

- [ ] Empresas tabs display correctly
- [ ] GeradorTarefas tabs display correctly
- [ ] Edit modal tabs display correctly
- [ ] No layout issues

### Tablet (768px width)

- [ ] Empresas tabs display correctly
- [ ] GeradorTarefas tabs display correctly
- [ ] Edit modal tabs display correctly
- [ ] Text remains readable
- [ ] No horizontal overflow

### Mobile (375px width)

- [ ] Empresas tabs display correctly
  - Horizontal scroll works if needed: [ ] Yes [ ] No
- [ ] GeradorTarefas tabs display correctly
  - Horizontal scroll works if needed: [ ] Yes [ ] No
- [ ] Edit modal tabs display correctly
  - Horizontal scroll works if needed: [ ] Yes [ ] No
- [ ] Tabs remain clickable
- [ ] Text readable (may be truncated on very long labels)

## 8. Cross-Browser Testing

### Chrome/Edge

- [ ] All tabs render correctly
- [ ] Tab switching works
- [ ] Visual styling matches spec
- [ ] No console errors
- [ ] No layout issues

### Firefox

- [ ] All tabs render correctly
- [ ] Tab switching works
- [ ] Visual styling matches spec
- [ ] No console errors
- [ ] No layout issues

### Safari (if available)

- [ ] All tabs render correctly
- [ ] Tab switching works
- [ ] Visual styling matches spec
- [ ] No console errors
- [ ] No layout issues

## 9. Keyboard Navigation (Accessibility)

- [ ] Tab key moves between tabs
- [ ] Enter/Space activates tab
- [ ] Tab indicators visible on focus
- [ ] Works on Empresas page
- [ ] Works on GeradorTarefas page
- [ ] Works in Edit modal

## 10. Regression Testing

### No Functionality Lost

- [ ] All search/filter functionality works
- [ ] All forms work correctly
- [ ] All buttons are clickable
- [ ] All modals open/close correctly
- [ ] No errors in console
- [ ] No visual glitches

## Issues Found

**Issue 1:**
- Location: _______________________
- Description: _______________________
- Severity: [ ] Critical [ ] Major [ ] Minor
- Screenshot/Details: _______________________

**Issue 2:**
- Location: _______________________
- Description: _______________________
- Severity: [ ] Critical [ ] Major [ ] Minor
- Screenshot/Details: _______________________

**Issue 3:**
- Location: _______________________
- Description: _______________________
- Severity: [ ] Critical [ ] Major [ ] Minor
- Screenshot/Details: _______________________

## Overall Assessment

- [ ] **All visual specs met** (height, width, gap, colors, borders)
- [ ] **All functionality works** (no regressions)
- [ ] **Responsive design works** (all viewport sizes)
- [ ] **Cross-browser compatible** (all tested browsers)
- [ ] **Accessible** (keyboard navigation works)

### Final Result

- [ ] **PASS** - All tests passed, migration is successful
- [ ] **PASS WITH MINOR ISSUES** - Passes but has non-critical issues (list above)
- [ ] **FAIL** - Critical issues found (list above)

### Tester Notes

_______________________________________________________________________

_______________________________________________________________________

_______________________________________________________________________

---

**Completed by:** _________________  
**Date:** _________________  
**Time spent:** _________________  
**Sign-off:** _________________

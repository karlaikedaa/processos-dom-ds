# Design System Tabs - Usage Guide

## Quick Reference

This guide shows how to use the design system tabs component correctly.

## Import

```typescript
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';
```

## Basic Usage

```typescript
function MyComponent() {
  const [activeTab, setActiveTab] = useState<'tab1' | 'tab2'>('tab1');

  return (
    <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'tab1' | 'tab2')}>
      <TabsList>
        <TabsTrigger value="tab1">Tab 1</TabsTrigger>
        <TabsTrigger value="tab2">Tab 2</TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
```

## Real-World Examples

### Example 1: Simple Status Filter (Empresas - Main Page)

```typescript
type EmpresaStatus = 'ativo' | 'inativo';

function EmpresasPage() {
  const [statusFilter, setStatusFilter] = useState<EmpresaStatus>('ativo');
  
  return (
    <Tabs value={statusFilter} onValueChange={(v) => setStatusFilter(v as EmpresaStatus)}>
      <TabsList>
        <TabsTrigger value="ativo">Ativos (7)</TabsTrigger>
        <TabsTrigger value="inativo">Inativos (3)</TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
```

### Example 2: Section Navigation (Empresas - Edit Modal)

```typescript
type EditTab = 'cadastrais' | 'tarefas' | 'senhas' | 'certidoes';

function EditModal() {
  const [tab, setTab] = useState<EditTab>('cadastrais');
  
  return (
    <div>
      <Tabs value={tab} onValueChange={(v) => setTab(v as EditTab)}>
        <TabsList>
          <TabsTrigger value="cadastrais">Informações cadastrais</TabsTrigger>
          <TabsTrigger value="tarefas">Tarefas do cliente</TabsTrigger>
          <TabsTrigger value="senhas">Senhas</TabsTrigger>
          <TabsTrigger value="certidoes">Certidões e certificados</TabsTrigger>
        </TabsList>
      </Tabs>
      
      {/* Conditionally render content based on tab */}
      {tab === 'cadastrais' && <CadastraisForm />}
      {tab === 'tarefas' && <TarefasList />}
      {tab === 'senhas' && <SenhasList />}
      {tab === 'certidoes' && <CertidoesList />}
    </div>
  );
}
```

### Example 3: Action Tabs (GeradorTarefas)

```typescript
type MainTab = 'gerar' | 'remover';

function GeradorTarefas() {
  const [tab, setTab] = useState<MainTab>('gerar');
  
  return (
    <Tabs value={tab} onValueChange={(v) => setTab(v as MainTab)}>
      <TabsList>
        <TabsTrigger value="gerar">Gerar tarefas</TabsTrigger>
        <TabsTrigger value="remover">Remover tarefas</TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
```

## Component Props

### `Tabs`

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `value` | `string` | ✅ | Current active tab value |
| `onValueChange` | `(value: string) => void` | ✅ | Callback when tab changes |
| `className` | `string` | ❌ | Additional CSS classes |
| `children` | `React.ReactNode` | ✅ | Child components |

### `TabsList`

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `className` | `string` | ❌ | Additional CSS classes |
| `children` | `React.ReactNode` | ✅ | TabsTrigger components |

### `TabsTrigger`

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `value` | `string` | ✅ | Unique value for this tab |
| `className` | `string` | ❌ | Additional CSS classes |
| `children` | `React.ReactNode` | ✅ | Tab label/content |

### `TabsContent` (optional)

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `value` | `string` | ✅ | Tab value this content belongs to |
| `className` | `string` | ❌ | Additional CSS classes |
| `children` | `React.ReactNode` | ✅ | Content to show when tab is active |

## Design Specifications

When using tabs, they automatically follow these specifications:

- **Height:** 40px
- **Min Width:** 80px per tab
- **Gap:** 8px between tabs
- **Active Tab:**
  - Text color: #d64000 (orange)
  - Border: 1.6px solid #d64000 (bottom only)
- **Inactive Tab:**
  - Text color: var(--muted-foreground)
  - Border: transparent
- **Style:** Underline (not pill/background)

## Best Practices

### ✅ Do

- Use TypeScript types for tab values
- Cast the value in `onValueChange` to maintain type safety
- Use descriptive tab labels
- Keep tab labels concise (1-3 words)
- Show counts when relevant (e.g., "Ativos (7)")

```typescript
// Good: Type-safe
type TabValue = 'tab1' | 'tab2';
const [tab, setTab] = useState<TabValue>('tab1');
<Tabs value={tab} onValueChange={(v) => setTab(v as TabValue)}>
```

### ❌ Don't

- Don't use generic string types without casting
- Don't create custom tab components
- Don't override the design system styles
- Don't use pill-style or background-style tabs

```typescript
// Bad: Loses type safety
const [tab, setTab] = useState('tab1');
<Tabs value={tab} onValueChange={setTab}>
```

## Migration from Custom Tabs

If you have custom tab buttons, migrate them to use the design system:

### Before (Custom Implementation)

```typescript
// DON'T DO THIS
<div style={{ display: 'flex', gap: 8 }}>
  <button
    onClick={() => setTab('tab1')}
    style={{
      background: tab === 'tab1' ? 'var(--primary)' : 'white',
      color: tab === 'tab1' ? 'white' : 'var(--foreground)',
      // ... custom styles
    }}
  >
    Tab 1
  </button>
  <button
    onClick={() => setTab('tab2')}
    style={{
      background: tab === 'tab2' ? 'var(--primary)' : 'white',
      color: tab === 'tab2' ? 'white' : 'var(--foreground)',
      // ... custom styles
    }}
  >
    Tab 2
  </button>
</div>
```

### After (Design System)

```typescript
// DO THIS INSTEAD
<Tabs value={tab} onValueChange={(v) => setTab(v as TabType)}>
  <TabsList>
    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
    <TabsTrigger value="tab2">Tab 2</TabsTrigger>
  </TabsList>
</Tabs>
```

## Accessibility

The tabs component includes proper accessibility attributes:

- `data-state="active"` on active tabs
- `data-state="inactive"` on inactive tabs
- Proper button semantics
- Keyboard navigation support

## Responsive Behavior

The TabsList component handles overflow automatically:

- Horizontal scrolling on small screens
- `overflow-x-auto` with hidden scrollbar
- Touch-friendly scrolling on mobile

## Common Patterns

### Pattern 1: With Counts

```typescript
<TabsList>
  <TabsTrigger value="ativo">Ativos ({activeCount})</TabsTrigger>
  <TabsTrigger value="inativo">Inativos ({inactiveCount})</TabsTrigger>
</TabsList>
```

### Pattern 2: Conditional Rendering

```typescript
<Tabs value={tab} onValueChange={(v) => setTab(v as TabType)}>
  <TabsList>
    <TabsTrigger value="view1">View 1</TabsTrigger>
    <TabsTrigger value="view2">View 2</TabsTrigger>
  </TabsList>
</Tabs>

{tab === 'view1' ? <Component1 /> : <Component2 />}
```

### Pattern 3: With TabsContent (Alternative)

```typescript
<Tabs value={tab} onValueChange={(v) => setTab(v as TabType)}>
  <TabsList>
    <TabsTrigger value="view1">View 1</TabsTrigger>
    <TabsTrigger value="view2">View 2</TabsTrigger>
  </TabsList>
  
  <TabsContent value="view1">
    <Component1 />
  </TabsContent>
  <TabsContent value="view2">
    <Component2 />
  </TabsContent>
</Tabs>
```

## Troubleshooting

### Tab not changing when clicked

**Problem:** Tab value doesn't update when clicking.

**Solution:** Make sure you're casting the value in `onValueChange`:

```typescript
// Correct
<Tabs value={tab} onValueChange={(v) => setTab(v as TabType)}>
```

### Tabs don't look right

**Problem:** Tabs don't match the design system.

**Solution:** Don't override styles. Use the component as-is. If you need customization, consult with the design team.

### TypeScript errors

**Problem:** Type errors with tab values.

**Solution:** Define a type for your tab values:

```typescript
type MyTabType = 'tab1' | 'tab2';
const [tab, setTab] = useState<MyTabType>('tab1');
```

## Support

For questions or issues:

1. Check this guide first
2. Review the component source: `src/app/components/ui/tabs.tsx`
3. See examples in: `Empresas.tsx` and `GeradorTarefas.tsx`
4. Consult the Figma design system: [Tabs Specification](https://www.figma.com/design/Q2p5d5mIahsEPxXYMOA16V/Dom-DS-Core-Web?node-id=6129-2272)

---

**Last Updated:** 2026-04-14  
**Version:** 1.0

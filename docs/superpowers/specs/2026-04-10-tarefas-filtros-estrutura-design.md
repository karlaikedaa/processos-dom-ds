# Design: Correções de Filtros e Estrutura - Tela Tarefas

**Data:** 2026-04-10  
**Componente:** `src/app/components/Tarefas.tsx`  
**Tipo:** Refatoração de UI/UX  
**Abordagem:** Refatoração Completa

---

## Objetivo

Corrigir problemas de estrutura, estilos e componentes na tela de Tarefas para corresponder às especificações do Figma, focando em:

1. **Botões duplicados** - Remover duplicação de "Exportar Excel" e "Filtros Avançados"
2. **Dropdowns sem seta** - Adicionar ícone ChevronDown visível nos selects
3. **Estilo das abas** - Ajustar padding, font-size, border-radius das abas de navegação
4. **Background e estrutura** - Reorganizar em 3 blocos brancos separados no fundo cinza
5. **Posição dos botões** - Ajustar espaçamento dos botões "Apontar" e "Nova tarefa"

---

## Escopo

### Componentes Afetados

- **Header da página** - Botões "Apontar" e "Nova tarefa"
- **Bloco de filtros** - Campo de busca + 4 dropdowns
- **Header de abas** - 4 abas de navegação + 2 botões de ação
- **Estrutura geral** - Reorganização de blocos

### O que NÃO será alterado

- Lógica de negócio (estados, handlers, funções)
- Conteúdo das views (KanbanView, CalendarioView, FluxoView, Lista)
- Props e interfaces TypeScript
- Mock data

---

## Especificação Detalhada

### 1. Estrutura de 3 Blocos

**Arquivo:** `src/app/components/Tarefas.tsx`

#### BLOCO 1: Header (direto no fundo cinza)

**Localização:** Logo após o `<div className="flex flex-col h-full">`

```tsx
<div className="px-6 pt-6 pb-4">
  <div className="flex items-center justify-between" style={{ paddingRight: '24px' }}>
    <div>
      <h1 style={{ fontSize: '24px', fontWeight: 'var(--font-weight-bold)', color: 'var(--foreground)' }}>
        Tarefas
      </h1>
      <p style={{ fontSize: 'var(--text-label)', color: 'var(--muted-foreground)', marginTop: '4px' }}>
        As tarefas exibidas por padrão se referem ao mês atual e estão ordenadas conforme a data meta.
      </p>
    </div>
    <div className="flex items-center gap-3">
      {/* Botões Apontar e Nova tarefa - ver seção 5 */}
    </div>
  </div>
</div>
```

**Características:**
- Background: `transparent` (sem card branco, direto no fundo cinza da página)
- Padding: `px-6 pt-6 pb-4`
- Margin-bottom: `0` (o gap vem do `mt-4` do próximo bloco)

---

#### BLOCO 2: Filtros (card branco separado)

```tsx
<div className="mx-6" style={{ marginTop: '16px' }}>
  <div className="bg-white rounded-lg px-6 py-4 border" style={{ borderColor: 'var(--border)' }}>
    <div className="flex items-center gap-3 flex-wrap">
      {/* Campo de busca */}
      <div className="flex-1 relative" style={{ minWidth: '250px', maxWidth: '400px' }}>
        <Search
          size={14}
          style={{
            position: 'absolute',
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--muted-foreground)',
          }}
        />
        <input
          type="text"
          placeholder="Buscar complemento/protocolo"
          className="w-full rounded-md px-10 py-2 outline-none"
          style={{
            border: '1px solid var(--border)',
            background: 'white',
            fontSize: 'var(--text-label)',
            color: 'var(--foreground)',
          }}
        />
      </div>
      
      {/* 4 Dropdowns com setas - ver seção 2 */}
    </div>
  </div>
</div>
```

**Características:**
- Background: `white`
- Border: `1px solid var(--border)`
- Border-radius: `8px`
- Padding: `px-6 py-4` (horizontal 24px, vertical 16px)
- Margin-top: `16px`

---

#### BLOCO 3: Tabs + Conteúdo (card branco separado)

```tsx
<div className="mx-6 mt-4">
  <div className="bg-white rounded-lg border" style={{ borderColor: 'var(--border)' }}>
    
    {/* BLOCO 3.1: Header de Abas */}
    <div className="px-6 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
      <div className="flex items-center justify-between">
        {/* Abas - ver seção 3 */}
        <div className="flex items-center gap-2">
          {/* 4 abas aqui */}
        </div>
        
        {/* Botões de ação - ver seção 4 */}
        <div className="flex items-center gap-2">
          {/* Exportar Excel e Filtros Avançados APENAS 1x AQUI */}
        </div>
      </div>
    </div>

    {/* BLOCO 3.2: Conteúdo das Abas */}
    <div className="flex-1 flex overflow-hidden bg-white" 
         style={{ 
           borderBottomLeftRadius: selectedTask ? '0' : '8px', 
           borderBottomRightRadius: selectedTask ? '0' : '8px' 
         }}>
      {viewMode === 'kanban' && <KanbanView />}
      {viewMode === 'calendario' && <CalendarioView />}
      {viewMode === 'fluxo' && <FluxoView />}
      {viewMode === 'lista' && (
        {/* Conteúdo da lista - mantém estrutura atual */}
      )}
    </div>

  </div>
</div>
```

**Características:**
- Margin-top: `16px` (mt-4)
- Card único que contém header E conteúdo
- **CRÍTICO:** Remover wrapper duplicado que estava causando botões duplicados

---

### 2. Dropdowns com ChevronDown

**Localização:** Dentro do BLOCO 2 (Filtros)

**Implementação para cada dropdown:**

```tsx
<div className="relative" style={{ minWidth: '150px' }}>
  <select
    className="w-full rounded-md px-3 py-2 outline-none"
    style={{
      border: '1px solid var(--border)',
      background: 'white',
      fontSize: 'var(--text-label)',
      color: 'var(--foreground)',
      paddingRight: '36px',
      appearance: 'none',
    }}
  >
    <option>Empresas: Todos</option>
    <option>Empresa ABC Ltda</option>
    <option>Empresa XYZ S/A</option>
  </select>
  <ChevronDown
    size={14}
    className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
    style={{ color: 'var(--muted-foreground)' }}
  />
</div>
```

**Repetir para os 4 dropdowns:**
1. Empresas: Todos
2. Responsável: Todos
3. Tarefas: Todos
4. Fluxo de tarefas: Todos

**CSS Crítico:**
- `appearance: none` - Remove seta nativa do select
- `paddingRight: '36px'` - Evita sobreposição do texto com ícone
- `pointer-events: none` no ChevronDown - Permite clicar no select
- `position: relative` no wrapper - Posiciona o ícone absoluto

---

### 3. Estilo das Abas

**Localização:** Dentro do BLOCO 3.1 (Header de Abas)

**Componente de Aba:**

```tsx
<button
  onClick={() => setViewMode('kanban')}
  className="flex items-center gap-2 px-4 py-2 rounded-md transition-all"
  style={{
    background: viewMode === 'kanban' ? 'var(--primary)' : 'white',
    color: viewMode === 'kanban' ? 'white' : 'var(--foreground)',
    border: `1px solid ${viewMode === 'kanban' ? 'var(--primary)' : 'var(--border)'}`,
    fontSize: 'var(--text-label)',
    fontWeight: 'var(--font-weight-semibold)',
    borderRadius: '6px',
  }}
>
  <LayoutGrid size={16} />
  Kanban
</button>
```

**Especificações:**

| Propriedade | Aba Ativa | Aba Inativa |
|-------------|-----------|-------------|
| Background | `var(--primary)` (#d64000) | `white` |
| Color | `white` | `var(--foreground)` |
| Border | `1px solid var(--primary)` | `1px solid var(--border)` |
| Padding | `8px 16px` | `8px 16px` |
| Font Size | `var(--text-label)` (14px) | `var(--text-label)` (14px) |
| Font Weight | `var(--font-weight-semibold)` (600) | `var(--font-weight-semibold)` (600) |
| Border Radius | `6px` | `6px` |
| Icon Size | `16px` | `16px` |
| Gap (icon-text) | `8px` | `8px` |

**4 Abas a implementar:**
1. Kanban (LayoutGrid icon)
2. Lista de tarefas (List icon)
3. Calendário (Calendar icon)
4. Fluxo de tarefas (ArrowRight icon)

---

### 4. Botões de Ação (Header das Abas)

**Localização:** Dentro do BLOCO 3.1, ao lado direito das abas

**IMPORTANTE:** Estes botões aparecem **APENAS 1 VEZ** aqui. Remover completamente a duplicação que estava fora do header.

```tsx
<div className="flex items-center gap-2">
  <button
    className="flex items-center gap-2 px-4 py-2 rounded-md transition-all"
    style={{
      background: 'white',
      color: 'var(--foreground)',
      border: '1px solid var(--border)',
      fontSize: 'var(--text-label)',
    }}
  >
    <Download size={16} />
    Exportar excel
  </button>
  <button
    className="flex items-center gap-2 px-4 py-2 rounded-md transition-all"
    style={{
      background: 'white',
      color: 'var(--foreground)',
      border: '1px solid var(--border)',
      fontSize: 'var(--text-label)',
    }}
  >
    <Filter size={16} />
    Filtros Avançados
  </button>
</div>
```

**Código a REMOVER (linhas 510-533 aproximadamente):**

```tsx
{/* REMOVER ESTE BLOCO INTEIRO */}
<div className="flex items-center gap-2">
  <button className="flex items-center gap-1.5 px-3 py-1.5...">
    <Download size={13} /> Exportar Excel
  </button>
  <button className="flex items-center gap-1.5 px-3 py-1.5...">
    <Filter size={13} /> Filtros avançados
  </button>
</div>
```

---

### 5. Botões do Topo (Header)

**Localização:** Dentro do BLOCO 1 (Header)

```tsx
<div className="flex items-center gap-3">
  <button
    className="flex items-center gap-2 px-4 py-2 rounded-md cursor-pointer hover:opacity-80 transition-opacity"
    style={{
      fontSize: 'var(--text-label)',
      color: 'var(--primary)',
      border: '1px solid var(--primary)',
      background: 'white',
      borderRadius: '6px',
    }}
  >
    <Clock size={14} /> Apontar
  </button>
  <button
    className="flex items-center gap-2 px-4 py-2 rounded-md cursor-pointer hover:opacity-90 transition-opacity"
    style={{
      fontSize: 'var(--text-label)',
      color: 'white',
      background: 'var(--primary)',
      border: 'none',
      fontWeight: 'var(--font-weight-semibold)',
      borderRadius: '6px',
    }}
  >
    <Plus size={14} /> Nova tarefa
  </button>
</div>
```

**Ajustes de espaçamento:**
- Gap entre botões: `12px` (era `8px` - ajustar de `gap-3` para ficar explícito)
- Padding interno: `8px 16px`
- Icon size: `14px`
- Border-radius: `6px`

---

## Padrão de Implementação

### Convenções Utilizadas

1. **Classes Tailwind** para layout e spacing (`flex`, `gap-3`, `px-6`, etc.)
2. **Inline styles** para cores e propriedades específicas (usando design tokens)
3. **Ícones** importados de `lucide-react`
4. **Design tokens** via `var(--token-name)` quando disponível

### Imports Necessários

Verificar se todos estes ícones estão importados no topo do arquivo:

```tsx
import {
  Search, Plus, Filter, Download, Clock,
  ChevronDown, LayoutGrid, List, Calendar, ArrowRight,
  // ... outros já existentes
} from 'lucide-react';
```

---

## Impacto Visual

### Antes
- Botões "Exportar Excel" e "Filtros Avançados" apareciam 2 vezes
- Dropdowns sem indicação visual de que são clicáveis (sem seta)
- Estrutura de blocos confusa (background cinza aplicado incorretamente)
- Abas com estilo inconsistente
- Espaçamento dos botões do topo inadequado

### Depois
- Botões de ação aparecem apenas 1 vez no header das abas
- Todos os dropdowns com ChevronDown visível
- 3 blocos brancos claramente separados no fundo cinza
- Abas com estilo consistente (border-radius, padding, cores)
- Botões do topo com espaçamento correto

---

## Validação

### Checklist Visual

- [ ] Página tem background cinza (#f6f6f6)
- [ ] 3 blocos brancos visíveis e separados
- [ ] Header SEM card branco (direto no fundo cinza)
- [ ] Bloco de filtros é um card branco separado
- [ ] Bloco de tabs+conteúdo é um card branco separado
- [ ] Todos os 4 dropdowns mostram ChevronDown
- [ ] Dropdowns são clicáveis (pointer-events correto)
- [ ] 4 abas com estilo correto (ativa/inativa)
- [ ] Botões "Exportar" e "Filtros Avançados" aparecem APENAS 1x
- [ ] Botões "Apontar" e "Nova tarefa" com gap de 12px
- [ ] Conteúdo das views renderiza dentro do Bloco 3

### Checklist Funcional

- [ ] Trocar de aba funciona (viewMode state)
- [ ] Dropdowns abrem e permitem seleção
- [ ] Campo de busca funciona
- [ ] Botões "Apontar" e "Nova tarefa" funcionam
- [ ] Botões "Exportar" e "Filtros Avançados" funcionam
- [ ] Views (Kanban, Lista, Calendário, Fluxo) renderizam corretamente

---

## Notas Técnicas

- **Sem breaking changes funcionais:** Apenas mudanças visuais/estruturais
- **Sem novos pacotes:** Usa apenas Tailwind e lucide-react já instalados
- **Compatibilidade:** Mantém toda a lógica de estado e handlers existente
- **Performance:** Zero impacto (apenas mudanças de markup e CSS)

---

## Referências

- Especificação Figma: `figma-frames-specs/02-TAREFAS-LISTA-COLAPSAVEIS.md`
- Especificação Geral: `figma-specs/FRAME-SPECS.md`
- Componente: `src/app/components/Tarefas.tsx`
- Design Tokens: `src/design-tokens.ts`

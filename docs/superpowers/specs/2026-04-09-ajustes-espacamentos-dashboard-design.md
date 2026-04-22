# Design: Ajustes de Espaçamentos e Tamanhos - Dashboard Visão Geral

**Data:** 2026-04-09  
**Componente:** `src/app/components/VisaoGeral.tsx`  
**Tipo:** Ajustes de UI (fontes e espaçamentos)

---

## Objetivo

Ajustar tamanhos de fonte e espaçamentos no dashboard "Visão Geral" para corresponder às especificações visuais do Figma, focando em três componentes específicos mostrados nas imagens de referência.

---

## Escopo

### Componentes Afetados

1. **Header "Tarefas vencendo hoje"** - Ajuste de tamanhos de fonte
2. **Gráfico Donut "Resumo de tarefas"** - Ajuste de largura da tabela
3. **Cards de destaque** - Sem alterações (manter valores atuais)

---

## Especificação Detalhada

### 1. Header "Tarefas vencendo hoje"

**Arquivo:** `src/app/components/VisaoGeral.tsx`  
**Linhas:** 982-993

#### Alterações de Fonte

| Elemento | Valor Atual | Novo Valor | Classe Atual | Nova Classe |
|----------|-------------|------------|--------------|-------------|
| Título "Tarefas vencendo hoje" | 14px | **36px** | `text-sm font-semibold` | `text-4xl font-semibold` |
| Número "800 pendentes" | 24px | **18px** | `text-2xl font-bold` | `text-lg font-bold` |

#### Código Atual
```tsx
<div className="text-sm font-semibold mb-0.5">Tarefas vencendo hoje</div>
<span className="text-2xl font-bold" style={{ color: colors.colors.orange['600'] }}>
  800 pendentes
</span>
```

#### Código Alterado
```tsx
<div className="text-4xl font-semibold mb-0.5">Tarefas vencendo hoje</div>
<span className="text-lg font-bold" style={{ color: colors.colors.orange['600'] }}>
  800 pendentes
</span>
```

---

### 2. Tabela do Gráfico Donut

**Arquivo:** `src/app/components/VisaoGeral.tsx`  
**Linha:** 1205

#### Alteração de Largura

| Propriedade | Valor Atual | Novo Valor |
|-------------|-------------|------------|
| Largura da tabela | 350px | **720px** |

#### Código Atual
```tsx
<div className="border rounded-lg overflow-hidden" style={{ borderColor: 'var(--border)', width: '350px', flexShrink: 0 }}>
```

#### Código Alterado
```tsx
<div className="border rounded-lg overflow-hidden" style={{ borderColor: 'var(--border)', width: '720px', flexShrink: 0 }}>
```

**Nota:** A tabela aparece dinamicamente quando o usuário clica em um item da legenda do gráfico donut.

---

### 3. Cards de Destaque

**Componentes:** Tarefas abertas, Pontos de atenção, Tarefas sujeitas à multa  
**Status:** **Sem alterações**

Todos os espaçamentos internos e externos permanecem como estão:
- Padding: `p-4` (16px)
- Espaçamentos internos: valores atuais mantidos

---

## Padrão de Implementação

### Convenções Utilizadas

Seguindo o padrão existente no componente:

1. **Tamanhos de fonte:** Classes Tailwind (`text-{size}`)
2. **Larguras fixas:** Inline styles quando já usado (`style={{ width: '...' }}`)
3. **Cores:** Inline styles com design tokens (`style={{ color: colors.colors.orange['600'] }}`)

### Classes Tailwind Utilizadas

- `text-4xl` → `font-size: 2.25rem` (36px)
- `text-lg` → `font-size: 1.125rem` (18px)

---

## Impacto Visual

### Header "Tarefas vencendo hoje"
- Título muito mais proeminente (36px vs 14px)
- Número ligeiramente menor (18px vs 24px)
- Hierarquia visual invertida: título > número

### Gráfico Donut
- Tabela de detalhes mais larga (720px vs 350px)
- Mais espaço para exibir informações das tarefas
- Melhor legibilidade em telas maiores

---

## Validação

### Checklist de Implementação

- [ ] Alterar classes do título em VisaoGeral.tsx:983
- [ ] Alterar classes do número em VisaoGeral.tsx:988
- [ ] Alterar largura inline style em VisaoGeral.tsx:1205
- [ ] Testar visualmente no navegador
- [ ] Verificar responsividade (se aplicável)
- [ ] Confirmar que cores e outros estilos permanecem inalterados

---

## Notas Técnicas

- **Sem breaking changes:** Alterações puramente visuais
- **Sem novos pacotes:** Usa apenas classes Tailwind existentes
- **Compatibilidade:** Mantém padrão atual do código
- **Performance:** Zero impacto (apenas mudanças de CSS)

---

## Referências

- Especificação Figma: `figma-frames-specs/01-VISAO-GERAL-DASHBOARD.md`
- Componente: `src/app/components/VisaoGeral.tsx`
- Design Tokens: `src/design-tokens.ts`

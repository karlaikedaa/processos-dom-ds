# Design: MultiSelectFilter Component - Filtros com Seleção Múltipla

**Data:** 2026-04-10  
**Componentes:** `src/app/components/ui/multi-select-filter.tsx` (novo), `src/app/components/Tarefas.tsx` (modificar)  
**Objetivo:** Substituir filtros HTML nativos por componente reutilizável do design system com seleção múltipla via checkboxes e exibição em badges laranjas

## Contexto

Atualmente, o bloco de filtros na tela Tarefas (linhas 322-413) usa elementos HTML nativos:
- `<input type="text">` para busca
- `<select multiple>` para os 4 filtros (Empresa, Responsável, Tarefa, Fluxo)

Esses elementos não seguem o design system e têm UX limitada. A referência do Figma mostra:
- Filtros com popover contendo tabela de checkboxes
- Itens selecionados aparecem como badges laranjas no trigger
- Formato "Item +N" quando há múltiplas seleções
- Link "Todas as empresas" para desmarcar tudo

## Requisitos

### Funcionais

**MultiSelectFilter Component:**
- Componente controlado (gerenciado pelo pai via props)
- Trigger exibe contagem de selecionados em formato badge laranja
- Click no trigger abre popover com:
  - Input de busca com ícone de lupa
  - Tabela com checkboxes para seleção múltipla
  - Colunas dinâmicas conforme configuração
  - Link de "limpar seleção" no rodapé
- Busca filtra itens em tempo real
- Seleção permanece após fechar popover

**Integração em Tarefas:**
- Substituir input de busca por componente Input do DS
- Substituir 4 selects nativos por 4 instâncias de MultiSelectFilter
- Manter layout flex com wrap
- Adicionar estados para gerenciar seleções

### Visuais

**Trigger Badge:**
- Background: `var(--primary)` (#d64000)
- Texto: `var(--primary-foreground)` (branco)
- Shape: `rounded-full` (pill)
- Padding: `px-3 py-1.5`
- Font: `var(--text-label)` (14px)
- Ícone X clicável para remover

**Estados do Trigger:**
- 0 selecionados: "Todas as empresas" (ou placeholder)
- 1 selecionado: Nome do item (ex: "NexGen")
- 2+ selecionados: "NomePrimeiro +N" (ex: "NexGen +2")

**Popover:**
- Width mínimo: 400px
- Max height da tabela: 300px com scroll
- Background: `var(--popover)`
- Border: `var(--border)`
- Shadow: `shadow-md`
- Padding: `p-4`

**Tabela:**
- Header: Background `var(--muted)`
- Hover em rows: `var(--accent)`
- Checkboxes: Componente Checkbox do DS
- Borders: `var(--border)`

## Abordagem Escolhida

**Componente Reutilizável MultiSelectFilter**

Criar um componente genérico que pode ser usado em qualquer lugar do app, não apenas em Tarefas. Isso garante:
- Consistência com design system
- Reutilização em outras telas
- Manutenção centralizada
- Type-safety com TypeScript

### Alternativas Consideradas

**Componente Inline:** Implementar lógica diretamente no Tarefas.tsx
- ❌ Rejeitada: Causa duplicação, dificulta manutenção

**Hook + Componente:** Separar lógica em hook `useMultiSelectFilter`
- ❌ Rejeitada: Adiciona complexidade desnecessária, duas camadas para entender

## Design Detalhado

### 1. Estrutura de Arquivos

**Novo arquivo:**
```
src/app/components/ui/multi-select-filter.tsx
```

**Arquivos modificados:**
```
src/app/components/Tarefas.tsx (linhas ~322-413)
```

**Dependências (já existentes):**
- `src/app/components/ui/input.tsx`
- `src/app/components/ui/popover.tsx`
- `src/app/components/ui/checkbox.tsx`
- `src/app/components/ui/badge.tsx`

### 2. TypeScript Interfaces

```tsx
interface MultiSelectFilterItem {
  id: string | number;
  [key: string]: any; // Permite propriedades customizadas
}

interface MultiSelectFilterColumn {
  key: string;      // Nome da propriedade no objeto (ex: "codigo", "nome")
  header: string;   // Texto exibido no header da coluna (ex: "Código", "Nome")
  width?: string;   // Largura opcional (ex: "80px", "1fr")
}

interface MultiSelectFilterProps {
  label: string;                              // Label do filtro (ex: "Empresa")
  placeholder: string;                        // Texto quando nada selecionado (ex: "Todas as empresas")
  items: MultiSelectFilterItem[];             // Array de todos os itens disponíveis
  selectedItems: MultiSelectFilterItem[];     // Array de itens selecionados
  onSelectionChange: (items: MultiSelectFilterItem[]) => void; // Callback quando seleção muda
  columns: MultiSelectFilterColumn[];         // Definição das colunas da tabela
  searchKeys?: string[];                      // Propriedades usadas na busca (default: todas)
  className?: string;                         // Classes CSS adicionais
  clearAllText?: string;                      // Texto do link limpar (default: "Todas as {label}s")
}
```

### 3. Arquitetura do Componente

```
MultiSelectFilter (componente controlado)
│
├── Trigger (Badge ou div estilizado)
│   ├── Texto: placeholder ou "Item +N"
│   └── Ícone chevron para indicar dropdown
│
└── Popover
    ├── PopoverTrigger (wrap do Trigger)
    └── PopoverContent
        ├── Input de busca
        │   ├── Ícone Search (posição absoluta à esquerda)
        │   └── Placeholder "Buscar"
        │
        ├── Tabela
        │   ├── Header Row
        │   │   ├── Checkbox (select all visível mas não implementado na v1)
        │   │   └── Colunas dinâmicas
        │   └── Body Rows (filtradas pela busca)
        │       ├── Checkbox (checked se item em selectedItems)
        │       └── Cells dinâmicas conforme columns
        │
        └── Footer
            └── Link "Todas as empresas" (limpar seleção)
```

### 4. Comportamento e Fluxo de Dados

#### 4.1 Estado Interno

```tsx
const [searchTerm, setSearchTerm] = useState('');
const [isOpen, setIsOpen] = useState(false);
```

**Nota:** O estado de seleção (`selectedItems`) é gerenciado pelo componente pai.

#### 4.2 Lógica de Busca

```tsx
const filteredItems = useMemo(() => {
  if (!searchTerm) return items;
  
  const keys = searchKeys || Object.keys(items[0] || {}).filter(k => k !== 'id');
  
  return items.filter(item => 
    keys.some(key => 
      String(item[key])
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    )
  );
}, [items, searchTerm, searchKeys]);
```

#### 4.3 Lógica de Seleção

```tsx
const handleToggleItem = (item: MultiSelectFilterItem) => {
  const isSelected = selectedItems.some(s => s.id === item.id);
  
  if (isSelected) {
    // Remove item
    onSelectionChange(selectedItems.filter(s => s.id !== item.id));
  } else {
    // Adiciona item
    onSelectionChange([...selectedItems, item]);
  }
};

const handleClearAll = () => {
  onSelectionChange([]);
};
```

#### 4.4 Formatação do Trigger Text

```tsx
const getTriggerText = () => {
  if (selectedItems.length === 0) {
    return placeholder; // "Todas as empresas"
  }
  
  if (selectedItems.length === 1) {
    // Usa primeira coluna não-id como nome de exibição
    const displayKey = columns[0].key;
    return selectedItems[0][displayKey];
  }
  
  // 2 ou mais: "NomePrimeiro +N"
  const displayKey = columns[0].key;
  const firstName = selectedItems[0][displayKey];
  const count = selectedItems.length - 1;
  return `${firstName} +${count}`;
};
```

#### 4.5 Interações do Usuário

**Abrir Popover:**
1. Usuário clica no trigger badge
2. `setIsOpen(true)` via Popover do Radix
3. Input de busca recebe focus automático
4. Tabela mostra todos os itens com checkboxes marcados conforme `selectedItems`

**Buscar:**
1. Usuário digita no input
2. `setSearchTerm(value)` atualiza estado
3. `filteredItems` recalcula automaticamente
4. Tabela re-renderiza com itens filtrados

**Selecionar Item:**
1. Usuário clica em checkbox ou row inteira
2. `handleToggleItem(item)` é chamado
3. Novo array é criado (adiciona ou remove item)
4. `onSelectionChange(newArray)` notifica o pai
5. Pai atualiza `selectedItems` prop
6. Componente re-renderiza com novo estado
7. Trigger text atualiza ("Item +N")

**Limpar Tudo:**
1. Usuário clica no link "Todas as empresas"
2. `handleClearAll()` é chamado
3. `onSelectionChange([])` notifica o pai
4. Trigger volta para placeholder

**Fechar Popover:**
1. Click fora do popover → Radix UI fecha automaticamente
2. Tecla Escape → Radix UI fecha automaticamente
3. Seleções persistem (não são perdidas)

### 5. Implementação Visual

#### 5.1 Trigger Badge

```tsx
<div className="relative inline-flex">
  {selectedItems.length > 0 && (
    <Badge 
      variant="default" 
      className="rounded-full px-3 py-1.5 cursor-pointer hover:opacity-90"
    >
      {getTriggerText()}
      <ChevronDown className="ml-2 size-4" />
    </Badge>
  )}
  
  {selectedItems.length === 0 && (
    <button 
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border"
      style={{
        borderColor: 'var(--border)',
        fontSize: 'var(--text-label)',
        color: 'var(--muted-foreground)'
      }}
    >
      {placeholder}
      <ChevronDown className="size-4" />
    </button>
  )}
</div>
```

**Estados visuais:**
- Selecionado: Badge laranja (`variant="default"`)
- Vazio: Button outline cinza
- Hover: `opacity-90` ou `hover:bg-accent`

#### 5.2 Popover Content

```tsx
<PopoverContent 
  className="w-[400px] p-4" 
  align="start"
  onOpenAutoFocus={(e) => {
    e.preventDefault();
    inputRef.current?.focus();
  }}
>
  {/* Input de busca */}
  <div className="relative mb-3">
    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
    <Input
      ref={inputRef}
      placeholder="Buscar"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="pl-9"
    />
  </div>
  
  {/* Tabela */}
  <div className="max-h-[300px] overflow-auto border rounded-md">
    <table className="w-full text-sm">
      <thead className="sticky top-0 bg-muted">
        <tr>
          <th className="w-10 p-2">
            <Checkbox disabled /> {/* Select all - não implementado na v1 */}
          </th>
          {columns.map(col => (
            <th key={col.key} className="p-2 text-left font-semibold">
              {col.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {filteredItems.map(item => {
          const isSelected = selectedItems.some(s => s.id === item.id);
          return (
            <tr 
              key={item.id}
              onClick={() => handleToggleItem(item)}
              className="cursor-pointer hover:bg-accent transition-colors"
            >
              <td className="p-2">
                <Checkbox checked={isSelected} />
              </td>
              {columns.map(col => (
                <td key={col.key} className="p-2 truncate">
                  {item[col.key]}
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
  
  {/* Footer */}
  <div className="mt-3 text-sm">
    <button
      onClick={handleClearAll}
      className="text-primary hover:opacity-80"
    >
      {clearAllText || `Todas as ${label.toLowerCase()}s`}
    </button>
  </div>
</PopoverContent>
```

#### 5.3 Design Tokens Utilizados

| Elemento | Token | Valor |
|----------|-------|-------|
| Badge background | `var(--primary)` | #d64000 |
| Badge text | `var(--primary-foreground)` | #ffffff |
| Popover background | `var(--popover)` | #ffffff |
| Border | `var(--border)` | #f2f2f2 |
| Muted background | `var(--muted)` | #e6e6e6 |
| Muted foreground | `var(--muted-foreground)` | #999999 |
| Accent (hover) | `var(--accent)` | #d64000 |
| Text size | `var(--text-label)` | 14px |

### 6. Integração no Componente Tarefas

#### 6.1 Imports Necessários

```tsx
import { Input } from './ui/input';
import { MultiSelectFilter } from './ui/multi-select-filter';
```

#### 6.2 Estados Adicionados

```tsx
// Estados para seleção de filtros
const [selectedEmpresas, setSelectedEmpresas] = useState<any[]>([]);
const [selectedResponsaveis, setSelectedResponsaveis] = useState<any[]>([]);
const [selectedTarefas, setSelectedTarefas] = useState<any[]>([]);
const [selectedFluxos, setSelectedFluxos] = useState<any[]>([]);
```

#### 6.3 Dados Mock

```tsx
const mockEmpresas = [
  { id: 1, codigo: '002', apelido: 'NexGen', nome: 'NexGen Soluções' },
  { id: 2, codigo: '003', apelido: 'Innova', nome: 'Innovate Tech' },
  { id: 3, codigo: '004', apelido: 'Acme', nome: 'Acme Corp' },
  { id: 4, codigo: '005', apelido: 'Aquarela d...', nome: 'Cores Brasil' },
];

const mockResponsaveis = [
  { id: 1, nome: 'Maria Silva', email: 'maria@example.com' },
  { id: 2, nome: 'João Pereira', email: 'joao@example.com' },
];

const mockTarefasFilter = [
  { id: 1, nome: 'DCTF Ago/25', tipo: 'Fiscal' },
  { id: 2, nome: 'REINF Out/25', tipo: 'Fiscal' },
];

const mockFluxos = [
  { id: 1, nome: 'Fluxo Fiscal' },
  { id: 2, nome: 'Fluxo Contábil' },
];
```

#### 6.4 Bloco de Filtros Atualizado

**Remover (linhas ~327-411):**
- Todo o conteúdo atual do `<div className="flex items-center gap-3 flex-wrap">`

**Adicionar:**

```tsx
<div className="flex items-center gap-3 flex-wrap">
  {/* Input de busca com componente do DS */}
  <Input 
    type="text"
    placeholder="Busque por complemento/protocolo"
    className="flex-1 min-w-[250px] max-w-[400px]"
  />
  
  {/* Filtros MultiSelect */}
  <MultiSelectFilter
    label="Empresa"
    placeholder="Todas as empresas"
    items={mockEmpresas}
    selectedItems={selectedEmpresas}
    onSelectionChange={setSelectedEmpresas}
    columns={[
      { key: 'codigo', header: 'Código', width: '80px' },
      { key: 'apelido', header: 'Apelido', width: '120px' },
      { key: 'nome', header: 'Nome', width: '1fr' },
    ]}
    searchKeys={['codigo', 'apelido', 'nome']}
  />
  
  <MultiSelectFilter
    label="Responsável"
    placeholder="Todos"
    items={mockResponsaveis}
    selectedItems={selectedResponsaveis}
    onSelectionChange={setSelectedResponsaveis}
    columns={[
      { key: 'nome', header: 'Nome' },
      { key: 'email', header: 'E-mail' },
    ]}
  />
  
  <MultiSelectFilter
    label="Tarefa"
    placeholder="Todas"
    items={mockTarefasFilter}
    selectedItems={selectedTarefas}
    onSelectionChange={setSelectedTarefas}
    columns={[
      { key: 'nome', header: 'Nome' },
      { key: 'tipo', header: 'Tipo' },
    ]}
  />
  
  <MultiSelectFilter
    label="Fluxo de tarefas"
    placeholder="Todos"
    items={mockFluxos}
    selectedItems={selectedFluxos}
    onSelectionChange={setSelectedFluxos}
    columns={[
      { key: 'nome', header: 'Fluxo' },
    ]}
  />
</div>
```

### 7. Acessibilidade

**Requisitos WCAG:**
- ✅ Trigger: `role="button"`, `aria-haspopup="dialog"`, `aria-expanded`
- ✅ Checkboxes: Radix UI fornece ARIA attributes automaticamente
- ✅ Tabela: Headers semânticos com `<thead>`, `<th>`
- ✅ Keyboard navigation:
  - Tab: Navega entre elementos
  - Space/Enter: Marca/desmarca checkbox
  - Escape: Fecha popover
  - Arrow keys: Navega pela tabela (comportamento nativo)
- ✅ Screen readers: Anunciam estado dos checkboxes e contagem de selecionados

### 8. Performance

**Otimizações:**

1. **Memoização de filteredItems:**
```tsx
const filteredItems = useMemo(() => {
  // lógica de filtro
}, [items, searchTerm, searchKeys]);
```

2. **Callback estável:**
```tsx
const handleToggleItem = useCallback((item) => {
  // lógica
}, [selectedItems, onSelectionChange]);
```

3. **Virtualização (futuro):**
- Se listas >100 itens, considerar `react-virtual` ou `react-window`
- Não implementado na v1

### 9. Validação e Testes

**Checklist Visual:**
- [ ] Badge laranja quando há seleções
- [ ] Formato "Item +N" correto para 2+ itens
- [ ] Placeholder quando nada selecionado
- [ ] Popover abre e fecha corretamente
- [ ] Tabela renderiza todas as colunas
- [ ] Checkboxes refletem estado de seleção
- [ ] Busca filtra itens em tempo real
- [ ] Link "Todas as empresas" limpa seleções
- [ ] Hover em rows muda background
- [ ] Scroll funciona quando >300px de altura

**Testes Funcionais:**
- [ ] Seleção/deseleção de items funciona
- [ ] Estado persiste ao fechar/abrir popover
- [ ] onSelectionChange notifica pai corretamente
- [ ] Busca funciona em todas as propriedades
- [ ] Limpar tudo remove todas as seleções
- [ ] Click fora fecha popover

**Testes de Integração:**
- [ ] Input de busca do DS funciona
- [ ] Todos os 4 filtros em Tarefas funcionam
- [ ] Estados independentes entre filtros
- [ ] Layout flex com wrap responsivo

### 10. Limitações e Trabalho Futuro

**Não incluído na v1:**
- Select all (checkbox no header da tabela)
- Virtualização para listas grandes
- Debounce na busca (busca é instantânea)
- Badges individuais removíveis no trigger (só mostra contagem)
- Ordenação de colunas
- Filtros avançados (range, etc)

**Possíveis melhorias futuras:**
- Adicionar prop `maxHeight` customizável
- Suporte a agrupamento de itens (SelectGroup)
- Modo "single select" (radio buttons)
- Exportação de seleções
- Memória de filtros (localStorage)

## Referências

- Design System Figma: https://www.figma.com/design/Q2p5d5mIahsEPxXYMOA16V/Dom-DS-Core-Web?node-id=6112-685
- Referência de comportamento: https://www.figma.com/design/Q2p5d5mIahsEPxXYMOA16V/Dom-DS-Core-Web?node-id=9008-5850
- Componentes do DS: `src/app/components/ui/`
- Radix UI Popover: https://www.radix-ui.com/primitives/docs/components/popover
- Radix UI Checkbox: https://www.radix-ui.com/primitives/docs/components/checkbox

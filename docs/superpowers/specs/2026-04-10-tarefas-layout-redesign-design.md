# Design: Reestruturação Visual da Tela de Tarefas

**Data:** 2026-04-10  
**Componente:** `src/app/components/Tarefas.tsx`  
**Objetivo:** Ajustar a estrutura visual e estilos da tela de tarefas para conformidade com o design system

## Contexto

A tela de tarefas atual possui uma estrutura básica com background cinza e blocos brancos, mas precisa de ajustes para:
1. Usar o componente `Tabs` do design system ao invés de botões customizados
2. Garantir que o background cinza cubra toda a altura da tela
3. Remover duplicação de botões de ação
4. Organizar o conteúdo das abas dentro de um terceiro bloco branco separado

## Requisitos

### Funcionais
- Manter todas as funcionalidades existentes (navegação entre visualizações, filtros, ações)
- Substituir botões de abas customizados pelo componente `Tabs` do design system
- Organizar layout em três blocos brancos distintos sobre fundo cinza

### Visuais
- Background cinza (#f6f6f6) deve cobrir 100% da altura da tela após o menu horizontal
- Três blocos brancos com bordas arredondadas e espaçamento consistente:
  1. Bloco de filtros (busca e dropdowns)
  2. Bloco de abas e botões de ação
  3. Bloco de conteúdo da aba selecionada
- Remover botões duplicados que aparecem fora do bloco de abas
- Aplicar estilos do design system nos botões "Exportar Excel" e "Filtros Avançados"

## Abordagem Escolhida

**Híbrida - Tabs do Design System + Estrutura Atual**

Substituir apenas a parte das abas pelo componente `Tabs` do design system, mantendo a estrutura geral do componente. Esta abordagem equilibra conformidade com o design system e minimiza riscos de quebrar funcionalidades existentes.

### Alternativas Consideradas

**Ajustes Cosméticos Mínimos:** Aplicar apenas estilos CSS sem usar componentes do design system.
- ❌ Rejeitada: Não garante conformidade com design system, menos manutenível

**Refatoração Completa:** Reestruturar todo o componente extraindo visualizações para componentes separados.
- ❌ Rejeitada: Mudanças muito amplas, maior risco, não necessário para os objetivos atuais

## Design Detalhado

### 1. Estrutura de Layout

Hierarquia de componentes:

```
<div> // Container principal - background cinza, min-h-screen
  │
  ├─ <div> // Header: Título + Botões de ação (fundo cinza)
  │   ├─ <h1> Tarefas
  │   ├─ <p> Descrição
  │   └─ <div> Botões: "Apontar" e "Nova tarefa"
  │
  ├─ <div> // Bloco 1 (branco): Filtros
  │   └─ Busca + Dropdowns (Empresa, Responsável, Tarefa)
  │
  ├─ <div> // Bloco 2 (branco): Abas + Botões de ação
  │   ├─ <Tabs> (componente do design system)
  │   │   └─ <TabsList>
  │   │       ├─ <TabsTrigger value="kanban"> Kanban
  │   │       ├─ <TabsTrigger value="lista"> Lista de tarefas
  │   │       ├─ <TabsTrigger value="calendario"> Calendário
  │   │       └─ <TabsTrigger value="fluxo"> Fluxo de tarefas
  │   └─ <div> Botões: "Exportar Excel", "Filtros Avançados"
  │
  └─ <div> // Bloco 3 (branco): Conteúdo da aba selecionada
      ├─ <TabsContent value="kanban"> <KanbanView />
      ├─ <TabsContent value="lista"> {/* Conteúdo da lista */}
      ├─ <TabsContent value="calendario"> <CalendarioView />
      └─ <TabsContent value="fluxo"> <FluxoView />
```

### 2. Componentes e Estilos

#### 2.1 Container Principal
```tsx
<div className="flex flex-col min-h-screen" style={{ background: '#f6f6f6' }}>
```
- `min-h-screen`: Garante altura mínima de 100vh
- Background: `#f6f6f6` (gray-100 do design system)

#### 2.2 Header (Título e Botões)
```tsx
<div className="px-6 pt-6 pb-4">
  <div className="flex items-center justify-between">
    {/* Título e botões de ação */}
  </div>
</div>
```
- Permanece sobre o fundo cinza
- Mantém estilos atuais dos botões "Apontar" e "Nova tarefa"

#### 2.3 Bloco 1 - Filtros
```tsx
<div className="mx-6 mt-4 bg-white rounded-lg px-6 py-4 border" 
     style={{ borderColor: 'var(--border)' }}>
  {/* Conteúdo de filtros existente */}
</div>
```
- Margin horizontal: 24px (mx-6)
- Margin top: 16px (mt-4)
- Padding: 24px horizontal, 16px vertical
- Background branco, bordas arredondadas (rounded-lg)

#### 2.4 Bloco 2 - Abas e Botões
```tsx
<div className="mx-6 mt-4 bg-white rounded-lg border" 
     style={{ borderColor: 'var(--border)' }}>
  <div className="px-6 py-4">
    <div className="flex items-center justify-between">
      <Tabs value={viewMode} onValueChange={setViewMode}>
        <TabsList>
          <TabsTrigger value="kanban">
            <LayoutGrid size={16} /> Kanban
          </TabsTrigger>
          <TabsTrigger value="lista">
            <List size={16} /> Lista de tarefas
          </TabsTrigger>
          <TabsTrigger value="calendario">
            <Calendar size={16} /> Calendário
          </TabsTrigger>
          <TabsTrigger value="fluxo">
            <ArrowRight size={16} /> Fluxo de tarefas
          </TabsTrigger>
        </TabsList>
      </Tabs>
      
      <div className="flex items-center gap-2">
        <button className="flex items-center gap-2 px-4 py-2 rounded-md"
                style={{
                  background: 'white',
                  color: 'var(--foreground)',
                  border: '1px solid var(--border)',
                  fontSize: 'var(--text-label)',
                }}>
          <Download size={16} /> Exportar Excel
        </button>
        <button className="flex items-center gap-2 px-4 py-2 rounded-md"
                style={{
                  background: 'white',
                  color: 'var(--foreground)',
                  border: '1px solid var(--border)',
                  fontSize: 'var(--text-label)',
                }}>
          <Filter size={16} /> Filtros Avançados
        </button>
      </div>
    </div>
  </div>
</div>
```

**Estilos dos botões de ação:**
- Background: `white`
- Border: `1px solid var(--border)`
- Color: `var(--foreground)`
- Border radius: `rounded-md`

#### 2.5 Bloco 3 - Conteúdo das Abas
```tsx
<div className="mx-6 mt-4 bg-white rounded-lg border" 
     style={{ borderColor: 'var(--border)' }}>
  <TabsContent value="kanban" className="p-6">
    <KanbanView />
  </TabsContent>
  
  <TabsContent value="lista" className="p-6">
    {/* Conteúdo atual da lista de tarefas */}
  </TabsContent>
  
  <TabsContent value="calendario" className="p-6">
    <CalendarioView />
  </TabsContent>
  
  <TabsContent value="fluxo" className="p-6">
    <FluxoView />
  </TabsContent>
</div>
```
- Cada `TabsContent` tem padding de 24px
- Apenas o conteúdo da aba ativa é renderizado (comportamento nativo do Radix Tabs)

#### 2.6 Remoção de Duplicações
Remover completamente o bloco de botões que aparece após o bloco de abas (aproximadamente linhas 510-533 do código atual):
```tsx
// REMOVER ESTE BLOCO:
<div className="flex items-center gap-2">
  <button>Exportar Excel</button>
  <button>Filtros avançados</button>
</div>
```

### 3. Gerenciamento de Estado

#### 3.1 Estados Existentes (Manter)
```tsx
const [viewMode, setViewMode] = useState<'kanban' | 'lista' | 'calendario' | 'fluxo'>('lista');
const [selectedTask, setSelectedTask] = useState<Tarefa | null>(mockTarefas[0]);
const [activeTab, setActiveTab] = useState<string>('informacoes');
const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
const [documentosOpen, setDocumentosOpen] = useState(false);
const [atividadesOpen, setAtividadesOpen] = useState(false);
const [checklistOpen, setChecklistOpen] = useState(false);
```

#### 3.2 Integração com Tabs
- O componente `<Tabs>` usa `value={viewMode}` para aba ativa
- `onValueChange={setViewMode}` atualiza o estado quando usuário troca de aba
- O estado `viewMode` sincroniza automaticamente com `<TabsContent>`

#### 3.3 Fluxo de Dados
1. Usuário clica em `<TabsTrigger>`
2. Radix UI chama `onValueChange` com o novo valor
3. `setViewMode` atualiza o estado
4. `<TabsContent>` correspondente se torna visível
5. Componente de visualização (KanbanView, etc.) é renderizado

**Sem mudanças na lógica de negócio** - apenas a estrutura visual muda.

### 4. Implementação

#### 4.1 Imports Necessários
```tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';
```

#### 4.2 Ordem de Implementação
1. Ajustar container principal (adicionar `min-h-screen`)
2. Substituir botões de abas pelo componente `<Tabs>`
3. Mover botões de ação para dentro do bloco de abas (se necessário)
4. Criar wrapper do terceiro bloco branco
5. Envolver cada visualização em `<TabsContent>`
6. Remover bloco de botões duplicados
7. Verificar espaçamentos entre blocos (16px de gap)

#### 4.3 Dependências
- ✅ `@radix-ui/react-tabs` - já instalado
- ✅ Componente `Tabs` - já existe em `src/app/components/ui/tabs.tsx`
- ✅ Design tokens - já definidos em `src/design-tokens.ts`
- ✅ Ícones (lucide-react) - já instalados

**Sem novas dependências necessárias.**

### 5. Validação e Testes

#### 5.1 Checklist Visual
Após implementação, verificar:
- [ ] Background cinza cobre toda altura da tela em diferentes resoluções
- [ ] Três blocos brancos visíveis e separados
- [ ] Espaçamento de 16px entre blocos
- [ ] Abas seguem estilo do design system (TabsList com fundo muted, TabsTrigger ativa com bg-card)
- [ ] Botões de ação no bloco correto (dentro do bloco 2)
- [ ] Sem botões duplicados visíveis
- [ ] Transição suave entre abas

#### 5.2 Testes Funcionais
- [ ] Navegação entre abas funciona (Kanban, Lista, Calendário, Fluxo)
- [ ] Estado `viewMode` sincroniza corretamente
- [ ] Conteúdo correto renderiza em cada aba
- [ ] Botões de filtro e ação permanecem funcionais
- [ ] Componentes de visualização (KanbanView, etc.) funcionam normalmente

#### 5.3 Responsividade
- [ ] Layout funciona em resoluções desktop padrão (1920x1080, 1366x768)
- [ ] Blocos brancos respeitam margin horizontal em telas menores
- [ ] Abas não quebram em telas estreitas

## Impacto e Riscos

### Baixo Risco
- ✅ Mudanças principalmente visuais/estruturais
- ✅ Lógica de negócio permanece intacta
- ✅ Componentes de visualização não são modificados
- ✅ Estados e gerenciamento de dados mantidos

### Pontos de Atenção
- Verificar se `TabsContent` preserva o estado dos componentes de visualização ao trocar abas
- Confirmar que a remoção do bloco duplicado não afeta nenhuma funcionalidade oculta
- Testar todas as visualizações após implementação

## Referências

- Design System: https://www.figma.com/design/Q2p5d5mIahsEPxXYMOA16V/Dom-DS-Core-Web?node-id=6129-2272
- Componente Tabs: `src/app/components/ui/tabs.tsx`
- Design Tokens: `src/design-tokens.ts`
- Screenshot de Referência: Fornecida pelo usuário mostrando estrutura de três blocos

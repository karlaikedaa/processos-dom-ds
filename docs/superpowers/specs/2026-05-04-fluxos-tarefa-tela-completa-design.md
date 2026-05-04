---
name: Fluxos de Tarefa - Migração para Tela Completa
description: Design técnico para transformar o drawer de edição de fluxos em uma tela completa com navegação via React Router
type: feature
date: 2026-05-04
status: approved
---

# Fluxos de Tarefa - Migração para Tela Completa

## Contexto

Atualmente, a edição/criação de fluxos de tarefa é feita em um drawer lateral (Sheet) de 700px de largura. Este design limita o espaço disponível, especialmente na aba "Etapas" que precisa exibir múltiplas colunas em layout Kanban.

## Objetivos

1. **Transformar drawer em tela completa** - Melhor aproveitamento de espaço
2. **Adicionar navegação com rotas dedicadas** - URLs compartilháveis e navegação nativa do browser
3. **Implementar breadcrumb navegável** - `Configurações > Fluxos de tarefa > [Nome do fluxo]`
4. **Manter padrão visual do sistema** - Breadcrumb → Título → WhiteBlocks
5. **Preservar todas as funcionalidades existentes** - Abas, formulários, validações

## Decisões de Design

### Abordagem Escolhida: React Router

**Por quê:**
- URLs compartilháveis e bookmarkáveis
- Navegação nativa do browser (botão voltar, refresh)
- Padrão da indústria para SPAs
- Facilita evolução futura (mais rotas, proteção de rotas)
- Melhor UX comparado a query params ou state management manual

**Trade-offs aceitos:**
- Adicionar dependência `react-router-dom` (~50kb gzipped)
- Refatoração do App.tsx (1-2 horas de setup inicial)
- Outros componentes de configuração eventualmente precisarão migrar

---

## Arquitetura

### Estrutura de Rotas

```
/
├── /visao-geral
├── /tarefas  
├── /auditoria
├── /circular
├── /status-integracao
├── /relatorios
├── /documentos-express
│
└── /configuracoes
    ├── /                              # Home de configurações
    ├── /funcionarios
    ├── /feriados
    ├── /empresas
    ├── /gerenciar-tarefas
    │
    └── /fluxos-de-tarefa              # NOVO
        ├── /                          # Lista de fluxos
        ├── /novo                      # Criar novo fluxo
        └── /:id                       # Editar fluxo (ex: /123)
```

### Mapeamento de URLs

| Ação | URL | Componente |
|------|-----|------------|
| Listar fluxos | `/configuracoes/fluxos-de-tarefa` | `FluxosDeTarefaLista` |
| Criar novo | `/configuracoes/fluxos-de-tarefa/novo` | `FluxoDetalhes` |
| Editar existente | `/configuracoes/fluxos-de-tarefa/123` | `FluxoDetalhes` |

---

## Estrutura de Componentes

### Organização de Arquivos

```
src/app/components/
├── FluxosDeTarefa.tsx              → RENOMEAR para FluxosDeTarefaLista.tsx
│
├── FluxoDetalhes/                   # NOVO - Container principal
│   ├── index.tsx                    # Main component
│   ├── FluxoHeader.tsx              # Breadcrumb + Título + Botões
│   ├── FluxoTabs.tsx                # Sistema de tabs
│   │
│   ├── tabs/
│   │   ├── DetalhesTab.tsx          # Formulário de detalhes
│   │   ├── EtapasTab.tsx            # Colunas Kanban de etapas
│   │   ├── ClientesTab.tsx          # Lista de clientes (checkboxes)
│   │   └── GeracaoTab.tsx           # Seletor mês/ano
│   │
│   └── components/
│       ├── EtapaColumn.tsx          # Coluna individual de etapa
│       ├── TarefaCard.tsx           # Card de tarefa
│       ├── AddTarefaModal.tsx       # Modal adicionar tarefa
│       └── ConfigEtapaModal.tsx     # Modal config etapa
```

### Hierarquia de Componentes

```
FluxoDetalhes (Container)
│
├── FluxoHeader
│   ├── Breadcrumb (navegável)
│   ├── Título + Subtítulo
│   └── Botões (CANCELAR / SALVAR)
│
├── FluxoTabs
│   └── TabsList (Detalhes | Etapas | Clientes* | Geração*)
│       * apenas para fluxos recorrentes
│
└── TabsContent
    │
    ├── DetalhesTab
    │   └── Formulário (Nome, Tipo, Frequência, etc.)
    │
    ├── EtapasTab
    │   ├── Header (título + botão "Nova Etapa")
    │   └── Scroll horizontal de colunas
    │       └── EtapaColumn[] (múltiplas colunas)
    │           ├── Header (ordem, nome, badge, ações)
    │           ├── TarefaCard[] (lista de tarefas)
    │           └── Botão "Adicionar tarefa"
    │
    ├── ClientesTab
    │   ├── Busca
    │   └── Lista com checkboxes (select all)
    │
    └── GeracaoTab
        ├── Aviso (área de risco)
        ├── Seletor Mês/Ano
        └── Info adicional
```

---

## Modelo de Dados

### Interface Principal

```typescript
interface Fluxo {
  id: number | 'novo';
  nome: string;
  tipo: 'recorrente' | 'esporadico';
  ativo: boolean;
  
  // Aba Detalhes
  metaTarefa?: 'abertura' | 'conclusao';
  frequencia?: 'semanal' | 'mensal' | 'trimestral' | 'anual';
  diaInicio?: number;
  diaSemana?: DiaSemana;
  competencia: number;
  considerarDiasUteis?: boolean;
  adiarFimSemana?: boolean;
  
  // Aba Etapas
  etapas: Etapa[];
  
  // Aba Clientes (apenas recorrente)
  clientesSelecionados?: number[];
  
  // Aba Geração (apenas recorrente)
  mesInicio?: number;
  anoInicio?: number;
  
  // Metadata
  criadoEm?: string;
  duracaoEstimada?: number;
}

interface Etapa {
  id: string;
  ordem: number;
  nome: string;
  tarefas: TarefaEtapa[];
  configuracoes: ConfigEtapa;
}

interface TarefaEtapa {
  id: string;
  tarefaId: number;              // ID da tarefa cadastrada no sistema
  nome: string;
  departamento: string;
  responsavelId: number;
  responsavelNome: string;
  aprovadorId?: number;
  aprovadorNome?: string;
}

interface ConfigEtapa {
  prazo?: number;                // em dias
  // Outras configurações a serem definidas conforme necessidade:
  // - Notificações automáticas?
  // - Dependências de outras etapas?
  // - Regras de aprovação?
  // Será expandido durante implementação com base em requisitos reais
}
```

---

## Fluxos de Interação

### 1. Criar Novo Fluxo

```
Usuário clica "NOVO FLUXO DE TAREFA" na lista
↓
navigate('/configuracoes/fluxos-de-tarefa/novo')
↓
FluxoDetalhes detecta id === 'novo'
↓
Inicializa estado vazio
↓
Renderiza formulário em branco
↓
Usuário preenche:
  - Aba Detalhes (nome, tipo, etc.)
  - Aba Etapas (cria colunas, adiciona tarefas)
  - [Se recorrente] Aba Clientes (seleciona clientes)
  - [Se recorrente] Aba Geração (define mês/ano)
↓
Clica SALVAR
↓
Validação (campos obrigatórios, etapas com nome, etc.)
↓
POST /api/fluxos
↓
Toast sucesso + navigate('/configuracoes/fluxos-de-tarefa')
```

### 2. Editar Fluxo Existente

```
Usuário clica no nome do fluxo na lista
↓
navigate('/configuracoes/fluxos-de-tarefa/123')
↓
FluxoDetalhes carrega dados via GET /api/fluxos/123
↓
Popula formulário com dados existentes
↓
Usuário modifica campos/etapas
↓
Clica SALVAR
↓
Validação
↓
PUT /api/fluxos/123
↓
Toast sucesso + navigate back
```

### 3. Adicionar Etapa

```
Usuário na aba Etapas
↓
Clica "+ Nova Etapa"
↓
Cria objeto Etapa:
  {
    id: generateId(),
    ordem: etapas.length + 1,
    nome: '',
    tarefas: [],
    configuracoes: {}
  }
↓
Adiciona ao array etapas[]
↓
Renderiza nova coluna vazia
↓
Usuário:
  - Nomeia a etapa (inline input ou editar)
  - Adiciona tarefas
  - Configura regras (modal)
```

### 4. Adicionar Tarefa à Etapa

```
Usuário clica "+ Adicionar tarefa" na coluna da etapa
↓
Abre AddTarefaModal
↓
Modal carrega:
  - Lista de tarefas cadastradas no sistema
  - Lista de funcionários (para responsável/aprovador)
↓
Usuário seleciona:
  - Tarefa
  - Responsável (obrigatório)
  - Aprovador (opcional)
↓
Clica "Adicionar"
↓
Cria TarefaEtapa e adiciona ao array etapa.tarefas[]
↓
Fecha modal
↓
Renderiza TarefaCard na coluna
```

### 5. Excluir Etapa

```
Usuário clica 🗑️ na etapa
↓
Se etapa tem tarefas:
  Confirma: "Etapa possui X tarefa(s). Deseja excluir?"
  ↓
  Se cancela: abort
↓
Remove etapa do array
↓
Renumera todas as etapas seguintes:
  etapas.map((e, index) => ({ ...e, ordem: index + 1 }))
↓
Re-renderiza colunas
↓
Toast: "Etapa excluída com sucesso"
```

### 6. Cancelar Edição

```
Usuário clica "CANCELAR"
↓
Se tem alterações não salvas (isDirty):
  Confirma: "Tem alterações não salvas. Sair mesmo assim?"
  ↓
  Se cancela: abort
↓
navigate('/configuracoes/fluxos-de-tarefa')
```

---

## Validações

### Antes de Salvar

```typescript
const validateFluxo = (fluxo: Fluxo): string[] => {
  const errors: string[] = [];
  
  // Nome obrigatório
  if (!fluxo.nome?.trim()) {
    errors.push('Nome é obrigatório');
  }
  
  // Validações para recorrente
  if (fluxo.tipo === 'recorrente') {
    if (!fluxo.frequencia) {
      errors.push('Frequência é obrigatória para fluxos recorrentes');
    }
    
    if (!fluxo.diaInicio && fluxo.frequencia !== 'semanal') {
      errors.push('Dia de início é obrigatório');
    }
    
    if (fluxo.frequencia === 'semanal' && !fluxo.diaSemana) {
      errors.push('Dia da semana é obrigatório');
    }
  }
  
  // Ao menos uma etapa
  if (fluxo.etapas.length === 0) {
    errors.push('Adicione ao menos uma etapa');
  }
  
  // Todas etapas com nome
  const etapasSemNome = fluxo.etapas.filter(e => !e.nome?.trim());
  if (etapasSemNome.length > 0) {
    errors.push(`${etapasSemNome.length} etapa(s) sem nome`);
  }
  
  return errors;
};
```

### Durante Interações

- **Ao mudar tipo de fluxo para "esporádico":**
  - Se activeTab === 'clientes' ou 'geracao'
  - Muda para activeTab = 'detalhes'
  - Limpa dados de clientes e geração

- **Ao adicionar tarefa:**
  - Tarefa selecionada: obrigatório
  - Responsável: obrigatório
  - Aprovador: opcional

---

## UI/UX

### Layout Geral

```
┌─────────────────────────────────────────────────────────┐
│ Breadcrumb                                              │
│ Configurações > Fluxos de tarefa > Alteração contratual│
├─────────────────────────────────────────────────────────┤
│                                                         │
│ Título: Edição de fluxo              [CANCELAR] [SALVAR]│
│ Subtítulo: Alteração contratual                        │
│                                                         │
├─────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────┐│
│ │ [Detalhes] [Etapas] [Clientes] [Geração]          ││
│ ├─────────────────────────────────────────────────────┤│
│ │                                                     ││
│ │  Conteúdo da aba ativa                             ││
│ │                                                     ││
│ │                                                     ││
│ └─────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────┘
```

### Aba Etapas (Kanban)

```
┌───────────────────────────────────────────────────────────┐
│ Etapas do fluxo                      [+ Nova Etapa]      │
├───────────────────────────────────────────────────────────┤
│                                                           │
│ ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐  ╔═════╗            │
│ │ 1.  │  │ 2.  │  │ 3.  │  │ 4.  │  ║  +  ║            │
│ │Nome │  │Nome │  │Nome │  │Nome │  ║Novo ║            │
│ │ (2) │  │ (3) │  │ (1) │  │ (0) │  ║     ║            │
│ │⚙️ 🗑️│  │⚙️ 🗑️│  │⚙️ 🗑️│  │⚙️ 🗑️│  ╚═════╝            │
│ ├─────┤  ├─────┤  ├─────┤  ├─────┤                      │
│ │Card │  │Card │  │Card │  │Vazio│  ← Scroll horizontal│
│ │Card │  │Card │  └─────┘  │     │                      │
│ ├─────┤  │Card │           │+ Add│                      │
│ │+ Add│  ├─────┤           └─────┘                      │
│ └─────┘  │+ Add│                                         │
│          └─────┘                                         │
└───────────────────────────────────────────────────────────┘
```

### Cores e Estilos

- **Breadcrumb:** Cinza (#666), clicável vira azul (#0766c5)
- **Título:** Preto (#000), 24px, weight 700
- **Botões:** 
  - CANCELAR: borda cinza, fundo branco
  - SALVAR: fundo vermelho (#dc0a0a), texto branco
- **Tabs ativa:** Borda inferior vermelha (#dc0a0a)
- **Colunas etapas:** Header verde (#387c2b)
- **Cards tarefas:** Fundo branco, borda #e0e0e0

---

## Implementação Técnica

### Setup do React Router

```typescript
// 1. Instalar dependência
npm install react-router-dom

// 2. Modificar App.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <TimerProvider>
        <div className="app-layout">
          <Sidebar />
          <MainContent>
            <Routes>
              <Route path="/" element={<Navigate to="/visao-geral" />} />
              <Route path="/visao-geral" element={<VisaoGeral />} />
              <Route path="/tarefas" element={<Tarefas />} />
              {/* ... outras tabs */}
              
              <Route path="/configuracoes" element={<ConfigLayout />}>
                <Route index element={<ConfigHome />} />
                <Route path="funcionarios" element={<FuncionariosEscritorio />} />
                {/* ... outras configs */}
                
                <Route path="fluxos-de-tarefa">
                  <Route index element={<FluxosDeTarefaLista />} />
                  <Route path="novo" element={<FluxoDetalhes />} />
                  <Route path=":id" element={<FluxoDetalhes />} />
                </Route>
              </Route>
            </Routes>
          </MainContent>
        </div>
        <FloatingTimer />
      </TimerProvider>
    </BrowserRouter>
  );
}
```

### Componente FluxoDetalhes (Skeleton)

```typescript
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

export function FluxoDetalhes() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [activeTab, setActiveTab] = useState('detalhes');
  const [fluxoData, setFluxoData] = useState<Fluxo | null>(null);
  
  const isNew = id === 'novo';
  
  // Carregar dados
  useEffect(() => {
    if (isNew) {
      setFluxoData(createEmptyFluxo());
      setLoading(false);
    } else {
      loadFluxo(Number(id)).then(data => {
        setFluxoData(data);
        setLoading(false);
      });
    }
  }, [id, isNew]);
  
  // Prevenir saída sem salvar
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);
  
  const handleSave = async () => {
    const errors = validateFluxo(fluxoData);
    if (errors.length > 0) {
      toast.error(errors.join('\n'));
      return;
    }
    
    setSaving(true);
    try {
      if (isNew) {
        await createFluxo(fluxoData);
      } else {
        await updateFluxo(Number(id), fluxoData);
      }
      toast.success('Fluxo salvo com sucesso!');
      navigate('/configuracoes/fluxos-de-tarefa');
    } catch (error) {
      toast.error('Erro ao salvar fluxo');
    } finally {
      setSaving(false);
    }
  };
  
  const handleCancel = () => {
    if (isDirty && !confirm('Tem alterações não salvas. Sair?')) {
      return;
    }
    navigate('/configuracoes/fluxos-de-tarefa');
  };
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  return (
    <div className="fluxo-detalhes-page">
      <FluxoHeader
        fluxoNome={fluxoData.nome}
        onSave={handleSave}
        onCancel={handleCancel}
        saving={saving}
      />
      
      <WhiteBlock>
        <FluxoTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          tipoFluxo={fluxoData.tipo}
        />
        
        <TabsContent activeTab={activeTab}>
          {/* Renderizar aba correspondente */}
        </TabsContent>
      </WhiteBlock>
    </div>
  );
}
```

### API / Mock Data

```typescript
// Por enquanto, usar mocks
// Depois conectar com backend real

const mockFluxos: Fluxo[] = [
  {
    id: 1,
    nome: 'Alteração contratual',
    tipo: 'recorrente',
    frequencia: 'mensal',
    competencia: 0,
    etapas: [
      {
        id: 'e1',
        ordem: 1,
        nome: 'Criar esta etapa',
        tarefas: [],
        configuracoes: {}
      }
    ]
  }
];

export const getFluxos = async (): Promise<Fluxo[]> => {
  return mockFluxos;
};

export const getFluxo = async (id: number): Promise<Fluxo> => {
  const fluxo = mockFluxos.find(f => f.id === id);
  if (!fluxo) throw new Error('Fluxo não encontrado');
  return fluxo;
};

export const createFluxo = async (fluxo: Fluxo): Promise<Fluxo> => {
  const newFluxo = { ...fluxo, id: mockFluxos.length + 1 };
  mockFluxos.push(newFluxo);
  return newFluxo;
};

export const updateFluxo = async (id: number, fluxo: Fluxo): Promise<Fluxo> => {
  const index = mockFluxos.findIndex(f => f.id === id);
  if (index === -1) throw new Error('Fluxo não encontrado');
  mockFluxos[index] = { ...fluxo, id };
  return mockFluxos[index];
};
```

---

## Testing Strategy

### Testes Unitários

- [ ] Validações de formulário (`validateFluxo`)
- [ ] Renumeração de etapas após exclusão
- [ ] Lógica de estado (isDirty detection)
- [ ] Helpers de geração de ID

### Testes de Integração

- [ ] Fluxo completo: criar → adicionar etapas → salvar
- [ ] Fluxo completo: editar → modificar → cancelar (sem salvar)
- [ ] Navegação: lista → novo → voltar
- [ ] Navegação: lista → editar → salvar → lista
- [ ] Breadcrumb clicável

### Testes E2E (Opcional)

- [ ] Criar fluxo recorrente com todas as abas preenchidas
- [ ] Editar fluxo existente e adicionar nova etapa
- [ ] Excluir etapa e verificar renumeração
- [ ] Adicionar tarefa à etapa via modal
- [ ] Configurações de etapa via modal

---

## Rollout Plan

### Fase 1: Setup Inicial (1 dia)
- [ ] Instalar `react-router-dom`
- [ ] Refatorar App.tsx para usar BrowserRouter
- [ ] Criar rotas básicas (sem implementação)
- [ ] Testar navegação básica

### Fase 2: Migrar Lista (1 dia)
- [ ] Renomear `FluxosDeTarefa.tsx` → `FluxosDeTarefaLista.tsx`
- [ ] Remover lógica de modal/drawer
- [ ] Adicionar navegação `navigate('/configuracoes/fluxos-de-tarefa/novo')`
- [ ] Testar lista e clique para criar/editar

### Fase 3: Criar FluxoDetalhes (3-4 dias)
- [ ] Criar estrutura de componentes
- [ ] Implementar FluxoHeader com breadcrumb
- [ ] Implementar sistema de tabs
- [ ] Implementar DetalhesTab (formulário)
- [ ] Testar criar/editar detalhes básicos

### Fase 4: Implementar EtapasTab (2-3 dias)
- [ ] Implementar layout de colunas horizontais
- [ ] Implementar EtapaColumn e TarefaCard
- [ ] Implementar AddTarefaModal
- [ ] Implementar ConfigEtapaModal
- [ ] Testar adicionar/excluir etapas e tarefas

### Fase 5: Implementar Abas Clientes e Geração (1-2 dias)
- [ ] Implementar ClientesTab (lista com checkboxes)
- [ ] Implementar GeracaoTab (seletor mês/ano)
- [ ] Testar exibição condicional (apenas recorrente)
- [ ] Testar mudança de tipo (recorrente ↔ esporádico)

### Fase 6: Polimento e Testes (1-2 dias)
- [ ] Adicionar loading states
- [ ] Adicionar feedback visual (toasts)
- [ ] Adicionar confirmações (excluir, sair sem salvar)
- [ ] Testes E2E completos
- [ ] Review de UX/acessibilidade

### Fase 7: Deploy (1 dia)
- [ ] Merge para main
- [ ] Deploy para staging
- [ ] QA manual
- [ ] Deploy para produção
- [ ] Monitorar erros

**Total estimado: 10-15 dias de desenvolvimento**

---

## Decisões Pendentes / Clarificações

### Durante Implementação

1. **Fonte de tarefas disponíveis:**
   - Modal `AddTarefaModal` precisa buscar "tarefas cadastradas no sistema"
   - Reutilizar a mesma API/serviço de "Gerenciar Tarefas"
   - Endpoint: `GET /api/tarefas` (ou mock equivalente)

2. **Edição de nome da etapa:**
   - **Decisão:** Input inline no header da coluna
   - Usuário clica no nome, vira input editável
   - Blur ou Enter salva

3. **Campos de ConfigEtapaModal:**
   - **MVP:** Apenas "Prazo (dias)" por enquanto
   - **Futuro:** Adicionar conforme necessidade (notificações, dependências, etc.)
   - Interface preparada para extensão

4. **Comportamento de click no TarefaCard:**
   - **Decisão:** Botão "Editar" abre modal para modificar responsável/aprovador
   - Click no card em si: sem ação (ou tooltip com detalhes?)
   - Drag-and-drop entre colunas: não no MVP, avaliar para v2

5. **Persistência de ordem das etapas:**
   - Campo `ordem` é salvo no backend
   - Backend retorna etapas já ordenadas
   - Frontend re-ordena apenas após exclusão (antes de salvar)

---

## Riscos e Mitigações

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| React Router conflita com estrutura atual | Baixa | Alto | Testar setup em branch isolada primeiro |
| Performance com muitas colunas de etapas | Média | Médio | Usar virtualização se necessário (react-window) |
| Dados não persistem após refresh | Baixa | Alto | Implementar carregamento via API desde o início |
| Usuários perdem alterações ao fechar aba | Média | Alto | Implementar beforeunload warning |
| Renumeração de etapas tem bug | Baixa | Médio | Testes unitários robustos para lógica de ordenação |

---

## Métricas de Sucesso

### Técnicas
- ✅ Todas as rotas funcionando sem erros
- ✅ Navegação do browser (voltar/avançar) funciona
- ✅ URLs compartilháveis abrem na tela correta
- ✅ Zero regressões em funcionalidades existentes
- ✅ Loading time < 2s para telas de edição

### UX
- ✅ Usuários conseguem criar fluxo completo sem ajuda
- ✅ Breadcrumb clicável é intuitivo
- ✅ Scroll horizontal das etapas é descoberto naturalmente
- ✅ Botões SALVAR/CANCELAR sempre visíveis no topo

### Negócio
- ✅ Redução de reclamações sobre espaço limitado
- ✅ Aumento na criação de fluxos complexos (>3 etapas)
- ✅ Usuários compartilham links diretos para fluxos

---

## Referências

- **Design System:** [Dom DS Core Web](https://www.figma.com/design/Q2p5d5mIahsEPxXYMOA16V/Dom-DS-Core-Web)
- **Componentes existentes:** `src/app/components/ui/`
- **Tela de referência (Empresas):** `src/app/components/Empresas.tsx`
- **Visualização atual de Fluxo (Kanban):** `src/app/components/views/FluxoView.tsx`
- **React Router Docs:** https://reactrouter.com/

---

## Aprovações

- [x] Design aprovado pelo usuário (2026-05-04)
- [ ] Revisão técnica do time
- [ ] Aprovação de UX
- [ ] Aprovação de produto

---

## Changelog

| Data | Versão | Mudança |
|------|--------|---------|
| 2026-05-04 | 1.0 | Design inicial aprovado |

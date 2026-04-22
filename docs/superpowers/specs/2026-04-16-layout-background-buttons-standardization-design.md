# Layout, Background e Botões - Padronização de Telas do Sistema

**Data:** 2026-04-16  
**Status:** Aprovado

## Visão Geral

Padronizar o layout, backgrounds, posicionamento de botões e responsividade em todas as telas do sistema que ainda não seguem o padrão estabelecido. Esta especificação define mudanças estruturais significativas em 18+ telas principais, incluindo menus de configuração, relatórios e telas operacionais.

**Problema Atual:**
- Inconsistência visual entre telas (algumas com background branco, outras cinza)
- Títulos e botões de ação posicionados de forma inconsistente
- Falta de botão "Auditoria de configuração" nas telas de configuração
- Background cinza interno em áreas que deveriam ser brancas (Kanban, Fluxo)
- Responsividade não otimizada para diferentes tamanhos de tela
- Algumas fontes abaixo do mínimo de acessibilidade (12px)

**Objetivo:**
Estabelecer padrão visual consistente com:
1. Background cinza (#f6f6f6) em todas as telas
2. Blocos brancos para conteúdo com padding interno 16px
3. Botão "Auditoria de configuração" em telas de segundo nível
4. Botões de ação primários alinhados aos filtros
5. Padding externo responsivo (24px desktop / 16px tablet / 12px mobile)
6. Fonte mínima 12px e contraste adequado (WCAG AA)

## Escopo

### Telas Afetadas - Fase 1 (Prioritárias)

1. **Documentos Express** (`src/app/components/DocumentosExpress.tsx`)
2. **Circular** (`src/app/components/Circular.tsx`)
3. **Status de Integração** (`src/app/components/StatusIntegracao.tsx`)
4. **Relatórios** (`src/app/components/Relatorios.tsx`)
5. **Auditoria** (`src/app/components/Auditoria.tsx`)

### Telas Afetadas - Fase 2 (Configurações)

6. **Funcionários do Escritório** (`src/app/components/FuncionariosEscritorio.tsx`)
7. **Feriados e Horários** (`src/app/components/FeriadosHorarios.tsx`)
8. **Responsabilidades** (`src/app/components/Responsabilidades.tsx`)
9. **Agrupadores de Tarefas e Clientes** (`src/app/components/AgrupadorTarefasClientes.tsx`)
10. **Empresas** (`src/app/components/Empresas.tsx`)
11. **Usuários do Cliente** (`src/app/components/UsuariosCliente.tsx`)
12. **Adequação de Agrupadores** (`src/app/components/AdequacaoAgrupadores.tsx`)
13. **Inbox Config** (`src/app/components/InboxConfig.tsx`)
14. **Personalizar Assinatura** (`src/app/components/PersonalizarAssinatura.tsx`)
15. **Templates Email/WhatsApp** (`src/app/components/TemplatesEmailWhatsapp.tsx`)
16. **Modelos de Documento** (`src/app/components/ModelosDocumento.tsx`)
17. **Gerenciar Tarefas** (`src/app/components/GerenciarTarefas.tsx`)
18. **Gerador de Tarefas** (`src/app/components/GeradorTarefas.tsx`)

### Fase 3 - Páginas Internas

- Modais de edição (EditEmpresa, EditFuncionario, EditTemplate, etc.)
- Páginas de detalhes (3+ níveis de breadcrumb)
- Telas de criação/novo item

### Fase 4 - Ajuste Especial

- **Tarefas - Kanban** (`src/app/components/views/KanbanView.tsx`)
- **Tarefas - Fluxo** (`src/app/components/views/FluxoView.tsx`)

### Componentes Novos a Criar

1. `src/app/components/ui/auditoria-button.tsx` - Botão padrão de auditoria
2. `src/app/components/ui/white-block.tsx` - Helper para blocos brancos
3. `src/app/components/ui/auditoria-drawer.tsx` - Drawer de histórico de auditoria
4. `src/app/components/ui/report-card.tsx` - Card redesenhado para relatórios

## Abordagem de Implementação

**Abordagem Selecionada:** Incremental por Tela

**Razão:** 
- Baixo risco de regressão
- Fácil de testar cada mudança individualmente
- Permite ajustes e aprendizados entre implementações
- Commits pequenos e focados
- Sistema em produção requer segurança

**Alternativas Rejeitadas:**
- **Layout Wrapper Component:** Muito invasivo, dificulta casos especiais
- **Híbrida:** Complexidade de manter dois padrões diferentes

## Arquitetura e Estrutura

### 1. Estrutura de Layout Padrão

Todas as telas seguirão esta estrutura base:

```tsx
<div style={{ 
  display: 'flex', 
  flexDirection: 'column', 
  height: '100%', 
  padding: '24px',  // Responsivo: 16px < 768px, 12px < 480px
  background: '#f6f6f6'  // var(--input-background)
}}>
  
  {/* Seção 1: Breadcrumb */}
  <div style={{ paddingBottom: '24px' }}>
    <ConfigBreadcrumb 
      menuLabel="Nome do Menu"
      onNavigateToConfig={onBack}
      // itemLabel opcional para 3+ níveis
    />
  </div>

  {/* Seção 2: Título + Botão Auditoria (apenas nível 2 breadcrumb) */}
  <div style={{ 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'flex-start',
    paddingBottom: '16px' 
  }}>
    <div>
      <h1 style={{ 
        fontSize: '24px', 
        fontWeight: 'var(--font-weight-bold)', 
        color: 'var(--foreground)', 
        marginBottom: '8px' 
      }}>
        Título da Página
      </h1>
      <p style={{ 
        fontSize: 'var(--text-caption)', 
        color: 'var(--muted-foreground)' 
      }}>
        Texto de apoio descritivo
      </p>
    </div>
    
    {/* Apenas em telas de segundo nível: Configurações > Seção */}
    <AuditoriaButton configName="Nome da Seção" />
  </div>

  {/* Seção 3: Abas (se houver) - direto no fundo cinza */}
  <Tabs />

  {/* Seção 4: Filtros (bloco branco) */}
  <WhiteBlock style={{ marginBottom: '24px' }}>
    <div style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      gap: '12px'
    }}>
      {/* Filtros à esquerda */}
      <div style={{ display: 'flex', gap: '12px', flex: 1 }}>
        {/* Select, DatePicker, Search, etc */}
      </div>
      
      {/* Botão ação à direita */}
      <Button variant="primary" size="sm">
        <Plus size={16} />
        Novo Item
      </Button>
    </div>
  </WhiteBlock>

  {/* Seção 5: Conteúdo (bloco branco) */}
  <WhiteBlock style={{ flex: 1, overflowY: 'auto' }}>
    {/* Conteúdo específico: tabela, cards, kanban, etc */}
  </WhiteBlock>
  
</div>
```

### 2. Hierarquia Visual

```
[Barra de Navegação Horizontal]
    ↓ 24px (padding externo)
[Background Cinza #f6f6f6]
    ↓ 0px (breadcrumb direto no cinza)
[Breadcrumb: Configurações > Menu]
    ↓ 24px (paddingBottom do container de breadcrumb)
[Título]                    [Botão Auditoria]
    ↓ 8px (marginBottom do h1)
[Descrição]
    ↓ 16px (paddingBottom do container de título)
[Abas] (se houver - direto no cinza)
    ↓ 24px (marginBottom)
[Bloco Branco 1: Filtros]
    ↓ 24px (marginBottom)
[Bloco Branco 2: Conteúdo]
    ↓ 24px (padding externo inferior)
```

### 3. Design Tokens e Valores

```typescript
// Cores
const BACKGROUND_GRAY = '#f6f6f6';       // var(--input-background)
const BACKGROUND_WHITE = '#ffffff';      // var(--background) ou var(--card)
const PRIMARY = 'rgba(214, 64, 0, 1)';   // var(--primary)
const FOREGROUND = 'rgba(31, 31, 31, 1)'; // var(--foreground)
const MUTED_FOREGROUND = 'rgba(153, 153, 153, 1)'; // var(--muted-foreground)

// Espaçamentos Externos (responsivos)
const PADDING_EXTERNAL = {
  desktop: '24px',   // >= 1024px
  tablet: '16px',    // 768px - 1023px
  mobile: '12px',    // < 768px
};

// Espaçamentos Internos (fixos)
const PADDING_INTERNAL_BLOCK = '16px';
const GAP_BETWEEN_BLOCKS = '24px';
const BREADCRUMB_SPACING = '24px';
const TITLE_SPACING = '16px';

// Tipografia (mínimos)
const MIN_FONT_SIZE = '12px';  // var(--text-caption)
const LABEL_SIZE = '14px';     // var(--text-label)
const BASE_SIZE = '16px';      // var(--text-base)
const TITLE_SIZE = '24px';     // var(--text-h3)

// Border Radius
const BORDER_RADIUS_BLOCK = '8px';  // var(--radius-card)
const BORDER_RADIUS_BUTTON = '4px'; // var(--radius-button)
```

## Mudanças Específicas por Tela

### Fase 1 - Telas Prioritárias

#### 1. Circular

**Arquivo:** `src/app/components/Circular.tsx`

**Estrutura:**
```
[Background Cinza]
  ├─ Breadcrumb: Configurações > Circular
  ├─ Título "Circular" + Botão "Auditoria de configuração"
  ├─ Descrição
  ├─ [Bloco Branco 1] Filtros + Botão "Nova circular" (primário sm)
  └─ [Bloco Branco 2] Tabela de circulares
```

**Mudanças:**
1. Adicionar background cinza externo com padding 24px
2. Título + botão "Auditoria" na mesma linha (flex, space-between)
3. Separar filtros e tabela em blocos brancos diferentes
4. Mover botão "Nova circular" para linha de filtros (alinhado à direita)
5. Padding interno dos blocos: 16px
6. Espaçamento entre blocos: 24px

---

#### 2. Status de Integração

**Arquivo:** `src/app/components/StatusIntegracao.tsx`

**Estrutura:**
```
[Background Cinza]
  ├─ Breadcrumb: Configurações > Status de integração
  ├─ Título + Botão "Auditoria de configuração"
  ├─ Descrição
  ├─ Abas (Status Geral | Detalhes | Logs) - direto no cinza
  └─ [Bloco Branco Único] Conteúdo da aba selecionada
```

**Mudanças:**
1. Background cinza externo (padding 24px)
2. Título + botão "Auditoria" alinhados
3. Abas renderizadas direto no fundo cinza (sem bloco branco)
4. Conteúdo de cada aba em bloco branco único
5. Padding interno: 16px

---

#### 3. Auditoria

**Arquivo:** `src/app/components/Auditoria.tsx`

**Estrutura:**
```
[Background Cinza]
  ├─ Breadcrumb: Configurações > Auditoria
  ├─ Título + Botão "Auditoria de configuração"
  ├─ Descrição
  ├─ Abas (Por Módulo | Por Usuário | Eventos) - direto no cinza
  ├─ [Bloco Branco 1] Filtros + Busca
  └─ [Bloco Branco 2] Timeline/Tabela de eventos
```

**Mudanças:**
1. Background cinza externo (padding 24px)
2. Título + botão "Auditoria" alinhados
3. Abas direto no fundo cinza
4. Filtros em bloco separado da tabela/timeline
5. Padding interno: 16px
6. Espaçamento entre blocos: 24px

---

#### 4. Documentos Express

**Arquivo:** `src/app/components/DocumentosExpress.tsx`

**Estrutura:**
```
[Background Cinza]
  ├─ Breadcrumb: Configurações > Documentos Express
  ├─ Título + Botão "Auditoria de configuração"
  ├─ Descrição
  ├─ Abas (Upload Express | Histórico | Lista de Documentos)
  │
  └─ Conteúdo por Aba:
      
      ABA 1 (Upload Express):
      ├─ [Bloco Branco 1] Área de Upload
      └─ [Bloco Branco 2] Documentos não identificados/identificados
      
      ABA 2 (Histórico):
      └─ [Bloco Branco Único] Filtros + Tabela
      
      ABA 3 (Lista de Documentos):
      └─ [Bloco Branco Único] Filtros + Tabela
```

**Mudanças:**
1. Background cinza externo (padding 24px)
2. Título + botão "Auditoria" alinhados
3. Abas direto no fundo cinza
4. **Primeira aba:** 2 blocos brancos separados (upload + conteúdo)
5. **Outras abas:** bloco branco único
6. Padding interno: 16px
7. Espaçamento entre blocos: 24px

---

#### 5. Relatórios (Mais Complexa)

**Arquivo:** `src/app/components/Relatorios.tsx`

**Estrutura:**
```
[Background Cinza]
  ├─ Breadcrumb: Configurações > Relatórios
  ├─ Título + Botão "Auditoria de configuração"
  ├─ Descrição
  ├─ [Bloco Branco 1] Abas (Disponíveis | Salvos | Recorrentes | Histórico)
  ├─ [Bloco Branco 2] Chip Filters + Busca
  └─ [Bloco Branco 3] Conteúdo
      └─ 4 Acordeões (fundo branco interno)
          └─ Cards de relatórios (redesenhados)
```

**Mudanças Estruturais:**
1. Background cinza externo (padding 24px)
2. Título + botão "Auditoria" alinhados
3. Abas em bloco branco separado
4. Filtros em bloco branco separado
5. Conteúdo em bloco branco com 4 acordeões internos (fundo branco)

**Mudanças nos Chip Filters:**
- Substituir chips atuais por componente `chip-filter` do design system
- Filtros pelas categorias:
  - "Clientes e Usuários"
  - "Status gerais de baixa"
  - "Tarefas"
  - "Financeiro e gestão"

**Redesign dos Cards de Relatórios:**

1. **Formato:** Mais quadrado (aspect ratio ~1:1 ou 4:3) vs retangular atual
2. **Botões Redesenhados:**
   - **Exportar:** Secundário, ícone Download à esquerda, label "Exportar"
   - **Exibir em tela:** Primário (era "Visualizar"), label "Exibir em tela"
   - **Excluir:** Terciário, apenas ícone Trash
3. **Ordem:** Exportar | Exibir em tela | Excluir
4. **Layout:**
   ```
   ┌─────────────────┐
   │  [Ícone Report] │
   │                 │
   │  Título         │
   │  Descrição      │
   │  Categoria      │
   │                 │
   │ [Exportar] [Exibir] [🗑]
   └─────────────────┘
   ```

**Aplicar em Todas as Abas:**
- Mesmo padrão de cards nas 4 abas (Disponíveis, Salvos, Recorrentes, Histórico)
- Mesmo padrão de botões em todos os cards
- Consistência visual total

---

### Fase 2 - Telas de Configuração (13 telas)

Todas as 13 telas de configuração seguirão o padrão base:

1. Background cinza externo (padding 24px)
2. Breadcrumb com paddingBottom 24px
3. Título + Botão "Auditoria de configuração" alinhados
4. Descrição com paddingBottom 16px
5. Filtros em bloco branco (se houver)
6. Conteúdo em bloco branco
7. Botão de ação (Nova empresa, Novo funcionário, etc.) alinhado aos filtros

**Lista Completa:**
- Funcionários do Escritório
- Feriados e Horários
- Responsabilidades
- Agrupadores de Tarefas e Clientes
- Empresas
- Usuários do Cliente
- Adequação de Agrupadores
- Inbox Config
- Personalizar Assinatura
- Templates Email/WhatsApp
- Modelos de Documento
- Gerenciar Tarefas
- Gerador de Tarefas

**Implementação:** Seguir estrutura de layout padrão da Seção 1.

---

### Fase 3 - Páginas Internas

**Escopo:**
- Modais de edição (ex: EditEmpresa, EditFuncionario, EditTemplate)
- Páginas de detalhes (breadcrumb com 3+ níveis)
- Telas de criação/novo item

**Padrão:**
- Aplicar o mesmo padrão completo das páginas principais
- Background cinza + blocos brancos + padding responsivo
- **Exceção:** Botão "Auditoria de configuração" NÃO aparece em níveis 3+
- Modais mantêm estrutura modal (não aplicar background cinza ao modal-overlay)

**Nota sobre Drawers:**
- Drawers (como AuditoriaDrawer) seguem padrão atual do sistema
- Background branco, sem blocos adicionais
- Não aplicar background cinza em drawers

---

### Fase 4 - Ajuste Especial: Tarefas

**Arquivos:**
- `src/app/components/views/KanbanView.tsx`
- `src/app/components/views/FluxoView.tsx`

**Mudança:**
Remover background cinza **interno** do bloco de conteúdo.

**Antes:**
```tsx
<div style={{ 
  background: '#f6f6f6',  // ← REMOVER
  padding: '24px' 
}}>
  {/* Colunas do kanban */}
</div>
```

**Depois:**
```tsx
<div style={{ 
  background: 'white',    // ← APLICAR
  padding: '24px' 
}}>
  {/* Colunas do kanban */}
</div>
```

**NÃO MEXER:**
- `CalendarioView.tsx` - mantém estrutura atual
- Página principal `Tarefas.tsx` - mantém estrutura atual
- Apenas os blocos internos do Kanban e Fluxo mudam

---

## Componentes Reutilizáveis

### 1. AuditoriaButton

**Arquivo:** `src/app/components/ui/auditoria-button.tsx`

```tsx
import React, { useState } from 'react';
import { Button } from './button';
import { AuditoriaDrawer } from './auditoria-drawer';

interface AuditoriaButtonProps {
  configName: string;  // Ex: "Empresas", "Circular", "Relatórios"
  configId?: string;   // Opcional: ID específico para filtrar histórico
}

export function AuditoriaButton({ configName, configId }: AuditoriaButtonProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <Button 
        variant="secondary" 
        size="sm"
        onClick={() => setDrawerOpen(true)}
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

**Quando Usar:**
- ✅ Telas de segundo nível: `Configurações > [Seção]`
- ❌ Telas de terceiro nível: `Configurações > Empresas > Editar`
- ❌ Telas que não são de configuração

---

### 2. WhiteBlock

**Arquivo:** `src/app/components/ui/white-block.tsx`

```tsx
import React from 'react';
import { cn } from './utils';

interface WhiteBlockProps {
  children: React.ReactNode;
  className?: string;
  padding?: string;  // Override padrão de 16px
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

**Uso:**
```tsx
<WhiteBlock style={{ marginBottom: '24px' }}>
  {/* Conteúdo */}
</WhiteBlock>
```

---

### 3. AuditoriaDrawer

**Arquivo:** `src/app/components/ui/auditoria-drawer.tsx`

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

  useEffect(() => {
    if (isOpen) {
      // TODO: Buscar histórico da API
      // fetchAuditoriaHistory(configName, configId).then(setEvents);
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
          {/* Timeline de eventos */}
          {events.length === 0 ? (
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

---

### 4. ReportCard

**Arquivo:** `src/app/components/ui/report-card.tsx`

```tsx
import React from 'react';
import { Button } from './button';
import { Download, Eye, Trash2, FileText } from 'lucide-react';

interface ReportCardProps {
  title: string;
  description: string;
  category: string;
  onExport: () => void;
  onView: () => void;
  onDelete: () => void;
}

export function ReportCard({
  title,
  description,
  category,
  onExport,
  onView,
  onDelete
}: ReportCardProps) {
  return (
    <div 
      style={{
        background: 'white',
        border: '1px solid var(--border)',
        borderRadius: '8px',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        minHeight: '220px',
        aspectRatio: '4/3',  // Formato mais quadrado
      }}
    >
      {/* Ícone e Título */}
      <div style={{ flex: 1 }}>
        <div style={{ 
          width: '48px', 
          height: '48px', 
          background: 'var(--muted)', 
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '12px'
        }}>
          <FileText size={24} color="var(--primary)" />
        </div>
        
        <h4 style={{ 
          fontSize: 'var(--text-label)', 
          fontWeight: 'var(--font-weight-semibold)',
          marginBottom: '4px'
        }}>
          {title}
        </h4>
        
        <p style={{ 
          fontSize: 'var(--text-caption)', 
          color: 'var(--muted-foreground)',
          marginBottom: '8px'
        }}>
          {description}
        </p>
        
        <span style={{
          fontSize: 'var(--text-caption)',
          color: 'var(--primary)',
          background: 'rgba(214, 64, 0, 0.08)',
          padding: '2px 8px',
          borderRadius: '4px',
          display: 'inline-block'
        }}>
          {category}
        </span>
      </div>

      {/* Botões */}
      <div style={{ 
        display: 'flex', 
        gap: '8px',
        borderTop: '1px solid var(--border)',
        paddingTop: '12px'
      }}>
        <Button 
          variant="secondary" 
          size="sm" 
          onClick={onExport}
          style={{ flex: 1 }}
        >
          <Download size={14} />
          Exportar
        </Button>
        
        <Button 
          variant="primary" 
          size="sm" 
          onClick={onView}
          style={{ flex: 1 }}
        >
          <Eye size={14} />
          Exibir em tela
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onDelete}
          aria-label="Excluir relatório"
          style={{ padding: '8px' }}
        >
          <Trash2 size={14} />
        </Button>
      </div>
    </div>
  );
}
```

---

## Responsividade

### Breakpoints e Comportamento

```css
/* Desktop: >= 1024px */
.container {
  padding: 24px;
}

/* Tablet: >= 768px and < 1024px */
@media (max-width: 1023px) {
  .container {
    padding: 16px;
  }
}

/* Mobile: < 768px */
@media (max-width: 767px) {
  .container {
    padding: 12px;
  }
}
```

### Comportamento por Tamanho

**Desktop (>= 1024px):**
- Padding externo: 24px
- Padding interno blocos: 16px
- Filtros lado a lado (flex-row)
- Botões na mesma linha dos filtros
- Título e botão "Auditoria" na mesma linha
- Tabelas com todas as colunas visíveis
- Cards de relatórios em grid (3-4 colunas)

**Tablet (768px - 1023px):**
- Padding externo: 16px
- Padding interno blocos: 16px
- Filtros começam a empilhar (flex-wrap)
- Botão de ação pode ir para linha abaixo se não couber
- Título e botão "Auditoria" mantêm mesma linha (se couber)
- Tabelas podem ocultar colunas menos importantes
- Cards de relatórios em grid (2-3 colunas)

**Mobile (< 768px):**
- Padding externo: 12px
- Padding interno blocos: 16px
- Filtros empilhados verticalmente (flex-col)
- Botão de ação largura total abaixo dos filtros
- Título e botão "Auditoria" empilhados verticalmente
- Tabelas com scroll horizontal
- Cards de relatórios em coluna única (1 coluna)
- Abas podem ter scroll horizontal se muitas

### Implementação com Tailwind CSS

```tsx
<div className="p-3 md:p-4 lg:p-6">
  {/* 12px mobile / 16px tablet / 24px desktop */}
</div>
```

Ou com CSS puro:
```tsx
<div style={{ 
  padding: 'clamp(12px, 2vw, 24px)' 
}}>
  {/* Padding responsivo fluido */}
</div>
```

### Exemplo Completo de Container Responsivo

```tsx
function ResponsiveContainer({ children }) {
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
      {children}
    </div>
  );
}
```

---

## Acessibilidade

### Fonte Mínima

**Regra:** Nenhum texto pode ser menor que 12px.

**Tamanhos Permitidos:**
- `var(--text-caption)`: 12px - Para textos secundários (labels, timestamps)
- `var(--text-label)`: 14px - Para labels de formulário, botões
- `var(--text-base)`: 16px - Para texto principal

**Ação:**
- Varrer todas as telas modificadas
- Identificar textos com `fontSize < 12px`
- Substituir por `var(--text-caption)` ou maior

### Contraste de Cores

**WCAG AA Compliance:**

| Combinação | Ratio | Status | Uso Recomendado |
|------------|-------|--------|-----------------|
| `#1f1f1f` em `#ffffff` | 19.38:1 | ✅ Excelente | Texto principal |
| `#999999` em `#ffffff` | 2.85:1 | ⚠️ Limite | Apenas textos >18px |
| `#737475` em `#ffffff` | 4.53:1 | ✅ Bom | Textos secundários |

**Regras:**
1. Texto principal: usar `var(--foreground)` (#1f1f1f)
2. Texto secundário >14px: pode usar `var(--muted-foreground)` (#999999)
3. Texto secundário <14px: usar `#737475` ou mais escuro
4. Evitar cinza claro em fundo cinza

**Ajuste Necessário:**
- Se `var(--muted-foreground)` for usado em textos 12px, considerar escurecer para `#737475`

### Navegação por Teclado

**Requisitos:**
- Todos os botões têm `:focus-visible` outline
- Tabs navegáveis por setas (← →)
- Modais/Drawers fecham com ESC
- Filtros/selects navegáveis por teclado
- Ordem de foco lógica (top-to-bottom, left-to-right)

**Implementação:**
```css
button:focus-visible,
a:focus-visible,
[role="button"]:focus-visible {
  outline: 2px solid var(--ring);
  outline-offset: 2px;
}
```

### ARIA Labels

**Botões com ícone apenas:**
```tsx
<Button 
  variant="ghost" 
  size="sm"
  aria-label="Excluir relatório"
>
  <Trash2 size={14} />
</Button>
```

**Botão Auditoria:**
```tsx
<Button 
  variant="secondary" 
  size="sm"
  aria-label="Ver histórico de alterações desta configuração"
>
  Auditoria de configuração
</Button>
```

**Filtros:**
```tsx
<Select aria-label="Filtrar por status">
  {/* Opções */}
</Select>
```

### Checklist de Acessibilidade por Tela

- [ ] Todas as fontes >= 12px
- [ ] Contraste adequado (WCAG AA)
- [ ] Botões de ícone com aria-label
- [ ] Navegação por teclado funcional
- [ ] Focus visible em elementos interativos
- [ ] Ordem de foco lógica
- [ ] Modais/Drawers acessíveis por teclado

---

## Plano de Implementação

### Ordem de Execução

**Fase 1 - Telas Prioritárias (em ordem):**

1. **Circular** (começar pela mais simples)
   - Estrutura: filtros + tabela
   - Sem abas, sem complexidades
   - Serve como template para as outras

2. **Status de Integração**
   - Adiciona: abas simples
   - Reutiliza padrão de Circular

3. **Auditoria**
   - Adiciona: filtros mais complexos
   - Abas + filtros + tabela

4. **Documentos Express**
   - Adiciona: múltiplos blocos por aba
   - Upload area especial

5. **Relatórios** (última - mais complexa)
   - Redesign de cards
   - Chip filters novos
   - 4 acordeões
   - Botões redesenhados

**Fase 2 - Telas de Configuração:**
- Implementar as 13 telas seguindo padrão estabelecido
- Podem ser paralelizadas se necessário
- Ordem sugerida: por similaridade de estrutura

**Fase 3 - Páginas Internas:**
- Modais de edição
- Páginas de detalhes
- Telas de criação

**Fase 4 - Ajuste Especial:**
- Tarefas (Kanban e Fluxo)

### Checklist por Tela

Para cada tela, seguir:

**[ ] Estrutura Base**
- [ ] Background cinza (#f6f6f6) com padding externo
- [ ] Breadcrumb com paddingBottom 24px
- [ ] Título + Botão Auditoria alinhados (flex, space-between)
- [ ] Texto de apoio abaixo do título
- [ ] Padding responsivo (24px/16px/12px)

**[ ] Blocos Brancos**
- [ ] Todos os blocos com background white
- [ ] Padding interno 16px
- [ ] Border radius 8px
- [ ] Espaçamento 24px entre blocos

**[ ] Botões e Ações**
- [ ] Botão "Auditoria de configuração": secundário sm, alinhado direita
- [ ] Botão de adicionar: primário sm, alinhado aos filtros à direita
- [ ] Drawer de auditoria implementado e funcional

**[ ] Responsividade**
- [ ] Padding reduz em tablet (16px)
- [ ] Padding reduz em mobile (12px)
- [ ] Filtros empilham em mobile
- [ ] Botões adaptam posição
- [ ] Tabelas com scroll horizontal
- [ ] Título + botão auditoria empilham em mobile

**[ ] Acessibilidade**
- [ ] Todas as fontes >= 12px
- [ ] Contraste adequado (WCAG AA)
- [ ] Botões de ícone com aria-label
- [ ] Navegação por teclado funcional
- [ ] Focus visible em todos os elementos interativos

**[ ] Testes**
- [ ] Visual: Desktop (1920x1080)
- [ ] Visual: Desktop (1366x768)
- [ ] Visual: Tablet (768x1024)
- [ ] Visual: Mobile (375x667)
- [ ] Funcional: todos os botões funcionam
- [ ] Funcional: filtros aplicam corretamente
- [ ] Funcional: drawer de auditoria abre/fecha
- [ ] Funcional: sem regressão em outras funcionalidades

### Testes Específicos por Tela

**Circular:**
- [ ] Filtros aplicam na tabela corretamente
- [ ] Botão "Nova circular" abre modal/página
- [ ] Tabela ordena colunas
- [ ] Status badges têm cores corretas
- [ ] Visualização e edição de circulares funcionam

**Status de Integração:**
- [ ] Abas trocam conteúdo corretamente
- [ ] Cada aba carrega dados corretos
- [ ] Indicadores de status funcionam
- [ ] Atualização de status funciona

**Auditoria:**
- [ ] Filtros por módulo/usuário/evento funcionam
- [ ] Timeline renderiza corretamente
- [ ] Paginação funciona
- [ ] Eventos carregam detalhes ao expandir

**Documentos Express:**
- [ ] Upload de arquivos funciona na aba 1
- [ ] Abas trocam conteúdo
- [ ] Blocos separados renderizam corretamente
- [ ] Documentos listam com filtros
- [ ] Download de documentos funciona

**Relatórios:**
- [ ] 4 acordeões abrem/fecham corretamente
- [ ] Cards redesenhados (formato quadrado) renderizam bem
- [ ] Botões na ordem correta: Exportar | Exibir | Excluir
- [ ] Chip filters funcionam e filtram relatórios
- [ ] Mesmo padrão em todas as 4 abas
- [ ] Botão "Exportar" baixa relatório
- [ ] Botão "Exibir em tela" mostra preview
- [ ] Botão "Excluir" remove relatório (com confirmação)

### Critérios de Aceitação

**Uma tela está completa quando:**

1. ✅ Passa em todos os itens do checklist estrutural
2. ✅ Testes visuais confirmados em 3 tamanhos (desktop, tablet, mobile)
3. ✅ Testes funcionais passam sem erros
4. ✅ Código commitado com mensagem descritiva
5. ✅ Nenhuma regressão visual em outras telas
6. ✅ Build do TypeScript passa sem erros

**Fase 1 está completa quando:**
- ✅ Todas as 5 telas passam nos critérios individuais
- ✅ Componentes reutilizáveis criados e testados
- ✅ Nenhuma regressão no sistema
- ✅ Documentação atualizada (se necessário)

**Projeto completo quando:**
- ✅ Fases 1, 2, 3 e 4 concluídas
- ✅ Todas as telas seguem o padrão estabelecido
- ✅ Componentes reutilizáveis documentados
- ✅ Testes de acessibilidade passam
- ✅ Performance mantida ou melhorada
- ✅ Aprovação final do usuário

---

## Rollback e Reversão

### Estratégia de Rollback

**Se houver problemas em uma tela:**

1. **Reversão individual (recomendado):**
   ```bash
   git revert <commit-hash-da-tela>
   ```

2. **Verificar impacto:**
   - Rodar build: `npm run build`
   - Verificar outras telas não quebraram
   - Testar funcionalidades críticas

**Se houver problemas em múltiplas telas:**

1. **Reversão de fase completa:**
   ```bash
   git revert <primeiro-commit-fase>..<ultimo-commit-fase>
   ```

2. **Ou reversão seletiva:**
   ```bash
   git checkout <commit-anterior> -- src/app/components/Circular.tsx
   git checkout <commit-anterior> -- src/app/components/Relatorios.tsx
   ```

### Testes de Não-Regressão

**Após cada tela implementada:**
- [ ] Build passa: `npm run build`
- [ ] Outras telas ainda funcionam
- [ ] Performance não degradou (verificar console, network)
- [ ] Nenhum console error novo
- [ ] Testes unitários passam (se houver)

**Ferramentas de Monitoramento:**
- DevTools Console (erros JavaScript)
- DevTools Network (performance, requests)
- React DevTools (re-renders desnecessários)
- Lighthouse (acessibilidade, performance)

### Plano de Contingência

**Se problemas críticos forem detectados:**

1. **Pausa imediata** na implementação
2. **Análise de causa raiz**
3. **Decisão:**
   - Corrigir problema e continuar
   - Reverter tela problemática
   - Reverter fase completa

**Comunicação:**
- Documentar problema encontrado
- Documentar solução aplicada
- Atualizar checklist se necessário

---

## Fora do Escopo

**O que NÃO será alterado:**

1. **Funcionalidade existente:**
   - Nenhuma lógica de negócio será modificada
   - APIs mantêm contratos atuais
   - Fluxos de dados permanecem iguais

2. **Telas não listadas:**
   - Visão Geral (mantém layout atual)
   - Telas públicas/login
   - Onboarding/setup inicial

3. **Componentes do Design System:**
   - Button, Select, Input, etc mantêm API atual
   - Apenas novos componentes serão criados (AuditoriaButton, WhiteBlock, etc)

4. **Backend/API:**
   - Nenhuma mudança em endpoints
   - Nenhuma mudança em models/schemas
   - Apenas frontend será modificado

5. **Testes automatizados:**
   - Não está no escopo criar novos testes automatizados
   - Apenas testes manuais conforme checklist

6. **Documentação externa:**
   - Não inclui atualização de documentação de usuário
   - Apenas documentação técnica (este spec)

---

## Referências

- **Design System:** `src/styles/theme.css`
- **Design Tokens:** `src/design-tokens.ts`
- **Componentes UI:** `src/app/components/ui/`
- **Breadcrumb Standardization:** `docs/superpowers/specs/2026-04-14-breadcrumb-standardization-design.md`
- **WCAG 2.1 Guidelines:** https://www.w3.org/WAI/WCAG21/quickref/

---

## Aprovações

- **Design Aprovado:** 2026-04-16
- **Especificação Aprovada:** Pendente revisão do usuário
- **Implementação Autorizada:** Após aprovação da spec

---

## Histórico de Alterações

| Data | Versão | Alteração | Autor |
|------|--------|-----------|-------|
| 2026-04-16 | 1.0 | Criação inicial da especificação | Claude |

---

## Apêndice A: Exemplo de Commit Message

```
feat(circular): add gray background and audit button

- Add gray background (#f6f6f6) with responsive padding
- Add "Auditoria de configuração" button aligned right
- Separate filters and table into distinct white blocks
- Move "Nova circular" button to filter line
- Add responsive behavior for mobile (12px padding)
- Ensure font sizes >= 12px for accessibility

Refs: docs/superpowers/specs/2026-04-16-layout-background-buttons-standardization-design.md
```

---

## Apêndice B: Cores e Variáveis de Referência Rápida

```css
/* Backgrounds */
--background-gray: #f6f6f6;
--background-white: #ffffff;

/* Cores primárias */
--primary: rgba(214, 64, 0, 1);
--foreground: rgba(31, 31, 31, 1);
--muted-foreground: rgba(153, 153, 153, 1);

/* Espaçamentos */
--padding-external-desktop: 24px;
--padding-external-tablet: 16px;
--padding-external-mobile: 12px;
--padding-internal-block: 16px;

/* Tipografia */
--text-caption: 12px;
--text-label: 14px;
--text-base: 16px;
--text-h3: 24px;

/* Border Radius */
--radius-card: 8px;
--radius-button: 4px;
```

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

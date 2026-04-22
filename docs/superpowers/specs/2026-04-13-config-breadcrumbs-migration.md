# Design: Migração de Navegação para Breadcrumbs nas Configurações

**Data:** 2026-04-13  
**Componentes:** 14 telas de Configuração + novo componente `ConfigBreadcrumb`  
**Objetivo:** Substituir botões "Voltar" e "Fechar" por breadcrumbs funcionais do design system

## Contexto

As telas de Configuração atualmente utilizam botões "Voltar para Configurações" (com ícone ArrowLeft) e "Fechar" (com ícone X) para navegação. Este padrão será substituído por breadcrumbs do design system, conforme especificação:
- **Figma:** https://www.figma.com/design/Q2p5d5mIahsEPxXYMOA16V/Dom-DS-Core-Web?node-id=6121-1427

**Motivação:**
- Melhor indicação visual da hierarquia de navegação
- Padrão mais comum em sistemas administrativos
- Consistência com design system
- Navegação mais intuitiva (todos os níveis clicáveis)

## Requisitos

### Funcionais

**Hierarquia de navegação:**
```
Configurações → [Menu de Configuração] → [Item]
```

**Exemplos:**
- `Configurações > Empresas` (tela de lista)
- `Configurações > Empresas > Acme Corp` (tela de detalhes)
- `Configurações > Funcionários do escritório > João Silva`

**Navegação:**
- Todos os níveis do breadcrumb são clicáveis (exceto a página atual)
- Clicar em "Configurações" retorna à tela principal de Configurações
- Clicar no menu (ex: "Empresas") retorna à lista (quando em tela de detalhes)
- Última página (atual) não é clicável

**Navegação por callbacks:**
- Utilizar callbacks existentes (`onBack`, `onClose`) para navegação
- Manter navegação baseada em state (`innerView`, `setInnerView`, etc.)
- Não implementar roteamento por URL neste momento

### Visuais

**Posicionamento:**
- Abaixo do título e descrição da página
- Substitui completamente os botões "Voltar" e "Fechar"
- Margem superior de 8-12px para espaçamento visual

**Componentes do design system:**
- `Breadcrumb` - wrapper nav
- `BreadcrumbList` - lista de itens
- `BreadcrumbItem` - cada nível
- `BreadcrumbLink` - níveis clicáveis
- `BreadcrumbPage` - nível atual (não-clicável)
- `BreadcrumbSeparator` - separador (ChevronRight)

**Estilos aplicados automaticamente:**
- `text-muted-foreground` para links inativos
- `hover:text-foreground` no hover de links
- `text-foreground font-normal` para página atual

## Abordagem Escolhida

### Componente Breadcrumb Wrapper Compartilhado

**Por que esta abordagem:**
- ✅ Consistência garantida em todas as 14 telas
- ✅ Menos código duplicado
- ✅ Fácil manutenção centralizada
- ✅ Labels padronizados
- ✅ Implementação e migração mais rápidas

**Alternativas consideradas:**

**Implementação individual por tela:**
- ❌ Rejeitada: Muito código duplicado (14 telas)
- ❌ Risco de inconsistência visual e comportamental
- ❌ Difícil manutenção (mudanças precisam ser replicadas 14 vezes)

**Hook compartilhado + componente base:**
- ❌ Rejeitada: Over-engineering para este caso
- ❌ Complexidade arquitetural desnecessária
- ❌ Padrão simples não justifica separação hook/componente

## Design Detalhado

### 1. Novo Componente: ConfigBreadcrumb

**Localização:** `src/app/components/ui/config-breadcrumb.tsx`

**Interface TypeScript:**
```typescript
interface ConfigBreadcrumbProps {
  /**
   * Label do menu de configuração
   * Ex: "Empresas", "Feriados e horários", "Funcionários do escritório"
   */
  menuLabel: string;

  /**
   * Label do item específico (opcional)
   * Ex: "Acme Corp", "João Silva", "Tarefa ABC"
   * Se não fornecido, breadcrumb tem 2 níveis (Configurações > Menu)
   * Se fornecido, breadcrumb tem 3 níveis (Configurações > Menu > Item)
   */
  itemLabel?: string;

  /**
   * Callback para navegar de volta para tela principal de Configurações
   * Sempre presente
   */
  onNavigateToConfig: () => void;

  /**
   * Callback para navegar de volta ao menu (lista)
   * Só presente quando itemLabel existe (tela de detalhes)
   */
  onNavigateToMenu?: () => void;
}
```

**Estrutura do componente:**
```tsx
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from './breadcrumb';

export function ConfigBreadcrumb({
  menuLabel,
  itemLabel,
  onNavigateToConfig,
  onNavigateToMenu,
}: ConfigBreadcrumbProps) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {/* Nível 1: Configurações (sempre clicável) */}
        <BreadcrumbItem>
          <BreadcrumbLink onClick={onNavigateToConfig}>
            Configurações
          </BreadcrumbLink>
        </BreadcrumbItem>
        
        <BreadcrumbSeparator />
        
        {/* Nível 2: Menu - clicável SE itemLabel existe, senão é página atual */}
        <BreadcrumbItem>
          {itemLabel ? (
            <BreadcrumbLink onClick={onNavigateToMenu}>
              {menuLabel}
            </BreadcrumbLink>
          ) : (
            <BreadcrumbPage>{menuLabel}</BreadcrumbPage>
          )}
        </BreadcrumbItem>
        
        {/* Nível 3: Item (condicional, sempre página atual) */}
        {itemLabel && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{itemLabel}</BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
```

**Responsabilidades:**
1. Renderizar estrutura de breadcrumbs usando componentes do design system
2. Determinar quantos níveis mostrar (2 ou 3) baseado em `itemLabel`
3. Determinar quais níveis são clicáveis (não o atual)
4. Conectar callbacks de navegação aos links apropriados
5. Aplicar estilos do design system automaticamente

### 2. Padrões de Uso

**Padrão 1 - Tela de Lista (2 níveis):**
```tsx
// Exemplo: src/app/components/Responsabilidades.tsx
<ConfigBreadcrumb 
  menuLabel="Responsabilidades"
  onNavigateToConfig={() => setInnerView(null)}
/>
// Renderiza: Configurações > Responsabilidades
// "Configurações" é clicável, "Responsabilidades" é a página atual
```

**Padrão 2 - Tela de Detalhes/Edição (3 níveis):**
```tsx
// Exemplo: src/app/components/Empresas.tsx (modal de edição)
<ConfigBreadcrumb 
  menuLabel="Empresas"
  itemLabel={empresaSelecionada.nome}
  onNavigateToConfig={() => setInnerView(null)}
  onNavigateToMenu={() => setEmpresaSelecionada(null)}
/>
// Renderiza: Configurações > Empresas > Acme Corp
// "Configurações" e "Empresas" são clicáveis, "Acme Corp" é a página atual
```

**Padrão 3 - Tela de Detalhes com Profundidade Variável:**
```tsx
// Se houver mais de 3 níveis, o componente pode ser extendido ou
// itemLabel pode conter a concatenação dos níveis intermediários
<ConfigBreadcrumb 
  menuLabel="Gerenciar tarefas"
  itemLabel={`${categoria} > ${tarefa.nome}`}
  onNavigateToConfig={() => setInnerView(null)}
  onNavigateToMenu={() => setTarefaSelecionada(null)}
/>
```

### 3. Integração nas Telas Existentes

**Localização física:**
- Posicionar abaixo do título (`<h1>`) e descrição (`<p>`)
- Remover completamente botões "Voltar" e "Fechar"
- Margem superior: `mt-2` ou `mt-3` (8-12px)

**Antes (exemplo FeriadosHorarios.tsx):**
```tsx
<div className="flex flex-col gap-4 p-6">
  <div>
    <h1>Feriados e Horários</h1>
    <p>Gerencie feriados e horários de acesso ao sistema</p>
    <button onClick={onBack}>
      <ArrowLeft size={13} /> Voltar para Configurações
    </button>
  </div>
  {/* conteúdo */}
</div>
```

**Depois:**
```tsx
<div className="flex flex-col gap-4 p-6">
  <div>
    <h1>Feriados e Horários</h1>
    <p>Gerencie feriados e horários de acesso ao sistema</p>
    <ConfigBreadcrumb 
      menuLabel="Feriados e horários"
      onNavigateToConfig={onBack}
    />
  </div>
  {/* conteúdo */}
</div>
```

### 4. Mapeamento de Labels dos Menus

**Labels exatos a serem utilizados:**

| Componente | menuLabel |
|------------|-----------|
| `FuncionariosEscritorio.tsx` | "Funcionários do escritório" |
| `FeriadosHorarios.tsx` | "Feriados e horários" |
| `Responsabilidades.tsx` | "Responsabilidades" |
| `AgrupadorTarefasClientes.tsx` | "Agrupadores de tarefas e clientes" |
| `Empresas.tsx` | "Empresas" |
| `UsuariosCliente.tsx` | "Usuários de clientes" |
| `AdequacaoAgrupadores.tsx` | "Adequação de agrupadores" |
| `ModelosDocumento.tsx` | "Modelos de documento" |
| `GerenciarTarefas.tsx` | "Gerenciar tarefas" |
| `GeradorTarefas.tsx` | "Gerador de tarefas" |
| `PersonalizarAssinatura.tsx` | "Personalizar assinatura e e-mail" |
| `InboxConfig.tsx` | "Inbox" |
| `TemplatesEmailWhatsapp.tsx` | "Modelos de e-mail e WhatsApp" |

**Nota:** "Fluxo de tarefas" mencionado pelo usuário - verificar se existe componente separado ou se está dentro de `GerenciarTarefas.tsx`.

## Estratégia de Implementação

### Ordem de Migração

**Fase 1: Criar componente base**
1. Criar `src/app/components/ui/config-breadcrumb.tsx`
2. Implementar interface e lógica conforme design detalhado
3. Adicionar exports necessários

**Fase 2: Tela piloto**
1. Escolher tela simples (recomendado: `Responsabilidades.tsx`)
2. Implementar breadcrumb
3. Testar navegação
4. Validar visualmente
5. Ajustar componente se necessário

**Fase 3: Migração em lote**
1. Migrar telas simples (lista sem detalhes):
   - Responsabilidades
   - FeriadosHorarios
   - AgrupadorTarefasClientes
   - ModelosDocumento
   - GeradorTarefas
   - PersonalizarAssinatura
   - InboxConfig
   - TemplatesEmailWhatsapp

2. Migrar telas com detalhes (lista + edição):
   - FuncionariosEscritorio
   - Empresas
   - UsuariosCliente
   - AdequacaoAgrupadores
   - GerenciarTarefas

### Mudanças por Tela

**Checklist de implementação:**

Para cada uma das 14 telas:

1. **Importar componente:**
   ```tsx
   import { ConfigBreadcrumb } from './ui/config-breadcrumb';
   ```

2. **Localizar botão "Voltar" ou "Fechar":**
   - Buscar por `<ArrowLeft` ou `<X`
   - Buscar por strings "Voltar" ou "Fechar"

3. **Substituir por ConfigBreadcrumb:**
   - Identificar callback de navegação atual (`onBack`, `onClose`, etc.)
   - Aplicar props adequadas conforme padrão de uso
   - Posicionar no mesmo lugar do botão antigo

4. **Remover código não utilizado:**
   - Remover import de `ArrowLeft` se não usado em outro lugar
   - Remover import de `X` se não usado em outro lugar
   - Remover estilos inline dos botões antigos

5. **Testar navegação:**
   - Clicar em "Configurações" → deve voltar à tela principal
   - Se tela de detalhes: clicar no menu → deve voltar à lista
   - Verificar que última página não é clicável

6. **Validação visual:**
   - Breadcrumb renderiza corretamente
   - Labels estão corretos
   - Espaçamento adequado
   - Separadores (ChevronRight) aparecem
   - Estilos do design system aplicados

### Exemplo Completo de Migração

**Antes - FeriadosHorarios.tsx (linhas ~775-783):**
```tsx
<div>
  <h1 style={{ fontSize: 'var(--text-h2)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)' }}>
    Feriados e Horários
  </h1>
  <p style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>
    Gerencie feriados e horários de acesso ao sistema
  </p>
  <button onClick={onBack}
    className="flex items-center gap-1.5 mt-2 cursor-pointer hover:opacity-75"
    style={{ background: 'none', border: 'none', padding: 0, fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>
    <ArrowLeft size={13} /> Voltar para Configurações
  </button>
</div>
```

**Depois:**
```tsx
<div>
  <h1 style={{ fontSize: 'var(--text-h2)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)' }}>
    Feriados e Horários
  </h1>
  <p style={{ fontSize: 'var(--text-caption)', color: 'var(--muted-foreground)' }}>
    Gerencie feriados e horários de acesso ao sistema
  </p>
  <div className="mt-2">
    <ConfigBreadcrumb 
      menuLabel="Feriados e horários"
      onNavigateToConfig={onBack}
    />
  </div>
</div>
```

**Imports alterados:**
```tsx
// ANTES
import { ArrowLeft, Plus, Search, ... } from 'lucide-react';

// DEPOIS
import { Plus, Search, ... } from 'lucide-react'; // ArrowLeft removido
import { ConfigBreadcrumb } from './ui/config-breadcrumb';
```

## Validação e Testes

### Checklist de Validação (por tela)

**Visual:**
- [ ] Breadcrumb renderiza no local correto (abaixo do título/descrição)
- [ ] Labels corretos para cada nível
- [ ] Separadores (ChevronRight) aparecem entre níveis
- [ ] Último nível (página atual) tem estilo diferenciado (não é link)
- [ ] Níveis clicáveis mudam de cor no hover
- [ ] Espaçamento vertical adequado (8-12px do conteúdo acima)
- [ ] Botões antigos "Voltar"/"Fechar" foram completamente removidos

**Funcional:**
- [ ] Clicar em "Configurações" navega corretamente (fecha a tela atual)
- [ ] Se tela de detalhes: clicar no menu navega para lista
- [ ] Página atual não é clicável (não tem efeito hover, sem cursor pointer)
- [ ] Navegação funciona sem erros de console
- [ ] Estado da aplicação atualiza corretamente após navegação

**Code Quality:**
- [ ] Imports não utilizados removidos (`ArrowLeft`, `X` se aplicável)
- [ ] Props do ConfigBreadcrumb corretas (menuLabel, itemLabel se aplicável, callbacks)
- [ ] Sem warnings do TypeScript
- [ ] Build sucede sem erros

### Teste de Regressão

**Cenários críticos a testar:**

1. **Navegação básica:**
   - Abrir tela de configuração → breadcrumb aparece
   - Clicar em "Configurações" → volta para tela principal

2. **Navegação com detalhes:**
   - Abrir lista (ex: Empresas) → breadcrumb: "Configurações > Empresas"
   - Abrir item → breadcrumb: "Configurações > Empresas > [Nome]"
   - Clicar em "Empresas" → volta para lista
   - Clicar em "Configurações" → fecha tudo

3. **Edge cases:**
   - Nome de item muito longo → breadcrumb deve ter text wrapping adequado
   - Navegação rápida (cliques múltiplos) → sem race conditions
   - Telas sem itemLabel → breadcrumb de 2 níveis funciona

## Impacto e Riscos

### Baixo Risco

**Por que esta mudança é de baixo risco:**
- ✅ Apenas mudança visual/UX, lógica de negócio intocada
- ✅ Callbacks de navegação existentes são reutilizados (sem nova lógica)
- ✅ Componente isolado e testável independentemente
- ✅ Migração gradual possível (tela por tela)
- ✅ Fácil reverter se necessário (código antigo preservado no git)

### Pontos de Atenção

**Consistência de labels:**
- Garantir que `menuLabel` seja exatamente igual ao texto do menu de configurações
- Usar tabela de mapeamento fornecida no design

**Telas com múltiplas profundidades:**
- Se alguma tela tiver mais de 3 níveis, pode precisar adaptar o componente
- Considerar usar `itemLabel` concatenado para níveis intermediários

**Espaçamento visual:**
- Ajustar margem superior (`mt-2`, `mt-3`) se necessário por tela
- Manter consistência visual entre todas as telas

## Dependências

**Componentes existentes necessários:**
- ✅ `src/app/components/ui/breadcrumb.tsx` - já existe no design system
- ✅ Design tokens - já definidos
- ✅ Ícone ChevronRight do lucide-react - já importado no breadcrumb

**Nenhuma nova dependência externa necessária.**

## Próximos Passos

Após aprovação deste design:

1. Criar plano de implementação detalhado com tasks específicas
2. Implementar componente `ConfigBreadcrumb`
3. Migrar tela piloto e validar
4. Migrar demais 13 telas
5. Testar navegação end-to-end
6. Code review final
7. Deploy

---

**Documento aprovado em:** _Aguardando aprovação do usuário_

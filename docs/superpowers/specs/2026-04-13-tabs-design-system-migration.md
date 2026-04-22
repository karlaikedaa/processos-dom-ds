# Design: Migração de Tabs Customizadas para Componente Tabs do Design System

**Data:** 2026-04-13  
**Objetivo:** Substituir botões customizados de tabs por componente Tabs do design system em 6 componentes  
**Referência Figma:** https://www.figma.com/design/Q2p5d5mIahsEPxXYMOA16V/Dom-DS-Core-Web?node-id=6129-2272

## Contexto

Atualmente, vários componentes do sistema usam botões customizados com estilos inline para criar navegação por tabs. Esses botões não seguem o padrão do design system e têm problemas de:
- Inconsistência visual entre componentes
- Falta de acessibilidade (ARIA attributes)
- Código duplicado de estilos
- Não seguem o padrão Radix UI usado no resto do sistema

## Escopo

Substituir tabs customizadas nos seguintes componentes (em ordem de execução):

1. **PersonalizarAssinatura** - 3 tabs (Personalizar assinatura, Personalizar endereço de e-mail, SMTP)
2. **GeradorTarefas** - 2-3 tabs (Gerar tarefas, Remover tarefas)
3. **UsuariosCliente** - 2 tabs de filtro (Ativos, Inativos)
4. **Empresas (Lista)** - 2 tabs de filtro (Ativos, Inativos)
5. **GerenciarTarefas** - 3 tabs (Tarefas recorrentes, Tarefas esporádicas, Tarefas de fluxo)
6. **Empresas (Modal)** - 4 tabs (Informações cadastrais, Tarefas do cliente, Senhas, Certidões e certificados)

## Requisitos

### Funcionais
- Preservar 100% da funcionalidade existente
- Navegação entre tabs deve funcionar identicamente
- Estado deve ser preservado ao trocar tabs
- Contadores dinâmicos devem atualizar corretamente
- Filtros e pesquisas devem continuar funcionando

### Visuais
- Usar componente `Tabs` do design system (`src/app/components/ui/tabs.tsx`)
- Seguir padrão visual do Figma (TabsList com fundo muted, TabsTrigger ativo com bg-background)
- Remover completamente estilos inline dos botões antigos
- Manter espaçamento consistente com o resto do layout

### Técnicos
- Usar `TabsContent` do Radix UI para envolver conteúdo (não renderização condicional simples)
- Importar de `'./ui/tabs'` ou `'../ui/tabs'` conforme localização do componente
- Manter estados existentes (apenas renomear variável se necessário)
- TypeScript sem erros
- Sem warnings no console

## Abordagem Escolhida

**Sequencial Componente por Componente**

Implementar um componente de cada vez, do mais simples ao mais complexo. Cada componente é um commit separado, testado e validado antes de passar para o próximo.

### Alternativas Consideradas

**Em Lote por Tipo:** Agrupar componentes similares (modais, filtros, navegação) e implementar todos de uma vez.
- ❌ Rejeitada: Maior risco - se um padrão estiver errado, afeta múltiplos componentes
- ❌ Rollback mais complexo

**Tudo de Uma Vez:** Implementar todos os 6 componentes em paralelo usando subagent-driven development.
- ❌ Rejeitada: Muito risco inicial, sem validação incremental
- ❌ Problemas de arquitetura só descobertos no final

## Design Detalhado

### 1. Padrão Arquitetural Único

Todos os componentes seguirão este padrão:

```tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';

// Estado (preservar existente)
const [activeTab, setActiveTab] = useState<TabType>('default-value');

// Estrutura
<Tabs value={activeTab} onValueChange={setActiveTab}>
  <TabsList>
    <TabsTrigger value="value1">Label 1</TabsTrigger>
    <TabsTrigger value="value2">Label 2</TabsTrigger>
  </TabsList>
  
  <TabsContent value="value1">
    {/* Conteúdo existente da tab 1 - mover sem reescrever */}
  </TabsContent>
  
  <TabsContent value="value2">
    {/* Conteúdo existente da tab 2 - mover sem reescrever */}
  </TabsContent>
</Tabs>
```

### 2. Componentes Específicos

#### 2.1 PersonalizarAssinatura (Mais Simples - Começar aqui)

**Arquivo:** `src/app/components/PersonalizarAssinatura.tsx`

**Estado atual:**
- Type: `type AssinaturaTab = 'assinatura' | 'endereco' | 'smtp';`
- Estado: `const [tab, setTab] = useState<AssinaturaTab>('assinatura');`
- Localização: ~linha 348-349 (definição das tabs)
- Botões customizados com estilos inline

**Mudanças:**
1. Adicionar import: `import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';`
2. Localizar bloco de botões customizados (`.map(t => <button ...>)`)
3. Substituir por:
```tsx
<Tabs value={tab} onValueChange={setTab}>
  <TabsList>
    <TabsTrigger value="assinatura">Personalizar assinatura</TabsTrigger>
    <TabsTrigger value="endereco">Personalizar endereço de e-mail</TabsTrigger>
    <TabsTrigger value="smtp">SMTP</TabsTrigger>
  </TabsList>
  
  <TabsContent value="assinatura">
    {/* Conteúdo atual da aba assinatura */}
  </TabsContent>
  
  <TabsContent value="endereco">
    {/* Conteúdo atual da aba endereço */}
  </TabsContent>
  
  <TabsContent value="smtp">
    {/* Conteúdo atual da aba SMTP */}
  </TabsContent>
</Tabs>
```

**Preservar:** Toda lógica de formulário e salvamento

---

#### 2.2 GeradorTarefas

**Arquivo:** `src/app/components/GeradorTarefas.tsx`

**Estado atual:**
- Botões para navegar entre "Gerar tarefas" e "Remover tarefas"

**Mudanças:**
1. Adicionar import do Tabs
2. Identificar type e estado existente
3. Substituir botões por TabsList + TabsTrigger
4. Envolver cada modo em TabsContent
5. Preservar toda lógica de geração/remoção

---

#### 2.3 UsuariosCliente (Filtro Ativo/Inativo)

**Arquivo:** `src/app/components/UsuariosCliente.tsx`

**Estado atual:**
- 2 botões de filtro: "Ativos (N)", "Inativos (M)"
- Renderização condicional baseada em status

**Mudanças:**
1. Criar ou identificar estado: `const [statusFilter, setStatusFilter] = useState<'ativo' | 'inativo'>('ativo');`
2. TabsList com 2 TabsTrigger
3. Labels com contador dinâmico:
```tsx
<TabsTrigger value="ativo">
  Ativos ({usuariosAtivos.length})
</TabsTrigger>
<TabsTrigger value="inativo">
  Inativos ({usuariosInativos.length})
</TabsTrigger>
```
4. Envolver tabela filtrada em cada TabsContent
5. Preservar lógica de busca e filtros

---

#### 2.4 Empresas - Lista (Filtro Ativo/Inativo)

**Arquivo:** `src/app/components/Empresas.tsx`

**Estado atual:**
- Similar ao UsuariosCliente
- Localização: ~linhas 560-580 na lista principal

**Mudanças:**
- Padrão idêntico ao 2.3 (UsuariosCliente)
- Contadores baseados em empresas ativas/inativas
- Preservar modal de edição (não mexer ainda - é outro componente)

---

#### 2.5 GerenciarTarefas (Navegação de Conteúdo)

**Arquivo:** `src/app/components/GerenciarTarefas.tsx`

**Estado atual:**
- Type: `type TaskTab = 'recorrentes' | 'esporadicas' | 'fluxo';`
- Estado: `const [tab, setTab] = useState<TaskTab>('recorrentes');`
- Localização: linhas 364-369 (botões)
- 3 botões customizados

**Mudanças:**
1. Import do Tabs
2. Substituir botões (linhas 364-369) por:
```tsx
<Tabs value={tab} onValueChange={setTab}>
  <TabsList>
    <TabsTrigger value="recorrentes">Tarefas recorrentes</TabsTrigger>
    <TabsTrigger value="esporadicas">Tarefas esporádicas</TabsTrigger>
    <TabsTrigger value="fluxo">Tarefas de fluxo</TabsTrigger>
  </TabsList>
  
  <TabsContent value="recorrentes">
    <TableRecorrentes items={filteredRec} setItems={setRecorrentes} />
  </TabsContent>
  
  <TabsContent value="esporadicas">
    <TableEsporadicas items={filteredEsp} setItems={setEsporadicas} />
  </TabsContent>
  
  <TabsContent value="fluxo">
    <TableFluxo items={filteredFluxo} />
  </TabsContent>
</Tabs>
```
3. Preservar: Toolbar (search e toggle integrado), InfoBanner, título com contador

**Nota:** O título "100 Tarefas recorrentes" (linha 372) deve usar a variável `countLabel` que já existe no código.

---

#### 2.6 Empresas - Modal (Mais Complexo - Fazer por último)

**Arquivo:** `src/app/components/Empresas.tsx`

**Estado atual:**
- Type: `type EditTab = 'cadastrais' | 'tarefas' | 'senhas' | 'certidoes';`
- Estado: Dentro de `EditEmpresaPanel` (já existe)
- Localização: linhas 651-665 (botões dentro do modal)
- 4 botões customizados
- Renderização condicional: `{tab === 'cadastrais' && <TabCadastrais ... />}`

**Mudanças:**
1. Import do Tabs no topo do arquivo
2. Localizar o bloco de botões (linhas 651-665)
3. Substituir por TabsList + 4 TabsTrigger
4. Localizar renderização condicional do conteúdo (linhas ~674+)
5. Envolver cada componente filho em TabsContent:
```tsx
<Tabs value={tab} onValueChange={setTab}>
  <TabsList>
    <TabsTrigger value="cadastrais">Informações cadastrais</TabsTrigger>
    <TabsTrigger value="tarefas">Tarefas do cliente</TabsTrigger>
    <TabsTrigger value="senhas">Senhas</TabsTrigger>
    <TabsTrigger value="certidoes">Certidões e certificados</TabsTrigger>
  </TabsList>
  
  <TabsContent value="cadastrais">
    <TabCadastrais empresa={empresa} onChange={setEmpresa} />
  </TabsContent>
  
  <TabsContent value="tarefas">
    <TabTarefasCliente empresaId={empresa.id} />
  </TabsContent>
  
  <TabsContent value="senhas">
    <TabSenhas empresaId={empresa.id} senhas={senhas} setSenhas={setSenhas} />
  </TabsContent>
  
  <TabsContent value="certidoes">
    <TabCertidoes empresaId={empresa.id} certificados={certificados} setCertificados={setCertificados} />
  </TabsContent>
</Tabs>
```

**Preservar:** 
- Action bar com botões CANCELAR/SALVAR (fora das tabs)
- Toda lógica de edição e salvamento
- Componentes filhos (TabCadastrais, TabTarefasCliente, etc.) - não modificar internamente

**Cuidado:** Este é um modal dentro da lista. As tabs são internas ao modal, não confundir com as tabs da lista principal (componente 2.4).

---

### 3. Gerenciamento de Estado

**Princípio:** Manter estados existentes, não criar novos.

Cada componente já tem seu próprio estado de tab:
- `PersonalizarAssinatura`: `tab: AssinaturaTab`
- `GeradorTarefas`: Identificar estado existente
- `UsuariosCliente`: Criar/identificar `statusFilter`
- `Empresas (Lista)`: Criar/identificar `statusFilter`
- `GerenciarTarefas`: `tab: TaskTab`
- `Empresas (Modal)`: `tab: EditTab` (dentro de EditEmpresaPanel)

**Integração com Tabs:**
- `value={estadoExistente}`
- `onValueChange={setEstadoExistente}`
- Radix UI sincroniza automaticamente

**Estado preservado ao trocar tabs:**
O Radix Tabs por padrão **não desmonta** componentes ao trocar tabs, apenas oculta via CSS. Isso significa que:
- Formulários mantêm valores preenchidos
- Scroll position é preservado
- Estado local dos componentes filhos permanece

---

### 4. Estilos e Design System

**Componente Tabs existente:**
Arquivo: `src/app/components/ui/tabs.tsx` (Radix UI + shadcn/ui)

**Estilos aplicados automaticamente:**
- `TabsList`: `bg-muted text-muted-foreground` (fundo cinza claro)
- `TabsTrigger` (inativo): `text-muted-foreground`
- `TabsTrigger` (ativo): `bg-background text-foreground shadow-sm` (branco com sombra)
- Transições suaves: `transition-all`
- Border radius: `rounded-md`

**O que fazer:**
✅ **FAZER:**
- Usar o componente como está
- Remover todos os estilos inline dos botões antigos
- Deixar o design system controlar 100% da aparência

❌ **NÃO FAZER:**
- Adicionar estilos inline customizados
- Modificar o componente Tabs base
- Tentar replicar estilos antigos

**Contadores dinâmicos:**
Para tabs com contagem (ex: "Ativos (7)"), incluir no label:
```tsx
<TabsTrigger value="ativo">
  Ativos ({count})
</TabsTrigger>
```

O `{count}` deve vir de:
- `useMemo` para arrays filtrados
- `.length` de arrays em estado
- Variável calculada reativa

---

### 5. Testes e Validação

**Checklist por componente (executar antes de commit):**

**Compilação:**
- [ ] TypeScript compila sem erros
- [ ] `npm run dev` inicia sem warnings
- [ ] Nenhum erro no console do browser

**Funcionalidade:**
- [ ] Clicar em cada tab navega corretamente
- [ ] Conteúdo correto aparece em cada tab
- [ ] Estado preservado ao trocar tabs (preencher formulário, trocar, voltar - dados ainda lá)
- [ ] Contadores dinâmicos atualizam quando dados mudam
- [ ] Filtros/pesquisa continuam funcionando
- [ ] Ações (salvar, cancelar, etc.) funcionam normalmente

**Visual:**
- [ ] Tabs seguem estilo do design system (fundo muted, ativa branca)
- [ ] Sem estilos inline residuais dos botões antigos
- [ ] Espaçamento correto ao redor das tabs
- [ ] Alinhamento correto com outros elementos da página
- [ ] Responsivo (testa em 1366px e 1920px)

**Navegação:**
- [ ] Tab padrão (inicial) carrega corretamente
- [ ] Trocar entre tabs é instantâneo
- [ ] Não há flicker ou reload de conteúdo
- [ ] Keyboard navigation funciona (Tab, Arrow keys, Enter)

---

### 6. Ordem de Implementação

**Sequência recomendada (do mais simples ao mais complexo):**

1. **PersonalizarAssinatura** ⭐ COMEÇAR AQUI
   - 3 tabs simples
   - Estrutura direta
   - Bom para estabelecer padrão

2. **GeradorTarefas**
   - 2-3 tabs
   - Similar ao anterior

3. **UsuariosCliente**
   - 2 tabs de filtro
   - Introduz conceito de contadores dinâmicos
   - Tabela filtrada

4. **Empresas - Lista Principal**
   - 2 tabs de filtro
   - Similar ao UsuariosCliente
   - Padrão já estabelecido

5. **GerenciarTarefas**
   - 3 tabs
   - Estrutura mais complexa (toolbar, múltiplas tabelas)
   - Testa preservação de estado em componentes maiores

6. **Empresas - Modal de Edição** ⭐ FAZER POR ÚLTIMO
   - 4 tabs
   - Dentro de modal
   - Componentes filhos complexos
   - Maior risco

**Por que essa ordem?**
- Aprender progressivamente
- Validar padrão em casos simples primeiro
- Ganhar confiança antes dos casos complexos
- Cada componente informa melhorias para o próximo

---

### 7. Riscos e Mitigações

**Risco 1: Quebrar funcionalidade ao envolver em TabsContent**
- **Probabilidade:** Média
- **Impacto:** Alto
- **Mitigação:** Mover código existente sem reescrever, apenas envolver. Testar cada funcionalidade após mudança.
- **Plano B:** Se quebrar, reverter commit e investigar antes de prosseguir.

**Risco 2: Estado perdido ao trocar tabs**
- **Probabilidade:** Baixa (Radix mantém componentes montados por padrão)
- **Impacto:** Médio
- **Mitigação:** Testar preenchimento de formulário + troca de tab + retorno.
- **Plano B:** Usar `forceMount` no TabsContent se necessário (improvável).

**Risco 3: Conflitos de CSS com estilos inline existentes**
- **Probabilidade:** Baixa
- **Impacto:** Baixo (apenas visual)
- **Mitigação:** Remover completamente estilos inline dos botões antigos. Inspecionar no browser.
- **Plano B:** Usar `!important` temporariamente (não recomendado) ou ajustar classes.

**Risco 4: Modal dentro de modal (Empresas - Modal de Edição)**
- **Probabilidade:** Baixa
- **Impacto:** Médio (problemas de z-index, focus trap)
- **Mitigação:** Tabs renderizam dentro do modal existente, sem criar novo modal. Testar abertura/fechamento.
- **Plano B:** Ajustar z-index se necessário.

**Risco 5: Contadores dinâmicos não atualizarem**
- **Probabilidade:** Média
- **Impacto:** Baixo (visual apenas)
- **Mitigação:** Usar variáveis reativas (useMemo/state derivado). Testar adição/remoção de itens.
- **Plano B:** Forçar re-render ou mover contador para fora do TabsTrigger.

**Risco 6: Performance com muitos itens em TabsContent**
- **Probabilidade:** Muito Baixa
- **Impacto:** Baixo
- **Mitigação:** Radix mantém todos montados mas ocultos (bom para preservar estado). Se houver problema de performance, usar lazy loading.
- **Plano B:** Usar `unmountOnExit` (customização do Radix) ou renderização condicional híbrida.

**Risco 7: TypeScript errors em tipos existentes**
- **Probabilidade:** Baixa
- **Impacto:** Baixo (bloqueia commit)
- **Mitigação:** Manter types existentes (EditTab, TaskTab, etc.). Não criar novos types.
- **Plano B:** Ajustar types conforme necessário, mas sem quebrar contratos existentes.

---

## Critérios de Sucesso

**Por componente:**
- ✅ Compilação sem erros
- ✅ Todos os testes manuais passam (checklist na seção 5)
- ✅ Visual matching com design system
- ✅ Commit individual criado
- ✅ Dev server funcionando

**Global (após todos os 6 componentes):**
- ✅ Zero botões customizados de tabs no código
- ✅ Todos os componentes usam `Tabs` do design system
- ✅ Consistência visual entre todos os componentes
- ✅ Acessibilidade melhorada (ARIA attributes do Radix)
- ✅ Código mais limpo (sem estilos inline duplicados)

---

## Próximos Passos

Após aprovação deste spec:
1. Criar plano de implementação detalhado (task-by-task)
2. Executar sequencialmente usando subagent-driven development
3. Um componente por vez, com revisão entre cada um
4. Commit individual por componente
5. Validação manual em browser após cada componente

---

## Referências

- **Design System Figma:** https://www.figma.com/design/Q2p5d5mIahsEPxXYMOA16V/Dom-DS-Core-Web?node-id=6129-2272
- **Componente Tabs:** `src/app/components/ui/tabs.tsx`
- **Radix UI Tabs:** https://www.radix-ui.com/primitives/docs/components/tabs
- **Exemplo de implementação:** `src/app/components/Tarefas.tsx` (já usa Tabs do DS corretamente)

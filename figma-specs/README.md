# Especificações e Mockups para Figma

Este diretório contém especificações detalhadas e mockups HTML interativos para criar os frames no Figma.

## 📁 Arquivos

### 1. **FRAME-SPECS.md**
Especificação técnica completa dos 2 frames:
- Dimensões exatas
- Cores (com referência aos design tokens)
- Espaçamentos
- Tipografia
- Estrutura de componentes
- Hierarquia
- Animações

### 2. **visao-geral-mockup.html**
Mockup interativo do frame "Visão Geral - Dashboard"
- Abra no navegador para visualizar
- Layout pixel-perfect com os tokens do design system
- Use como referência visual ao criar no Figma

### 3. **tarefas-lista-mockup.html**
Mockup interativo do frame "Tarefas - Lista com Colapsáveis"
- Abra no navegador para visualizar
- **Clique nos cabeçalhos** para ver as seções expandirem/recolherem
- Demonstra a animação de abertura/fechamento (300ms)

## 🎨 Como usar no Figma

### Passo 1: Abra o arquivo de destino
[Processos - DS TR](https://www.figma.com/design/RP5tDV71kd88hxXHfUyneY/Processos---DS-TR?node-id=39-395)

### Passo 2: Abra o arquivo de referência (Design System)
[Dom-DS-Core-Web](https://www.figma.com/design/Q2p5d5mIahsEPxXYMOA16V/Dom-DS-Core-Web) - **SOMENTE LEITURA**

### Passo 3: Abra os mockups HTML no navegador
1. Abra `visao-geral-mockup.html` no Chrome/Edge/Firefox
2. Abra `tarefas-lista-mockup.html` no Chrome/Edge/Firefox
3. Mantenha as janelas abertas lado a lado com o Figma

### Passo 4: Crie os frames no Figma

#### Frame 1: "Visão Geral - Dashboard"
1. Crie um novo frame: **1400px × 3500px** (aprox)
2. Nomeie: "Visão Geral - Dashboard"
3. Background: #f6f6f6
4. Use **Auto Layout** para facilitar ajustes
5. Siga a estrutura do mockup HTML e as specs do FRAME-SPECS.md

**Componentes principais:**
- Header com barra de progresso
- 2 banners de alerta (laranja/amarelo)
- Grid 3 colunas: cards de destaque
- Gráfico de donut + legenda
- Grid 6 colunas: ações rápidas
- Tabelas de desempenho (grid 2 colunas)
- Tabela de empresas
- Tabela de tarefas

#### Frame 2: "Tarefas - Lista com Colapsáveis"
1. Crie um novo frame: **800px × 1200px** (aprox)
2. Nomeie: "Tarefas - Lista com Colapsáveis"
3. Background: #FFFFFF
4. Border: 1px solid #e5e5e5

**Componentes principais:**
- Seção "Documentos solicitados" (colapsável)
- Seção "Atividades com anexo" (colapsável)
- Seção "Checklist" (colapsável)

**Para criar variantes colapsável/expandido:**
1. Crie **componentes** para cada seção
2. Crie **variantes**: "collapsed" e "expanded"
3. Na variante "collapsed": oculte o conteúdo (height: 0)
4. Na variante "expanded": mostre o conteúdo
5. Use **protótipo**: click no header → Change to variant

### Passo 5: Adicione interatividade (Protótipo)
1. Selecione o header de uma seção colapsável
2. Modo Prototype → Add interaction
3. Trigger: Click
4. Action: Change to → variant oposta
5. Animation: Smart animate, 300ms, Ease out

## 🎯 Design Tokens Utilizados

### Cores Principais
```
Orange 600:  #d64000
Blue 600:    #0766c5
Mint 700:    #2e6b58
Yellow 500:  #e49e1b
Purple 500:  #904eb1
Red 600:     #b92f30
Green:       #387C2B
Gray BG:     #f6f6f6
```

### Espaçamentos
```
8px   (spacing.1x)
16px  (spacing.2x)
24px  (spacing.3x)
32px  (spacing.4x)
```

### Border Radius
```
4px   (borderRadius.s)
8px   (borderRadius.m)
100px (borderRadius.pill)
```

## 📊 Dicas de Implementação

### Use Auto Layout
- Facilita ajustes de espaçamento
- Permite responsividade
- Organiza componentes hierarquicamente

### Crie Componentes Reutilizáveis
- **Card base** → variants para diferentes tipos
- **Badge** → variants: enviado/pendente
- **Progress Bar** → com propriedades de porcentagem
- **Botão** → variants: primary/outline
- **Table Row** → com auto layout

### Nomeação Clara
Use estrutura:
- `Card/Documento/Enviado`
- `Badge/Status/Pendente`
- `Button/Primary`
- `Section/Documentos/Collapsed`
- `Section/Documentos/Expanded`

### Organize com Frames
```
📁 Visão Geral - Dashboard
  ├─ Header
  ├─ Alertas
  ├─ Cards de Destaque
  ├─ Resumo de Tarefas
  ├─ Ações Rápidas
  ├─ Desempenho
  └─ Tabelas

📁 Tarefas - Lista
  ├─ Section/Documentos
  ├─ Section/Atividades
  └─ Section/Checklist
```

## 🔍 Verificação de Qualidade

Antes de finalizar, verifique:

- [ ] Cores correspondem aos tokens do design system
- [ ] Espaçamentos consistentes (8px, 16px, 24px)
- [ ] Border radius consistente (4px, 8px)
- [ ] Tipografia (font-size, font-weight) correta
- [ ] Componentes nomeados claramente
- [ ] Hierarquia de layers organizada
- [ ] Auto Layout aplicado onde apropriado
- [ ] Variantes criadas para estados diferentes
- [ ] Protótipo funcional para collapse/expand
- [ ] Alinhamento no grid de 8px

## 📞 Suporte

Se precisar de ajustes nas especificações:
1. Abra `FRAME-SPECS.md` para detalhes técnicos
2. Consulte os mockups HTML para referência visual
3. Compare com o design system de referência

## ✅ Checklist de Entrega

- [ ] Frame "Visão Geral - Dashboard" criado (1400px)
- [ ] Frame "Tarefas - Lista com Colapsáveis" criado (800px)
- [ ] Componentes organizados e nomeados
- [ ] Variantes de estado criadas (collapsed/expanded)
- [ ] Protótipo com interações de collapse funcional
- [ ] Cores seguem design tokens
- [ ] Espaçamentos consistentes
- [ ] Frames organizados na página node-id=39-395

---

**Tempo estimado:** 2-3 horas para implementar ambos os frames com componentes e protótipos.

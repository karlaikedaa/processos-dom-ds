# Especificações de Frames para Figma

**Arquivo de destino:** [Processos - DS TR](https://www.figma.com/design/RP5tDV71kd88hxXHfUyneY/Processos---DS-TR?node-id=39-395)

**Referência de estilos:** [Dom-DS-Core-Web](https://www.figma.com/design/Q2p5d5mIahsEPxXYMOA16V/Dom-DS-Core-Web)

---

## Frame 1: "Visão Geral - Dashboard"

### Dimensões
- **Largura:** 1400px
- **Altura:** ~3500px (altura variável conforme conteúdo)
- **Background:** #f6f6f6 (colors.neutral.background-01)
- **Padding:** 24px

### Estrutura de Componentes

#### 1. Header com Barra de Progresso
**Container:** 1352px × 120px  
**Background:** #FFFFFF  
**Border Radius:** 8px  
**Border:** 1px solid var(--border)  
**Padding:** 24px

**Conteúdo:**
- **Título grupo 1 - "Tarefas vencendo hoje"**
  - Label: text-sm, color: var(--muted-foreground)
  - Valor: "800 pendentes", text-2xl, font-bold, color: #d64000 (orange.600)

- **Título grupo 2 - "Tarefas concluídas"**
  - Label: text-sm, color: var(--muted-foreground)
  - Valor: "2000", text-2xl, font-bold, color: #387C2B (green)

- **Título grupo 3 - "Total"**
  - Label: text-sm, color: var(--muted-foreground)
  - Valor: "2800", text-2xl, font-bold

**Barra de Progresso:**
- Height: 8px
- Background: #f6f6f6
- Progress fill: #387C2B (71% de 2800)
- Border radius: 9999px (pill)
- Porcentagem: "71%" (text-xs, font-semibold, color: #387C2B)

---

#### 2. Banner Alerta - Falhas de Envio
**Dimensões:** 1352px × auto  
**Background:** rgba(254,166,1,0.12)  
**Padding:** 12px 16px  
**Border Radius:** 8px  
**Margin-bottom:** 16px

**Conteúdo:**
- Ícone: AlertTriangle, size: 20px, color: #9a6a00
- Texto: "12 Tarefas com falha de envio - últimos 30 dias"
  - Font-size: 14px, font-weight: 600, color: #9a6a00
- Botão: "Abrir tarefas" + ArrowRight icon
  - Color: #9a6a00, font-weight: 600

---

#### 3. Banner Alerta - Configurações Pendentes
**Dimensões:** 1352px × auto  
**Background:** rgba(254,166,1,0.08)  
**Padding:** 12px 16px  
**Border Radius:** 8px  
**Margin-bottom:** 24px

**Conteúdo:**
- Ícone: AlertTriangle, size: 20px, color: #9a6a00
- Texto: "07 configurações não realizadas"
  - Font-size: 14px, font-weight: 600, color: #9a6a00
- Botão: "Abrir detalhes" + ArrowRight icon
  - Color: #9a6a00, font-weight: 600

---

#### 4. Três Cards de Destaque (Grid 3 colunas)
**Container:** Grid 3 colunas, gap: 16px

**Card 1 - "4 pontos de atenção"**
- Dimensões: ~440px × 220px
- Background: #FFFFFF
- Border: 1px solid var(--border)
- Border Radius: 8px
- Padding: 16px

**Conteúdo:**
- Título: "4 pontos de atenção", font-semibold, text-sm
- 4 itens com barras de progresso:
  1. "Empresas sem responsável vinculado" - 12 (30%, cor: #DC0A0A)
  2. "Tarefas sem funcionário responsável" - 8 (20%, cor: #FEA601)
  3. "Agrupadores não configurados" - 5 (13%, cor: #904eb1)
  4. "Clientes inativos" - 3 (8%, cor: #8B8D8F)

**Card 2 - "120 tarefas abertas com documentos pendentes"**
- Dimensões: ~440px × 220px
- Layout idêntico ao Card 1

**Conteúdo:**
- Título: "120 tarefas abertas com documentos pendentes"
- "Cobrados: 80"
- "Não cobrados: 40"
- Barra de progresso: 80/120 (67%, cor: #d64000)

**Card 3 - "150 a concluir hoje"**
- Dimensões: ~440px × 220px
- Layout idêntico

**Conteúdo:**
- Título: "150 a concluir hoje"
- "Tarefas sujeitas à multa: 150"
- Barra: 150/200 (75%, cor: #904eb1)
- Legenda: "75% das tarefas críticas de hoje"

---

#### 5. Resumo de Tarefas - Gráfico de Donut
**Container:** 1352px × 380px  
**Background:** #FFFFFF  
**Border:** 1px solid var(--border)  
**Border Radius:** 8px  
**Padding:** 24px

**Layout:**
- Esquerda: Gráfico Donut (300px × 300px)
- Direita: Legenda (Grid 2 colunas)

**Gráfico Donut:**
- Inner radius: 80px
- Outer radius: 120px
- Padding angle: 2deg

**Dados:**
1. Atrasadas: 899 (#DC0A0A)
2. Desconsideradas: 38 (#8B8D8F)
3. Em andamento: 210 (#FEA601)
4. Aguardando aprovação: 347 (#904eb1)
5. Com impedimento: 148 (#DC0A0A)
6. Concluídas: 1240 (#387C2B)

**Legenda:**
- Grid 2 colunas, gap: 12px
- Cada item:
  - Bolinha colorida (12px × 12px, border-radius: 50%)
  - Nome (text-xs, color: var(--muted-foreground))
  - Valor (text-sm, font-semibold)

---

#### 6. Ações Rápidas
**Container:** 1352px × auto  
**Background:** #FFFFFF  
**Border:** 1px solid var(--border)  
**Border Radius:** 8px  
**Padding:** 24px

**Título:** "Ações rápidas", font-semibold, text-lg

**Grid:** 6 colunas, gap: 12px

**Botões (cada um):**
- Dimensões: ~210px × 100px
- Background: #FFFFFF
- Border: 1px solid var(--border)
- Border Radius: 8px
- Padding: 16px
- Hover: shadow-md

**Conteúdo de cada botão:**
- Ícone: 24px (cores variadas conforme design tokens)
- Label: text-xs, text-center, font-medium

**Botões:**
1. "Calendário de tarefas" (Calendar, #0766c5)
2. "Lista de tarefas" (List, #d64000)
3. "Kanban" (LayoutGrid, #2e6b58)
4. "Fluxo de tarefas" (ArrowRight, #904eb1)
5. "Item mais acessado 1" (FileText, #e49e1b)
6. "Item mais acessado 2" (CheckCircle2, #b92f30)

---

#### 7. Desempenho - 2 Tabelas (Grid 2 colunas)
**Container:** Grid 2 colunas, gap: 16px

**Cada tabela:**
- Dimensões: ~668px × auto
- Background: #FFFFFF
- Border: 1px solid var(--border)
- Border Radius: 8px
- Padding: 24px

**Header:**
- Título: "Desempenho por responsável" / "Desempenho por departamento"
- Botão: "Exibir como gráfico" (BarChart3 icon)

**Tabela:**
- Colunas: Nome | Abertas | Concluídas | Progresso
- Font-size: text-sm
- Headers: text-xs, font-medium, color: var(--muted-foreground)
- Borders: 1px solid var(--border)

**Barra de Progresso (coluna Progresso):**
- Width: 64px, height: 6px
- Background: #f6f6f6
- Fill: #387C2B
- Porcentagem: text-xs, font-semibold

---

#### 8. Tarefas por Empresa
**Container:** 1352px × auto  
**Background:** #FFFFFF  
**Border:** 1px solid var(--border)  
**Border Radius:** 8px  
**Padding:** 24px

**Título:** "Tarefas por empresa", font-semibold, text-lg

**Tabela:**
- 9 colunas: Empresa | Total | Abertas | Aberta em atraso | Aberta com multa | Concluídas | Concluídas em atraso | Concluídas com multa | Progresso
- Text-align: left para nome, right para números
- Row hover: bg-gray-50

**Dados de exemplo:**
1. Empresa ABC Ltda: 100, 48, 2, 2, 52, 1, 0, 52%
2. Empresa XYZ S/A: 85, 35, 4, 2, 50, 2, 1, 59%
3. DEF Comércio: 70, 29, 0, 0, 41, 0, 0, 59%
4. GHI Serviços: 65, 22, 1, 2, 43, 1, 0, 66%
5. JKL Indústria: 50, 18, 0, 0, 32, 0, 0, 64%

---

#### 9. Tarefas
**Container:** 1352px × auto  
**Background:** #FFFFFF  
**Border:** 1px solid var(--border)  
**Border Radius:** 8px  
**Padding:** 24px

**Título:** "Tarefas", font-semibold, text-lg

**Tabela:**
- 10 colunas: Tarefa | Tipo | Total | Abertas | Aberta em atraso | Aberta com multa | Concluídas | Concluídas em atraso | Concluídas com multa | Progresso

**Badge de Tipo:**
- Recorrente: bg: rgba(56,124,43,0.1), color: #387C2B
- Esporádico: bg: rgba(254,166,1,0.1), color: #FEA601
- Fluxo: bg: rgba(144,78,177,0.1), color: #904eb1
- Padding: 4px 8px, border-radius: 4px, text-xs, font-medium

**Dados de exemplo:**
1. DCTF Ago/25 (Recorrente): 48, 46, 4, 2, 2, 0, 0, 4%
2. REINF Out/25 (Recorrente): 35, 30, 0, 0, 5, 0, 0, 14%
3. Alteração Contratual (Esporádico): 22, 22, 0, 0, 0, 0, 0, 0%
4. ECF 2025 (Fluxo): 20, 15, 6, 4, 5, 1, 1, 25%
5. Balancete Jan/2026 (Recorrente): 18, 10, 0, 0, 8, 0, 0, 44%

---

## Frame 2: "Tarefas - Lista com Colapsáveis"

### Dimensões
- **Largura:** 800px
- **Altura:** ~1200px (variável)
- **Background:** #FFFFFF
- **Border:** 1px solid var(--border)

### Estrutura

#### Seção 1: Documentos solicitados (Colapsável)
**Estado fechado:**
- Header clicável
- Chevron Right (▶) - 16px, color: var(--muted-foreground)
- Título: "Documentos solicitados (2/5)"
- Botão: "Resumir cobrança" (Send icon, primary color)

**Estado aberto:**
- Chevron Down (▼)
- Conteúdo expandido com animação suave (300ms)
- Lista de documentos com cards

**Card de Documento:**
- Border: 1px solid var(--border)
- Border radius: 8px
- Header: padding: 12px
  - Background enviado: rgba(56,124,43,0.04)
  - Background pendente: var(--input-background)
- Ícone: FileText (14px)
- Nome do documento
- Badge: "Enviado" (verde) ou "Pendente" (laranja)

**Arquivos (se houver):**
- Lista de arquivos enviados
- Botões: "Visualizar" (Eye icon), "Excluir" (Download icon)

**Upload (se não enviado):**
- Botão: "Novo upload" (Upload icon)

---

#### Seção 2: Atividades com anexo (Colapsável)
**Layout idêntico à Seção 1**

**Header:**
- Chevron animado
- Título: "Atividades com anexo (3/1)"
- Botões: "Reenviar" (outline) + "Baixar tudo" (filled)

**Card de Atividade:**
- Ícone: Paperclip
- Nome da atividade
- Badge: "Enviado" ou "Pendente"
- Botões: "Visualizar", "Download"

---

#### Seção 3: Checklist (Colapsável)
**Layout idêntico**

**Header:**
- Chevron animado
- Título: "Checklist (1/5)"

**Items:**
- Checkbox (custom ou nativo)
- Texto da tarefa
- Texto riscado se concluído
- Color: var(--muted-foreground) se concluído, var(--foreground) se pendente

**Dados de exemplo:**
1. ✓ Lançar notas fiscais de entrada
2. ☐ Lançar notas fiscais de saída
3. ☐ Conferir apuração de ICMS
4. ☐ Conferir apuração de IPI
5. ☐ Gerar SPED Fiscal

---

## Animações

### Collapsible
- **Transição:** 300ms cubic-bezier(0.4, 0, 0.2, 1)
- **Propriedades:** height, opacity
- **Keyframes:**
  - slideDown: height 0 → auto, opacity 0 → 1
  - slideUp: height auto → 0, opacity 1 → 0

### Chevron
- **Rotação:** 0deg (▶) → 90deg (▼)
- **Transição:** 200ms ease-in-out

---

## Design Tokens Utilizados

### Cores
```
colors.colors.orange[600]: #d64000
colors.colors.blue[600]: #0766c5
colors.colors.mint[700]: #2e6b58
colors.colors.yellow[500]: #e49e1b
colors.colors.purple[500]: #904eb1
colors.colors.red[600]: #b92f30
colors.neutral["background 01"]: #f6f6f6
```

### Espaçamentos
```
spacing["1x"]: 8px
spacing["2x"]: 16px
spacing["3x"]: 24px
spacing["4x"]: 32px
```

### Border Radius
```
borderRadius.s: 4px
borderRadius.m: 8px
borderRadius.pill: 100px
```

---

## Notas de Implementação

1. **Hierarquia de componentes:** Use Auto Layout no Figma para facilitar ajustes
2. **Componentes reutilizáveis:** Crie componentes para cards, badges, botões
3. **Variantes:** Use variantes para estados (aberto/fechado, enviado/pendente)
4. **Protótipo:** Adicione interações de click para simular collapse/expand
5. **Nomeação:** Use nomes descritivos (ex: "Card/Documento/Enviado")
6. **Alinhamento:** Use grid de 8px para consistência

---

## Arquivo HTML de Referência

Um mockup HTML interativo foi gerado em:
`figma-specs/visao-geral-mockup.html`
`figma-specs/tarefas-lista-mockup.html`

Abra no browser para ver os layouts exatos com funcionalidade de collapse.

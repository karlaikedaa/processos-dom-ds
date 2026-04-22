# Frame: Visão Geral - Dashboard

## 📐 Dimensões
- **Largura**: 1400px (max-width do container)
- **Altura**: Auto (scroll vertical)
- **Background**: `#f6f6f6` (colors.neutral['background 01'])

---

## 🎨 Estrutura de Componentes

### 1. Header com Barra de Progresso
**Componente**: Card branco com padding 24px
- **Background**: white
- **Border**: 1px solid #e5e5e5
- **Border radius**: 8px

#### Números Clicáveis (Flexbox horizontal, gap: 32px)
1. **Tarefas vencendo hoje**
   - Label: "Tarefas vencendo hoje" (14px, gray-600)
   - Número: "800 pendentes" (24px, bold, #ff7033 - orange-600)
   - Estado: Clicável (cursor: pointer, hover: opacity 0.7)

2. **Tarefas concluídas**
   - Label: "Tarefas concluídas" (14px, gray-600)
   - Número: "2000" (24px, bold, #387C2B - green)
   - Estado: Clicável

3. **Total**
   - Label: "Total" (14px, gray-600)
   - Número: "2800" (24px, bold, #000000)
   - Estado: Clicável

#### Barra de Progresso
- Largura: 100%
- Altura: 8px
- Background: #f6f6f6
- Border radius: 4px
- Progresso: 71% preenchido com #387C2B
- Margem superior: 16px

---

### 2. Banners de Alerta (2 cards)

#### Alert 1: Falhas de Envio
- **Background**: rgba(254,166,1,0.12)
- **Padding**: 12px 16px
- **Border radius**: 8px
- **Margem inferior**: 16px

**Conteúdo**:
- Ícone: AlertTriangle (20px, #9a6a00)
- Texto: "12 Tarefas com falha de envio - últimos 30 dias ("
- Links clicáveis (underline, #9a6a00):
  - "Portal"
  - ", "
  - "E-mail"
  - ", "
  - "WhatsApp"
- ")"

#### Alert 2: Erros de Configuração
- **Background**: rgba(254,166,1,0.08)
- **Padding**: 12px 16px
- **Border radius**: 8px

**Conteúdo**:
- Ícone: AlertTriangle (20px, #9a6a00)
- Texto: "07 configurações não realizadas ("
- Links clicáveis (underline, #9a6a00):
  - "Regime tributário"
  - ", "
  - "Agrupadores"
  - ", "
  - "Responsáveis"
- ")"

---

### 3. Cards de Destaque (Grid 3 colunas, gap: 16px)

#### Card 1: Pontos de Atenção
- **Título**: "4 pontos de atenção" (16px, bold)
- 4 itens com:
  - Label (12px, gray-600)
  - Valor (12px, bold)
  - Barra de progresso colorida (altura: 6px)
  - Cores: vermelho, laranja, roxo, cinza

#### Card 2: Documentos Pendentes
- **Título**: "120 tarefas abertas com documentos pendentes"
- Cobrados: 80
- Não cobrados: 40
- Barra de progresso laranja

#### Card 3: Tarefas Hoje
- **Título**: "150 a concluir hoje"
- Tarefas sujeitas à multa: 150
- Barra de progresso roxa
- Subtexto: "75% das tarefas críticas de hoje"

---

### 4. Gráfico de Donut (Card branco)
- **Título**: "Resumo de tarefas"
- **Largura do chart**: 300px
- **Altura do chart**: 300px
- **Tipo**: Donut chart (inner radius: 80px, outer radius: 120px)

**Dados** (sentido horário):
1. Atrasadas: 899 (vermelho #DC0A0A)
2. Desconsideradas: 38 (cinza #8B8D8F)
3. Em andamento: 210 (laranja #FEA601)
4. Aguardando aprovação: 347 (roxo #904eb1)
5. Com impedimento: 148 (vermelho #DC0A0A)
6. Concluídas: 1240 (verde #387C2B)

**Legenda**: Grid ao lado do gráfico
- Cada item: cor + label + valor

---

### 5. Ações Rápidas (Grid 6 colunas, gap: 8px)
Cada card (100px × 100px):
- Ícone (32px) colorido no topo
- Label (12px) embaixo em 2 linhas
- Background: white
- Border: 1px solid #e5e5e5
- Hover: shadow

Itens:
1. Calendário de tarefas (azul #0766c5)
2. Lista de tarefas (laranja #ff7033)
3. Kanban (verde #2e6b58)
4. Fluxo de tarefas (roxo #904eb1)
5. Item mais acessado 1 (amarelo #e49e1b)
6. Item mais acessado 2 (vermelho #b92f30)

---

### 6. Tabelas de Performance (2 colunas)

#### Coluna 1: Desempenho por Responsável
**Colunas da tabela**:
- Nome
- Abertas
- Concluídas
- Progresso (barra + %)

5 linhas de dados

#### Coluna 2: Desempenho por Departamento
**Colunas da tabela**:
- Departamento
- Abertas
- Concluídas
- Progresso (barra + %)

5 linhas de dados

---

### 7. Tarefas por Empresa (Tabela Expansível)
**Header**: "Tarefas por empresa"
**Colunas**: Empresa | Total | Abertas | Aberta em atraso | Aberta com multa | Concluídas | Concluídas em atraso | Concluídas com multa | Progresso

**Feature especial**: Ícone ChevronRight antes do nome
- Ao expandir: mostra lista de tarefas da empresa
- Background expandido: #f6f6f6
- Padding: 16px 48px
- Lista de tarefas com status colorido

5 empresas listadas

---

### 8. Tarefas (Tabela Expansível)
**Header**: "Tarefas"
**Colunas**: Tarefa | Tipo | Total | Abertas | Aberta em atraso | Aberta com multa | Concluídas | Concluídas em atraso | Concluídas com multa | Progresso

**Tipos de tarefa** (badges):
- Recorrente: verde claro
- Esporádico: laranja claro
- Fluxo: roxo claro

**Feature especial**: Ícone ChevronRight antes do nome
- Ao expandir: mostra lista de empresas com essa tarefa
- Background expandido: #f6f6f6
- Lista de empresas com status colorido

5 tarefas listadas

---

## 🎯 Interatividade (indicadores visuais)

### Elementos Clicáveis
- **Números do header**: mostrar ícone de link ou efeito hover
- **Links nos alertas**: underline e cor diferente
- **Chevrons nas tabelas**: rotação 90° quando expandido
- **Cards de ação rápida**: efeito de elevação no hover

### Estados de Drawer (representar com anotação)
- Adicionar anotação: "Drawer lateral desliza da direita ao clicar"
- Mostrar exemplo de 1 drawer aberto com:
  - Overlay escuro (50% opacidade)
  - Painel branco 600px à direita
  - Lista de tarefas dentro

---

## 📏 Espaçamentos
- **Gap entre seções**: 24px
- **Padding dos cards**: 24px
- **Gap em grids**: 16px
- **Border radius**: 8px (padrão)
- **Container max-width**: 1400px
- **Container padding**: 24px

---

## 🎨 Cores Principais
```
Backgrounds:
- Página: #f6f6f6
- Cards: #ffffff
- Expandido: #f6f6f6

Bordas:
- Padrão: #e5e5e5

Status:
- Verde (concluída): #387C2B
- Laranja (em andamento): #FEA601
- Vermelho (impedida/atrasada): #DC0A0A
- Azul (aberta): #0766c5
- Roxo (aguardando): #904eb1
- Cinza (desconsiderada): #8B8D8F

Texto:
- Principal: #000000
- Secundário: #737475
- Muted: #999999
```

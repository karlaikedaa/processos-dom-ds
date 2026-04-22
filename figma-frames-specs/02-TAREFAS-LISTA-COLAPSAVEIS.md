# Frame: Tarefas - Lista com Colapsáveis

## 📐 Dimensões
- **Largura**: 1440px (full viewport width)
- **Altura**: 900px (full viewport height)
- **Layout**: 3 colunas fixas

---

## 🎨 Estrutura Geral

### Layout de 3 Colunas
1. **Coluna 1**: Lista de tarefas agrupadas (320px)
2. **Coluna 2**: Detalhes da tarefa com abas (flex-1)
3. **Coluna 3**: Complementos com seções colapsáveis (384px)

**Separadores**: Border vertical 1px solid #e5e5e5 entre colunas

---

## 📋 COLUNA 1: Lista de Tarefas (320px)

### Background
- Branco (#ffffff)
- Scroll vertical

### Grupos de Tarefas (Collapsible)
Cada grupo contém:

#### Header do Grupo (clicável)
- **Padding**: 12px 16px
- **Background**: white
- **Border bottom**: 1px solid #e5e5e5
- **Hover**: background rgba(0,0,0,0.02)

**Conteúdo**:
- Ícone Hash (14px, #737475)
- Nome do grupo: "DCTF Ago/25" (14px, semibold)
- Badge: "48 itens" (12px, background: #f6f6f6, padding: 2px 8px, rounded-full)
- Chevron: ChevronUp/ChevronDown (14px, #737475)

#### Items do Grupo (quando expandido)
Cada item (tarefa individual):
- **Padding**: 12px 16px 12px 32px
- **Border bottom**: 1px solid #e5e5e5
- **Hover**: background rgba(0,0,0,0.02)
- **Cursor**: pointer
- **Selected**: background rgba(214,64,0,0.05), border-left 3px solid #d64000

**Conteúdo do item**:
- Ícone Building2 (14px, #737475)
- Nome da empresa (14px, regular)
- Responsável (12px, #737475)
- Data meta (12px, #737475)

---

## 📄 COLUNA 2: Detalhes da Tarefa

### Tabs de Navegação
**Background**: rgba(214,64,0,0.05)
**Padding**: 0 24px
**Border bottom**: 1px solid #e5e5e5

4 Abas (horizontais):
1. **Informações** (ativa)
2. **Histórico**
3. **Tarefas associadas**
4. **Usuários do cliente**

**Estilo da aba ativa**:
- Border bottom: 3px solid #d64000
- Cor do texto: #d64000
- Font weight: semibold

### Conteúdo da Aba (scroll)
**Background**: white
**Padding**: 24px

#### Seção: Informações Gerais
Grid 2 colunas com campos:
- **Número**: #1850 (readonly, background cinza claro)
- **Nome da tarefa**: Campo de texto
- **Empresa**: Dropdown
- **Responsável**: Dropdown
- **Status**: Dropdown com badge colorido
- **Data Meta**: Date picker
- **Data Legal**: Date picker
- **Competência**: Campo de texto
- **Criado por**: Readonly
- **Valor**: Campo monetário
- **E-mail da tarefa**: Campo de texto
- **Observação**: Textarea (full width)

#### Seção: Usuários do Cliente
- Lista de cards com:
  - Ícone User
  - Nome (14px, semibold)
  - Email (12px, #737475)
  - Telefone (12px, #737475)

#### Seção: E-mails Adicionais
- Lista de chips com emails
- Botão "+ Adicionar e-mail"

---

## 🗂️ COLUNA 3: Complementos (384px)

### Background
- Branco (#ffffff)
- Scroll vertical
- Border left: 1px solid #e5e5e5

### Header Fixo
**Padding**: 16px
**Border bottom**: 1px solid #e5e5e5
- Título: "Complemento de tarefa" (14px, semibold, #737475)

---

### 1️⃣ SEÇÃO COLAPSÁVEL: Documentos Solicitados

#### Header (sempre visível)
**Padding**: 16px
**Border bottom**: 1px solid #e5e5e5
**Cursor**: pointer

**Layout flexbox (space-between)**:

**Lado esquerdo**:
- Chevron (rotacionável): ChevronRight → ChevronDown quando aberto
- Texto: "Documentos solicitados (3/5)" (12px, semibold, #737475)

**Lado direito**:
- Botão "Resumir cobrança":
  - Background: #d64000
  - Cor: white
  - Padding: 6px 12px
  - Font size: 12px
  - Ícone Send (11px)

#### Conteúdo (quando expandido)
**Animation**: slideDown 300ms ease

**Cada documento** (card):
- **Border**: 1px solid #e5e5e5
- **Border radius**: 8px
- **Margin bottom**: 12px

**Header do documento**:
- Background: 
  - Enviado: rgba(56,124,43,0.04)
  - Pendente: #f6f6f6
- Padding: 12px
- Ícone FileText (14px)
- Nome do documento (14px, semibold)
- Badge de status:
  - Enviado: verde claro
  - Pendente: laranja claro

**Arquivos** (se enviado):
- Lista de arquivos com:
  - Nome do arquivo (12px)
  - Data de envio (12px, #737475)
  - Botões: "Visualizar" | "Excluir"

**Ação** (se pendente):
- Botão "Novo upload" (border laranja, texto laranja)

---

### 2️⃣ SEÇÃO COLAPSÁVEL: Atividades com Anexo

#### Header (sempre visível)
**Padding**: 16px
**Border bottom**: 1px solid #e5e5e5
**Cursor**: pointer

**Layout flexbox (space-between)**:

**Lado esquerdo**:
- Chevron (rotacionável)
- Texto: "Atividades com anexo (2/1)" (12px, semibold, #737475)

**Lado direito** (2 botões):
1. "Reenviar" (border laranja, texto laranja)
2. "Baixar tudo" (background laranja, texto branco)

#### Conteúdo (quando expandido)
**Animation**: slideDown 300ms ease

**Cada atividade** (card):
- **Border**: 1px solid #e5e5e5
- **Border radius**: 8px
- **Padding**: 12px
- Background:
  - Enviado: rgba(56,124,43,0.04)
  - Pendente: #f6f6f6

**Conteúdo**:
- Ícone Paperclip (14px)
- Nome da atividade (14px, semibold)
- Badge de status (enviado/pendente)
- Se enviado:
  - Botões: "Visualizar" | "Download"

---

### 3️⃣ SEÇÃO COLAPSÁVEL: Checklist

#### Header (sempre visível)
**Padding**: 16px
**Cursor**: pointer

**Layout**:
- Chevron (rotacionável)
- Texto: "Checklist (1/5)" (12px, semibold, #737475)

#### Conteúdo (quando expandido)
**Animation**: slideDown 300ms ease

**Cada item do checklist**:
- **Layout**: flexbox horizontal
- **Gap**: 8px
- **Padding**: 8px 0
- **Cursor**: pointer

**Componentes**:
- Checkbox (16px × 16px)
  - Checked: verde com ✓
  - Unchecked: border cinza
- Label (14px)
  - Checked: cinza + line-through
  - Unchecked: preto

---

## 🎯 Animações e Transições

### Chevron Rotation
```css
transition: transform 300ms cubic-bezier(0.4, 0, 0.2, 1);
transform: rotate(0deg);     /* fechado */
transform: rotate(90deg);    /* aberto */
```

### Slide Down/Up
```css
@keyframes slideDown {
  from {
    height: 0;
    opacity: 0;
  }
  to {
    height: var(--content-height);
    opacity: 1;
  }
}
duration: 300ms
easing: cubic-bezier(0.4, 0, 0.2, 1)
```

### Hover States
- Grupos/Items: background rgba(0,0,0,0.02)
- Botões: opacity 0.8
- Transition: 150ms ease

---

## 📏 Dimensões e Espaçamentos

### Colunas
- Coluna 1: 320px (fixo)
- Coluna 2: flex-1 (cresce)
- Coluna 3: 384px (fixo)

### Seções Colapsáveis
- Padding header: 16px
- Padding conteúdo: 16px
- Gap entre cards: 12px
- Border radius: 8px

### Cards de Documento/Atividade
- Border: 1px solid #e5e5e5
- Border radius: 8px
- Padding: 12px
- Margin bottom: 12px

### Checklist
- Checkbox size: 16px × 16px
- Gap entre checkbox e label: 8px
- Padding vertical: 8px

---

## 🎨 Cores e Estados

### Backgrounds
- Coluna: white (#ffffff)
- Seção expandida: transparente
- Card enviado: rgba(56,124,43,0.04)
- Card pendente: #f6f6f6
- Hover: rgba(0,0,0,0.02)
- Selected: rgba(214,64,0,0.05)

### Badges de Status
**Enviado**:
- Background: rgba(56,124,43,0.10)
- Cor: #387C2B
- Texto: "Enviado"

**Pendente**:
- Background: rgba(254,166,1,0.10)
- Cor: #FEA601
- Texto: "Pendente"

### Botões
**Primário** (laranja):
- Background: #d64000
- Cor: white
- Hover: opacity 0.9

**Secundário** (outline laranja):
- Border: 1px solid #d64000
- Background: white
- Cor: #d64000
- Hover: opacity 0.8

### Ícones
- Padrão: #737475 (gray-600)
- Status enviado: #387C2B (verde)
- Status pendente: #FEA601 (laranja)

---

## 🔄 Estados de Interação

### Fechado (Default)
- Chevron aponta para direita (0deg)
- Conteúdo hidden (height: 0, opacity: 0)

### Aberto
- Chevron aponta para baixo (90deg)
- Conteúdo visível com animação slideDown
- Altura automática baseada no conteúdo

### Transição
- Duração: 300ms
- Easing: cubic-bezier(0.4, 0, 0.2, 1)
- Propriedades: transform, height, opacity

---

## 📱 Notas de Implementação no Figma

1. **Use Auto Layout** para todas as listas e grupos
2. **Variants** para estados aberto/fechado dos colapsáveis
3. **Components** para:
   - Card de documento
   - Card de atividade
   - Item de checklist
   - Badge de status
4. **Prototyping**: 
   - Smart animate entre estados
   - Duração: 300ms
   - Easing: ease out
5. **Organize em frames separados**:
   - Frame 1: Estado fechado (todos colapsados)
   - Frame 2: Estado com "Documentos" aberto
   - Frame 3: Estado com "Atividades" aberto
   - Frame 4: Estado com "Checklist" aberto
   - Frame 5: Estado com todos abertos

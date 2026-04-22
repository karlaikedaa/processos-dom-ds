# 🎨 Guia Visual Rápido

## Frame 1: Visão Geral - Dashboard

```
┌─────────────────────────────────────────────────────────────────┐
│                    VISÃO GERAL - DASHBOARD                      │
│                      (1400px width)                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Header com Barra de Progresso                          │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐             │  │
│  │  │ 800 📊   │  │ 2000 ✓   │  │ 2800     │             │  │
│  │  │ pendentes│  │ concluídas│  │ total    │             │  │
│  │  └──────────┘  └──────────┘  └──────────┘             │  │
│  │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━             │  │
│  │  ████████████████████████░░░░░░░░░ 71%                │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ ⚠️  12 Tarefas com falha - Portal, E-mail, WhatsApp    │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ ℹ️  07 configurações - Regime, Agrupadores, Responsáveis│  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐                        │
│  │ 4 pontos│  │ 120     │  │ 150     │                        │
│  │ atenção │  │ docs    │  │ hoje    │                        │
│  │ ▰▰▰░░   │  │ ▰▰▰▰░   │  │ ▰▰▰▰▰   │                        │
│  └─────────┘  └─────────┘  └─────────┘                        │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Resumo de Tarefas (Donut Chart)                        │  │
│  │                                                          │  │
│  │      ╭─────╮        • Atrasadas: 899                    │  │
│  │    ╱         ╲      • Desconsideradas: 38              │  │
│  │   │           │     • Em andamento: 210                 │  │
│  │   │     ○     │     • Aguardando: 347                   │  │
│  │   │           │     • Impedimento: 148                  │  │
│  │    ╲         ╱      • Concluídas: 1240                  │  │
│  │      ╰─────╯                                            │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  Ações Rápidas (6 botões em grid)                              │
│  ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐                         │
│  │📅 │ │📋 │ │⊞  │ │→  │ │📄 │ │✓  │                         │
│  └───┘ └───┘ └───┘ └───┘ └───┘ └───┘                         │
│                                                                 │
│  ┌──────────────────────┐  ┌──────────────────────┐           │
│  │ Desempenho por       │  │ Desempenho por       │           │
│  │ Responsável          │  │ Departamento         │           │
│  │ ┌─────────────────┐  │  │ ┌─────────────────┐  │           │
│  │ │ Nome │ % │ ▰▰▰  │  │  │ │ Dept │ % │ ▰▰▰  │  │           │
│  │ │ ...  │...│ ...  │  │  │ │ ...  │...│ ...  │  │           │
│  │ └─────────────────┘  │  │ └─────────────────┘  │           │
│  └──────────────────────┘  └──────────────────────┘           │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Tarefas por Empresa (Expansível)                        │  │
│  │ ┌─────────────────────────────────────────────────────┐ │  │
│  │ │ ▸ Empresa ABC Ltda │ 100 │ 48 │ ... │ ▰▰▰▰ 52%     │ │  │
│  │ ├─────────────────────────────────────────────────────┤ │  │
│  │ │   ┌─────────────────────────────────────────┐       │ │  │
│  │ │   │ • DCTF Ago/25      [Aberta]     10/04   │       │ │  │
│  │ │   │ • REINF Out/25     [Andamento]  12/04   │       │ │  │
│  │ │   └─────────────────────────────────────────┘       │ │  │
│  │ │ ▸ Empresa XYZ S/A  │ 85  │ 35 │ ... │ ▰▰▰▰ 59%     │ │  │
│  │ └─────────────────────────────────────────────────────┘ │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Tarefas (Expansível)                                    │  │
│  │ ┌─────────────────────────────────────────────────────┐ │  │
│  │ │ ▸ DCTF Ago/25 [Recorrente] │ 48 │ ... │ ▰ 4%       │ │  │
│  │ ├─────────────────────────────────────────────────────┤ │  │
│  │ │   ┌─────────────────────────────────────────┐       │ │  │
│  │ │   │ • Empresa ABC Ltda  [Aberta]     10/04  │       │ │  │
│  │ │   │ • GHI Serviços     [Aberta]     10/04  │       │ │  │
│  │ │   └─────────────────────────────────────────┘       │ │  │
│  │ │ ▸ REINF Out/25 [Recorrente] │ 35│ ... │ ▰▰ 14%     │ │  │
│  │ └─────────────────────────────────────────────────────┘ │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Frame 2: Tarefas - Lista com Colapsáveis

```
┌───────────────────────────────────────────────────────────────────────────────┐
│                     TAREFAS - LISTA COM COLAPSÁVEIS                           │
│                          (1440px × 900px)                                     │
├──────────┬──────────────────────────────────────────────┬─────────────────────┤
│          │                                              │                     │
│  Col 1   │              Col 2                           │      Col 3          │
│  320px   │              flex-1                          │      384px          │
│          │                                              │                     │
│┌────────┐│┌──────────────────────────────────────────┐ │┌──────────────────┐ │
││        │││ Tabs: [Info] Histórico  Associadas  ...  │ ││ Complemento      │ │
││ Grupos │││───────────────────────────────────────────│ ││                  │ │
││        │││                                           │ │├──────────────────┤ │
││▸ DCTF  │││  Informações Gerais                       │ ││                  │ │
││  Ago/25│││  ┌────────┐  ┌────────┐                  │ ││ ▸ Documentos     │ │
││  48    │││  │Número  │  │Nome    │                  │ ││   solicitados    │ │
││        │││  └────────┘  └────────┘                  │ ││   (3/5)    [📤]  │ │
││        │││  ┌────────┐  ┌────────┐                  │ ││                  │ │
││  items:│││  │Empresa │  │Resp.   │                  │ ││                  │ │
││  ▸ ABC │││  └────────┘  └────────┘                  │ ││ ▸ Atividades     │ │
││    Ltda│││  ┌────────┐  ┌────────┐                  │ ││   com anexo      │ │
││  ▸ XYZ │││  │Status  │  │Data    │                  │ ││   (2/1) [↻][⬇]  │ │
││    S/A │││  └────────┘  └────────┘                  │ ││                  │ │
││        │││                                           │ ││                  │ │
││▸ REINF │││  Usuários do Cliente                      │ ││ ▸ Checklist      │ │
││  Out/25│││  ┌────────────────────┐                  │ ││   (1/5)          │ │
││  35    │││  │👤 João Silva       │                  │ ││                  │ │
││        │││  │   joao@email.com   │                  │ ││                  │ │
││▸ ECF   │││  └────────────────────┘                  │ ││                  │ │
││  2025  │││  ┌────────────────────┐                  │ ││                  │ │
││  20    │││  │👤 Maria Santos     │                  │ ││                  │ │
││        │││  │   maria@email.com  │                  │ ││                  │ │
│└────────┘││  └────────────────────┘                  │ │└──────────────────┘ │
│          ││                                           │ │                     │
│          ││  E-mails Adicionais                       │ │                     │
│          ││  [email1@...] [email2@...] [+ Adicionar] │ │                     │
│          │└───────────────────────────────────────────┘ │                     │
│          │                                              │                     │
└──────────┴──────────────────────────────────────────────┴─────────────────────┘
```

### Estado: Documentos Expandido

```
┌─────────────────────┐
│ Complemento         │
├─────────────────────┤
│                     │
│ ▾ Documentos        │ ← Chevron rotacionado 90°
│   solicitados       │
│   (3/5)       [📤]  │
│ ┌─────────────────┐ │
│ │ 📄 Doc 1        │ │ ← Card expandido
│ │ [Enviado] ✓     │ │
│ │ • arquivo.pdf   │ │
│ │   15/03 [👁][🗑] │ │
│ └─────────────────┘ │
│ ┌─────────────────┐ │
│ │ 📄 Doc 2        │ │
│ │ [Pendente] ⏳   │ │
│ │ [⬆ Novo upload] │ │
│ └─────────────────┘ │
│                     │
│ ▸ Atividades        │ ← Fechado
│   com anexo         │
│                     │
│ ▸ Checklist         │ ← Fechado
│                     │
└─────────────────────┘
```

### Estado: Atividades Expandido

```
┌─────────────────────┐
│ Complemento         │
├─────────────────────┤
│                     │
│ ▸ Documentos        │ ← Fechado
│   solicitados       │
│                     │
│ ▾ Atividades        │ ← Aberto
│   com anexo         │
│   (2/1)   [↻][⬇]   │
│ ┌─────────────────┐ │
│ │ 📎 Atividade 1  │ │
│ │ [Enviado] ✓     │ │
│ │ [👁 Visualizar] │ │
│ │ [⬇ Download]    │ │
│ └─────────────────┘ │
│ ┌─────────────────┐ │
│ │ 📎 Atividade 2  │ │
│ │ [Pendente] ⏳   │ │
│ └─────────────────┘ │
│                     │
│ ▸ Checklist         │ ← Fechado
│                     │
└─────────────────────┘
```

### Estado: Checklist Expandido

```
┌─────────────────────┐
│ Complemento         │
├─────────────────────┤
│                     │
│ ▸ Documentos        │ ← Fechado
│   solicitados       │
│                     │
│ ▸ Atividades        │ ← Fechado
│   com anexo         │
│                     │
│ ▾ Checklist         │ ← Aberto
│   (1/5)             │
│ ☑ Item concluído   │ │ ← Riscado, cinza
│ ☐ Item pendente 1   │
│ ☐ Item pendente 2   │
│ ☐ Item pendente 3   │
│ ☐ Item pendente 4   │
│                     │
└─────────────────────┘
```

---

## 🎨 Paleta de Cores Visual

```
Status:
█ #387C2B  Verde (Concluída)
█ #FEA601  Laranja (Em andamento)
█ #DC0A0A  Vermelho (Impedida/Atrasada)
█ #0766c5  Azul (Aberta)
█ #904eb1  Roxo (Aguardando)
█ #8B8D8F  Cinza (Desconsiderada)

Design System:
█ #2e6b58  Mint 700 (Primary)
█ #ff7033  Orange 600
█ #d64000  Orange 600 (Dark)
█ #e49e1b  Yellow 500
█ #b92f30  Red 600

Backgrounds:
█ #ffffff  Branco (Cards)
█ #f6f6f6  Cinza claro (Background)
█ #e5e5e5  Cinza (Borders)
```

---

## 🔄 Animações

### Chevron Rotation
```
Fechado:  ▸  (0°)
Aberto:   ▾  (90°)
Duração: 300ms
Easing: ease-out
```

### Slide Down/Up
```
┌─────┐         ┌─────────┐
│ ▸   │  →300ms →│ ▾       │
└─────┘         │ Content │
                │  shows  │
                │  here   │
                └─────────┘
```

### Expand Row (Tabela)
```
┌─────────────────────────────┐
│ ▸ Empresa ABC │ 100 │ ▰▰▰  │
└─────────────────────────────┘
        ↓ Click (300ms)
┌─────────────────────────────┐
│ ▾ Empresa ABC │ 100 │ ▰▰▰  │
├─────────────────────────────┤
│   • Tarefa 1  [Status]      │
│   • Tarefa 2  [Status]      │
└─────────────────────────────┘
```

---

## 📱 Ícones Utilizados

```
Geral:
📊 Chart/Graph
✓  Checkmark
⚠️  Warning
ℹ️  Info
📅 Calendar
📋 List
⊞  Grid/Kanban
→  Arrow Right
📄 Document
▸/▾ Chevron
👤 User
📎 Attachment
📤 Send
↻  Refresh
⬇  Download
👁  View/Eye
🗑  Delete
⬆  Upload
☑  Checkbox checked
☐  Checkbox unchecked
```

---

## 💡 Dicas Finais

### Auto Layout
```
Vertical Stack:
┌─────────┐
│ Item 1  │ ← Padding: 16px
├─────────┤
│ Item 2  │ ← Gap: 12px
├─────────┤
│ Item 3  │
└─────────┘

Horizontal Stack:
┌───┐ ┌───┐ ┌───┐
│ A │ │ B │ │ C │
└───┘ └───┘ └───┘
  ←  Gap: 16px  →
```

### Components
```
Badge:
┌─────────┐
│ Label   │ ← Padding: 4px 12px
└─────────┘   Border radius: 12px
              Background: colors[status]
```

### Variants
```
Card Documento:
├─ ✓ Enviado   (green background)
└─ ⏳ Pendente  (orange background)

Seção Colapsável:
├─ ▸ Fechado   (height: auto)
└─ ▾ Aberto    (height: content)
```

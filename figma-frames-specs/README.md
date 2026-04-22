# 📐 Especificações para Frames do Figma

Este diretório contém especificações detalhadas para criar frames no Figma correspondentes às implementações realizadas.

## 🎯 Objetivo

Criar frames organizados e documentados no arquivo:
**https://www.figma.com/design/RP5tDV71kd88hxXHfUyneY/Processos---DS-TR?node-id=39-395**

## 📁 Arquivos de Especificação

### 1. [01-VISAO-GERAL-DASHBOARD.md](./01-VISAO-GERAL-DASHBOARD.md)
**Frame: "Visão Geral - Dashboard"**

Especificações completas do novo layout da página inicial com:
- Header com números clicáveis e barra de progresso
- Banners de alerta com links interativos
- Cards de destaque (3 colunas)
- Gráfico de donut
- Ações rápidas (6 botões)
- Tabelas de performance
- Tabelas expansíveis (Empresas e Tarefas)

### 2. [02-TAREFAS-LISTA-COLAPSAVEIS.md](./02-TAREFAS-LISTA-COLAPSAVEIS.md)
**Frame: "Tarefas - Lista com Colapsáveis"**

Especificações da visualização de tarefas com:
- Layout de 3 colunas
- Lista de tarefas agrupadas
- Detalhes da tarefa com abas
- 3 seções colapsáveis no complemento:
  - Documentos solicitados
  - Atividades com anexo
  - Checklist

---

## 🎨 Design System (Referência)

**Arquivo somente leitura**:
https://www.figma.com/design/Q2p5d5mIahsEPxXYMOA16V/Dom-DS-Core-Web

Use os tokens e estilos deste arquivo, mas **NÃO altere nada** nele.

### Tokens Principais

#### Cores
```
colors.neutral['background 01']: #f6f6f6
colors.colors.mint['700']: #2e6b58
colors.colors.orange['600']: #ff7033
colors.colors.orange['400']: #ff7033
colors.colors.purple['500']: #904eb1
colors.colors.blue['600']: #0766c5
colors.colors.red['600']: #b92f30
colors.colors.yellow['500']: #e49e1b

Status colors:
- Verde (concluída): #387C2B
- Laranja (em andamento): #FEA601
- Vermelho (impedida): #DC0A0A
- Azul (aberta): #0766c5
- Roxo (aguardando): #904eb1
- Cinza (desconsiderada): #8B8D8F
```

#### Espaçamentos
```
spacing-2: 8px
spacing-3: 12px
spacing-4: 16px
spacing-6: 24px
spacing-8: 32px
```

#### Bordas
```
borderRadius.md: 8px
borderRadius.lg: 12px
borderRadius.full: 9999px
```

#### Tipografia
```
text-caption: 12px
text-label: 14px
text-base: 16px
text-heading-3: 20px
text-2xl: 24px

font-weight-regular: 400
font-weight-semibold: 600
font-weight-bold: 700
```

---

## 📋 Passo a Passo para Criar no Figma

### 1. Preparação
1. Abra o arquivo de destino no Figma
2. Navegue até a página com `node-id=39-395`
3. Abra o arquivo do design system em outra aba (referência)

### 2. Criação do Frame 1: Visão Geral - Dashboard

#### Configuração Inicial
1. Pressione `F` para criar um frame
2. Nome: "Visão Geral - Dashboard"
3. Largura: 1400px
4. Altura: Auto layout (vertical)
5. Background: #f6f6f6

#### Seguir Especificação
Abra `01-VISAO-GERAL-DASHBOARD.md` e siga seção por seção:

**Ordem de criação**:
1. Header com barra de progresso
2. Banners de alerta
3. Grid de 3 cards de destaque
4. Gráfico de donut
5. Grid de ações rápidas
6. Tabelas de performance
7. Tabela de empresas (criar variant expandido)
8. Tabela de tarefas (criar variant expandido)

#### Dicas
- Use **Auto Layout** para tudo
- Crie **Components** para elementos repetitivos
- Use **Variants** para estados (expandido/colapsado)
- Adicione **anotações** para interatividade

### 3. Criação do Frame 2: Tarefas - Lista com Colapsáveis

#### Configuração Inicial
1. Pressione `F` para criar um frame
2. Nome: "Tarefas - Lista com Colapsáveis"
3. Largura: 1440px
4. Altura: 900px
5. Layout: 3 colunas com auto layout horizontal

#### Seguir Especificação
Abra `02-TAREFAS-LISTA-COLAPSAVEIS.md` e siga:

**Coluna 1** (320px):
- Lista de grupos de tarefas
- Criar variant expandido

**Coluna 2** (flex-1):
- Abas de navegação
- Formulário de detalhes
- Seções de usuários e emails

**Coluna 3** (384px):
- Header fixo
- 3 seções colapsáveis
- Criar 5 variants (fechado, cada seção aberta, todos abertos)

#### Dicas Especiais
- Use **Smart Animate** entre variants
- Duração da animação: 300ms
- Easing: ease out
- Rotação do chevron: 0° → 90°

### 4. Organização

#### Estrutura Sugerida
```
📁 Página (node-id=39-395)
  📄 Visão Geral - Dashboard
  📄 Visão Geral - Dashboard (Drawer Aberto) [opcional]
  📄 Tarefas - Lista (Fechado)
  📄 Tarefas - Lista (Documentos Aberto)
  📄 Tarefas - Lista (Atividades Aberto)
  📄 Tarefas - Lista (Checklist Aberto)
  📄 Tarefas - Lista (Todos Abertos)
```

#### Nomenclatura
- Use nomes claros e descritivos
- Inclua o estado entre parênteses
- Agrupe variants relacionados

### 5. Componentes Reutilizáveis

Crie components para:

**Visão Geral**:
- Card base (white, border, shadow)
- Badge de status (variants por cor)
- Item de tabela
- Row expansível (variants)

**Tarefas**:
- Card de documento (variants: enviado/pendente)
- Card de atividade (variants: enviado/pendente)
- Item de checklist (variants: checked/unchecked)
- Header de seção colapsável
- Botão primário/secundário

### 6. Prototyping (Opcional)

#### Interações Sugeridas
1. **Números clicáveis** → Mostrar drawer
2. **Links nos alertas** → Mostrar drawer
3. **Chevrons nas tabelas** → Expandir/colapsar row
4. **Chevrons nos colapsáveis** → Expandir/colapsar seção

#### Configuração
- Tipo: On click
- Ação: Change to (variant correspondente)
- Animação: Smart animate
- Duração: 300ms
- Easing: Ease out

---

## ✅ Checklist de Validação

### Visão Geral - Dashboard
- [ ] Dimensões corretas (1400px width)
- [ ] Background #f6f6f6
- [ ] 3 números clicáveis no header
- [ ] Barra de progresso funcional
- [ ] 2 banners de alerta com links
- [ ] 3 cards de destaque em grid
- [ ] Gráfico de donut com legenda
- [ ] 6 ações rápidas em grid
- [ ] 2 tabelas de performance
- [ ] Tabelas expansíveis funcionais
- [ ] Cores conforme design system
- [ ] Espaçamentos consistentes
- [ ] Anotações de interatividade

### Tarefas - Lista com Colapsáveis
- [ ] Dimensões corretas (1440px × 900px)
- [ ] 3 colunas (320px | flex | 384px)
- [ ] Lista de grupos funcionais
- [ ] Abas de navegação
- [ ] Formulário de detalhes completo
- [ ] 3 seções colapsáveis
- [ ] Chevrons rotacionam corretamente
- [ ] Animações configuradas (300ms)
- [ ] Cards de documento/atividade
- [ ] Checklist funcional
- [ ] Badges de status coloridos
- [ ] Botões primário e secundário
- [ ] Variants para todos os estados

---

## 🎬 Próximos Passos

Após criar os frames:

1. **Revisar** com a especificação lado a lado
2. **Testar** protótipos de interação
3. **Documentar** no Figma (adicionar descrições)
4. **Compartilhar** link para review
5. **Iterar** baseado em feedback

---

## 📞 Suporte

Se tiver dúvidas sobre as especificações:
- Consulte os arquivos `.md` detalhados
- Verifique a implementação no código em `src/app/components/`
- Compare com o design system de referência

---

**Criado em**: 09/04/2026
**Versão**: 1.0
**Autor**: Claude Code

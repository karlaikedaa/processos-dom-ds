---
name: Localhost Setup - Frontend Environment
description: Setup local development environment for Domínio Processos React frontend
type: setup
status: approved
date: 2026-04-08
---

# Design: Ambiente Frontend Localhost

## Contexto

O projeto "Domínio Processos" é um protótipo React exportado do Figma para um sistema de gestão de tarefas, documentos e fluxos de trabalho voltado para escritórios contábeis.

**Stack tecnológico:**
- React 18.3.1
- TypeScript
- Vite 6.3.5
- TailwindCSS 4.1.12
- Material-UI 7.3.5
- Radix UI (vários componentes)
- React Router 7.13.0

## Objetivo

Executar o protótipo React do Domínio Processos em ambiente de desenvolvimento local usando NPM como gerenciador de pacotes.

## Escopo

**Incluído:**
- Instalação de dependências
- Inicialização do servidor de desenvolvimento
- Validação de funcionamento básico

**Não incluído:**
- Configuração de backend/APIs
- Configuração de banco de dados
- Deploy em produção
- Configurações customizadas de ambiente

## Abordagem Escolhida

Usar **NPM** como gerenciador de pacotes (conforme README existente).

**Justificativa:**
- Já documentado no README.md
- Não requer instalação de ferramentas adicionais
- Universalmente suportado
- Simplicidade para setup inicial

**Alternativas consideradas:**
- PNPM: Mais rápido mas requer instalação adicional
- Yarn: Popular mas sem configurações específicas no projeto

## Processo de Setup

### 1. Instalação de Dependências
```bash
npm install
```

**O que faz:**
- Lê package.json
- Baixa e instala todas as dependências listadas
- Cria node_modules/ e package-lock.json
- Instala peer dependencies (React 18.3.1 e React-DOM 18.3.1)

### 2. Iniciar Servidor de Desenvolvimento
```bash
npm run dev
```

**O que faz:**
- Executa comando `vite` configurado no package.json
- Inicia servidor de desenvolvimento Vite
- Habilita Hot Module Replacement (HMR)
- Expõe aplicação em porta local (geralmente 5173)

### 3. Acessar Aplicação
- Abrir navegador no endereço exibido no terminal
- Padrão: `http://localhost:5173`

## Critérios de Sucesso

✅ Comando `npm install` completa sem erros  
✅ Comando `npm run dev` inicia o servidor Vite  
✅ Console exibe URL de acesso local  
✅ Navegador carrega a interface do sistema  
✅ Hot reload funciona ao editar arquivos

## Tratamento de Problemas

### Porta ocupada
- **Sintoma:** Erro "Port 5173 is already in use"
- **Solução:** Vite automaticamente tentará próxima porta disponível (5174, 5175, etc.)

### Erros de dependência
- **Sintoma:** Erros durante `npm install`
- **Solução:** Verificar versão do Node.js (recomendado Node 18+)
- **Comando:** `node --version`

### Problemas de permissão (Windows)
- **Sintoma:** Erros de acesso negado
- **Solução:** Executar terminal como administrador

### Cache corrompido
- **Sintoma:** Erros inexplicáveis após mudanças
- **Solução:** Limpar cache do Vite
- **Comando:** `rm -rf node_modules/.vite`

## Requisitos Técnicos

**Node.js:** Versão 18+ recomendada  
**NPM:** Versão 8+ (incluída com Node.js)  
**Sistema Operacional:** Windows, macOS ou Linux  
**Navegador:** Chrome, Firefox, Safari ou Edge (versões recentes)

## Próximos Passos

Após o ambiente estar funcionando:
1. Explorar componentes existentes
2. Testar navegação entre páginas
3. Verificar responsividade
4. Identificar necessidades de backend (se aplicável no futuro)

## Referências

- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- README.md do projeto
- PRD: src/imports/prd-dominio-processos.md

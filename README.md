# MediaTracker UI

Interface web do **MediaTracker**, uma aplicação para catálogo, rastreamento e diário de consumo de filmes e séries, integrada à API do MediaTracker e aos dados do The Movie Database (TMDB).

---

## Funcionalidades

- **Exploração e Catálogo**: Visualização de destaques, mídias mais bem avaliadas e busca detalhada de filmes e séries.
- **Diário de Visualização (Journal)**: Registro e controle de filmes assistidos e progresso de episódios por temporadas.
- **Autenticação e Perfil**: Login, cadastro, redefinição de senha e gerenciamento de perfil.
- **Internacionalização (i18n)**: Suporte nativo a Português (pt-BR) e Inglês (en-US) com detecção automática e via cookies.

---

## Tecnologias

- [Next.js](https://nextjs.org/) (App Router, Server Actions e Turbopack)
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Zod](https://zod.dev/)

---

## Como Executar o Projeto

### Pré-requisitos

- [Node.js](https://nodejs.org/) (versão 20 ou superior recomendada)
- [pnpm](https://pnpm.io/) (recomendado) ou npm/yarn
- [MediaTracker API](https://github.com/MandyDevelopingThings/media-tracker-api) em execução

---

### Passo a Passo

#### 1. Clonar o repositório

```bash
git clone git@github.com:MandyDevelopingThings/media-tracker-ui.git
cd media-tracker-ui
```

#### 2. Instalar as dependências

```bash
pnpm install
```

#### 3. Configurar as variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto (ou duplique a partir do `.env.example`):

```bash
cp .env.example .env.local
```

Conteúdo padrão do `.env.local`:

```env
API_BASE_URL="http://localhost:5004"
```

> **Nota**: Caso o backend esteja rodando em outro host ou porta, atualize o valor de `API_BASE_URL`.

#### 4. Iniciar o servidor de desenvolvimento

```bash
pnpm dev
```

A aplicação estará disponível em [http://localhost:3000](http://localhost:3000).

#### Executar em modo de produção

Para validar o comportamento real do projeto:

```bash
pnpm build
pnpm start
```

---

## Scripts Disponíveis

| Comando | Descrição |
| :--- | :--- |
| `pnpm dev` | Inicia o servidor local de desenvolvimento com Turbopack |
| `pnpm build` | Gera a versão otimizada de produção da aplicação |
| `pnpm start` | Inicia a aplicação utilizando a compilação gerada pelo build |
| `pnpm lint` | Executa a análise estática do código-fonte com o ESLint |

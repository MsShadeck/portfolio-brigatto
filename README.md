# Portfólio Videomaker

Site de portfólio para videomaker com área pública (portfólio, clientes, sobre,
contato) e painel administrativo próprio — sem precisar de desenvolvedor para
o dia a dia (adicionar vídeos, trocar textos, responder mensagens etc.).

## Stack

- **Next.js 16** (App Router) + TypeScript + Tailwind CSS 4
- **Prisma 6** + PostgreSQL (Neon, integrado na Vercel, ou Supabase)
- **Auth.js (NextAuth v5)** — login por e-mail/senha com bcrypt
- **Vercel Blob** — upload de thumbnails, logos e foto de perfil
- **Zod** — validação de formulários
- **@dnd-kit** — reordenação por arrastar-e-soltar no admin

---

## 1. Rodando localmente

### Pré-requisitos

- [Node.js](https://nodejs.org) 20 ou superior
- Uma string de conexão Postgres (veja a seção 2 — o mais simples é criar um
  banco Neon gratuito direto pelo painel da Vercel, mesmo antes de fazer deploy)

### Passo a passo

```bash
# 1. Instalar as dependências
npm install

# 2. Copiar o arquivo de variáveis de ambiente
cp .env.example .env
# Edite o .env e preencha DATABASE_URL, AUTH_SECRET, ADMIN_EMAIL e ADMIN_PASSWORD
# (gere o AUTH_SECRET com: npx auth secret)

# 3. Aplicar o schema no banco (primeira vez)
npx prisma migrate dev --name init

# 4. Popular o banco com o usuário admin e alguns dados de exemplo
npm run db:seed

# 5. Rodar o projeto
npm run dev
```

Acesse `http://localhost:3000` para o site público e
`http://localhost:3000/admin` para o painel administrativo (use o
`ADMIN_EMAIL`/`ADMIN_PASSWORD` definidos no `.env`).

> **Sobre uploads em desenvolvimento:** sem configurar o `BLOB_READ_WRITE_TOKEN`
> (seção 3), o upload de imagens no admin vai falhar com uma mensagem
> explicando isso. O restante do site funciona normalmente com as imagens de
> exemplo criadas pelo seed.

---

## 2. Banco de dados

O projeto usa Postgres tanto em desenvolvimento quanto em produção (não há
mais SQLite — simplifica não ter dois dialetos de SQL diferentes).

- **Criar um banco gratuito:** o mais simples é pelo próprio painel da
  Vercel — Storage → Create Database → Postgres (usa [Neon](https://neon.tech)
  por baixo). Alternativa: criar direto em [neon.tech](https://neon.tech) ou
  [supabase.com](https://supabase.com).
- Copie a connection string gerada para `DATABASE_URL` no `.env` (local) e
  nas variáveis de ambiente do projeto na Vercel (produção) — pode ser o
  **mesmo banco** para os dois, ou uma branch/projeto separado para dev.

Comandos úteis:

```bash
npx prisma studio        # interface visual para ver/editar os dados
npx prisma migrate dev   # aplicar mudanças no schema durante o desenvolvimento
npx prisma migrate deploy # aplicar migrações existentes (usado em produção)
```

---

## 3. Upload de imagens (Vercel Blob)

O admin usa o [Vercel Blob](https://vercel.com/docs/storage/vercel-blob) para
thumbnails de vídeos, logos de clientes e foto de perfil.

1. Crie um projeto na Vercel (ou use um existente) e conecte um **Blob
   Store** em: Project → Storage → Create → Blob.
2. A Vercel gera automaticamente a variável `BLOB_READ_WRITE_TOKEN` no
   ambiente do projeto.
3. Para testar localmente, copie esse token para o `.env` local:
   `vercel env pull .env.local` (com a [Vercel CLI](https://vercel.com/docs/cli))
   ou copie manualmente do painel da Vercel.

Sem essa variável configurada, tudo funciona exceto o upload de novas imagens.

---

## 4. Deploy na Vercel

1. Suba o projeto para um repositório no GitHub/GitLab/Bitbucket.
2. Em [vercel.com/new](https://vercel.com/new), importe o repositório.
3. Crie o banco Postgres (Storage → Create Database → Postgres) — a
   `DATABASE_URL` é preenchida automaticamente.
4. Crie o Blob Store (Storage → Create Database → Blob) — o
   `BLOB_READ_WRITE_TOKEN` também é preenchido automaticamente.
5. Configure as demais variáveis de ambiente do projeto:
   - `NEXT_PUBLIC_SITE_URL` — a URL final do site
   - `AUTH_SECRET`
   - `ADMIN_NOME`, `ADMIN_EMAIL`, `ADMIN_PASSWORD` (usados só no seed inicial)
6. Depois do primeiro deploy, rode a migração e o seed contra o banco de
   produção (uma vez, do seu computador):
   ```bash
   DATABASE_URL="<connection-string-copiada-da-vercel>" npx prisma migrate deploy
   DATABASE_URL="<connection-string-copiada-da-vercel>" npm run db:seed
   ```
7. Troque a senha do admin pelo próprio painel (`/admin/conta`) assim que
   acessar em produção.

---

## 5. Guia rápido do painel admin

Acesse `/admin` e entre com seu e-mail e senha.

- **Dashboard** — visão geral: total de vídeos, clientes e mensagens novas.
- **Vídeos** — cadastre cada trabalho: título, link do YouTube/Vimeo, uma
  imagem de capa (thumbnail), categoria, cliente (opcional), ano e sua função
  no projeto. Marque **Destaque** para aparecer na home e **Publicado**
  quando quiser que fique visível no site (deixe desmarcado para manter como
  rascunho). Arraste pelo ícone ⠿ para mudar a ordem de exibição.
- **Clientes** — nome, logo e, se quiser, um depoimento e o site do cliente.
  Também dá pra arrastar para reordenar.
- **Categorias** — os filtros que aparecem na página de Trabalhos (ex.:
  Aftermovie, Clipe, Institucional...). Uma categoria só pode ser excluída se
  nenhum vídeo estiver usando ela.
- **Mensagens** — tudo que for enviado pelo formulário de contato do site
  cai aqui. Dá para marcar como lida ou excluir.
- **Configurações** — nome do site, textos da home, biografia da página
  Sobre, foto de perfil, redes sociais, WhatsApp e e-mail de contato.
- **Conta** — trocar sua senha.

Todas as ações mostram uma mensagem de confirmação ou erro na tela, e pedem
confirmação antes de excluir algo.

---

## 6. Estrutura do projeto

```
prisma/            schema do banco, migrações e seed
src/
  app/
    (public)/       páginas públicas do site (home, trabalhos, clientes, sobre, contato)
    admin/          painel administrativo (protegido por login)
    api/auth/       rota do Auth.js
  actions/          server actions (todo o CRUD do admin + formulário de contato)
  components/
    public/         componentes do site público
    admin/           componentes do painel
    ui/             botões, campos de formulário etc. (compartilhados)
  lib/              Prisma client, autenticação, validações Zod, upload, utilidades
```

---

## Notas

- O CLI do Prisma (`prisma`) tem uma dependência transitiva
  (`deepmerge-ts`) com um alerta de segurança "high" sem correção disponível
  na versão estável atual (afeta só a ferramenta de linha de comando usada
  localmente/no deploy, não o site em produção). Vale rodar `npm audit`
  periodicamente e atualizar o Prisma quando uma versão corrigida sair.
- O e-mail automático de notificação de novas mensagens (via Resend) não foi
  implementado — é opcional no escopo original. As variáveis `RESEND_API_KEY`
  e `RESEND_FROM_EMAIL` já estão reservadas no `.env.example` para quem
  quiser adicionar depois.

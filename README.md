# Nova Sabrina

App pessoal de acompanhamento de saúde, treino em casa e alimentação — feita à medida para a Sabrina: pós-cirurgia bariátrica, atualmente a tomar Mounjaro, com cirurgias plásticas marcadas para dezembro na Turquia.

Não é um produto genérico de fitness — é uma versão pessoal, suave e acolhedora, pensada para esta fase específica da vida dela. Paleta rosa quente + azul pastel, tom de apoio em vez de números frios.

## Stack

- Vite + TypeScript, sem framework de UI — SPA leve, fácil de manter offline.
- Estado local em `localStorage` (fonte de verdade), tipado em `src/lib/storage.ts`.
- Sincronização opcional entre dispositivos via Supabase (`src/lib/sync.ts`), com merge automático em conflitos. Sem configuração, a app funciona 100% local/offline.
- PWA instalável: `public/manifest.webmanifest` + `public/sw.js` (service worker escrito à mão, cache-first).
- Testes: Vitest (`npm test`).
- Deploy: GitHub Pages via GitHub Actions.

## Estrutura

```
src/
  data/        Exercícios (só casa), plano de treino semanal (Normal + Suave/Recuperação),
               plano alimentar (porções em chávenas/colheres, sem pesar), cirurgias previstas
  lib/         storage, merge (resolução de conflitos), datas (contagem Turquia), cálculo
               calórico, cliente Supabase, sync, notificações
  ui/          nav + 6 separadores (Hoje, Treino, Comer, Progresso, Cirurgia, Definições) + componentes
supabase/schema.sql   Esquema para sincronização cloud (tabela chave/valor + RLS)
scripts/stamp-sw.mjs  Dá à cache do service worker um nome único por build
tests/                Testes Vitest (storage, merge/sync, dados de treino e dieta, datas)
```

## Correr localmente

```bash
npm install
npm run dev       # servidor de desenvolvimento
npm test          # testes
npm run build     # build de produção (gera dist/)
npm run preview   # pré-visualizar o build
```

## Publicar no GitHub Pages

O workflow `.github/workflows/deploy.yml` publica automaticamente a cada push para `main`:

1. Em **Settings → Pages**, define a origem como **GitHub Actions**.
2. (Opcional) Define os secrets `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` em **Settings → Secrets and variables → Actions** para ativar a sincronização cloud no build publicado.
3. Faz push para `main` — o site fica disponível em `https://<utilizador>.github.io/Sabrina-Health/`.

Se publicares num domínio próprio (raiz, não subpasta), define `VITE_BASE_PATH=/` como variável de ambiente do build.

## Sincronização cloud (opcional)

Sem `VITE_SUPABASE_URL`/`VITE_SUPABASE_ANON_KEY` definidos, a app funciona inteiramente local/offline — nada quebra, só não sincroniza entre dispositivos.

**1. Criar o projeto Supabase** — [supabase.com](https://supabase.com/dashboard) → New project.

**2. Executar `supabase/schema.sql`** — SQL Editor → New query → colar o conteúdo do ficheiro → Run. Confirma que apareceu a tabela `user_data` com RLS ativo (4 policies).

**3. Auth por magic link** — Authentication → Providers → Email já vem ativo por omissão. Não é preciso password nem outro provider.

**4. Copiar as chaves** — Project Settings → API → `Project URL` e `anon public key`. Cola-os em `.env` local (ver `.env.example`) e/ou nos secrets do GitHub Actions.

`VITE_SUPABASE_URL` e a `anon key` são seguros para expor publicamente no bundle — é o que a Supabase espera, e o acesso de cada utilizador é restringido pelas políticas de Row Level Security em `schema.sql` (`auth.uid() = user_id`). A `service_role key` **nunca** deve ser usada neste projeto.

## Sobre o conteúdo

Os planos de treino e alimentação são pensados especificamente para o contexto pós-bariátrica + Mounjaro + cirurgias plásticas de dezembro:

- **Treino** — só em casa (sem ginásio), cada dia tem uma versão Normal e uma versão Suave/Recuperação, sem exercícios de alto impacto ou core agressivo, pensados para poderem ser trocados livremente nas semanas à volta das cirurgias.
- **Alimentação** — porções sempre em chávenas, colheres e unidades, nunca em gramas. Foco nos alimentos que a Sabrina já come (granola, chia, sementes de abóbora, psílio, aveia), porções pequenas e alta proteína.
- **Cirurgia & Recuperação** — só uma lista informativa das cirurgias previstas e uma agenda simples de curativos. Sem qualquer lógica clínica — não substitui indicação médica.

Todos os valores de kcal/macros são estimativas de referência para acompanhamento pessoal, não dados de tabela nutricional certificada.

# Supabase setup (ClaimSaver+)

This app uses **Clerk** for authentication (Google and other OAuth providers). **Supabase** provides **Postgres** for structured data and **Storage** for claim document files. The Next.js server talks to Supabase with the **service role** key (never expose it to the browser).

There is **no legacy data migration** in this repo: use a **fresh** Supabase project (or empty database), apply **one** SQL migration, and go.

## App vs Postgres connection (read this if “nothing connects”)

Supabase gives you **two different connection paths**:

| What | Typical value | Used for |
|------|----------------|----------|
| **Project URL (HTTPS)** | `https://<project-ref>.supabase.co` | **ClaimSaver** — `NEXT_PUBLIC_SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY`. Goes over normal HTTPS (**IPv4-friendly**). This is what the Next.js API routes use. |
| **Direct Postgres** | `db.<project-ref>.supabase.co` **port `5432`** | `psql`, TablePlus, `npm run db:migrate:supabase`. In some regions this endpoint is **not IPv4-compatible**; Supabase may show a warning. |
| **Session pooler (Postgres)** | Host/port shown under **Database → Connection string → Session pooler** (often port **`6543`**) | Same tools as direct Postgres, but **IPv4-compatible**. Use this URI for `SUPABASE_DATABASE_URL` if `5432` fails or you’re on an IPv4-only network. |

**ClaimSaver does not use** the `postgresql://…@db…:5432` string for runtime — only for optional **CLI migrations** if you set `SUPABASE_DATABASE_URL`. The live app only needs the **HTTPS** URL and **service_role** key from **Settings → API**.

## Schema (what gets created)

| Area | Details |
|------|---------|
| **Tables** | `profiles`, `claims`, `claim_documents`, `calendar_events` |
| **Document categories** | `claim_documents.type`: `medical`, `legal`, `insurance`, `evidence`, `other` |
| **Calendar event types** | `appointment`, `deadline`, `follow-up`, `payment`, `custom` |
| **Storage** | Private bucket `claim-documents` (~50 MB per file) |

All definitions live in **`supabase/migrations/001_initial_claimsaver.sql`**.

## Quick checklist

1. **API keys** — **Project Settings** → **API**:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **`service_role`** (secret) → `SUPABASE_SERVICE_ROLE_KEY` (server only; never `NEXT_PUBLIC_*`)
2. **Apply the migration** — [§2](#2-apply-database-migrations): SQL Editor, Supabase CLI, or direct Postgres (`npm run db:migrate:supabase`).
3. **Confirm** — **Table Editor**: four tables. **Storage**: bucket `claim-documents`.
4. **Env** — `.env.local` per [§4](#4-environment-variables); restart `npm run dev`.
5. **Smoke test** — `GET /api/check-env`: `database.supabase.hasUrl` and `hasServiceRoleKey` should be `true`.

## 1. Create a Supabase project

Create a project in the [dashboard](https://supabase.com/dashboard) and wait until the database is ready. Note **Project URL** and **`service_role`** under **Settings → API**.

## 2. Apply database migrations

**Single file:** `supabase/migrations/001_initial_claimsaver.sql`

### Option A — Dashboard

**SQL Editor** → **New query** → paste **only the SQL from the file** (open `supabase/migrations/001_initial_claimsaver.sql` in your editor, **Select All**, copy, paste). Do **not** type or paste the filename. The query must **not** begin with `001_initial_claimsaver` or `001` — that causes `ERROR: 42601: trailing junk after numeric literal` (Postgres reads `001` as a number). The migration file starts with `--` so line 1 is not a digit.

If your paste accidentally looks like `001_initial_claimsaver.sql--` or `001_initial_claimsaver.sql/*` on **one line**, delete the filename part and leave a newline before the rest. → **Run**.

### Option B — Supabase CLI

```bash
supabase login
supabase init    # if you have not already; keeps existing supabase/migrations/
supabase link --project-ref <YOUR_PROJECT_REF>
supabase db push
```

### Option C — Direct Postgres (if the dashboard shows “Failed to fetch” / `api.supabase.com`)

1. **Settings → Database** → **Connection string**.
2. Prefer **Session pooler** (or “Pooler”) if you see **“Not IPv4 compatible”** for direct `5432` — copy the **Session mode** URI (often port **`6543`**). Otherwise you can use **Direct connection** (`db.<ref>.supabase.co:5432`).
3. Replace `[YOUR-PASSWORD]` with your database password (set or reset on the same page). Append **`?sslmode=require`** if not already in the URI.
4. In `.env.local` (do not commit):

   ```bash
   # Example shapes — use the exact string from the dashboard (pooler recommended on IPv4)
   SUPABASE_DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@db.<ref>.supabase.co:5432/postgres?sslmode=require
   # or Session pooler, e.g. port 6543 — copy from Supabase UI
   ```

5. From the project root:

   ```bash
   npm install
   npm run db:migrate:supabase
   ```

This runs `001_initial_claimsaver.sql` via the `pg` driver only—no `api.supabase.com`.

**Security:** `SUPABASE_DATABASE_URL` is as sensitive as a root DB password. The running app only needs `NEXT_PUBLIC_SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY`.

### Optional: Supabase Agent Skills (Cursor / AI tools)

For richer Supabase-aware help in your editor:

```bash
npx skills add supabase/agent-skills
```

## 3. Storage bucket

Migration `001` creates the private bucket **`claim-documents`**. Uploads/downloads use the service role on the server.

## 4. Environment variables

Add to `.env.local` (and hosting):

| Variable | Notes |
|----------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | **Must** be the HTTPS project URL, e.g. `https://<project-ref>.supabase.co` (from **Settings → API**). Not `postgresql://…`. |
| `SUPABASE_SERVICE_ROLE_KEY` | **Server only** |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk |
| `CLERK_SECRET_KEY` | Clerk |
| `CLERK_WEBHOOK_SECRET` | Optional; for `/api/webhooks/clerk` |

Optional: `MONGODB_URI` only if you still use code paths that connect to Mongo (being phased out).

## 5. Clerk webhook (recommended)

Point Clerk’s webhook to:

`https://your-domain.com/api/webhooks/clerk`

Subscribe at least to `user.created` and `user.updated` so `profiles` stay in sync.

## 6. Health check

`GET /api/check-env` reports whether Clerk and Supabase env vars are present (no secrets).

**Browser integration test:** open **`/debug/integration`** (with `npm run dev`). It calls **`GET /api/debug/supabase`**, which checks table access, the `claim-documents` bucket, and—when you’re signed in—whether a **`profiles`** row exists for your Clerk user. Use **Re-run** after signing in.

## 7. Troubleshooting

- **`ERROR: 42601: trailing junk after numeric literal at or near "001_initial"`** — The **filename** was pasted on line 1 (sometimes **stuck to** the first comment: `001_initial_claimsaver.sql-- ClaimSaver+`). Delete everything up to and including `.sql` on line 1 so the script starts with `--` or `create table`.
- **`ERROR: 42601: unterminated /* comment`** — A block comment contained the characters `/*` inside it (nested comment). The migration file uses only `--` line comments so this should not happen; re-copy the file from the repo.
- **“Database not configured”** — Missing `NEXT_PUBLIC_SUPABASE_URL` or `SUPABASE_SERVICE_ROLE_KEY`, or URL is wrong (must start with `https://`, not `postgresql://`).
- **Postgres tools / `db:migrate:supabase` won’t connect** — Direct host `db.*:5432` may be IPv6-only. In **Database → Connection string**, switch to **Session pooler** and use that URI (often port `6543`) in `SUPABASE_DATABASE_URL`.
- **RLS** — This app uses the **service role** on the server; end users are not expected to use Supabase Auth JWTs for table access in this design.
- **Claims use UUIDs** — New claims get Postgres UUIDs; old links with Mongo-style `ObjectId` strings will not match.

## Starting over in Supabase

If you already ran partial SQL and want a clean slate: create a **new** Supabase project, or use **Database** settings to reset (destructive). Then apply **`001_initial_claimsaver.sql`** only once on that empty database.

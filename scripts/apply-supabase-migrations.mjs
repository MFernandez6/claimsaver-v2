#!/usr/bin/env node
/**
 * Apply ClaimSaver SQL migrations using a direct Postgres connection.
 * Use this when the Supabase dashboard shows "Failed to fetch" but you have
 * the connection string (Settings → Database).
 *
 * Requires: SUPABASE_DATABASE_URL or DATABASE_URL in .env.local
 * Example (direct):
 *   postgresql://postgres:YOUR_PASSWORD@db.xxxxx.supabase.co:5432/postgres?sslmode=require
 * If IPv4 fails, use Session pooler URI from Supabase Dashboard (often port 6543).
 *
 * Install dependency once: npm install
 *
 * Usage:
 *   npm run db:migrate:supabase
 *   npm run db:migrate:supabase -- --dry-run   # print files only
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import pg from "pg";

dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });
dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const migrationsDir = path.join(__dirname, "..", "supabase", "migrations");
const files = ["001_initial_claimsaver.sql"];

const dryRun = process.argv.includes("--dry-run");

const connectionString =
  process.env.SUPABASE_DATABASE_URL ||
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL;

async function main() {
  if (dryRun) {
    for (const f of files) {
      const p = path.join(migrationsDir, f);
      console.log("[dry-run] would apply:", p, "bytes:", fs.statSync(p).size);
    }
    return;
  }

  if (!connectionString) {
    console.error(
      "Missing connection string. Set one of:\n" +
        "  SUPABASE_DATABASE_URL\n" +
        "  DATABASE_URL\n" +
        "  POSTGRES_URL\n" +
        "\nExample (replace password):\n" +
        "  postgresql://postgres:PASSWORD@db.<ref>.supabase.co:5432/postgres?sslmode=require"
    );
    process.exit(1);
  }

  const { Client } = pg;

  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
  });

  await client.connect();
  console.log("Connected to Postgres.");

  for (const f of files) {
    const full = path.join(migrationsDir, f);
    const sql = fs.readFileSync(full, "utf8");
    console.log("Applying:", f, "…");
    await client.query(sql);
    console.log("  OK");
  }

  await client.end();
  console.log("Done. Tables and bucket migration should be applied.");
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});

# Supabase Development Guide

This directory contains the Supabase configuration for Open CMMS. It is managed through the Supabase CLI and is used for both local development and production migrations.

## Contents

- `config.toml` – CLI configuration including project reference IDs.
- `migrations/` – SQL migrations created with `supabase migration new`.
- `seed.sql` – Idempotent seed data applied to the local environment.
- `setup.sh` – Helper script that starts the Supabase local stack, applies migrations, and syncs environment variables.

## Prerequisites

- [Supabase CLI](https://supabase.com/docs/guides/cli) v1.200+
- Docker running locally

## Common Commands

```bash
# Start the local stack
supabase start

# Generate a new migration
supabase migration new add-maintenance-plans

# Apply migrations to the local database
supabase db reset --force --seed supabase/seed.sql

# Link the CLI to a hosted Supabase project
supabase link --project-ref <your-project-ref>
```

## Local Setup

Use the helper script from the repository root:

```bash
./supabase/setup.sh
```

The script will:

1. Ensure the Supabase CLI and Docker are available.
2. Start (or restart) the local stack.
3. Reset the database, run migrations, and seed data.
4. Populate `.env.local` with the local Supabase credentials when available.

## Production Deployments

1. Link the CLI to your hosted project (`supabase link`).
2. Apply migrations with `supabase db push`.
3. Update environment variables in your hosting platform using the Supabase dashboard or CLI output.

Keep migrations backwards-compatible and document any manual steps required to deploy.

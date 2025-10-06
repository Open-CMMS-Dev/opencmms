# Open CMMS

Open CMMS is an open-source, modular computerized maintenance management system (CMMS) built with Next.js 15, Supabase, and shadcn/ui. The project is structured as a collection of composable modules that ship shared primitives (data access, auth helpers, UI kit) alongside feature-specific apps. The goal is to make it easy for teams to deploy a production-grade CMMS while empowering the community to extend the platform with new modules, automations, and integrations.

## Key Features

- **Modular architecture** – a registry-driven module system keeps domain features isolated while sharing core utilities and UI components.
- **Supabase-first backend** – Postgres + Row Level Security (RLS) with built-in auth, migrations, and seeds managed through the Supabase CLI.
- **Modern Next.js app** – server components, streaming layouts, and edge-ready APIs with turbopack-powered DX.
- **shadcn/ui design system** – consistent, themeable components that keep UX cohesive across modules.
- **OSS-first workflows** – a full contributor experience with docs, CI, governance, and security policies inspired by projects like Supabase.

## Repository Structure

```
src/
├── app/              # Next.js app router entrypoints
├── components/       # Shared shadcn/ui components and primitives
├── core/             # Auth, configuration, Supabase helpers
├── hooks/            # Shared React hooks
├── lib/              # Utilities, constants, types
├── middleware.ts     # Auth/session middleware
├── modules/          # Domain-specific CMMS modules registered with the app shell
supabase/
├── config.toml       # Supabase project configuration
├── migrations/       # SQL migrations managed through the Supabase CLI
└── seed.sql          # Seed data for local development
```

## Quick Start

Follow these steps to run the app locally with Supabase.

### 1. Prerequisites

- **Node.js** 20.x or 22.x and **npm** 10.x (use [nvm](https://github.com/nvm-sh/nvm) for easy version switching)
- **Supabase CLI** v1.200+ ([installation guide](https://supabase.com/docs/guides/cli))
- **Docker** (for running the Supabase local stack)

### 2. Clone and Install

```bash
git clone https://github.com/<your-org>/opencmms.git
cd opencmms
npm ci
```

### 3. Configure Environment

Copy the example env file and fill in the Supabase values:

```bash
cp .env.example .env.local
```

The `.env.example` file documents the required variables for both Next.js and Supabase. If you are using the Supabase local stack (recommended for development), the setup script in `supabase/setup.sh` will populate the appropriate values for you.

### 4. Bootstrap Supabase

Run the helper script to start the Supabase local stack, apply migrations, and seed demo data:

```bash
./supabase/setup.sh
```

This requires Docker to be running. The script uses `supabase db reset` to guarantee a clean state each time.

### 5. Start the App

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to explore the CMMS modules.

## Production Deployment

1. Provision a Supabase project and create a secure `.env` with the production credentials.
2. Run database migrations using the Supabase CLI (`supabase db push`).
3. Build and start the Next.js app:
   ```bash
   npm run build
   npm run start
   ```
4. Configure your hosting provider (Vercel, Fly.io, Docker, etc.) with the environment variables from `.env`.

## Contributing

We welcome contributions of all sizes—from bug fixes to new modules. Please read [`CONTRIBUTING.md`](./CONTRIBUTING.md) for a full walkthrough of the development workflow, coding standards, and how to propose module additions. All contributors are expected to follow our [Code of Conduct](./CODE_OF_CONDUCT.md).

## Governance

Open CMMS is stewarded by the Core Maintainers team. See [`GOVERNANCE.md`](./GOVERNANCE.md) for information about roles, decision-making, and the release process. Feature requests, bugs, and RFCs are tracked via GitHub issues and discussions.

## Security

If you discover a vulnerability, please follow the responsible disclosure process outlined in [`SECURITY.md`](./SECURITY.md). Do not open a public issue for security reports.

## Community & Support

- **Discussions** – Use GitHub Discussions for feature proposals and architectural questions.
- **Issues** – File bug reports and feature requests using the provided templates.
- **Releases** – Published through GitHub Releases with changelog notes for each version.

## License

Open CMMS is released under the [MIT License](./LICENSE).

---

Inspired by Supabase, we strive to make every contributor feel welcome. Clone the repo, run the setup script, and start building the next generation of maintenance tooling.

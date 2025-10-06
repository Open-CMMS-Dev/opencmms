# Contributing to Open CMMS

Thanks for your interest in improving Open CMMS! This document walks you through the contributor workflow, coding standards, and expectations for proposing changes. Whether you are fixing a bug, adding a module, or improving documentation, we appreciate your help.

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Project Setup](#project-setup)
3. [Development Workflow](#development-workflow)
4. [Database & Supabase](#database--supabase)
5. [Coding Guidelines](#coding-guidelines)
6. [Testing & Quality Gates](#testing--quality-gates)
7. [Documentation Expectations](#documentation-expectations)
8. [Submitting a Pull Request](#submitting-a-pull-request)
9. [Community Support](#community-support)

## Code of Conduct

Participation in this project is governed by the [Code of Conduct](./CODE_OF_CONDUCT.md). By contributing, you agree to uphold this standard in all community spaces.

## Project Setup

1. **Fork and clone**
   ```bash
   git clone https://github.com/<your-username>/opencmms.git
   cd opencmms
   git remote add upstream https://github.com/opencmms/opencmms.git
   ```
2. **Install dependencies**
   ```bash
   npm ci
   ```
3. **Copy environment variables**
   ```bash
   cp .env.example .env.local
   ```
4. **Bootstrap Supabase** – run the helper script to start the local stack and apply migrations:
   ```bash
   ./supabase/setup.sh
   ```
5. **Start the dev server**
   ```bash
   npm run dev
   ```

## Development Workflow

- Create a descriptive branch from `main`:
  ```bash
  git checkout -b feat/add-work-order-export
  ```
- Keep your branch up to date:
  ```bash
  git fetch upstream
  git rebase upstream/main
  ```
- Write clear, atomic commits. We recommend the Conventional Commits format (`feat:`, `fix:`, `docs:`, etc.) but do not require it.

## Database & Supabase

- The local Supabase stack runs via Docker using the Supabase CLI.
- Apply schema changes with SQL migrations in `supabase/migrations`. Use `supabase migration new <name>` to scaffold new files.
- Seed data lives in `supabase/seed.sql`. Keep the seed idempotent.
- When you add migrations or seeds, verify that `./supabase/setup.sh` completes without manual steps.
- Production database changes must be reversible. Include rollback notes in the migration file when possible.

## Coding Guidelines

- Use TypeScript for application code. Avoid `any` unless absolutely necessary.
- Favor server components and server actions for data fetching. Shared Supabase helpers live in `src/core`.
- UI primitives belong in `src/components`. Module-specific UI should live under `src/modules/<module-name>/components`.
- Follow the project formatting conventions enforced by TypeScript and Prettier defaults. The repo uses the TypeScript compiler and Next.js toolchain for linting.
- Keep imports absolute using the existing `tsconfig.json` paths when possible.

## Testing & Quality Gates

Before opening a PR, run the following checks locally:

```bash
npm run build
```

If you add scripts or tests in the future, document them here. CI runs `npm ci` and `npm run build` to verify that the app compiles with Turbopack.

## Documentation Expectations

- Update the README or module docs when you introduce new features.
- Public APIs (components, hooks, utilities) should include JSDoc or inline comments describing usage and return values.
- Include diagrams or screenshots when they help explain new modules or UI changes.

## Submitting a Pull Request

1. Push your branch to your fork.
2. Open a PR against `opencmms/opencmms:main`.
3. Fill out the PR template, including screenshots for UI changes.
4. Ensure the CI workflow passes. Address review feedback promptly.
5. Squash or rebase commits if requested by maintainers.

## Community Support

- **GitHub Discussions** – architecture questions, RFCs, module proposals.
- **Issues** – bug reports and feature requests. Use the provided templates for consistency.
- **Security** – report vulnerabilities privately via the process in [`SECURITY.md`](./SECURITY.md).

Thank you for helping make Open CMMS better for everyone!

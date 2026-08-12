# Resolutiion Technical Code Review Challenge

## What this is

A small Nx monorepo modelling a basic task-tracking tool:

- `apps/api` — a NestJS backend (workspaces + tasks)
- `apps/web` — a Next.js frontend (task board)
- `libs/shared-types` — types shared between the two

This isn't a "spot the typo" exercise. Treat it like a real pull request that's about to be merged: read it the way you would before approving it in production, and flag anything you wouldn't be comfortable shipping.

## What to focus on

Please concentrate your review on these files. Everything else is supporting scaffolding and isn't part of the exercise:

- `apps/api/src/tasks/tasks.controller.ts`
- `apps/api/src/tasks/tasks.service.ts`
- `apps/api/src/tasks/tasks.repository.ts`
- `apps/api/src/workspaces/workspaces.service.ts`
- `apps/api/src/admin/admin.controller.ts`
- `apps/api/src/admin/admin.service.ts`
- `apps/api/src/admin/admin-notifier.ts`
- `apps/web/src/hooks/use-tasks.ts`
- `apps/web/src/components/task-board.tsx`
- `apps/web/src/components/task-card.tsx`
- `apps/web/src/app/admin/page.tsx`
- `apps/web/src/lib/api-client.ts`

## What we're looking for

For each issue you find, tell us:

1. Where it is (file + rough location)
2. What's actually wrong with it, and why it matters
3. What you'd change

We're interested in correctness, security, performance, and maintainability — and in how you prioritise when you find more than one thing. Not every issue is equally serious; part of the exercise is telling us which ones you'd block a PR on and which you'd leave a comment on and approve anyway.

## Running it

    pnpm install
    pnpm dev:api   # NestJS on :3000
    pnpm dev:web   # Next.js on :4200

Running it is optional — a static review is enough on its own — but it may help you confirm a hypothesis.

## Time

We don't expect more than 60–90 minutes. If you run out of time, tell us what you'd look at next rather than rushing to cover everything.

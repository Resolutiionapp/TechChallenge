# Resolutiion Technical Code Review Challenge

## What this is

A small Nx monorepo modelling a basic task-tracking tool:

- `apps/api` — a NestJS backend (workspaces, tasks, an internal admin panel)
- `apps/web` — a Next.js frontend (task board + the same admin panel)
- `libs/shared-types` — types shared between the two

This isn't a "spot the typo" exercise, and it isn't a scavenger hunt across the whole repo either. Treat it like a real pull request that's about to be merged: read the files below the way you would before approving them in production, and tell us what you wouldn't be comfortable shipping.

## Files to focus on

Everything we're testing lives in these files. Following an import one hop outside this list (e.g. from a controller into the guard or DTO it uses) is expected and normal — that's just reading the code you're reviewing.

**Backend**

- `apps/api/src/tasks/tasks.controller.ts`
- `apps/api/src/tasks/tasks.service.ts`
- `apps/api/src/tasks/tasks.repository.ts`
- `apps/api/src/tasks/task-status.util.ts`
- `apps/api/src/workspaces/workspaces.service.ts`
- `apps/api/src/auth/workspace-member.guard.ts`
- `apps/api/src/admin/admin.controller.ts`
- `apps/api/src/admin/admin.service.ts`
- `apps/api/src/admin/admin-notifier.ts`

**Frontend**

- `apps/web/src/hooks/use-tasks.ts`
- `apps/web/src/components/task-board.tsx`
- `apps/web/src/components/task-card.tsx`
- `apps/web/src/components/task-form.tsx`
- `apps/web/src/app/admin/page.tsx`
- `apps/web/src/lib/api-client.ts`
- `apps/web/src/lib/session.ts`

It's also worth a quick read of the `Task` type and its doc comment in `libs/shared-types/src/task.types.ts` before judging anything status-related — the intended business rule is documented there, not in the service code.

## Files explicitly out of scope

Don't spend time on these — they're plumbing, and nothing in them is part of the exercise:

- Root config: `nx.json`, `package.json`, `pnpm-workspace.yaml`, `tsconfig.base.json`, `eslint.config.mjs`
- `apps/api/src/main.ts`, `app.module.ts`, `admin/admin.module.ts`, project/tsconfig files
- `apps/api/src/auth/current-user.decorator.ts`, `apps/api/src/common/audit-log.repository.ts`
- `apps/api/src/workspaces/workspaces.controller.ts`, `workspaces.module.ts`, `workspaces.repository.ts`
- `apps/api/src/tasks/tasks.module.ts` and everything under `apps/api/src/tasks/dto/`
- `apps/web/src/app/layout.tsx`, `apps/web/src/app/page.tsx`, `apps/web/src/hooks/use-current-user.ts`, project/tsconfig/next.config files

## The rules: what we care about vs. what we don't

**We care about:**

- Correctness bugs that would produce wrong behaviour in production, not just style you'd personally write differently.
- Security: broken or missing authorization, data leaking across users/workspaces, secrets that shouldn't be in source, sensitive data in logs, insecure storage of anything session-related.
- Architecture that will bite later: dependencies that bypass the framework's DI instead of using it, state that's shared when it shouldn't be.
- Prioritisation. Finding ten things and correctly telling us which two are "block this PR" and which eight are "comment and approve anyway" is worth more to us than finding all ten with no sense of severity.
- Clarity in how you write it up — file, location, what's wrong, why it matters, what you'd do about it. We're evaluating the review, not just the bug list.

**We don't care about:**

- Formatting, naming preferences, or anything a linter would fix by itself — there's no enforced style here, don't spend time on it.
- The fact that "the database" is an in-memory array, or that authentication is simulated via request headers instead of real tokens/sessions. Both are deliberate simplifications so the exercise runs without any infrastructure — they are not themselves bugs to report. (The one exception: if a real issue is layered on top of one of these — e.g. how a session value gets stored — that's fair game. We'll make it obvious when that's the case rather than let you guess.)
- Whether you get the whole thing running perfectly. A static review is enough on its own.
- Visual design — the UI is deliberately bare.
- Writing or fixing tests. Not part of the ask, though a one-line "this has no test coverage and should" is fine if it's genuinely one of your top points.
- General Nx/monorepo tooling correctness. We're not testing Nx expertise as a whole — only whatever specific issue you actually notice while reading the code.

## What to hand back

For each issue you flag, tell us:

1. Where it is (file + rough location)
2. What's actually wrong with it, and why it matters
3. What you'd change

## Running it

    pnpm install
    pnpm dev:api   # NestJS on :3000
    pnpm dev:web   # Next.js on :4200

Running it is optional — a static review is enough — but it may help you confirm a hypothesis.

## Time

This is a 45-minute task, hard stop. We don't expect you to find everything in the focus list — we'd rather see good judgement on a partial pass than a rushed attempt at a complete one. If time runs out, tell us what you'd look at next and why, rather than skimming the rest to say you covered it.

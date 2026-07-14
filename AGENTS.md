# LIVHOME Engineering Guide

## Scope

This repository is the production React Native frontend for LIVHOME, not a disposable visual prototype. Preserve the current UI while making changes suitable for backend integration and store builds.

## Toolchain

- Node.js 22.13 or newer
- npm and the committed `package-lock.json`
- Expo SDK 54 and React Native 0.81
- TypeScript strict mode

SDK 54 is intentional because the current App Store version of Expo Go on physical iOS devices does not support newer SDKs. Do not upgrade Expo or React Native without explicit approval and physical-device validation.

## Required Checks

Run checks once after a logical batch of changes, not after every individual edit.

For ordinary TypeScript or TSX changes, run:

```bash
npm run lint
npm run typecheck
```

- Markdown-only changes require no npm checks; inspect the diff and run `git diff --check`.
- Run `npm run check:api` only when `src/api/client.ts` or `scripts/check-api-client.mjs` changes.
- Run `npx expo-doctor` only after dependency, Expo app config, or native configuration changes, during an SDK upgrade, or while diagnosing an Expo environment problem.
- Run `npm ci` only for a fresh or clean install, CI validation, or explicit lockfile validation after dependencies change. Do not run it when dependencies are unchanged.
- Run `npx expo export --platform all --clear` only for release or CI validation, or when changes may affect bundling, module resolution, platform assets, or Expo configuration.

Never run `npm ci` or a clear Expo export in this checkout while Metro is running. Before either command, check for an active Metro listener. Do not stop or restart a user-owned development server without explicit direction; leave the restart to the user unless they ask otherwise.

Do not commit generated export directories, `.expo/`, `node_modules/`, logs, or local `.env` files.

## Architecture

- `src/screens/`: screen composition, local visual state, modals, and navigation events.
- `src/features/`: feature state and behavior shared across a complex screen or ready to be replaced by backend data.
- `src/api/client.ts`: the only low-level HTTP boundary. Screens must not call `fetch` directly.
- `src/contracts/`: frontend/backend DTOs and stable enums. Update these with backend contract changes.
- `src/navigation/types.ts`: route names and route params. Every new route must be added here.
- `src/navigation/registry.tsx`: route-to-screen registration. Missing routes must fail TypeScript; do not restore a silent fallback screen.
- `src/components/kit.tsx`: shared UI primitives. Add a primitive only when at least two screens need it.

Keep server state out of global UI stores. Add TanStack Query only when the first real API integration needs caching, invalidation, or request deduplication. Keep transient interaction state in React state or a feature hook.

## Backend Integration

- Start from `docs/API_CONTRACT.md` and `src/contracts/`; do not infer endpoints from JSX.
- Use `EXPO_PUBLIC_API_URL` for the public server base URL. Never place secrets in `EXPO_PUBLIC_*` variables.
- On physical devices, the API URL must use the development machine's LAN address, not `localhost`.
- Normalize network and HTTP failures through `ApiError`.
- Define loading, empty, error, retry, and mutation-in-progress states for every connected screen.
- Store authentication tokens in `expo-secure-store` when authentication is implemented; do not use AsyncStorage for secrets.
- Agree on streaming transport before implementing assistant chat streaming.

## Change Discipline

- Follow the change-scoped checks above; do not rerun the full validation set after every individual edit.
- Read the target screen, its feature hook, route contract, and callers before editing.
- Prefer deleting dead code or reusing existing primitives over adding abstractions.
- Do not split files only to reduce line count; extract behavior when it creates a real API, testing, or ownership boundary.
- Preserve user-provided copy and visual behavior unless the task explicitly changes them.
- Keep commits focused and report uncommitted files that remain local.
<!-- DESIGN_MD_INSTRUCTIONS_START -->
## Design System

Before any visual, frontend, styling, layout, component, page, or design-system work, read `DESIGN.md` and follow it as the project's visual source of truth.

If `DESIGN.md` still appears to be the generic starter, initialize it first: inspect the project context, update `DESIGN.md` into a project-specific design system, then validate it before continuing.

If visual implementation introduces a reusable color, typography level, spacing value, radius, component pattern, or styling rule, update `DESIGN.md` in the same change and keep its YAML tokens and prose guidance consistent.

After editing `DESIGN.md`, perform self-validation before finishing: reread the changed file, verify YAML tokens and prose guidance agree, check that new token references resolve, run `npx -y -p @google/design.md designmd lint DESIGN.md` when network access is available, and report the validation result.
<!-- DESIGN_MD_INSTRUCTIONS_END -->

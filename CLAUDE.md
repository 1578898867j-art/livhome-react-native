# Claude Collaboration Notes

Read `AGENTS.md` before making changes. It is the repository-wide engineering contract.

For each task:

1. Inspect the current screen, route types, feature hook, and shared components before editing.
2. Keep Expo on SDK 54 unless the task explicitly authorizes an upgrade.
3. Put HTTP behavior in `src/api`, DTOs in `src/contracts`, and reusable feature behavior in `src/features`.
4. Never call `fetch` from a screen or invent backend fields without updating `docs/API_CONTRACT.md`.
5. Preserve the existing visual design and avoid speculative state frameworks or component abstractions.
6. Run `npm run typecheck` and the checks required by `AGENTS.md` before reporting completion.

When a contract is unclear, leave a named open decision in `docs/API_CONTRACT.md` instead of silently choosing a protocol.
<!-- DESIGN_MD_INSTRUCTIONS_START -->
## Design System

Before any visual, frontend, styling, layout, component, page, or design-system work, read `DESIGN.md` and follow it as the project's visual source of truth.

If `DESIGN.md` still appears to be the generic starter, initialize it first: inspect the project context, update `DESIGN.md` into a project-specific design system, then validate it before continuing.

If visual implementation introduces a reusable color, typography level, spacing value, radius, component pattern, or styling rule, update `DESIGN.md` in the same change and keep its YAML tokens and prose guidance consistent.

After editing `DESIGN.md`, perform self-validation before finishing: reread the changed file, verify YAML tokens and prose guidance agree, check that new token references resolve, run `npx -y -p @google/design.md designmd lint DESIGN.md` when network access is available, and report the validation result.
<!-- DESIGN_MD_INSTRUCTIONS_END -->

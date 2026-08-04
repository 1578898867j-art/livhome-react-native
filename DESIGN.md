---
version: alpha
name: LIVHOME Mobile Design System
description: The visual and interaction source of truth for the LIVHOME Expo React Native home-monitoring application.
colors:
  bg-primary: "#FBFBFB"
  bg-secondary: "#F2F2F1"
  surface: "#FFFFFF"
  surface-warm: "#F7F5F4"
  text-primary: "#1A1A1A"
  text-secondary: "#616161"
  text-tertiary: "#8A8A8C"
  text-inverse: "#FFFFFF"
  primary: "#2382FF"
  brand-soft: "#E8F2FF"
  critical: "#E5352B"
  critical-soft: "#FBEDEC"
  warning: "#9A7C3E"
  warning-soft: "#FBF6D8"
  success: "#10BE7E"
  success-soft: "#E7F7F0"
  info: "#5E8088"
  info-soft: "#EBEFF0"
  preventive: "#6E6A8C"
  preventive-soft: "#EDECF2"
  border: "#ECECEC"
  border-strong: "#D9D9DC"
  btn-primary: "#1A1A1A"
typography:
  h1:
    fontFamily: System
    fontSize: 28px
    fontWeight: 800
    lineHeight: 1.2
    letterSpacing: "-0.6px"
  h2:
    fontFamily: System
    fontSize: 24px
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "-0.4px"
  title:
    fontFamily: System
    fontSize: 17px
    fontWeight: 700
    lineHeight: 1.35
  body:
    fontFamily: System
    fontSize: 15px
    fontWeight: 500
    lineHeight: 1.4
  label:
    fontFamily: System
    fontSize: 14px
    fontWeight: 600
    lineHeight: 1.3
  caption:
    fontFamily: System
    fontSize: 12px
    fontWeight: 500
    lineHeight: 1.35
rounded:
  none: 0px
  sm: 10px
  md: 14px
  lg: 20px
  xl: 24px
  pill: 999px
spacing:
  none: 0px
  xs: 6px
  sm: 10px
  md: 16px
  lg: 20px
  xl: 24px
components:
  screen:
    backgroundColor: "{colors.bg-primary}"
    textColor: "{colors.text-primary}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    padding: "{spacing.md}"
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text-primary}"
    typography: "{typography.body}"
    rounded: "{rounded.lg}"
    padding: "{spacing.md}"
  warm-panel:
    backgroundColor: "{colors.surface-warm}"
    textColor: "{colors.text-primary}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "{spacing.md}"
  secondary-panel:
    backgroundColor: "{colors.bg-secondary}"
    textColor: "{colors.text-primary}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "{spacing.md}"
  button-primary:
    backgroundColor: "{colors.btn-primary}"
    textColor: "{colors.text-inverse}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "{spacing.md}"
    height: 54px
  button-secondary:
    backgroundColor: "{colors.bg-secondary}"
    textColor: "{colors.text-primary}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "{spacing.md}"
    height: 54px
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text-primary}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "{spacing.md}"
  divider:
    backgroundColor: "{colors.border}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.none}"
    height: 1px
  status-critical:
    backgroundColor: "{colors.critical-soft}"
    textColor: "{colors.text-primary}"
    typography: "{typography.caption}"
    rounded: "{rounded.pill}"
    padding: "{spacing.sm}"
  status-warning:
    backgroundColor: "{colors.warning-soft}"
    textColor: "{colors.text-primary}"
    typography: "{typography.caption}"
    rounded: "{rounded.pill}"
    padding: "{spacing.sm}"
  status-success:
    backgroundColor: "{colors.success-soft}"
    textColor: "{colors.text-primary}"
    typography: "{typography.caption}"
    rounded: "{rounded.pill}"
    padding: "{spacing.sm}"
---

## Overview

LIVHOME is a production mobile application for home monitoring, camera control, event review, device management, and AI-assisted care. The interface must feel calm, dependable, and efficient during repeated daily use. It is an operational app, not a marketing site: prioritize current device state, camera media, alerts, and the next useful action.

This file documents the design system already implemented in `src/theme/index.ts` and `src/components/kit.tsx`. Those files remain the runtime source. Reusable visual changes must update the runtime tokens and this document in the same change.

The primary target is iOS and Android through Expo SDK 54. Preserve native safe areas, touch behavior, platform text rendering, and physical-device usability. Do not redesign established screens unless the task explicitly requests it.

## Product Principles

- Put live or recorded camera information before decorative content.
- Make device state, event severity, connectivity, and command progress immediately scannable.
- Keep common monitoring and control actions reachable with one hand.
- Use plain, concise labels. Avoid feature explanations inside the interface.
- Preserve context when moving between home, camera, event, AI, and device-detail flows.
- Treat loading, empty, offline, error, permission, and pending-command states as required product states.

## Colors

Use only semantic tokens from the frontmatter and `colors` in `src/theme/index.ts`.

- `bg-primary` is the default screen canvas; `surface` is for cards, sheets, controls, and grouped content.
- `bg-secondary` and `surface-warm` provide quiet separation without decorative gradients.
- `text-primary`, `text-secondary`, and `text-tertiary` establish hierarchy. Do not create additional gray values locally.
- `primary` maps to the runtime `colors.brand` token. It marks selection, focus, links, active controls, and branded system feedback; it is not the default large-button fill.
- `btn-primary` is the fill for decisive primary actions; use `text-inverse` on it.
- `critical`, `warning`, `success`, `info`, and `preventive` are reserved for operational meaning. Prefer their soft variants as backgrounds.
- Never rely on status color alone. Pair it with an icon, label, or state text.

Do not add gradients, glow, translucent color blobs, or atmospheric decoration. A functional media or voice state may use an existing product-specific treatment only when it improves state recognition.

## Typography

Use the native system font. This keeps the app legible, platform-appropriate, and free of unnecessary font loading.

- `h1` is for top-level screen titles only.
- `h2` is for major sections and prominent modal titles.
- `title` is for cards, settings groups, device names, and compact headers.
- `body` is the default content style.
- `label` is for buttons, tabs, settings labels, and control text.
- `caption` is for timestamps, metadata, supporting state, and compact badges.

Do not scale font sizes with viewport width. Keep dynamic text from resizing surrounding controls; allow wrapping where content can grow and use truncation only when the full value remains available elsewhere.

## Layout

- Use `Screen` from `src/components/kit.tsx` for safe-area handling and the standard scroll behavior.
- Pass the screen-level return or close control, title, and optional right action through `Screen`'s `header` slot. The header stays fixed outside the scrolling body; tabs, filters, search, dates, and other secondary controls remain in the body unless the product flow explicitly requires otherwise.
- Start with `spacing.md` horizontal page padding. Use `spacing.xs` through `spacing.xl` before introducing one-off gaps.
- Keep camera previews and media at a stable aspect ratio so loading labels and overlays cannot shift the layout.
- Use unframed sections for page structure. Use cards for individual grouped items, settings groups, repeated entities, dialogs, and true tool surfaces.
- Do not nest cards. Separate hierarchy with spacing, dividers, or a surface change.
- Keep primary actions near the related decision area. Avoid stacking multiple visually dominant actions.
- On wider layouts, constrain readable forms, dialogs, and text blocks rather than stretching a phone composition edge to edge.

Bottom navigation and stack navigation are the application structure. New screens must fit the existing navigation model and preserve a clear return path.

## Shapes And Depth

- `rounded.lg` (`20`) is the standard card radius.
- `rounded.md` (`14`) is for inputs, segmented controls, and compact panels.
- `rounded.sm` (`10`) is for small controls and contained media details.
- `rounded.xl` (`24`) is for prominent sheets and dialogs when the existing component pattern calls for it.
- `rounded.pill` is limited to buttons, toggles, badges, chips, avatars, and circular icon controls.

Depth is functional. Prefer surface contrast and spacing. Use the shared `shadow.sm`, `shadow.md`, and `shadow.lg` values from `src/theme/index.ts` only for elements that genuinely float, such as menus, sheets, dialogs, or active overlays.

## Components

Reuse `src/components/kit.tsx` before creating local versions of the same behavior.

- `Screen` owns the screen background, safe area, fixed screen-level header slot, scrolling body, and default bottom space.
- `Header` and `NavBar` own compact screen-level navigation and titles.
- `Card` groups one coherent item or settings section with the standard surface and radius.
- `PrimaryBtn` is a 54-unit dark pill button for the main decision in an area.
- `SecondaryBtn` is a 54-unit neutral pill button for alternatives.
- `SettingRow`, `ToggleRow`, `RadioRow`, `Toggle`, and `Segmented` are the standard settings controls.
- `Eyebrow` and `Hint` provide compact supporting hierarchy; they must not replace clear labels.
- `Tap` uses the shared pressed-opacity response. New interactive wrappers need an equivalent visible pressed state.
- Global success, error, and information toasts appear centered above the bottom navigation, aligned with media-save confirmation banners. Keep modal-local and full-screen feedback inside its active surface when the global layer would be obscured.
- `TalkIndicator` provides two-way-talk feedback over camera media. It enters as a 92-by-94 translucent dark panel with a microphone and animated seven-bar waveform, then contracts after 900 ms to a 92-by-52 waveform-only panel and remains visible until talk is turned off. Use the same behavior in normal and full-screen camera views.
- Full-screen transient surfaces opened from a tab screen use `TabOverlay` so they cover bottom navigation without unmounting or visually shifting it.
- Activating the currently selected bottom tab collapses the capsule into a 72-unit icon-only circle. Devices and Assistant anchor left, Profile anchors right, and one activation of the circle expands the full navigation again. Sending a non-empty typed Assistant message also collapses an expanded capsule; voice and suggestion actions do not. When Assistant is collapsed, its composer shares the circle's row, leaves the standard gap clear, and returns to its original size and position with the expanded capsule. Preserve immediate navigation for unselected tabs and reduced-motion behavior.

Use icons for familiar tools and actions. Every icon-only control needs an accessibility label and a stable touch target of at least 44 by 44 units where layout permits. Do not use rounded text rectangles when a standard icon communicates the action more clearly.

## Camera And Operational States

- Show the actual camera frame, event thumbnail, or device state as the primary visual signal when available.
- Keep overlays sparse and maintain readable contrast against changing media.
- Distinguish live, replay, offline, reconnecting, privacy, and unavailable states with text plus a visual indicator.
- A device command must expose pending, success, and failure feedback; do not silently assume completion.
- Empty states should identify what is empty and present the next valid action when one exists.
- Error states should preserve context and offer retry or recovery without discarding the user's place.

## Accessibility

- Support native text scaling without clipping essential labels or buttons.
- Keep text contrast readable, especially on media and soft status backgrounds.
- Provide accessibility roles, labels, state, and hints for non-text controls.
- Do not convey severity, selection, connectivity, or success by color alone.
- Respect reduced-motion preferences for any nonessential animation.
- Keep focus order aligned with the visual order and preserve predictable back behavior.

## Do's And Don'ts

- Do read this file before visual, layout, styling, component, or screen work.
- Do use the runtime theme and shared kit instead of duplicating values in screens.
- Do preserve the current quiet neutral palette, system typography, and compact mobile hierarchy.
- Do update both this file and runtime tokens when a reusable design decision changes.
- Do validate on a physical-device-sized viewport for camera, safe-area, keyboard, and bottom-navigation behavior.
- Don't introduce a new UI library, font family, color scale, or spacing scale without an explicit project need.
- Don't build marketing heroes, decorative section cards, oversized display type, or nested card layouts inside the app.
- Don't hide required loading, empty, error, offline, permission, or command-result states.
- Don't replace established UI solely to make code more abstract.

## AI Bootstrap Protocol

This `DESIGN.md` has been initialized for LIVHOME. On any later initialization request, reread the current repository and reconcile this file with the actual theme, shared components, product flows, and companion marker state; do not assume an earlier initialization is still current.

Ensure `AGENTS.md` and `CLAUDE.md` each contain exactly one copy of the following block. Create or append it only when the markers are absent.

```md
<!-- DESIGN_MD_INSTRUCTIONS_START -->
## Design System

Before any visual, frontend, styling, layout, component, page, or design-system work, read `DESIGN.md` and follow it as the project's visual source of truth.

If `DESIGN.md` still appears to be the generic starter, initialize it first: inspect the project context, update `DESIGN.md` into a project-specific design system, then validate it before continuing.

If visual implementation introduces a reusable color, typography level, spacing value, radius, component pattern, or styling rule, update `DESIGN.md` in the same change and keep its YAML tokens and prose guidance consistent.

After editing `DESIGN.md`, perform self-validation before finishing: reread the changed file, verify YAML tokens and prose guidance agree, check that new token references resolve, run `npx -y -p @google/design.md designmd lint DESIGN.md` when network access is available, and report the validation result.
<!-- DESIGN_MD_INSTRUCTIONS_END -->
```

## AI Maintenance Protocol

For every reusable visual change:

1. Read this file and the affected runtime theme or shared component first.
2. Update exact values in `src/theme/index.ts` before documenting them here.
3. Keep YAML token references and prose rules consistent.
4. Reuse or extend `src/components/kit.tsx` when the behavior is shared across screens.
5. Reread this file and confirm both frontmatter fences remain valid.
6. Confirm every `{colors.*}`, `{typography.*}`, `{rounded.*}`, and `{spacing.*}` reference resolves.
7. Run `npx -y -p @google/design.md designmd lint DESIGN.md` when network access is available.
8. Run the repository typecheck and relevant tests when implementation code changed.
9. Report the validation result and any physical-device validation still required.

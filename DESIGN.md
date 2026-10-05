---
name: Master M/C Plan Dashboard
version: alpha
description: Design system for the factory production-planning dashboard (BW/LC/CW/AI process plans, Stock/Inventory). Optimized for dense daily-use data tables on a factory LAN, not a marketing surface.

colors:
  background: "#f6f7f9"
  surface: "#ffffff"
  headerSurface: "#f9fafb"
  textPrimary: "#111827"
  textSecondary: "#6b7280"
  textMuted: "#9ca3af"
  border: "#e5e7eb"
  borderStrong: "#d1d5db"
  primary: "#6366f1"
  primaryDark: "#4f46e5"
  primarySoft: "#eef2ff"
  success: "#16a34a"
  danger: "#dc2626"
  warning: "#b45309"
  totalStdBg: "#fef9f0"
  totalDg1Bg: "#f0fdf4"
  grandTotalBg: "#eef2ff"
  grandTotalText: "#4338ca"
  weekendHeaderBg: "#fffbeb"
  weekendCellBg: "#fffdf5"
  teamsAccent: "#5b5fc7"

typography:
  base:
    fontFamily: "'Prompt', sans-serif"
    fontSize: 13px
    fontWeight: 400
  heading:
    fontFamily: "'Prompt', sans-serif"
    fontWeight: 700

rounded:
  sm: 8px
  md: 10px
  lg: 14px

spacing:
  page: 24px

components:
  surface:
    backgroundColor: "{colors.headerSurface}"
  card:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.md}"
  bodyText:
    textColor: "{colors.textPrimary}"
  secondaryText:
    textColor: "{colors.textSecondary}"
  mutedText:
    textColor: "{colors.textMuted}"
  totalRowStandard:
    backgroundColor: "{colors.totalStdBg}"
    textColor: "{colors.warning}"
  totalRowDg1:
    backgroundColor: "{colors.totalDg1Bg}"
    textColor: "{colors.success}"
  totalRowGrand:
    backgroundColor: "{colors.grandTotalBg}"
    textColor: "{colors.grandTotalText}"
  weekendColumnHeader:
    backgroundColor: "{colors.weekendHeaderBg}"
    textColor: "{colors.warning}"
  weekendColumnCell:
    backgroundColor: "{colors.weekendCellBg}"
  buttonPrimary:
    backgroundColor: "{colors.primary}"
    textColor: "#ffffff"
    rounded: "{rounded.sm}"
  buttonPrimaryHover:
    backgroundColor: "{colors.primaryDark}"
    textColor: "#ffffff"
    rounded: "{rounded.sm}"
  buttonBroadcast:
    backgroundColor: "{colors.teamsAccent}"
    textColor: "#ffffff"
    rounded: "{rounded.sm}"
  toggleChipOff:
    backgroundColor: "{colors.primarySoft}"
    textColor: "{colors.primary}"
    rounded: "{rounded.sm}"
  toggleChipOn:
    backgroundColor: "{colors.primary}"
    textColor: "#ffffff"
    rounded: "{rounded.sm}"
  badgeCritical:
    backgroundColor: "#fef2f2"
    textColor: "{colors.danger}"
  badgeLow:
    backgroundColor: "#fffbeb"
    textColor: "{colors.warning}"
  badgeNormal:
    backgroundColor: "#f0fdf4"
    textColor: "{colors.success}"
  badgeExcess:
    backgroundColor: "{colors.primarySoft}"
    textColor: "{colors.primary}"
  buttonIconLabeled:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.textSecondary}"
    rounded: "{rounded.sm}"
  modalPreviewList:
    backgroundColor: "{colors.headerSurface}"
    textColor: "{colors.textSecondary}"
    rounded: "{rounded.sm}"
---

## Overview

Internal factory tool for planning BW/LC/CW/AI machine (M/C) production and tracking Stock/Inventory, used daily on a LAN by a small team (admins + process-scoped users). Thai-first UI. The table is the product — every other element (buttons, cards, modals) is secondary chrome that must stay visually quiet so the data tables read clearly, including when printed to PDF.

## Colors

- **Indigo (`primary`)** is the one recurring accent — used for primary actions (Save), active toggle states, links, and the "excess stock" status. Don't introduce a second general-purpose accent color.
- **Status colors are semantic and fixed**: green = normal/success/healthy, red = critical/danger, amber = low/warning, indigo = excess. These map directly to `computeStockStatus()` and must stay consistent between the Stock table, the "needs attention" alert panel, and any chart.
- **`teamsAccent` (#5b5fc7) is a deliberate exception** — used only for the "ส่งแผนให้ทีม" button, so a broadcast-to-team action is never visually confused with Save (indigo) or Admin Mode (green).
- Neutral grays (`textPrimary` → `textMuted`) carry the text hierarchy; avoid pure black.

## Typography

- **Prompt** (Google Font, Latin + Thai) is the only typeface, everywhere including print.
- Base size is small (13px) by design — this is a dense data-table app, not prose. Don't enlarge body text app-wide; enlarge specific things (e.g., kiosk/TV mode already has its own scaled-up rules).

## Layout

- Top tab bar is `position: sticky` — never let it scroll away, especially on CW's long model list.
- Controls that need to stay visible (search, date picker, save, notifications, admin state) live in one `.controls-area` row above the content, not buried in menus.
- One-shot actions (Export CSV/PDF, Manage Users, Manage BOM) belong in the "⋮" more-options menu. **Toggle-state controls do not** — see Components.

## Elevation & Depth

- Two shadow levels only: `shadow-sm` for controls/buttons, `shadow-md` for elevated surfaces (modals, cards). No heavier elevation — this app separates content with `border-color` hairlines, not drop shadows, to stay legible when printed.

## Shapes

- Corner radius scale: `sm` (8px) for buttons/inputs, `md` (10px) for cards, `lg` (14px) for large containers/modals. Don't invent a fourth radius.

## Components

- **Toggle chip** (e.g. "เฉพาะที่มีปัญหา", "ซ่อน Model ว่าง"): soft-tinted background when off, solid fill when on. This exists specifically because a toggle's on/off state must be visible at a glance — it must never live only inside the "⋮" dropdown, where the current state is invisible until opened.
- **Status badge** (Stock page): soft-tinted pill, color per status (see Colors). Used identically in the table's Status column and the alert panel.
- **Model-name color coding**: a 3px left-border stripe on the cell, not a filled badge — long model names in a filled badge read as visually busy ("ลายตา") when stacked in a column. Short codes (e.g. Cover codes) use a solid badge instead, since short text doesn't have that problem.
- **Primary action button** ("บันทึก"): solid `primary`, white text, disabled/grayed when there's nothing to save.
- **Broadcast action button** ("ส่งแผนให้ทีม"): solid `teamsAccent`, always outside any menu, placed after the Admin Mode indicator.
- **Labeled icon button** (e.g. "⋮ เพิ่มเติม"): same outline style as an icon-only button, but with a visible text label next to the icon — used for controls a non-technical user wouldn't recognize from the icon alone (an overflow-menu ellipsis isn't self-explanatory). Icon-only stays fine for widely-understood icons (bell = notifications).
- **Modal preview list**: a small scrollable `headerSurface`-tinted box inside a confirm modal, listing the specific items (model names, cell counts) an action will affect. Required on any confirm dialog for a bulk/destructive action — a generic count ("ลบ 5 Model?") isn't enough to let someone verify they selected the right ones before confirming.

## Do's and Don'ts

- **Do** reuse the toggle-chip on/off pattern for any new persistent setting, and place it outside menus.
- **Do** keep status colors (critical/low/normal/excess) consistent across every surface that shows them.
- **Do** default new print-relevant styling to legible-on-paper (dark borders, no reliance on color alone) — this app is printed/exported to PDF regularly.
- **Don't** add a new accent color for a one-off button; reuse `primary` unless the action is a genuinely distinct risk class (the way `teamsAccent` is for "notify the whole team").
- **Don't** add drop shadows or gradients — flat + hairline borders only.
- **Don't** hide a toggle's current state inside a dropdown menu.

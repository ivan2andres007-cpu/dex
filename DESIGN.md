---
name: Punto Prisma
description: Minimalist Apple-inspired hybrid e-commerce & digital subscription marketplace in Paraguay
colors:
  primary: "#f5f6f8"
  primary-hover: "#e2e4e9"
  primary-dark: "#090a0d"
  surface: "#12141a"
  surface-elevated: "#181b24"
  surface-hover: "#1f232e"
  surface-active: "#2b3140"
  accent-emerald: "#10b981"
  accent-emerald-hover: "#14cd92"
  accent-emerald-soft: "rgba(16, 185, 129, 0.12)"
  accent-red: "#ef4444"
  backdrop-overlay: "rgba(0, 0, 0, 0.65)"
  border-subtle: "rgba(255, 255, 255, 0.08)"
  border-medium: "rgba(255, 255, 255, 0.15)"
  text-primary: "#f5f6f8"
  text-secondary: "#a1a7b5"
  text-tertiary: "#8e95a5"
typography:
  display:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif"
    fontSize: "clamp(2.3rem, 5.2vw, 4.4rem)"
    fontWeight: 700
    lineHeight: 1.08
    letterSpacing: "-0.038em"
  headline:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif"
    fontSize: "clamp(1.8rem, 3.2vw, 2.6rem)"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.03em"
  title:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, sans-serif"
    fontSize: "1.18rem"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "-0.02em"
  body:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, sans-serif"
    fontSize: "0.95rem"
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: "normal"
  label:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, sans-serif"
    fontSize: "0.78rem"
    fontWeight: 600
    letterSpacing: "0.05em"
rounded:
  sm: "8px"
  md: "14px"
  lg: "20px"
  xl: "28px"
  pill: "9999px"
spacing:
  xs: "6px"
  sm: "12px"
  md: "20px"
  lg: "32px"
  xl: "64px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-dark}"
    rounded: "{rounded.pill}"
    padding: "0 28px"
    height: "48px"
  button-secondary:
    backgroundColor: "{colors.surface-elevated}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.pill}"
    padding: "0 24px"
    height: "48px"
  button-whatsapp:
    backgroundColor: "{colors.accent-emerald}"
    textColor: "#032115"
    rounded: "{rounded.pill}"
    padding: "0 24px"
    height: "48px"
  card-product:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.lg}"
    padding: "24px"
---

# Design System: Punto Prisma

## Overview

**Creative North Star: "The Cupertino Prism"**

Punto Prisma pairs the uncompromising restraint, spatial breathing room, and optical precision of Apple interfaces with the practical commerce realities of Paraguay. The interface refuses cluttered retail templates, chaotic advertising banners, and noisy countdown timers. Every product card, navigation pill, and dialog feels deliberate, authoritative, and tactfully weighted.

Surfaces inhabit a deep slate graphite universe where elevation is expressed through precise hairline micro-borders and subtle tonal shifts rather than blurry dark halos. The vibrant emerald green accent is held strictly in reserve: it signals active WhatsApp channels, verified stock status, and immediate checkout capability.

**Key Characteristics:**
- **Restrained Monochromatic Foundation:** Deep space canvas with light, crisp optical hierarchy.
- **Glassmorphic Floating Chrome:** Subtle frosted glass navigation (`backdrop-filter: blur(24px)`) floating over page content.
- **Action Emerald:** Vibrant green used with deliberate scarcity for WhatsApp engagement and conversion proof.
- **Tabular Precision:** Consistent alignment and native tabular numerals (`font-variant-numeric: tabular-nums`) for currency values in Guaraníes (`Gs.`).

## Colors

The palette is anchored in an ultra-clean neutral slate with purposeful emerald green accents.

### Primary
- **Cupertino Chalk** (`#f5f6f8`): Primary headlines, active selection backgrounds, and high-emphasis controls.

### Secondary
- **Action Emerald** (`#10b981`): WhatsApp direct triggers, live stock indicators, and confirmed checkout actions.

### Neutral
- **Deep Space Ground** (`#090a0d`): Canvas base background.
- **Dark Graphite Surface** (`#12141a`): Product cards and section backgrounds.
- **Elevated Graphite** (`#181b24`): Controls, secondary buttons, and icon frames.
- **Hover Graphite** (`#1f232e`): Interactive hover state on cards and buttons.
- **Slate Secondary Text** (`#a1a7b5`): Subheadings, descriptions, and feature lists.
- **Muted Slate Text** (`#8e95a5`): Labels, timestamps, and metadata (strictly maintaining >= 4.5:1 contrast).

### Named Rules
**The Reserve Accent Rule.** Emerald green is strictly reserved for conversion, live connectivity, and WhatsApp actions. It is never used as decorative ambient lighting or generic text coloring.

## Typography

**Display Font:** System San Francisco stack (`-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif`)
**Body Font:** System San Francisco Text (`-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif`)
**Label/Mono Font:** System Monospace (`"SF Mono", Menlo, Consolas, monospace`)

**Character:** Clean, objective, modern typography with negative tracking on large titles and generous line heights on body copy.

### Hierarchy
- **Display** (Bold 700, `clamp(2.3rem, 5.2vw, 4.4rem)`, line-height 1.08, letter-spacing -0.038em): Hero title statement.
- **Headline** (Bold 700, `clamp(1.8rem, 3.2vw, 2.6rem)`, line-height 1.15, letter-spacing -0.03em): Major section titles.
- **Title** (Semibold 600, `1.18rem`, line-height 1.3, letter-spacing -0.02em): Product and package card titles.
- **Body** (Regular 400, `0.95rem`, line-height 1.55): Descriptions, paragraphs, and specifications. Max line measure: 68ch.
- **Label** (Medium/Semibold, `0.78rem`, letter-spacing 0.05em, uppercase): Category badges and metadata tags.

### Named Rules
**The Tabular Pricing Rule.** All prices in Guaraníes (`Gs.`) must use tabular figures (`font-variant-numeric: tabular-nums`) to preserve numeric column alignment across cards and cart summaries.

## Layout

- **Container:** Maximum content width 1240px with responsive horizontal padding (24px desktop, 20px mobile).
- **Navigation:** Floating pill header (height 60px) pinned at `top: 16px` with glassmorphic backdrop.
- **Product Grid:** Responsive auto-fill grid (`repeat(auto-fill, minmax(280px, 1fr))`) with 22px gutter.
- **Agency Grid:** Adaptive package cards (`repeat(auto-fit, minmax(310px, 1fr))`) with 24px gutter.

## Elevation & Depth

Surfaces communicate depth through hairline micro-borders (`1px solid rgba(255,255,255,0.08)`) and controlled, tight shadows. Exaggerated colored halos, blurred radial haze, and artificial neon glows are strictly prohibited.

### Shadow Vocabulary
- **Subtle Ambient** (`0 1px 3px rgba(0, 0, 0, 0.3)`): Floating pill and small control elevation.
- **Card Hover** (`0 3px 6px rgba(0, 0, 0, 0.4)`): Interactive card lift on hover (`transform: translateY(-3px)`).
- **Drawer Elevation** (`0 6px 12px rgba(0, 0, 0, 0.55)`): Modal cart drawer elevation against blurred backdrop.

### Named Rules
**The Zero Chromatic Halo Rule.** Box shadows must always use neutral alpha masks. Colored glows (`box-shadow: 0 0 Xpx #10b981`) are forbidden.

## Shapes

- **Pill Geometry:** Fully rounded pill shapes (`border-radius: 9999px`) are standard for all interactive buttons, category filters, search bars, and the navigation shell.
- **Card Geometry:** Smooth corner radius (`20px` for product cards, `28px` for agency sections) with 1px border definition.
- **Icon Frames:** Squircle frames (`14px` radius) providing dedicated grounding for category SVGs.

## Components

### Buttons
- **Shape:** Pill radius (`9999px`).
- **Primary:** High-contrast chalk background (`#f5f6f8`), dark ink (`#090a0d`), 48px height.
- **Secondary:** Elevated slate (`#181b24`), chalk text, 1px border.
- **WhatsApp Direct:** Emerald fill (`#10b981`) or emerald soft tint with matching border.

### Filter Pills
- **Style:** 38px height, 18px horizontal padding, subtle border.
- **Active State:** Solid white pill with dark text.

### Product Cards
- **Structure:** Surface background (`#12141a`), 24px internal padding, top category icon + badge row, feature bullet list, and bottom dual CTA actions.
- **Hover:** Smooth 3px lift with medium border reveal.

### Cart Drawer (`<dialog>`)
- **Structure:** Modern slide-over drawer from right viewport edge, backdrop blur (`8px`), quantity increment/decrement steppers, and direct WhatsApp checkout trigger.

## Do's and Don'ts

### Do:
- **Do** format all currency figures as `Gs. [amount]` with thousands separated by dots (e.g., `Gs. 35.000`).
- **Do** use vector SVGs with uniform stroke width (`1.8`–`2.2`) for all icons.
- **Do** maintain >= 4.5:1 text contrast on all secondary and tertiary labels.
- **Do** direct WhatsApp orders with clearly encoded and readable line items.

### Don't:
- **Don't** use gradient text or colored text shadows.
- **Don't** add eyebrows or kickers above section titles; let the typography carry its own weight.
- **Don't** use emojis as replacements for interface icons.
- **Don't** introduce multi-step checkout forms that ask for credit card numbers not suited for local Paraguayan payment habits.

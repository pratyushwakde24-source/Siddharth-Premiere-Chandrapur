---
name: Siddharth Premium
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#3a3939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#201f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353534'
  on-surface: '#e5e2e1'
  on-surface-variant: '#d0c5af'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#99907c'
  outline-variant: '#4d4635'
  surface-tint: '#e9c349'
  primary: '#f2ca50'
  on-primary: '#3c2f00'
  primary-container: '#d4af37'
  on-primary-container: '#554300'
  inverse-primary: '#735c00'
  secondary: '#c8c6c5'
  on-secondary: '#313030'
  secondary-container: '#474746'
  on-secondary-container: '#b7b5b4'
  tertiary: '#cecece'
  on-tertiary: '#2f3131'
  tertiary-container: '#b2b3b3'
  on-tertiary-container: '#434546'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffe088'
  primary-fixed-dim: '#e9c349'
  on-primary-fixed: '#241a00'
  on-primary-fixed-variant: '#574500'
  secondary-fixed: '#e5e2e1'
  secondary-fixed-dim: '#c8c6c5'
  on-secondary-fixed: '#1c1b1b'
  on-secondary-fixed-variant: '#474746'
  tertiary-fixed: '#e2e2e2'
  tertiary-fixed-dim: '#c6c6c7'
  on-tertiary-fixed: '#1a1c1c'
  on-tertiary-fixed-variant: '#454747'
  background: '#131313'
  on-background: '#e5e2e1'
  surface-variant: '#353534'
typography:
  display-lg:
    fontFamily: Bodoni Moda
    fontSize: 72px
    fontWeight: '600'
    lineHeight: 80px
    letterSpacing: 0.05em
  display-lg-mobile:
    fontFamily: Bodoni Moda
    fontSize: 40px
    fontWeight: '600'
    lineHeight: 48px
    letterSpacing: 0.02em
  headline-lg:
    fontFamily: Bodoni Moda
    fontSize: 48px
    fontWeight: '500'
    lineHeight: 56px
    letterSpacing: 0.03em
  headline-md:
    fontFamily: Bodoni Moda
    fontSize: 32px
    fontWeight: '500'
    lineHeight: 40px
    letterSpacing: 0.02em
  body-lg:
    fontFamily: Manrope
    fontSize: 18px
    fontWeight: '300'
    lineHeight: 28px
    letterSpacing: 0.01em
  body-md:
    fontFamily: Manrope
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: 0em
  label-sm:
    fontFamily: Manrope
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.15em
spacing:
  unit: 8px
  container-max: 1440px
  gutter: 32px
  margin-desktop: 80px
  margin-mobile: 24px
  section-padding: 160px
---

## Brand & Style

The design system is engineered to evoke an atmosphere of absolute prestige and cinematic exclusivity. It draws heavy inspiration from high-end horology, bespoke automotive marques, and ultra-luxury real estate. The aesthetic is defined by a "Quiet Luxury" approach—where every element is intentional, and whitespace is treated as a premium commodity.

The style is a hybrid of **Minimalism** and **Glassmorphism**, set against a high-contrast backdrop. We utilize deep, ink-like blacks to create a sense of infinite depth, while champagne gold accents provide a warmth that feels earned rather than loud. Transitions should be slow and deliberate, mimicking the smooth motion of a luxury timepiece.

- **Target Audience:** High-net-worth individuals, corporate executives, and luxury connoisseurs.
- **Emotional Response:** Awe, trust, exclusivity, and a feeling of "arrival."

## Colors

The palette is anchored in a true-black environment to maximize the brilliance of the gold accents and the clarity of the typography.

- **Primary (Champagne Gold):** Used sparingly for high-impact calls to action, active states, and fine border accents. It represents the "Signature" of the brand.
- **Neutral (Obsidian Black):** The #050505 base provides more depth than a standard black, allowing for subtle gradients and glass effects to appear more luminous.
- **Secondary (Anthracite):** Used for container backgrounds and elevated surfaces to create a tiered visual hierarchy without breaking the dark aesthetic.
- **Tertiary (Pure White):** Reserved strictly for body text and critical icons to ensure maximum legibility against the dark void.

## Typography

This design system utilizes a high-contrast typographic pairing to balance heritage with modernity.

- **Headlines:** `Bodoni Moda` is used for all display and headline roles. Its high-contrast strokes reflect the craftsmanship of luxury editorial design. We apply generous letter-spacing (tracking) to headlines to increase their perceived value and breathability.
- **Body & Interface:** `Manrope` provides a refined, modern sans-serif balance. It is set with a lighter weight (300 or 400) for body text to maintain an airy, sophisticated feel.
- **Labels:** Small labels and captions are always in uppercase with high tracking (0.15em) to serve as elegant architectural markers within the UI.

## Layout & Spacing

The layout philosophy is built on **expansive breathing room**. We avoid density at all costs.

- **Grid System:** A 12-column fixed grid for desktop (centered) and a 4-column fluid grid for mobile.
- **Section Vertical Spacing:** Large vertical gaps (160px+) are used between major content sections to allow the user's eye to rest, creating a "gallery" feel.
- **Margins:** We use oversized margins on desktop (80px) to pull the content into a focused, cinematic central view.
- **Alignment:** Consistent left-alignment is preferred for storytelling, while centered alignment is reserved for high-impact hero moments.

## Elevation & Depth

Depth in this design system is achieved through **optical transparency** rather than heavy shadows.

- **Glassmorphism:** Primary cards and navigation bars use a "Frosted Obsidian" effect—a semi-transparent black fill with a 20px-30px backdrop blur.
- **Lustre Borders:** Instead of shadows, elevation is indicated by a 1px solid border. The top and left borders use a subtle gold-to-transparent gradient, mimicking a light source catching the edge of a physical material.
- **Layering:** Backgrounds should occasionally feature "Black Marble" textures—extremely low-contrast, high-resolution imagery that moves slightly on scroll (parallax) to create a sense of physical space.

## Shapes

The design system adopts a **Sharp (0)** roundedness strategy.

While modern web design often leans toward rounded corners, ultra-premium corporate luxury is rooted in the sharp, clean lines of architecture and bespoke tailoring. 
- **Edges:** 0px radius on all primary buttons, cards, and input fields.
- **Exceptions:** Icons and very small decorative chips may use a subtle 1px or 2px radius to avoid looking "jagged" on low-resolution displays, but the overall impression must remain architectural and linear.

## Components

### Buttons
- **Primary:** Sharp corners, gold background, black text. No shadows. On hover, the gold shifts to a slightly lighter "Shimmer" gold.
- **Ghost:** 1px gold border, transparent background, gold text. On hover, the background fills with a 10% gold opacity.

### Floating Glass Cards
Cards are the primary container. They feature a #000000 background at 60% opacity with a heavy backdrop blur. A 0.5px border in "Champagne Gold" (at 30% opacity) defines the shape.

### Input Fields
Minimalist underlines instead of boxes. The label sits in `label-sm` style above the line. Upon focus, the 1px white underline transforms into a 2px gold underline with a smooth lateral expansion animation.

### Navigation
A "Floating Island" header. A slim glassmorphic bar that sits 24px from the top of the viewport. Links are in `label-sm` with a subtle gold dot appearing under the active page.

### Lists & Tables
Minimalist borders only between rows. No vertical lines. High cell padding (24px+) to ensure every piece of data feels exclusive and readable.
# Component Reference Guide

Quick reference for all UI components in the NT Manuscripts Timeline app.

---

## Component Hierarchy

```
App
├── Header
│   ├── Logo + Title
│   ├── Filter Group
│   │   ├── All Button
│   │   ├── Papyrus Button
│   │   ├── Uncial Button
│   │   └── Minuscule Button
│   └── Info Button
├── Main
│   ├── Map Container
│   │   ├── Map (Leaflet)
│   │   └── Stats Overlay
│   │       ├── Year Display
│   │       ├── Visible Count
│   │       └── Total Count
│   └── Timeline Bar
│       ├── Play/Pause Button
│       ├── Timeline Slider
│       │   ├── Labels (0, 500, 1000, 1500)
│       │   ├── Range Input
│       │   └── Manuscript Markers
│       └── Speed Control
├── Info Panel (slide-out)
│   ├── Panel Header
│   │   ├── Title
│   │   └── Close Button
│   └── Panel Content
│       └── Manuscript Details
│           ├── ID + Badge
│           ├── Dating
│           ├── Location
│           ├── Contents
│           ├── Text Type
│           └── Description
├── Tooltip (floating)
│   ├── ID + Year
│   └── Content Preview
└── Modal
    ├── Modal Header
    │   ├── Title
    │   └── Close Button
    └── Modal Content
```

---

## Component Specifications

### Header Components

#### App Title
```css
Font: Crimson Pro, 30px, Bold
Color: #2C2C2C (Ink)
Spacing: 16px gap from icon
```

#### Filter Button
```css
Size: Auto × 36px
Padding: 8px 16px
Border Radius: 8px
Font: Inter, 14px, Medium
Transition: 150ms

States:
- Default: White bg, Gray 600 text
- Hover: Gray 100 bg, Ink text
- Active: Primary bg, White text
```

#### Icon Button
```css
Size: 40px × 40px
Border: 1px Gray 300
Border Radius: 8px
Icon Size: 20px × 20px

States:
- Default: White bg, Gray 600 icon
- Hover: Gray 100 bg, Ink icon
```

---

### Map Components

#### Stats Overlay
```css
Position: Absolute top-right (24px inset)
Background: White 95% opacity + blur(10px)
Border: 1px Gray 200
Border Radius: 12px
Padding: 16px
Shadow: 0 10px 15px rgba(0,0,0,0.1)

Layout: Flex row, gap 24px

Stat Item:
  Layout: Flex column, center aligned
  Label: 12px, uppercase, Gray 500
  Value: Crimson Pro, 24px, Bold, Ink
```

#### Map Marker (Manuscript Icon)
```css
Size: 24px × 24px (standard zoom)
Filter: drop-shadow(0 1px 1px rgba(0,0,0,0.2))

Interaction:
- Hover: Scale 1.1, cursor pointer
- Click: Open info panel
```

---

### Timeline Components

#### Play/Pause Button
```css
Size: 56px × 56px
Border: 2px Primary
Border Radius: 50% (full circle)
Shadow: 0 4px 6px rgba(0,0,0,0.1)

Icon: 24px × 24px

States:
- Default: White bg, Primary icon
- Hover: Primary bg, White icon, scale(1.05)
- Active: scale(0.98)

Animation: 250ms ease-in-out
```

#### Timeline Slider
```css
Track:
  Height: 8px
  Border Radius: 9999px
  Background: Gray 200

Thumb:
  Size: 24px × 24px
  Border Radius: 50%
  Background: Primary
  Border: 3px White
  Shadow: 0 4px 6px rgba(0,0,0,0.1)

  Hover: scale(1.1)

Labels:
  Font: JetBrains Mono, 12px, Medium
  Color: Gray 500
  Position: Above track
```

#### Timeline Marker (on track)
```css
Size: 2px × 12px
Background: Gray 400
Opacity: 0.3

Active (in current year): Opacity 0.8
```

#### Speed Control
```css
Button:
  Size: Auto × 40px
  Padding: 8px 12px
  Border: 1px Gray 300
  Border Radius: 8px

Label:
  Font: JetBrains Mono, 14px, Semibold
  Examples: "0.5x", "1x", "2x", "4x"
```

---

### Panel Components

#### Info Panel
```css
Width: 400px (100% on mobile)
Height: 100vh
Position: Fixed right
Background: White
Shadow: 0 20px 25px rgba(0,0,0,0.1)

Animation:
  Default: translateX(100%)
  Active: translateX(0)
  Duration: 350ms ease-out

Header:
  Padding: 24px
  Background: Gray 100
  Border Bottom: 1px Gray 200

Content:
  Padding: 24px
  Overflow-y: auto
```

#### Manuscript Detail Card
```css
Layout: Flex column, gap 24px

ID Display:
  Font: Crimson Pro, 30px, Bold
  Color: Ink

Type Badge:
  Padding: 8px 12px
  Border Radius: 8px
  Font: 12px, Semibold, Uppercase
  Color: White
  Background: (Papyrus/Uncial/Minuscule color)

Section:
  Gap: 8px

  Heading:
    Font: 14px, Semibold, Uppercase
    Color: Gray 500
    Letter Spacing: 0.05em

  Content:
    Font: 16px, Regular
    Color: Ink
    Line Height: 1.6

Date Range:
  Font: JetBrains Mono, 18px, Semibold
  Color: Primary
```

#### Close Button
```css
Size: 32px × 32px
Border: None
Border Radius: 8px
Background: Transparent
Color: Gray 500

Hover:
  Background: Gray 200
  Color: Ink
```

---

### Overlay Components

#### Tooltip
```css
Position: Fixed (follows cursor)
Max Width: 250px
Background: Ink (#2C2C2C)
Color: White
Padding: 12px 16px
Border Radius: 8px
Shadow: 0 20px 25px rgba(0,0,0,0.1)
Pointer Events: none
Z-Index: 1500

Animation:
  Default: opacity 0, translateY(-8px)
  Active: opacity 1, translateY(0)
  Duration: 150ms

Header:
  Border Bottom: 1px rgba(255,255,255,0.2)
  Padding Bottom: 8px

  ID: Crimson Pro, 18px, Bold
  Year: JetBrains Mono, 14px, opacity 0.8

Content:
  Font: 14px
  Line Height: 1.4
  Margin Top: 8px
```

#### Modal Overlay
```css
Position: Fixed fullscreen
Background: rgba(0,0,0,0.5) + blur(4px)
Z-Index: 1200

Animation:
  Default: opacity 0
  Active: opacity 1
  Duration: 250ms
```

#### Modal
```css
Max Width: 600px
Width: 90%
Max Height: 80vh
Border Radius: 16px
Background: White
Shadow: 0 20px 25px rgba(0,0,0,0.1)

Animation:
  Default: scale(0.9)
  Active: scale(1)
  Duration: 250ms

Header:
  Padding: 24px
  Background: Gray 100
  Border Bottom: 1px Gray 200

  Title: Crimson Pro, 24px, Semibold

Content:
  Padding: 24px
  Overflow-y: auto

  Paragraph: 16px, line-height 1.6, Gray 600
  Heading: 18px, Semibold, margin-top 24px
```

---

## State Classes

### JavaScript Toggle Classes

```css
.active
  /* Applied to: Buttons, Panels, Tooltips */
  /* Indicates element is selected or visible */

.hidden
  /* Applied to: Any element */
  /* display: none !important */

.invisible
  /* Applied to: Elements maintaining space */
  /* visibility: hidden !important */

.disabled
  /* Applied to: Interactive elements */
  /* opacity: 0.5, pointer-events: none */

.animate-fade-in
  /* Applied to: New elements */
  /* Fade in animation (250ms) */

.animate-pulse
  /* Applied to: Loading states */
  /* Pulse animation (2s infinite) */
```

---

## Manuscript Type Indicators

### Color Mapping

```css
Papyrus:
  Color: #C97B3C (Warm Terracotta)
  Usage: Badges, map markers, filters

Uncial:
  Color: #5B8C5A (Deep Sage)
  Usage: Badges, map markers, filters

Minuscule:
  Color: #6B7FA8 (Slate Blue)
  Usage: Badges, map markers, filters
```

### Badge Component
```html
<span class="manuscript-badge badge-papyrus">Papyrus</span>
```

```css
.manuscript-badge {
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  color: white;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.badge-papyrus { background-color: #C97B3C; }
.badge-uncial { background-color: #5B8C5A; }
.badge-minuscule { background-color: #6B7FA8; }
```

---

## Text Type Indicators

### Color Classes

```css
.text-alexandrian { color: #8B4789; } /* Royal Purple */
.text-byzantine { color: #B85450; }    /* Byzantine Red */
.text-western { color: #7A8E4A; }      /* Olive Green */
.text-caesarean { color: #5F7B9A; }    /* Caesarean Blue */
```

Usage:
```html
<p class="text-alexandrian">Alexandrian</p>
```

---

## Responsive Variations

### Desktop (1024px+)
- All components at standard sizes
- Info panel: 400px width
- Timeline labels: 4 marks

### Tablet (768px - 1023px)
- Header: Stacked layout
- Filter buttons: Wrap to multiple rows
- Info panel: Full width
- Font sizes: 90% scale

### Mobile (<768px)
- Single column
- Timeline labels: 2 marks only
- Play button: 48px (reduced from 56px)
- Stats overlay: Vertical stack
- Touch targets: Minimum 44px

---

## Animation Timing Reference

```css
Micro-interactions (hover):
  Duration: 150ms
  Easing: ease-in-out
  Properties: background, color, transform

Standard transitions (panels, tooltips):
  Duration: 250ms
  Easing: ease-in-out
  Properties: opacity, transform

Large movements (modals, slides):
  Duration: 350ms
  Easing: ease-out
  Properties: transform, opacity

Timeline animation:
  Interval: 100ms per update
  Speed: Configurable (0.5x to 4x)
```

---

## Z-Index Layers

```css
Base layer (map):          1
Dropdowns:                 1000
Sticky header:             1100
Overlays (stats):          1200
Modals:                    1300
Popovers:                  1400
Tooltips:                  1500
```

---

## Accessibility Notes

### Focus States
All interactive elements have visible focus indicators:
```css
:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}
```

### Keyboard Support
- **Tab**: Navigate between elements
- **Enter/Space**: Activate buttons
- **Esc**: Close modals/panels
- **Arrow Keys**: Navigate timeline slider (±10 years)

### ARIA Labels
Required for icon-only buttons:
```html
<button aria-label="Play animation">...</button>
<button aria-label="Close panel">...</button>
```

### Screen Reader Announcements
Use ARIA live regions for dynamic content:
```html
<div aria-live="polite" aria-atomic="true">
  Year: <span id="currentYear">100</span>
</div>
```

---

## Common Patterns

### Button Hover Effect
```css
.btn {
  transition: all 150ms ease-in-out;
}
.btn:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}
```

### Card Elevation
```css
.card {
  background: white;
  border: 1px solid var(--color-gray-200);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  transition: box-shadow var(--transition-fast);
}
.card:hover {
  box-shadow: var(--shadow-md);
}
```

### Loading State
```css
.loading {
  opacity: 0.6;
  pointer-events: none;
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
```

---

**Quick Reference Version**: 1.0.0
**For detailed specifications, see**: DESIGN-README.md

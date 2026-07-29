# Dispatcher Web Dashboard

A modern React-based web dashboard for delivery dispatchers, built with Remix and featuring a custom Neon Mint design system.

## Design System

### Neon Mint Palette
- **Base**: `#0d1b2a` - Dark background
- **Mint**: `#2dd4a8` - Primary accent color
- **Glow**: `#73ffb8` - Highlight/glow effect

### Semantic Tokens
- **Surface**: `#1a2d3d` - Elevated surfaces
- **Success**: `#2dd4a8` - Success states
- **Warning**: `#fbbf24` - Warning states
- **Error**: `#ef4444` - Error states
- **Info**: `#60a5fa` - Information states

### Gradients
- **gradient-primary**: Linear gradient from mint to glow
- **gradient-surface**: Vertical surface gradient
- **gradient-hero**: Hero section gradient

### Typography
- **Display**: Space Grotesk (headings)
- **Body**: Inter (body text)
- Full type scale from 12px to 60px

### Spacing
- 4px grid system
- Scale: 4px, 8px, 16px, 24px, 32px, 40px, 48px, 64px, 80px, 96px

### Border Radius
- sm: 4px
- md: 8px
- lg: 12px
- xl: 16px
- 2xl: 24px
- 3xl: 32px
- full: 9999px

### Elevation
- elevation-1 to elevation-4 (progressive shadows)
- shadow-glow (neon mint glow effect)
- shadow-glow-strong (stronger glow)

## Components

### Buttons
- **Primary**: Gradient mint with glow effect
- **Secondary**: Elevated surface
- **Outline**: Mint border
- **Ghost**: Transparent with hover
- **Destructive**: Error color
- **Icon**: Icon-only button

### Status Pills
- pending, assigned, in_transit, arrived, delivered, failed, cancelled
- Sizes: sm, md, lg
- Color-coded with semantic colors

### Inputs
- Label, error state, helper text
- Focus states with mint glow
- Disabled state

### Toggles
- Controlled/uncontrolled
- Sizes: sm, md, lg
- Smooth transitions

### Delivery Card
- Customer info
- Pickup/dropoff addresses
- Status, time, distance, earnings
- Driver assignment
- Action buttons

### Progress Card
- Visual progress indicator
- Animated progress line
- Step-by-step completion
- Customizable steps

## Tech Stack

- **Framework**: Remix (React)
- **Styling**: Tailwind CSS + Custom CSS
- **Icons**: Lucide React
- **Utilities**: clsx, tailwind-merge
- **TypeScript**: Full type safety

## Setup

```bash
cd web
npm install
npm run dev
```

## Project Structure

```
web/
├── app/
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── StatusPill.tsx
│   │   │   ├── Input.tsx
│   │   │   └── Toggle.tsx
│   │   └── delivery/
│   │       ├── DeliveryCard.tsx
│   │       └── ProgressCard.tsx
│   ├── lib/
│   │   └── utils.ts
│   ├── styles.css
│   ├── root.tsx
│   └── routes/
│       └── _index.tsx
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## Features

- ✅ Neon Mint design system
- ✅ Full component library
- ✅ Responsive design
- ✅ TypeScript support
- ✅ Custom animations
- ✅ Accessibility considerations
- 🔲 Backend integration
- 🔲 Real-time updates
- 🔲 Map integration
- 🔲 Authentication

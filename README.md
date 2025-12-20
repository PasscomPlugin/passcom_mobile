# Passcom Mobile

A mobile-first Progressive Web Application (PWA) built with Next.js, TypeScript, and Tailwind CSS.

## Technology Stack

### Core Framework
- **Next.js 15.1.3** - React framework with App Router
- **React 18** - UI library
- **TypeScript 5** - Type-safe development

### Styling & UI
- **Tailwind CSS 3.4.1** - Utility-first CSS framework
- **shadcn/ui** - High-quality React components
  - Style: **New York**
  - Base Color: **Zinc**
- **Radix UI** - Unstyled, accessible component primitives
- **Lucide React** - Icon library

### Pre-installed shadcn/ui Components
- ✅ Button
- ✅ Card
- ✅ Input
- ✅ Sheet
- ✅ Dialog

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS transformations
- **Autoprefixer** - CSS vendor prefixing

## Project Structure

```
passcom_mobile/
├── src/
│   ├── app/
│   │   ├── globals.css      # Global styles with Zinc theme variables
│   │   ├── layout.tsx       # Root layout with mobile viewport config
│   │   └── page.tsx         # Home page
│   ├── components/
│   │   └── ui/              # shadcn/ui components
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── dialog.tsx
│   │       ├── input.tsx
│   │       └── sheet.tsx
│   └── lib/
│       └── utils.ts         # Utility functions (cn helper)
├── components.json          # shadcn/ui configuration
├── tailwind.config.ts       # Tailwind configuration
├── tsconfig.json            # TypeScript configuration
├── next.config.ts           # Next.js configuration
└── package.json             # Dependencies
```

## Mobile Configuration

The application is configured for optimal mobile experience:

### Viewport Settings (in layout.tsx)
```typescript
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};
```

This prevents zoom issues on mobile inputs and ensures consistent viewport behavior.

## Getting Started

### Install Dependencies
```bash
npm install
```

### Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Build for Production
```bash
npm run build
```

### Start Production Server
```bash
npm start
```

### Lint Code
```bash
npm run lint
```

## Adding More shadcn/ui Components

To add additional components:

```bash
npx shadcn@latest add [component-name]
```

Example:
```bash
npx shadcn@latest add form
npx shadcn@latest add dropdown-menu
npx shadcn@latest add toast
```

## Path Aliases

The project uses `@/*` as the import alias for the `src/` directory:

```typescript
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
```

## v0 Compatibility

This project is fully configured for use with **v0.dev** (Vercel's AI-powered UI generator):

- ✅ shadcn/ui initialized with New York style
- ✅ Zinc color scheme configured
- ✅ Core components pre-installed
- ✅ TypeScript enabled
- ✅ Tailwind CSS configured
- ✅ App Router structure

You can now use v0.dev to generate components that will work seamlessly with this setup.

## Notes

- The project uses the App Router (not Pages Router)
- All source code is in the `src/` directory
- Components use the New York style variant of shadcn/ui
- The color scheme is based on Zinc with both light and dark mode support
- Mobile viewport is locked to prevent zoom issues on form inputs

## Next Steps

1. Open the project in **Cursor** or your preferred IDE
2. Start the development server with `npm run dev`
3. Begin building your mobile-first application
4. Use v0.dev to generate UI components as needed

---

**Status:** ✅ Ready for development

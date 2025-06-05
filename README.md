# Job Application Assistant (Chrome/Firefox)

AI-powered browser extension that automates job applications with smart form filling and document generation.

## Key Features

- Smart form auto-fill
- AI-generated cover letters
- Resume customization
- Application tracking
- Cross-browser support

## Quick Start

1. Clone and install:
```bash
git clone https://github.com/cardocodes/middleai.git
cd middleai/extension
npm install --legacy-peer-deps
```

2. Set up environment:
   Create a `.env.local` file in the `extension/` directory by copying `.env.example` if it exists, or create it manually with your API keys. For Supabase, you will need:
```
NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

3. Start development:
```bash
npm run dev
```

## Loading the Extension

1. Build production version:
```bash
npm run build
```
   (Note: This runs `next build`. Ensure your build process outputs the necessary files, including `manifest.json`, to a loadable directory, e.g., `extension/dist/` or handles static export to `extension/out/` if applicable.)

2. Load in browser:
- **Chrome:** `chrome://extensions/` → Enable dev mode → Load `extension/dist/` (or the appropriate build output directory containing `manifest.json`)
- **Firefox:** `about:debugging` → Load Temporary Add-on → Select `extension/manifest.json` (assuming build places assets correctly relative to this manifest or you load the root of the build output)

## Development

| Command               | Description                  |
|-----------------------|------------------------------|
| `npm run dev`         | Start development server     |
| `npm run build`       | Create production build      |
| `npm run start`       | Start production server      |

## Dependencies

### Main Dependencies
- React & React DOM (`^18.2.0`)
- Next.js (`^14.1.0`)
- Supabase Client (`@supabase/supabase-js`)
- Radix UI Components:
  - `@radix-ui/react-accordion`
  - `@radix-ui/react-checkbox`
  - `@radix-ui/react-label`
  - `@radix-ui/react-separator`
  - `@radix-ui/react-slot`
  - `@radix-ui/react-switch`
  - `@radix-ui/react-tabs`
  - `@radix-ui/react-toast`
  - `@radix-ui/react-tooltip`
- Styling:
  - Tailwind CSS
  - `class-variance-authority`
  - `tailwind-merge`
  - `clsx`
  - `tailwindcss-animate`
- UI Components:
  - Lucide React (icons)
- Other:
  - `@geist-ui/core`
  - `@react-spring/web`
  - `react-use-gesture`
  - `react-scripts`

### Dev Dependencies
- TypeScript (`^4.9.5`)
- Type Definitions:
  - `@types/react`
  - `@types/react-dom`
  - `@types/node`
- `autoprefixer`
- `postcss`
- `tailwindcss`

## Tech Stack

- React + TypeScript
- Supabase

## Contributing

PRs welcome! Please follow standard GitHub workflow:
1. Fork repo
2. Create feature branch
3. Submit PR

## Supabase Setup

1. Create a project at [supabase.com](https://supabase.com/)
2. Get your API credentials from Project Settings → API
3. Create `extension/.env.local` with:
```
NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```
4. Run `npm run build` (This command builds the Next.js application. Ensure it's configured to prepare the extension files if necessary.)

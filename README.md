# AI Photo Prompt Lab

AI Photo Prompt Lab is a Gemini-focused inspiration hub that curates copy-ready photo prompts, showcases visual outputs, and publishes in-depth workflow articles. The project uses Next.js 15 with the App Router, Tailwind CSS, and configuration-driven content so editors can update prompts and blog posts without touching React components.

## Highlights
- **Gemini prompt library** with categories, use-case filters, and always-visible copy buttons that track per-user copy counts via `localStorage`.
- **Editorial blog experience** powered by Markdown + JSON metadata that mirrors the prompt library’s visual language for a consistent brand story.
- **Remote-first media**: prompt cards and blog posts pull artwork from Cloudflare R2 (or any CDN) so the repo stays lean while still supporting full-size previews on hover/tap.
- **Newsletter growth hooks** with a reusable subscribe component that opens the Substack signup in a new tab.
- **Tailored UI system** using shared layout primitives (`container-custom`, border treatments, softened cards) to keep home, prompts, and blog screens visually aligned.

## Tech Stack
- [Next.js 15](https://nextjs.org/) (App Router, TypeScript, server components)
- [React 18](https://react.dev/)
- [Tailwind CSS 3](https://tailwindcss.com/)
- Markdown + JSON content pipeline (see `content/`)

## Getting Started
### Prerequisites
- Node.js **18.18+** (Next.js 15 requirement)
- npm 9+

### Installation
```bash
npm install
```

### Local Development
```bash
npm run dev
```
The app runs at `http://localhost:3000`.

### Production Build & Checks
```bash
npm run build      # Compile production bundle
npm run start      # Serve the production build
npm run lint       # ESLint
npm run type-check # TypeScript without emitting files
```

## Project Layout
```
app/                 // Next.js App Router entries
  page.tsx           // Landing page (hero, showcase, newsletter)
  prompts/page.tsx   // Prompt library index
  blog/              // Blog listing + dynamic article route
components/          // Shared UI (Header, Footer, PromptCard, BlogCard, etc.)
content/
  prompts/           // Prompt markdown docs (content lives in Supabase)
  blog/              // Blog metadata (JSON) and markdown articles
lib/                 // Content loaders, Markdown helpers, shared types
public/              // Static assets (if any local media is needed)
```

## Editing Prompts
Prompt categories and cards are now managed in Supabase (`prompt_categories`, `prompts`).
- Update categories via the `prompt_categories` table (slug, title, description, icon, color, order).
- Add or edit prompt rows in the `prompts` table (slug, title, template, use case, difficulty, etc.).
- Use the admin interface under `/admin` for a guided form experience, or run SQL migrations when bulk-editing.

For long-form reference docs that supplement a prompt, drop a Markdown file in `content/prompts/docs/{slug}.md`. The loader still merges that content when available.

## Editing Blog Content
Blog configuration lives in `content/blog/config/posts-meta.json` and references Markdown files stored in `content/blog/posts/`.
1. Add a new markdown file (`{slug}.md`) with frontmatter (`title`, `slug`, `publishDate`, `tags`, etc.).
2. Register the post in `posts-meta.json` with matching `slug`, `coverImage`, and `excerpt`.
3. The blog index automatically sorts by `publishDate` (newest first) and highlights any item with `featured: true`.

Images inside posts should link to CDN versions. The global stylesheet caps displayed size to keep layouts tidy and shows a “View original” tooltip when readers hover or focus the image, reinforcing the remote asset workflow.

## Styling System
- Typography uses Google Fonts (`Calistoga` for display, `DM Sans`/`Inter` for body text) loaded in `app/globals.css`.
- Utility classes like `container-custom`, softened card borders, and article typography helpers keep pages visually cohesive.
- Theme colors and typography scaling are configured in `tailwind.config.js`. Adjust them to evolve the brand without touching individual components.

## Newsletter Configuration
`components/EmailSubscribe.tsx` opens the Substack signup (`https://socialprompt.substack.com/`) in a new tab. Update the `targetUrl` constant if the newsletter destination changes.

## Deployment Notes
- The project builds as a standard Next.js app and can be hosted on Vercel, Netlify, or any Node-compatible environment.
- Because prompt and blog assets live remotely (e.g., Cloudflare R2), deployments stay lightweight. If you add local static assets, place them in `public/` and reference via `/path` URLs.
- Update `next.config.js` if you start using the Next `Image` component with additional remote domains.

## Roadmap Ideas
- Persist copy counts server-side to power a true “most copied prompts” leaderboard.
- Add search and filtering across prompt categories.
- Introduce CMS integration (e.g., Notion, Sanity) in place of JSON configs when collaboration scales.

---
Maintained by the AI Photo Prompt Lab team. Contributions and prompt ideas are welcome!

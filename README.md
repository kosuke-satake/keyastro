# KeyAstro Website

This is the official website for KeyAstro (Astro + Keystatic Template), built with [Astro](https://astro.build/) and managed using [Keystatic](https://keystatic.com/).

## 🚀 Quick Start

1.  **Install dependencies:**
    ```bash
    npm install
    ```

2.  **Start the development server:**
    ```bash
    npm run dev
    ```
    This will start the Astro dev server at `http://localhost:4321`.

3.  **Access Keystatic CMS:**
    Navigate to `http://localhost:4321/keystatic` to manage the content, events, and leaders.
    *Note: Keystatic is currently configured to run in GitHub mode for production, but you can switch `kind` to `'local'` in `keystatic.config.ts` for local development without pushing to a branch.*

## 🛠️ Project Structure

- `src/pages/`: Contains the Astro routes for English (`en/`) and Japanese (`ja/`).
- `src/components/`: Reusable React (`.tsx`) and Astro (`.astro`) UI components.
- `src/content/`: Stores Keystatic collections, global settings, and Markdoc content.
- `src/layouts/`: Base layouts (like `Layout.astro` containing the `head`, `Header`, and `Footer`).
- `keystatic.config.ts`: Configuration file defining the CMS schemas for leaders, events, homepage, etc.

## 🚢 Deployment

The site is configured to be deployed on **Cloudflare Pages** using the `@astrojs/cloudflare` adapter.
When you push to the `main` branch, Cloudflare will automatically build and deploy the site using:

```bash
npm run build
```

## 🌐 Localization

The site supports both English and Japanese. All pages have an `en` and `ja` version inside `src/pages/`. Keystatic is also configured with dual singletons (e.g., `homepageEN` and `homepageJA`) to manage localized content effectively.

## 📝 Scripts

- `npm run dev`: Starts the local development server.
- `npm run build`: Builds the static and server-rendered assets for production.
- `npx astro check`: Runs TypeScript checks across all `.astro` and `.ts`/`.tsx` files.

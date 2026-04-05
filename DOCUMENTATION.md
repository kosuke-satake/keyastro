# KeyAstro Documentation

Welcome to the complete documentation for the **KeyAstro** template. This guide will walk you through the architecture, how to customize the site, and how to configure the Keystatic CMS for production.

---

## 1. Architecture Overview

KeyAstro is built using:
- **Astro**: A modern static site generator that ships zero JavaScript by default, ensuring lightning-fast load times.
- **Tailwind CSS**: A utility-first CSS framework for rapid and highly customizable styling.
- **Keystatic**: A local-first, Git-backed Content Management System (CMS). Keystatic writes directly to your repository via Markdoc, YAML, and JSON files, meaning you own your data.
- **Markdoc**: A powerful, Markdown-based authoring format that allows embedding rich React/Astro components directly inside your content.

---

## 2. Directory Structure

```text
.
├── src/
│   ├── components/    # Reusable Astro and React UI components
│   ├── content/       # Git-backed data managed by Keystatic (YAML, JSON, Markdoc)
│   ├── layouts/       # Global page layouts (e.g., Header, Footer)
│   ├── pages/         # Astro file-based routing (e.g., /en/about.astro, /ja/about.astro)
│   ├── styles/        # Global CSS and Tailwind directives
│   └── utils/         # Helper functions (i18n, dates, search indexing)
├── public/            # Static assets like favicons, raw images, and robots.txt
├── keystatic.config.ts# Defines the CMS schema (collections and singletons)
├── astro.config.mjs   # Astro configuration, integrations, and deployment adapters
└── tailwind.config.js # Tailwind theme colors, typography, and plugins
```

---

## 3. Local Development

To run the site and the CMS locally:

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Start the Development Server:**
   ```bash
   npm run dev
   ```
   - Your live site is available at `http://localhost:4321`.
   - Your Keystatic CMS dashboard is available at `http://localhost:4321/keystatic`.

Any changes you make inside the CMS will instantly modify the files inside the `src/content/` directory. Astro will hot-reload your browser to reflect the changes.

---

## 4. Customizing the Design

Because KeyAstro doesn't hide anything behind an opaque framework, you have complete control over the design.

### Changing Global Colors
Open `tailwind.config.js` or `src/styles/global.css`. KeyAstro uses CSS variables for its primary colors. You can easily adjust the `--color-primary` values to match your brand.

### Modifying Page Layouts
If you want to restructure the Homepage, About page, or Blog layout:
1. Navigate to `src/pages/en/` or `src/pages/ja/`.
2. Open the respective `.astro` file.
3. You can safely add, remove, or rearrange components like `<Hero />`, `<Features />`, or `<MemberGrid />`.

---

## 5. Adding New Content via the CMS

Instead of editing code, non-developers can manage the entire site using Keystatic.

### Singletons (One-off Pages)
Singletons are used for pages that only have one instance (e.g., Homepage, Global Settings, About Us). 
- Go to the **Main Pages** or **Settings** section in Keystatic.
- Edit the text, update SEO metadata, and swap out images.

### Collections (Repeating Content)
Collections are used for content that grows over time (e.g., Blog Posts, Events, Members, News).
- Go to the **Content** or **Team** section in Keystatic.
- Click **Add new** to create a new entry.
- *Important for Images:* When writing a blog post or creating an event, you must first upload the image to the **Library** (e.g., `mediaBlog` or `mediaEvents`), then select that image from the dropdown inside your content entry.

---

## 6. Configuring GitHub Mode for Production

By default, the template is configured in **Local Mode** (`kind: 'local'`). This is perfect for local development, but if you deploy the site to Cloudflare Pages or Vercel, the CMS will not let you edit content because it cannot save files to a live server.

To edit your site directly from the live URL, you must enable **GitHub Mode**.

### Step-by-Step GitHub Mode Setup:

1. **Update `keystatic.config.ts`:**
   Open the file and modify the `storage` configuration at the bottom:
   ```typescript
   storage: {
     kind: 'github',
     repo: 'YOUR_GITHUB_USERNAME/YOUR_REPOSITORY_NAME',
   }
   ```

2. **Deploy to Cloudflare Pages (or Vercel):**
   Push your code to GitHub and connect the repository to your hosting provider. Make sure your build command is `npm run build` and output directory is `dist`.

3. **Create a GitHub App:**
   - Go to GitHub -> Settings -> Developer Settings -> GitHub Apps -> **New GitHub App**.
   - **Homepage URL:** `https://your-site.pages.dev`
   - **Callback URL:** `https://your-site.pages.dev/api/keystatic/github/oauth/callback`
   - **Webhook:** Disable "Active".
   - **Permissions:** Set "Contents" to **Read & write**.
   - Generate a **Client Secret**.

4. **Set Environment Variables:**
   In your hosting provider's dashboard (e.g., Cloudflare Pages Settings -> Environment variables), add the following:
   - `KEYSTATIC_GITHUB_CLIENT_ID`: (From your GitHub App)
   - `KEYSTATIC_GITHUB_CLIENT_SECRET`: (From your GitHub App)
   - `KEYSTATIC_SECRET`: (Generate a random 32+ character string)

5. **Node.js Compatibility (Cloudflare Only):**
   If using Cloudflare, go to Settings -> Functions -> Compatibility flags, and add `nodejs_compat`.

Once configured, visit `https://your-site.pages.dev/keystatic` and click "Login with GitHub". You can now manage your site from any device!

---

## 7. Multilingual Support (i18n)

KeyAstro supports English (`en`) and Japanese (`ja`) by default.
- Content is split into parallel collections in `src/content/` (e.g., `postsEN` vs `postsJA`).
- Pages are duplicated in `src/pages/en/` and `src/pages/ja/`.
- To add a third language (e.g., Spanish `es`), duplicate an existing content folder, duplicate the pages folder, and update `src/utils/i18n.ts` and `keystatic.config.ts` to register the new locale.
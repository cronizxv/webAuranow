# CRONIZXV

Standalone personal website, configured to publish to **GitHub Pages**.

Read **START-HERE.txt** for upload instructions. Enable **GitHub Actions** as the Pages source in the repository settings. The included workflow publishes `dist/` after every push to `main`.

## Local development

Node.js >=22.12.0 is required.

```sh
npm ci
npm run dev
```

## Build

```sh
npm run build
npm run preview
```

Vite uses a relative base (`./`), and public asset paths are relative. The same build supports a repository URL such as `username.github.io/repository-name/` without hardcoding a username or repository.

## Domain

This is an additional public copy. Keep `croniz.xyz` attached to the existing Vercel project. No CNAME is included. The canonical URL remains `https://croniz.xyz/` intentionally, identifying the primary production site.

## Included

The current CRONIZXV design, Topaz-enhanced assets, scroll-driven hero, subtle stars, parallax, opt-in sound, click bursts, social links, opening tagline and the closing 1 Corinthians 9:24 quote. The deployment workflow is authored specifically for this export and needs no user-provided secrets.

Do not commit `node_modules/` or `dist/`; GitHub Actions installs and builds them. Static media in `public/` is required and must be committed.

# Cryptiq — Random Password Generator (Web)

A small single-page web app that generates cryptographically random passwords in the browser. The interface is a single glass card: a password display with a copy button, a length slider, four character-set toggles, and a generate button.

Everything happens client-side — no network requests, no accounts, no storage. Passwords are produced with `crypto.getRandomValues()`, not `Math.random()`.

## Features

- **Cryptographically secure randomness** — uniform integers via rejection sampling (see below)
- **Adjustable length** — 4 to 124 characters, defaults to 12; regenerates as you drag the slider, and the display scales its type down for long passwords
- **Four character sets** — uppercase, lowercase, digits, and special characters, each toggleable
- **One-click copy** — the copy button or the password itself writes to the clipboard and shows a green check for two seconds
- **Empty-set guard** — disabling every character set displays `---` and blocks copying instead of producing a broken value
- **Responsive layout** — centered card that adapts from mobile to desktop

## Tech stack

| Concern      | Choice                          |
| ------------ | ------------------------------- |
| UI           | React 18 (function components, hooks) |
| Build/dev    | Vite 5                          |
| Styling      | Tailwind CSS 3 + a small CSS layer of design tokens in `src/styles.css` |
| Fonts        | Montserrat (UI), Ubuntu Mono (password display) via Google Fonts |
| Icons        | Font Awesome 7 (CSS webfont, self-hosted from npm) |

## Getting started

Requires Node.js 18 or newer (Vite 5 minimum).

```bash
cd web
npm install
npm run dev
```

The dev server runs on <http://localhost:5173/>. The custom domain serves the app from the site root, so the base path is `/` locally and in production.

```bash
npm run build     # production bundle in dist/
npm run preview   # serve the built bundle locally
```

`dist/` and `node_modules/` are git-ignored.

## Deployment

Published to GitHub Pages at <https://password.devfazla.com/> via a custom domain.

- `vite.config.js` sets `base: '/'`, because a custom domain serves the project page from the site root. Without a custom domain, this would need to be `/random-password-web/`.
- `.github/workflows/deploy.yml` builds on every push to `main` (and on manual dispatch), then publishes `dist/` through `actions/deploy-pages`.
- The Pages source must be set to **GitHub Actions**, not a branch.
- There is no client-side router, so no `404.html` fallback is required.

## Project structure

```
web/
├── index.html                 # HTML shell, font/icon links, #root mount
├── vite.config.js             # React plugin, Pages base path, dev server port
├── tailwind.config.js         # scans index.html and src/**/*.{js,jsx}
├── postcss.config.js          # tailwindcss + autoprefixer
├── public/
│   └── favicon.svg            # site icon
├── .github/workflows/
│   └── deploy.yml             # build + GitHub Pages deploy
└── src/
    ├── main.jsx               # React entry point, mounts <App /> in StrictMode
    ├── App.jsx                # Generator state, UI, and password assembly
    ├── styles.css             # Tailwind layers, color tokens, component styles
    ├── assets/
    │   └── random-password-generator-background.png   # page background
    └── lib/
        └── randomInt.js       # crypto-backed uniform integer helper
```

## How password generation works

1. `randomInt(max)` in `src/lib/randomInt.js` fills a `Uint32Array` with `crypto.getRandomValues()` and rejects any value at or above `2^32 - (2^32 % max)`. This removes modulo bias, so every character is equally likely.
2. `buildPassword(length, selection)` in `src/App.jsx` concatenates the character pools of the enabled sets, then appends `length` characters picked with `randomInt(pool.length)`.
3. Every generated character is drawn from the union of the enabled pools. A password is **not** guaranteed to contain at least one character from each enabled set — enabling a set widens the pool rather than forcing inclusion.

Character pools:

| Toggle  | Pool                                                     |
| ------- | -------------------------------------------------------- |
| Upper   | `ABCDEFGHIJKLMNOPQRSTUVWXYZ`                             |
| Lower   | `abcdefghijklmnopqrstuvwxyz`                             |
| Digits  | `0123456789`                                             |
| Special | ``!@#$%^&*()_+~`|}{[]:;?><,./-=``                        |

Defaults on load: length 12, uppercase/lowercase/digits on, special characters off.

## Notes

- Clipboard access uses `navigator.clipboard`, which browsers only expose in a secure context — `localhost` or HTTPS. Over plain HTTP (other than localhost) copying silently does nothing.
- Tailwind utility classes and the `--primary`, `--secondary`, `--muted` design tokens are applied in parallel in `App.jsx`, so theme colors live in `src/styles.css` under `:root`. Change them there.
- This repository contains the web app only. The standalone single-file `random-password.html` and the Flutter to-do app live one directory up, outside this repository.

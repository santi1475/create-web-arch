<p align="center">
  <img src="assets/logo.png" alt="create-web-arch logo" width="560" style="border-radius: 12px;">
</p>

<h1 align="center">create-web-arch</h1>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15-black?logo=next.js" alt="Next.js 15">
  &nbsp;
  <img src="https://img.shields.io/badge/Astro-7-BC52EE?logo=astro" alt="Astro 7">
  &nbsp;
  <img src="https://img.shields.io/badge/TypeScript-5%2B-3178C6?logo=typescript" alt="TypeScript 5+">
  &nbsp;
  <img src="https://img.shields.io/badge/Tailwind-v4-06B6D4?logo=tailwindcss" alt="Tailwind CSS v4">
  &nbsp;
  <img src="https://img.shields.io/npm/v/create-web-arch?label=npm&color=CB3837&logo=npm" alt="npm version">
</p>

<p align="center">
  A blazing-fast CLI to scaffold production-ready Next.js or Astro projects with clean architectures.<br>
  Powered by <a href="https://github.com/unjs/giget"><code>giget</code></a> for instant remote template delivery.
</p>

---

## ✨ Key Features

- ▲🚀 **Two frameworks** — Next.js 15 (App Router) or Astro 7, your choice.
- 🏗️ **Three battle-tested architectures** — Feature-based, Layer-based, and DDD, available instantly from remote templates.
- 🧹 **Code quality baked in** — ESLint, Prettier, and Conventional Commits (Commitlint) out of the box.
- ⚡ **Modern stack** — Tailwind CSS v4, TypeScript strict mode.
- 📦 **Universal package manager support** — Works with `npm`, `pnpm`, `yarn`, and `bun`.
- 🛠️ **Dynamic generators** — Scaffold components, services, and features (plus hooks, on Next.js) from your project root.

---

## 🚀 Quick Start

```bash
npx create-web-arch <project-name>
```

The interactive wizard will guide you through:

1. **Framework selection** — `next` or `astro`
2. **Template selection** — `feature`, `layer`, or `ddd`
3. **Package manager** — `npm`, `pnpm`, `yarn`, or `bun`
4. **Automatic dependency install** — or skip and do it yourself

You can also pass both flags directly to skip the prompts:

```bash
npx create-web-arch my-app --framework next --template feature
npx create-web-arch my-app --framework astro --template layer
npx create-web-arch my-app --template ddd            # framework defaults to next
```

---

## 🏗 Supported Architectures

Templates are pulled directly from [`santi1475/web-architecture-templates`](https://github.com/santi1475/web-architecture-templates) via `giget`, so you always get the latest version. Each of the three architectures below ships for **both** Next.js (`src/app/`) and Astro (`src/pages/`) — the folder tree is identical outside the routing directory, and Next.js additionally gets a `hooks/` layer (Astro doesn't use React hooks by default).

### `feature` — Feature-Based Architecture

Modular design grouped by business context. Ideal for large teams and growing codebases.

```
src/
├── features/
│   └── checkout/
│       ├── components/
│       ├── hooks/        # Next.js only
│       └── services/
├── shared/
└── app/ (Next.js) / pages/ (Astro)
```

### `layer` — Layer-Based Architecture

Classic horizontal structure. Perfect for mid-sized applications with clear separation of concerns.

```
src/
├── components/
├── hooks/                # Next.js only
├── services/
├── utils/
└── app/ (Next.js) / pages/ (Astro)
```

### `ddd` — Domain Driven Design

Strict clean architecture divided into Application, Domain, Infrastructure, and Presentation layers. For complex enterprise systems.

```
src/
├── application/
├── domain/
├── infrastructure/
└── presentation/
```

---

## ⚡ Generators

Once your project is scaffolded, never create boilerplate manually again:

```bash
# Create a UI Component (Next.js prompts Server/Client + optional tests; Astro writes a plain .astro file)
npx create-web-arch g component Navbar

# Create a custom hook (Next.js only — Astro has no default hook model)
npx create-web-arch g hook useTheme

# Create a service / data-fetching layer
npx create-web-arch g service Users

# (Feature-based only) Scaffold an entire feature skeleton
npx create-web-arch g feature Payments
```

> Tip: `g` is a shortcut for `generate`. The framework is read from `.web-arch.json`, written at project creation — no flag needed here.

---

## 🔗 Remote Templates

This CLI consumes templates from a dedicated repository:

👉 [`santi1475/web-architecture-templates`](https://github.com/santi1475/web-architecture-templates)

Each template is a fully independent, production-ready boilerplate (Next.js 15 or Astro 7). To contribute a template or report an issue with the scaffolding content, open an issue there.

---

## 🤝 Contributing

Contributions, issues, and PRs are welcome! Please read the contributing guides before submitting:

- [Contributing Guide — English](./CONTRIBUTING.en.md)
- [Guía de Contribución — Español](./CONTRIBUTING.es.md)

---

## 📄 License

Distributed under the **MIT** License. See [`LICENSE.md`](./LICENSE.md) for details.

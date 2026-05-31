<p align="center">
  <img src="assets/logo.png" alt="create-next-arch logo" width="560" style="border-radius: 12px;">
</p>

<h1 align="center">create-next-arch</h1>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15-black?logo=next.js" alt="Next.js 15">
  &nbsp;
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react" alt="React 19">
  &nbsp;
  <img src="https://img.shields.io/badge/TypeScript-5%2B-3178C6?logo=typescript" alt="TypeScript 5+">
  &nbsp;
  <img src="https://img.shields.io/badge/Tailwind-v4-06B6D4?logo=tailwindcss" alt="Tailwind CSS v4">
  &nbsp;
  <img src="https://img.shields.io/npm/v/create-next-arch?label=npm&color=CB3837&logo=npm" alt="npm version">
</p>

<p align="center">
  A blazing-fast CLI to scaffold production-ready Next.js 15 projects with enterprise-grade architectures.<br>
  Powered by <a href="https://github.com/unjs/giget"><code>giget</code></a> for instant remote template delivery.
</p>

---

## ✨ Key Features

- 🏗️ **Three battle-tested architectures** — Feature-based, Layer-based, and DDD, available instantly from remote templates.
- 🎨 **Shadcn/UI pre-configured** — Zero path resolution bugs, adapted to each architecture's folder structure.
- 🧹 **Code quality baked in** — ESLint, Prettier, Husky, and Conventional Commits (Commitlint) out of the box.
- ⚡ **Modern stack** — Next.js App Router, Tailwind v4, TanStack Query, and Lucide Icons.
- 📦 **Universal package manager support** — Works with `npm`, `pnpm`, `yarn`, and `bun`.
- 🛠️ **Dynamic generators** — Scaffold components, hooks, services, and features from your project root.

---

## 🚀 Quick Start

```bash
npx create-next-arch <project-name>
```

The interactive wizard will guide you through:

1. **Template selection** — `feature`, `layer`, or `ddd`
2. **Package manager** — `npm`, `pnpm`, `yarn`, or `bun`
3. **Automatic dependency install** — or skip and do it yourself

You can also pass the template directly to skip the prompt:

```bash
npx create-next-arch my-app --template feature
npx create-next-arch my-app --template layer
npx create-next-arch my-app --template ddd
```

---

## 🏗 Supported Architectures

Templates are pulled directly from [`santi1475/next-architecture-templates`](https://github.com/santi1475/next-architecture-templates) via `giget`, so you always get the latest version.

### `feature` — Feature-Based Architecture

Modular design grouped by business context. Ideal for large teams and growing codebases.

```
src/
├── features/
│   └── checkout/
│       ├── components/
│       ├── hooks/
│       └── services/
├── shared/
└── app/
```

### `layer` — Layer-Based Architecture

Classic horizontal structure. Perfect for mid-sized applications with clear separation of concerns.

```
src/
├── components/
├── hooks/
├── services/
├── utils/
└── app/
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
# Create a UI Component (prompts for Server/Client and optional tests)
npx create-next-arch g component Navbar

# Create a custom hook
npx create-next-arch g hook useTheme

# Create a service / data-fetching layer
npx create-next-arch g service Users

# (Feature-based only) Scaffold an entire feature skeleton
npx create-next-arch g feature Payments
```

> Tip: `g` is a shortcut for `generate`.

---

## 🔗 Remote Templates

This CLI consumes templates from a dedicated repository:

👉 [`santi1475/next-architecture-templates`](https://github.com/santi1475/next-architecture-templates)

Each template is a fully independent, production-ready Next.js 15 boilerplate. To contribute a template or report an issue with the scaffolding content, open an issue there.

---

## 🤝 Contributing

Contributions, issues, and PRs are welcome! Please read the contributing guides before submitting:

- [Contributing Guide — English](./CONTRIBUTING.en.md)
- [Guía de Contribución — Español](./CONTRIBUTING.es.md)

---

## 📄 License

Distributed under the **MIT** License. See [`LICENSE.md`](./LICENSE.md) for details.

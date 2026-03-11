# ⚡ create-next-arch

A blazing fast, advanced Command Line Interface (CLI) to scaffold professional projects with **Next.js 15**, **Tailwind CSS v4**, and enterprise-grade scalable architectures.

Forget about manually configuring directories, aliases, linting tools, UI libraries, or tedious CI/CD routines: `create-next-arch` sets up the perfect foundation for you from the very first second.

---

## ✨ Key Features

- 🏗️ **Scalable Architectures**: Choose the structure that perfectly matches your needs (Layer-based, Feature-based, or DDD).
- 🎨 **Native Shadcn UI**: Flawless, automatic configuration of modern component libraries (with zero path resolution bugs).
- 🧹 **Code Quality**: ESLint, Prettier, Husky, and Conventional Commits (Commitlint) out of the box.
- ⚡ **Modern Stack**: Next.js App Router, Tailwind v4, TanStack Query, and Lucide Icons integrated.
- 🛠️ **Dynamic Generators**: CLI commands (`g`) to automatically scaffold interactive components, hooks, or services in their architecturally correct locations.

---

## 🚀 Quick Start

To initialize your new, supercharged Next.js project, open your terminal and run:

```bash
npx create-next-arch <project-name>
```

Follow the interactive prompts to select:
1. Your package manager (`npm`, `yarn`, `pnpm`, `bun`, or `deno`).
2. Your primary language (Spanish or English).
3. Your ideal architecture.
4. Additional setup tools and utilities.

---

## 🏗 Supported Architectures

`create-next-arch` automatically injects path aliases in `tsconfig.json` and builds the scaffolding based on your selection:

- **Layer-Based**: Classic horizontal structure (components, hooks, utils, services). Ideal for mid-sized applications.
- **Feature-Based**: Modular, cohesive design grouped by business context (e.g., `/features/checkout/components`). Highly recommended to scale across large teams.
- **DDD (Domain Driven Design)**: A clean architecture strictly divided into Application, Domain, Infrastructure, and Presentation. For highly complex enterprise systems.

---

## ⚡ Automate your workflow with Generators

Once your project is created, you will never have to create boilerplate files manually again. Use the dynamic scaffolds at the root of your generated project:

```bash
# Create a new UI Component (asks if Server/Client and whether to create tests)
npx create-next-arch generate component Navbar

# Create a Custom Hook ready to use
npx create-next-arch generate hook useTheme

# Create a Service or Data Fetching Layer
npx create-next-arch generate service Users

# (Feature-based only) Create an entire Feature skeleton
npx create-next-arch generate feature Payments
```
*Tip: You can use `g` as a shortcut for `generate`.*

---

## 🤝 Contributing

Contributions, issues, and PRs are highly appreciated! Your help ensures this tool keeps growing.

To understand our versioning and contribution process, please read our guides carefully:
- [Contributing Guide - English](./templates/CONTRIBUTING.en.md)
- [Guía de Contribución en Español](./templates/CONTRIBUTING.es.md)

---

## 📄 License

Distributed under the **MIT** License. Open the code, study it, and mold it to your liking.

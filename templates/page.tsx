export default function Home() {
  const quickFacts = [
    {
      label: "{{PAGE_ARCH_LABEL}}",
      value: "{{ARCHITECTURE_NAME}}",
      detail: "{{ARCHITECTURE_SUMMARY}}",
    },
    {
      label: "{{PAGE_STACK_LABEL}}",
      value: "{{LIBRARIES_SUMMARY}}",
      detail: "{{PAGE_NEXT_STEP_LABEL}}",
    },
    {
      label: "{{PAGE_UI_LABEL}}",
      value: "{{UI_SUMMARY}}",
      detail: "{{STARTER_COMMAND}}",
    },
  ];

  const generators = ["{{STARTER_COMMAND}}", "{{SECONDARY_COMMAND}}"];

  const blueprint = [
    {
      label: "{{BLUEPRINT_ONE_LABEL}}",
      title: "{{BLUEPRINT_ONE_TITLE}}",
      detail: "{{BLUEPRINT_ONE_DETAIL}}",
    },
    {
      label: "{{BLUEPRINT_TWO_LABEL}}",
      title: "{{BLUEPRINT_TWO_TITLE}}",
      detail: "{{BLUEPRINT_TWO_DETAIL}}",
    },
    {
      label: "{{BLUEPRINT_THREE_LABEL}}",
      title: "{{BLUEPRINT_THREE_TITLE}}",
      detail: "{{BLUEPRINT_THREE_DETAIL}}",
    },
  ];

  return (
    <main className="relative min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 px-6 py-16 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
      {/* Background decorative elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-12">
        {/* Hero Section */}
        <section className="overflow-hidden rounded-2xl border border-zinc-800/50 bg-gradient-to-br from-zinc-900/80 via-zinc-900/60 to-zinc-950/80 backdrop-blur-xl shadow-2xl">
          <div className="grid gap-12 px-8 py-12 md:grid-cols-[1fr_1.2fr] md:p-12 lg:gap-16">
            <div className="flex flex-col justify-center space-y-8">
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 backdrop-blur-sm">
                <div className="h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
                <span className="text-xs font-semibold text-blue-300 uppercase tracking-widest">
                  {{ PAGE_BADGE }}
                </span>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <p className="text-xs font-bold text-zinc-500 uppercase tracking-[0.2em]">
                    {{ PROJECT_NAME }}
                  </p>
                </div>
                <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-zinc-50 leading-tight text-balance">
                  {{ PAGE_TITLE }}
                </h1>
                <p className="max-w-lg text-base leading-relaxed text-zinc-400">
                  {{ PAGE_SUBTITLE }}
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <div className="group flex items-center gap-2 rounded-lg border border-zinc-700/50 bg-zinc-800/40 px-4 py-2 transition-all hover:border-zinc-600 hover:bg-zinc-800/60">
                  <div className="h-2 w-2 rounded-full bg-emerald-400" />
                  <span className="text-sm font-medium text-zinc-300">{{ ARCHITECTURE_NAME }}</span>
                </div>
                <div className="group flex items-center gap-2 rounded-lg border border-zinc-700/50 bg-zinc-800/40 px-4 py-2 transition-all hover:border-zinc-600 hover:bg-zinc-800/60">
                  <div className="h-2 w-2 rounded-full bg-cyan-400" />
                  <span className="text-sm font-medium text-zinc-300">{{ LIBRARIES_SUMMARY }}</span>
                </div>
              </div>
            </div>

            {/* Commands Box */}
            <div className="flex flex-col gap-4">
              <div className="rounded-xl border border-zinc-800/50 bg-zinc-950/50 backdrop-blur p-6">
                <p className="mb-4 text-xs font-bold uppercase tracking-widest text-zinc-500">
                  {{ PAGE_GENERATORS_LABEL }}
                </p>
                <div className="space-y-3">
                  {generators.map((command) => (
                    <div
                      key={command}
                      className="group relative rounded-lg border border-zinc-800/50 bg-zinc-900/50 p-4 transition-all hover:border-zinc-700 hover:bg-zinc-900 cursor-pointer overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-cyan-500/0 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <code className="relative block overflow-x-auto text-sm font-mono text-zinc-300 group-hover:text-zinc-200 transition-colors">
                        {command}
                      </code>
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-xs leading-relaxed text-zinc-500">
                  {{ PAGE_GENERATORS_HINT }}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Facts Grid */}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {quickFacts.map((item) => (
            <article
              key={item.label}
              className="group relative rounded-xl border border-zinc-800/50 bg-gradient-to-br from-zinc-900/40 via-zinc-900/30 to-zinc-950/40 p-6 backdrop-blur transition-all duration-300 hover:border-zinc-700/50 hover:from-zinc-900/60 hover:via-zinc-900/50 hover:to-zinc-950/60 hover:shadow-lg"
            >
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-500/0 to-cyan-500/0 group-hover:from-blue-500/5 group-hover:to-cyan-500/5 transition-all duration-300" />

              <div className="relative space-y-4">
                <div className="inline-flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-blue-400" />
                  <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 group-hover:text-zinc-400 transition-colors">
                    {item.label}
                  </p>
                </div>

                <h2 className="text-xl sm:text-2xl font-bold text-zinc-100 group-hover:text-zinc-50 transition-colors">
                  {item.value}
                </h2>

                <p className="text-sm leading-relaxed text-zinc-400 group-hover:text-zinc-300 transition-colors">
                  {item.detail}
                </p>
              </div>
            </article>
          ))}
        </section>

        {/* Blueprint Section */}
        <section className="rounded-2xl border border-zinc-800/50 bg-gradient-to-br from-zinc-900/40 via-zinc-900/30 to-zinc-950/40 p-8 backdrop-blur md:p-10">
          <div className="mb-10 space-y-4">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-zinc-50">
                {{ PAGE_BLUEPRINT_LABEL }}
              </h2>
              <div className="hidden flex-1 h-px bg-gradient-to-r from-zinc-800/50 to-transparent md:block" />
            </div>
            <p className="text-sm text-zinc-400">
              Everything you need to get started with your project
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {blueprint.map((item, index) => (
              <article
                key={item.title}
                className="group relative rounded-xl border border-zinc-800/50 bg-gradient-to-br from-zinc-900/40 to-zinc-950/50 p-6 transition-all duration-300 hover:border-zinc-700/50 hover:from-zinc-900/70 hover:to-zinc-950/70 hover:shadow-xl cursor-pointer overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-cyan-500/0 to-blue-500/0 group-hover:from-blue-500/10 group-hover:via-cyan-500/5 group-hover:to-blue-500/10 transition-all duration-300" />

                {/* Animated counter background */}
                <div className="absolute -right-8 -top-8 text-6xl font-bold text-zinc-800/20 group-hover:text-zinc-700/30 transition-colors">
                  {String(index + 1).padStart(2, '0')}
                </div>

                <div className="relative space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400" />
                    <p className="text-xs font-bold uppercase tracking-widest text-blue-400 group-hover:text-blue-300 transition-colors">
                      {item.label}
                    </p>
                  </div>

                  <h3 className="text-lg font-bold text-zinc-100 group-hover:text-zinc-50 transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-sm leading-relaxed text-zinc-400 group-hover:text-zinc-300 transition-colors">
                    {item.detail}
                  </p>
                </div>

                {/* Hover accent line */}
                <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-blue-500 to-cyan-500 group-hover:w-full transition-all duration-300" />
              </article>
            ))}
          </div>
        </section>
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-950">
          Kayros Systems
        </p>
      </div>
    </main>
  );
}

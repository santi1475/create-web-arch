export default function Home() {
  const metrics = [
    {
      label: "{{PAGE_DEMO_METRIC_ARCH_LABEL}}",
      value: "{{ARCHITECTURE_NAME}}",
    },
    {
      label: "{{PAGE_DEMO_METRIC_READY_LABEL}}",
      value: "{{PAGE_DEMO_METRIC_READY_VALUE}}",
    },
    {
      label: "{{PAGE_DEMO_METRIC_SCALE_LABEL}}",
      value: "{{PAGE_DEMO_METRIC_SCALE_VALUE}}",
    },
  ];

  const commands = ["{{STARTER_COMMAND}}", "{{SECONDARY_COMMAND}}"];
  
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
    <main className="relative min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Animated background elements */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl opacity-50 animate-pulse" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl opacity-40 animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative mx-auto max-w-6xl px-6 py-16 md:py-24">
        {/* Animated hero header */}
        <div className="mb-16 space-y-6 text-center md:text-left">
          <div className="flex items-center gap-3 justify-center md:justify-start">
            <div className="h-2 w-2 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-widest text-cyan-400/80">
              {{PAGE_DEMO_BADGE}}
            </span>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-widest text-slate-500">
              {{PROJECT_NAME}}
            </p>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-slate-50 leading-tight text-balance">
              {{PAGE_DEMO_TITLE}}
            </h1>
          </div>

          <p className="max-w-2xl text-lg leading-relaxed text-slate-400 mx-auto md:mx-0">
            {{PAGE_DEMO_SUBTITLE}}
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-8 md:gap-10 md:grid-cols-[1.3fr_1fr] mb-16">
          {/* Left Section - Metrics Grid */}
          <section className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {metrics.map((item, idx) => (
                <article 
                  key={item.label} 
                  className="group relative rounded-xl border border-slate-800/50 bg-gradient-to-br from-slate-900/50 to-slate-950/50 p-6 transition-all duration-300 hover:border-cyan-500/30 hover:from-slate-900/80 hover:to-slate-950/80 hover:shadow-2xl hover:shadow-cyan-500/5 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 to-blue-500/0 group-hover:from-cyan-500/5 group-hover:to-blue-500/5 transition-all duration-300 rounded-xl" />
                  
                  <div className="relative space-y-4">
                    <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 group-hover:text-cyan-400/80 transition-colors">
                      {item.label}
                    </p>
                    <p className="text-3xl font-bold text-slate-50 group-hover:text-white transition-colors">
                      {item.value}
                    </p>
                  </div>

                  <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-cyan-500 to-blue-500 group-hover:w-full transition-all duration-500" />
                </article>
              ))}
            </div>
          </section>

          {/* Right Section - Commands Panel */}
          <section className="rounded-xl border border-slate-800/50 bg-gradient-to-br from-slate-900/50 to-slate-950/50 p-8 h-fit sticky top-8">
            <div className="space-y-4">
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                  {{PAGE_DEMO_PANEL_TITLE}}
                </p>
              </div>

              <div className="space-y-3">
                {commands.map((command) => (
                  <div 
                    key={command} 
                    className="group relative rounded-lg border border-slate-800/80 bg-slate-950/80 p-4 transition-all duration-300 hover:border-cyan-500/50 hover:bg-slate-950 hover:shadow-lg hover:shadow-cyan-500/5 cursor-copy overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/0 to-blue-500/0 group-hover:from-cyan-500/10 group-hover:via-cyan-500/5 group-hover:to-blue-500/10 transition-all duration-300" />
                    
                    <code className="relative block text-sm font-mono text-slate-300 group-hover:text-slate-100 transition-colors overflow-x-auto whitespace-nowrap">
                      {command}
                    </code>
                  </div>
                ))}
              </div>

              <p className="mt-6 text-xs leading-relaxed text-slate-500">
                {{PAGE_GENERATORS_HINT}}
              </p>
            </div>
          </section>
        </div>

        {/* Blueprint Section */}
        <section className="rounded-xl border border-slate-800/50 bg-gradient-to-br from-slate-900/40 via-slate-900/30 to-slate-950/40 p-8 md:p-10">
          <div className="mb-10 space-y-4">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                Architecture Overview
              </p>
              <h2 className="text-4xl font-bold text-slate-50">
                {{PAGE_BLUEPRINT_LABEL}}
              </h2>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {blueprint.map((item, index) => (
              <article 
                key={item.title} 
                className="group relative rounded-xl border border-slate-800/50 bg-gradient-to-br from-slate-900/40 to-slate-950/60 p-6 transition-all duration-300 hover:border-cyan-500/40 hover:from-slate-900/70 hover:to-slate-950/80 hover:shadow-xl hover:shadow-cyan-500/10 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 to-blue-500/0 group-hover:from-cyan-500/10 group-hover:to-blue-500/10 transition-all duration-300 rounded-xl" />

                {/* Numbered background */}
                <div className="absolute -right-6 -top-6 text-7xl font-bold text-slate-800/25 group-hover:text-slate-700/40 transition-colors select-none">
                  {String(index + 1).padStart(2, '0')}
                </div>

                <div className="relative space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500" />
                    <p className="text-xs font-semibold uppercase tracking-widest text-cyan-400/80">
                      {item.label}
                    </p>
                  </div>

                  <h3 className="text-lg font-bold text-slate-100 group-hover:text-white transition-colors leading-tight">
                    {item.title}
                  </h3>

                  <p className="text-sm leading-relaxed text-slate-400 group-hover:text-slate-300 transition-colors">
                    {item.detail}
                  </p>
                </div>

                <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-cyan-500 to-blue-500 group-hover:w-full transition-all duration-500" />
              </article>
            ))}
          </div>
        </section>
        <section>
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                Kayros Systems
          </p>
        </section>
      </div>
    </main>
  );
}

import React from 'react';

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-muted rounded-full blur-3xl opacity-40 -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-muted rounded-full blur-3xl opacity-40 translate-x-1/2 translate-y-1/2" />

        <div className="relative px-6 py-20 sm:py-28 lg:py-32">
          <div className="mx-auto max-w-3xl">
            {/* Badge */}
            <div className="mb-6 flex justify-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-4 py-2 text-sm font-medium text-muted-foreground backdrop-blur-sm hover:bg-card/70 transition-colors">
                <span className="flex h-2 w-2 rounded-full bg-foreground" />
                {{ PROJECT_NAME }}
              </div>
            </div>

            {/* Main Heading */}
            <h1 className="text-center text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-balance leading-tight mb-6">
              {{ PAGE_SIMPLE_TITLE }}
            </h1>

            {/* Description */}
            <p className="text-center text-base sm:text-lg text-muted-foreground text-balance leading-relaxed mb-8 mx-auto max-w-2xl">
              {{ PAGE_SIMPLE_BODY }}
            </p>

            {/* Code Block */}
            <div className="mx-auto max-w-2xl mb-8">
              <div className="group rounded-xl border border-border bg-card/50 backdrop-blur-sm overflow-hidden hover:border-foreground/20 transition-colors">
                <div className="flex items-center gap-2 px-4 py-3 border-b border-border/50 bg-muted/30">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-destructive/40" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/40" />
                    <div className="w-3 h-3 rounded-full bg-green-500/40" />
                  </div>
                  <span className="ml-auto text-xs text-muted-foreground font-mono">Terminal</span>
                </div>
                <code className="block px-4 py-6 text-sm sm:text-base font-mono text-foreground overflow-x-auto">
                  <span className="text-muted-foreground">$</span> {{ STARTER_COMMAND }}
                </code>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="relative border-t border-border/30">
        <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20 lg:py-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'Modern',
                description: 'Built with the latest design patterns and best practices',
              },
              {
                title: 'Fast',
                description: 'Optimized for performance with zero compromises',
              },
              {
                title: 'Scalable',
                description: 'Ready to grow and adapt to your needs',
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="group rounded-lg border border-border/50 bg-card/30 p-6 hover:border-border hover:bg-card/60 transition-all duration-300 cursor-pointer"
              >
                <div className="mb-4 h-12 w-12 rounded-lg bg-muted/50 group-hover:bg-muted transition-colors flex items-center justify-center">
                  <div className="h-6 w-6 rounded bg-foreground/10" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-foreground">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="relative border-t border-border/30" />

      {/* CTA Section */}
      <section className="relative">
        <div className="mx-auto max-w-4xl px-6 py-16 sm:py-20 lg:py-24">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-foreground">
              Ready to get started?
            </h2>
            <p className="text-muted-foreground mb-8 text-balance">
              Everything you need to build amazing things is already here.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors">
                Get Started
              </button>
              <button className="px-8 py-3 border border-border bg-background text-foreground rounded-lg font-medium hover:bg-muted/30 transition-colors">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/30 bg-muted/20">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-950">
          Kayros Systems
        </p>
      </footer>
    </main>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-agromassa-cream px-6 py-12 text-agromassa-ink">
      <section className="mx-auto flex min-h-[70vh] max-w-4xl flex-col justify-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-agromassa-green">
          AgroMassa
        </p>
        <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-6xl">
          Base inicial do projeto
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-agromassa-muted">
          Next.js, TypeScript, App Router e Tailwind CSS estao configurados.
          As funcionalidades do catalogo, painel administrativo, banco e
          autenticacao entram nas proximas tarefas.
        </p>
      </section>
    </main>
  );
}

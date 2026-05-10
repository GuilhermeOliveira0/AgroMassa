import Image from "next/image";

import { AdminLoginForm } from "@/components/admin/login-form";

type AdminLoginPageProps = {
  searchParams?: Promise<{
    callbackUrl?: string;
  }>;
};

export default async function AdminLoginPage({
  searchParams,
}: AdminLoginPageProps) {
  const resolvedSearchParams = await searchParams;

  return (
    <main className="min-h-screen bg-agromassa-cream text-agromassa-ink">
      <div className="grid min-h-screen lg:grid-cols-[1.15fr_0.85fr]">
        <section className="relative flex min-h-[320px] items-center justify-center overflow-hidden bg-agromassa-forest px-6 py-8 text-white sm:px-10 lg:min-h-screen lg:px-14 lg:py-14">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(57,179,26,0.28),transparent_42%),linear-gradient(180deg,rgba(17,17,17,0.16),rgba(17,17,17,0.72))]" />

          <div className="relative z-10 mx-auto flex w-full max-w-xl flex-col items-center gap-8 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="overflow-hidden rounded-lg border border-white/10 bg-white/95 p-2 shadow-lg">
                <Image
                  alt="Logo AgroMassa"
                  className="h-16 w-16 object-cover sm:h-20 sm:w-20"
                  height={80}
                  priority
                  src="/brand/agromassa1.jpeg"
                  width={80}
                />
              </div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/75">
                AgroMassa
              </p>
              <h1 className="text-3xl font-black sm:text-5xl">
                Acesso administrativo
              </h1>
            </div>

            <div className="max-w-xl">
              <p className="text-base leading-7 text-white/78 sm:text-lg">
                Entre com a conta administrativa para gerenciar produtos e
                informacoes institucionais da AgroMassa.
              </p>
            </div>
          </div>
        </section>

        <section className="flex items-center px-6 py-10 sm:px-10 lg:px-14">
          <div className="mx-auto w-full max-w-md rounded-lg border border-black/8 bg-white p-6 shadow-[0_18px_60px_rgba(17,17,17,0.08)] sm:p-8">
            <div className="mb-8">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-agromassa-green">
                Login
              </p>
              <h2 className="mt-3 text-2xl font-black sm:text-3xl">
                Entrar no painel
              </h2>
              <p className="mt-3 text-sm leading-6 text-agromassa-muted">
                Use o email e a senha do administrador inicial para acessar a
                area restrita.
              </p>
            </div>

            <AdminLoginForm callbackUrl={resolvedSearchParams?.callbackUrl} />
          </div>
        </section>
      </div>
    </main>
  );
}

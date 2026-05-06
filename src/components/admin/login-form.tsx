"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useMemo, useState, type FormEvent } from "react";

import { adminLoginSchema } from "@/validators/auth/login";

type LoginErrors = {
  email?: string[];
  password?: string[];
  form?: string;
};

const DEFAULT_CALLBACK_URL = "/";

type AdminLoginFormProps = {
  callbackUrl?: string;
};

export function AdminLoginForm({ callbackUrl }: AdminLoginFormProps) {
  const router = useRouter();
  const callbackPath = useMemo(() => {
    try {
      const parsedUrl = new URL(callbackUrl ?? DEFAULT_CALLBACK_URL, "http://localhost");

      return `${parsedUrl.pathname}${parsedUrl.search}${parsedUrl.hash}`;
    } catch {
      return DEFAULT_CALLBACK_URL;
    }
  }, [callbackUrl]);

  const [errors, setErrors] = useState<LoginErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const parsedValues = adminLoginSchema.safeParse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    if (!parsedValues.success) {
      setErrors(parsedValues.error.flatten().fieldErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const response = await signIn("credentials", {
        email: parsedValues.data.email,
        password: parsedValues.data.password,
        callbackUrl: callbackPath,
        redirect: false,
      });

      if (!response || response.error) {
        setErrors({
          form: "Email ou senha invalidos.",
        });
        return;
      }

      router.push(response.url ?? callbackPath);
      router.refresh();
    } catch {
      setErrors({
        form: "Nao foi possivel iniciar a sessao agora.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit} noValidate>
      <div className="space-y-2">
        <label
          className="block text-sm font-semibold text-agromassa-ink"
          htmlFor="email"
        >
          Email
        </label>
        <input
          autoComplete="email"
          className="block h-12 w-full rounded-lg border border-black/10 bg-white px-4 text-base text-agromassa-ink outline-none transition focus:border-agromassa-green focus:ring-2 focus:ring-agromassa-green/20"
          id="email"
          name="email"
          placeholder="admin@agromassa.com"
          type="email"
        />
        {errors.email?.map((error) => (
          <p key={error} className="text-sm text-red-700">
            {error}
          </p>
        ))}
      </div>

      <div className="space-y-2">
        <label
          className="block text-sm font-semibold text-agromassa-ink"
          htmlFor="password"
        >
          Senha
        </label>
        <input
          autoComplete="current-password"
          className="block h-12 w-full rounded-lg border border-black/10 bg-white px-4 text-base text-agromassa-ink outline-none transition focus:border-agromassa-green focus:ring-2 focus:ring-agromassa-green/20"
          id="password"
          name="password"
          placeholder="Sua senha"
          type="password"
        />
        {errors.password?.map((error) => (
          <p key={error} className="text-sm text-red-700">
            {error}
          </p>
        ))}
      </div>

      {errors.form ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errors.form}
        </div>
      ) : null}

      <button
        className="flex h-12 w-full items-center justify-center rounded-lg bg-agromassa-green px-4 text-sm font-bold text-white transition hover:bg-[#2f9714] focus:outline-none focus:ring-2 focus:ring-agromassa-green/30 disabled:cursor-not-allowed disabled:bg-agromassa-green/70"
        disabled={isSubmitting}
        type="submit"
      >
        {isSubmitting ? "Entrando..." : "Entrar"}
      </button>
    </form>
  );
}

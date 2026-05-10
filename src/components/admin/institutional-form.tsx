"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useState, useTransition } from "react";

import { useToast } from "@/components/ui/toast-provider";
import { saveSiteSettingsAction } from "@/features/institutional/admin-site-settings-actions";
import {
  siteSettingsFormFieldErrors,
  siteSettingsFormInputFromFormData,
  siteSettingsFormSchema,
  type SiteSettingsFormFieldErrors,
  type SiteSettingsFormInput,
} from "@/validators/institutional/site-settings";

type InstitutionalFormProps = {
  initialValues: SiteSettingsFormInput;
};

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return <p className="text-xs font-bold text-red-700">{message}</p>;
}

function TextInput({
  error,
  label,
  name,
  placeholder,
  value,
}: {
  error?: string;
  label: string;
  name: keyof SiteSettingsFormInput;
  placeholder?: string;
  value: string;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-xs font-black uppercase text-agromassa-muted">
        {label}
      </span>
      <input
        className="min-h-11 rounded-md border border-agromassa-border px-3 text-sm font-bold text-agromassa-ink outline-none transition placeholder:text-agromassa-muted/70 focus:border-agromassa-forest"
        defaultValue={value}
        name={name}
        placeholder={placeholder}
        type="text"
      />
      <FieldError message={error} />
    </label>
  );
}

function TextArea({
  error,
  label,
  name,
  placeholder,
  value,
}: {
  error?: string;
  label: string;
  name: keyof SiteSettingsFormInput;
  placeholder?: string;
  value: string;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-xs font-black uppercase text-agromassa-muted">
        {label}
      </span>
      <textarea
        className="min-h-32 rounded-md border border-agromassa-border px-3 py-3 text-sm font-bold text-agromassa-ink outline-none transition placeholder:text-agromassa-muted/70 focus:border-agromassa-forest"
        defaultValue={value}
        name={name}
        placeholder={placeholder}
      />
      <FieldError message={error} />
    </label>
  );
}

export function InstitutionalForm({ initialValues }: InstitutionalFormProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [errors, setErrors] = useState<SiteSettingsFormFieldErrors>({});

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const result = siteSettingsFormSchema.safeParse(
      siteSettingsFormInputFromFormData(formData),
    );

    setErrors(siteSettingsFormFieldErrors(result));

    if (!result.success) {
      showToast({
        message: "Revise os campos obrigatorios antes de salvar as configuracoes.",
        tone: "validation",
      });
      return;
    }

    startTransition(async () => {
      const actionResult = await saveSiteSettingsAction(formData);

      if (!actionResult.ok) {
        setErrors(actionResult.fieldErrors ?? {});
        showToast({
          message:
            actionResult.formError ??
            "Nao foi possivel concluir a acao. Tente novamente.",
          tone: actionResult.fieldErrors ? "validation" : "error",
        });
        return;
      }

      setErrors({});
      showToast({
        message: "Configuracoes salvas com sucesso.",
        tone: "success",
      });
      router.refresh();
    });
  }

  return (
    <form className="grid gap-6" onSubmit={handleSubmit}>
      <section className="rounded-lg border border-agromassa-border bg-white p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-black uppercase text-agromassa-green">
              Institucional
            </p>
            <h1 className="mt-2 text-3xl font-black text-agromassa-ink">
              Configuracoes da empresa.
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-agromassa-muted">
              Atualize os dados que aparecem na home, no rodape e nos pontos de
              contato do site publico.
            </p>
          </div>

          <Link
            className="inline-flex min-h-10 items-center justify-center rounded-md border border-agromassa-border px-4 text-sm font-black text-agromassa-forest transition hover:border-agromassa-forest"
            href="/admin"
          >
            Voltar
          </Link>
        </div>
      </section>

      <section className="rounded-lg border border-agromassa-border bg-white p-5 sm:p-6">
        <h2 className="text-xl font-black text-agromassa-ink">
          Apresentacao
        </h2>
        <div className="mt-5 grid gap-4">
          <TextInput
            error={errors.companyName}
            label="Nome da empresa"
            name="companyName"
            placeholder="AgroMassa"
            value={initialValues.companyName}
          />
          <TextArea
            error={errors.institutionalText}
            label="Texto institucional"
            name="institutionalText"
            placeholder="Apresentacao da empresa"
            value={initialValues.institutionalText}
          />
          <TextArea
            error={errors.servicesText}
            label="Servicos"
            name="servicesText"
            placeholder="Compra, venda, troca e locacao..."
            value={initialValues.servicesText}
          />
        </div>
      </section>

      <section className="rounded-lg border border-agromassa-border bg-white p-5 sm:p-6">
        <h2 className="text-xl font-black text-agromassa-ink">
          Contato e localizacao
        </h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <TextInput
            error={errors.phoneDisplay}
            label="Telefone exibido"
            name="phoneDisplay"
            placeholder="17 99727-8876"
            value={initialValues.phoneDisplay}
          />
          <TextInput
            error={errors.whatsappDisplay}
            label="WhatsApp exibido"
            name="whatsappDisplay"
            placeholder="17 99727-8876"
            value={initialValues.whatsappDisplay}
          />
          <TextInput
            error={errors.whatsappDigits}
            label="WhatsApp para link"
            name="whatsappDigits"
            placeholder="5517997278876"
            value={initialValues.whatsappDigits}
          />
          <div className="grid gap-4 sm:grid-cols-[1fr_7rem]">
            <TextInput
              error={errors.city}
              label="Cidade"
              name="city"
              placeholder="Sao Francisco"
              value={initialValues.city}
            />
            <TextInput
              error={errors.state}
              label="Estado"
              name="state"
              placeholder="SP"
              value={initialValues.state}
            />
          </div>
        </div>
      </section>

      <div className="flex flex-wrap gap-3">
        <button
          className="inline-flex min-h-11 items-center justify-center rounded-md bg-agromassa-green px-5 text-sm font-black text-white transition hover:bg-[#2f9714]"
          disabled={isPending}
          type="submit"
        >
          {isPending ? "Salvando..." : "Salvar configuracoes"}
        </button>
        <Link
          className="inline-flex min-h-11 items-center justify-center rounded-md border border-agromassa-border bg-white px-5 text-sm font-black text-agromassa-forest transition hover:border-agromassa-forest"
          href="/"
        >
          Ver home publica
        </Link>
      </div>
    </form>
  );
}

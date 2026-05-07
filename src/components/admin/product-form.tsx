"use client";

import Link from "next/link";
import { type FormEvent, useState } from "react";

import {
  ADMIN_PRODUCT_CATEGORY_VALUES,
  ADMIN_PRODUCT_CONDITION_VALUES,
  ADMIN_PRODUCT_STATUS_VALUES,
  adminProductFormSchema,
  type AdminProductFormInput,
} from "@/validators/products/admin-product";

export type ProductFormInitialValues = Omit<
  AdminProductFormInput,
  "intent"
> & {
  id?: string;
  mainImageUrl?: string | null;
};

type ProductFormProps = {
  initialValues: ProductFormInitialValues;
  mode: "create" | "edit";
};

type FieldName = keyof AdminProductFormInput;
type FieldErrors = Partial<Record<FieldName, string>>;

const categoryLabels: Record<string, string> = {
  IMPLEMENTOS: "Implementos",
  TRATORES: "Tratores",
};

const conditionLabels: Record<string, string> = {
  NOVO: "Novo",
  SEMINOVO: "Seminovo",
  USADO: "Usado",
};

const statusLabels: Record<string, string> = {
  ALUGADO: "Alugado",
  DISPONIVEL: "Disponivel",
  RASCUNHO: "Rascunho",
  SOB_CONSULTA: "Sob consulta",
  VENDIDO: "Vendido",
};

export function createEmptyProductFormValues(): ProductFormInitialValues {
  return {
    brand: "",
    category: "",
    city: "Sao Francisco",
    condition: "",
    description: "",
    isArchived: false,
    isFeatured: false,
    isPublicVisible: false,
    mainImageId: "",
    mainImageUrl: null,
    model: "",
    name: "",
    price: "",
    priceVisible: true,
    slug: "",
    state: "SP",
    status: "RASCUNHO",
    subcategory: "",
    technicalSpecs: "",
    year: "",
  };
}

function toFieldErrors(
  issues: ReturnType<typeof adminProductFormSchema.safeParse>,
): FieldErrors {
  if (issues.success) {
    return {};
  }

  const fields = issues.error.flatten().fieldErrors;

  return Object.fromEntries(
    Object.entries(fields).map(([field, messages]) => [
      field,
      messages?.[0] ?? "",
    ]),
  ) as FieldErrors;
}

function buildFormInput(
  formData: FormData,
  intent: AdminProductFormInput["intent"],
): AdminProductFormInput {
  return {
    brand: String(formData.get("brand") ?? ""),
    category: String(
      formData.get("category") ?? "",
    ) as AdminProductFormInput["category"],
    city: String(formData.get("city") ?? ""),
    condition: String(
      formData.get("condition") ?? "",
    ) as AdminProductFormInput["condition"],
    description: String(formData.get("description") ?? ""),
    intent,
    isArchived: formData.get("isArchived") === "on",
    isFeatured: formData.get("isFeatured") === "on",
    isPublicVisible: formData.get("isPublicVisible") === "on",
    mainImageId: String(formData.get("mainImageId") ?? ""),
    model: String(formData.get("model") ?? ""),
    name: String(formData.get("name") ?? ""),
    price: String(formData.get("price") ?? ""),
    priceVisible: formData.get("priceVisible") === "on",
    slug: String(formData.get("slug") ?? ""),
    state: String(formData.get("state") ?? "").toUpperCase(),
    status: String(
      formData.get("status") ?? "RASCUNHO",
    ) as AdminProductFormInput["status"],
    subcategory: String(formData.get("subcategory") ?? ""),
    technicalSpecs: String(formData.get("technicalSpecs") ?? ""),
    year: String(formData.get("year") ?? ""),
  };
}

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
  type = "text",
  value,
}: {
  error?: string;
  label: string;
  name: keyof ProductFormInitialValues;
  placeholder?: string;
  type?: string;
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
        type={type}
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
  name: keyof ProductFormInitialValues;
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

function SelectInput({
  error,
  label,
  name,
  options,
  value,
}: {
  error?: string;
  label: string;
  name: keyof ProductFormInitialValues;
  options: Record<string, string>;
  value: string;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-xs font-black uppercase text-agromassa-muted">
        {label}
      </span>
      <select
        className="min-h-11 rounded-md border border-agromassa-border bg-white px-3 text-sm font-bold text-agromassa-ink outline-none transition focus:border-agromassa-forest"
        defaultValue={value}
        name={name}
      >
        <option value="">Selecione</option>
        {Object.entries(options).map(([optionValue, optionLabel]) => (
          <option key={optionValue} value={optionValue}>
            {optionLabel}
          </option>
        ))}
      </select>
      <FieldError message={error} />
    </label>
  );
}

function CheckboxInput({
  defaultChecked,
  description,
  label,
  name,
}: {
  defaultChecked: boolean;
  description: string;
  label: string;
  name: keyof ProductFormInitialValues;
}) {
  return (
    <label className="flex gap-3 rounded-lg border border-agromassa-border bg-white p-4">
      <input
        className="mt-1 h-4 w-4 accent-agromassa-green"
        defaultChecked={defaultChecked}
        name={name}
        type="checkbox"
      />
      <span>
        <span className="block text-sm font-black text-agromassa-ink">
          {label}
        </span>
        <span className="mt-1 block text-xs font-bold leading-5 text-agromassa-muted">
          {description}
        </span>
      </span>
    </label>
  );
}

export function ProductForm({ initialValues, mode }: ProductFormProps) {
  const [errors, setErrors] = useState<FieldErrors>({});
  const [feedback, setFeedback] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nativeEvent = event.nativeEvent as SubmitEvent;
    const submitter = nativeEvent.submitter as HTMLButtonElement | null;
    const intent = submitter?.value === "publish" ? "publish" : "draft";
    const result = adminProductFormSchema.safeParse(
      buildFormInput(new FormData(event.currentTarget), intent),
    );

    setErrors(toFieldErrors(result));

    if (!result.success) {
      setFeedback(null);
      return;
    }

    setFeedback(
      intent === "publish"
        ? "Formulario valido para publicacao. A persistencia sera conectada na T23."
        : "Rascunho valido. A persistencia sera conectada na T23.",
    );
  }

  return (
    <form className="grid gap-6" onSubmit={handleSubmit}>
      <section className="rounded-lg border border-agromassa-border bg-white p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-black uppercase text-agromassa-green">
              {mode === "create" ? "Novo produto" : "Editar produto"}
            </p>
            <h1 className="mt-2 text-3xl font-black text-agromassa-ink">
              Dados do produto.
            </h1>
          </div>

          <Link
            className="inline-flex min-h-10 items-center justify-center rounded-md border border-agromassa-border px-4 text-sm font-black text-agromassa-forest transition hover:border-agromassa-forest"
            href="/admin/produtos"
          >
            Voltar
          </Link>
        </div>

        {feedback ? (
          <div className="mt-5 rounded-lg border border-agromassa-green bg-[#effbe9] px-4 py-3 text-sm font-bold text-agromassa-forest">
            {feedback}
          </div>
        ) : null}
      </section>

      <section className="rounded-lg border border-agromassa-border bg-white p-5 sm:p-6">
        <h2 className="text-xl font-black text-agromassa-ink">
          Identificacao
        </h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <TextInput
            error={errors.name}
            label="Nome"
            name="name"
            placeholder="Trator Massey Ferguson 4292"
            value={initialValues.name}
          />
          <TextInput
            error={errors.slug}
            label="Slug"
            name="slug"
            placeholder="trator-massey-ferguson-4292"
            value={initialValues.slug}
          />
          <SelectInput
            error={errors.category}
            label="Categoria"
            name="category"
            options={Object.fromEntries(
              ADMIN_PRODUCT_CATEGORY_VALUES.map((value) => [
                value,
                categoryLabels[value],
              ]),
            )}
            value={initialValues.category}
          />
          <TextInput
            error={errors.subcategory}
            label="Tipo ou subcategoria"
            name="subcategory"
            placeholder="Trator agricola"
            value={initialValues.subcategory}
          />
          <TextInput
            error={errors.brand}
            label="Marca"
            name="brand"
            placeholder="Massey Ferguson"
            value={initialValues.brand}
          />
          <TextInput
            error={errors.model}
            label="Modelo"
            name="model"
            placeholder="4292"
            value={initialValues.model}
          />
          <TextInput
            error={errors.year}
            label="Ano"
            name="year"
            placeholder="2019"
            type="number"
            value={initialValues.year}
          />
          <SelectInput
            error={errors.condition}
            label="Condicao"
            name="condition"
            options={Object.fromEntries(
              ADMIN_PRODUCT_CONDITION_VALUES.map((value) => [
                value,
                conditionLabels[value],
              ]),
            )}
            value={initialValues.condition}
          />
        </div>
      </section>

      <section className="rounded-lg border border-agromassa-border bg-white p-5 sm:p-6">
        <h2 className="text-xl font-black text-agromassa-ink">
          Conteudo comercial
        </h2>
        <div className="mt-5 grid gap-4">
          <TextArea
            error={errors.description}
            label="Descricao"
            name="description"
            placeholder="Descricao comercial do produto"
            value={initialValues.description}
          />
          <TextArea
            error={errors.technicalSpecs}
            label="Especificacoes tecnicas"
            name="technicalSpecs"
            placeholder="Motor, tracao, pneus, medidas e observacoes tecnicas"
            value={initialValues.technicalSpecs}
          />
        </div>
      </section>

      <section className="rounded-lg border border-agromassa-border bg-white p-5 sm:p-6">
        <h2 className="text-xl font-black text-agromassa-ink">
          Publicacao
        </h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <SelectInput
            error={errors.status}
            label="Status"
            name="status"
            options={Object.fromEntries(
              ADMIN_PRODUCT_STATUS_VALUES.map((value) => [
                value,
                statusLabels[value],
              ]),
            )}
            value={initialValues.status}
          />
          <TextInput
            error={errors.price}
            label="Preco"
            name="price"
            placeholder="185000,00"
            value={initialValues.price}
          />
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

        <div className="mt-5 grid gap-3 md:grid-cols-2">
          <CheckboxInput
            defaultChecked={initialValues.priceVisible}
            description="Permite exibir o valor quando o preco estiver preenchido."
            label="Preco visivel"
            name="priceVisible"
          />
          <CheckboxInput
            defaultChecked={initialValues.isPublicVisible}
            description="Controla se o produto pode aparecer no catalogo publico."
            label="Visivel no site"
            name="isPublicVisible"
          />
          <CheckboxInput
            defaultChecked={initialValues.isFeatured}
            description="Prioriza o produto na ordenacao publica."
            label="Destaque"
            name="isFeatured"
          />
          <CheckboxInput
            defaultChecked={initialValues.isArchived}
            description="Mantem o produto fora da operacao ativa sem apagar registro."
            label="Arquivado"
            name="isArchived"
          />
        </div>
      </section>

      <section className="rounded-lg border border-agromassa-border bg-white p-5 sm:p-6">
        <h2 className="text-xl font-black text-agromassa-ink">Fotos</h2>
        <input
          defaultValue={initialValues.mainImageId}
          name="mainImageId"
          type="hidden"
        />
        <div className="mt-5 rounded-lg border border-dashed border-agromassa-border bg-agromassa-cream p-5">
          {initialValues.mainImageUrl ? (
            <div className="grid gap-3 sm:grid-cols-[160px_1fr] sm:items-center">
              <div
                aria-label={initialValues.name}
                className="aspect-[4/3] rounded-md bg-agromassa-ink bg-cover bg-center"
                role="img"
                style={{
                  backgroundImage: `url("${initialValues.mainImageUrl.replaceAll('"', '\\"')}"), url("/brand/agromassa.jpeg")`,
                }}
              />
              <p className="text-sm font-bold leading-6 text-agromassa-muted">
                Foto principal vinculada ao produto.
              </p>
            </div>
          ) : (
            <p className="text-sm font-bold leading-6 text-agromassa-muted">
              Nenhuma foto principal vinculada.
            </p>
          )}
          <FieldError message={errors.mainImageId} />
        </div>
      </section>

      <div className="flex flex-wrap gap-3">
        <button
          className="inline-flex min-h-11 items-center justify-center rounded-md border border-agromassa-border bg-white px-5 text-sm font-black text-agromassa-forest transition hover:border-agromassa-forest"
          name="intent"
          type="submit"
          value="draft"
        >
          Salvar rascunho
        </button>
        <button
          className="inline-flex min-h-11 items-center justify-center rounded-md bg-agromassa-green px-5 text-sm font-black text-white transition hover:bg-[#2f9714]"
          name="intent"
          type="submit"
          value="publish"
        >
          Publicar produto
        </button>
      </div>
    </form>
  );
}

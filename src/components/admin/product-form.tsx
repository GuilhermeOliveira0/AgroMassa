"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useState, useTransition } from "react";

import {
  archiveProductAction,
  saveProductAction,
} from "@/features/products/admin-product-actions";
import { useToast } from "@/components/ui/toast-provider";
import {
  PRODUCT_CATEGORY_LABELS,
  PRODUCT_CONDITION_LABELS,
  PRODUCT_STATUS_LABELS,
} from "@/lib/utils/product-display";
import {
  ADMIN_PRODUCT_CATEGORY_VALUES,
  ADMIN_PRODUCT_CONDITION_VALUES,
  ADMIN_PRODUCT_STATUS_VALUES,
  adminProductFormFieldErrors,
  adminProductFormInputFromFormData,
  type AdminProductFormInput,
  type AdminProductFormFieldErrors,
  adminProductFormSchema,
} from "@/validators/products/admin-product";

import {
  ProductImageGallery,
  type ProductFormImage,
} from "./product-image-gallery";
import { ProductImageUploader } from "./product-image-uploader";

export type ProductFormInitialValues = Omit<
  AdminProductFormInput,
  "intent"
> & {
  id?: string;
  images: ProductFormImage[];
  mainImageUrl?: string | null;
};

type ProductFormProps = {
  initialValues: ProductFormInitialValues;
  mode: "create" | "edit";
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

function getProductValidationMessage(
  intent: AdminProductFormInput["intent"],
) {
  if (intent === "publish") {
    return "Revise os campos obrigatorios para publicar o produto.";
  }

  return "Revise os campos obrigatorios para salvar o rascunho.";
}

function getProductSuccessMessage({
  intent,
  mode,
}: {
  intent: AdminProductFormInput["intent"];
  mode: ProductFormProps["mode"];
}) {
  if (intent === "draft") {
    return "Rascunho salvo com sucesso.";
  }

  if (mode === "create") {
    return "Produto publicado com sucesso.";
  }

  return "Produto atualizado com sucesso.";
}

export function ProductForm({ initialValues, mode }: ProductFormProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [errors, setErrors] = useState<AdminProductFormFieldErrors>({});
  const [images, setImages] = useState<ProductFormImage[]>(initialValues.images);
  const [mainImageId, setMainImageId] = useState(initialValues.mainImageId);

  function handleImageUploaded(image: ProductFormImage) {
    setImages((currentImages) => [image, ...currentImages]);

    if (image.isMain || !mainImageId) {
      setMainImageId(image.id);
    }

    router.refresh();
  }

  function handleMainImageChange(imageId: string) {
    setMainImageId(imageId);
    setImages((currentImages) =>
      currentImages.map((image) => ({
        ...image,
        isMain: image.id === imageId,
      })),
    );
    router.refresh();
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nativeEvent = event.nativeEvent as SubmitEvent;
    const submitter = nativeEvent.submitter as HTMLButtonElement | null;
    const intent = submitter?.value === "publish" ? "publish" : "draft";
    const formData = new FormData(event.currentTarget);
    const result = adminProductFormSchema.safeParse(
      adminProductFormInputFromFormData(formData, intent),
    );

    setErrors(adminProductFormFieldErrors(result));

    if (!result.success) {
      showToast({
        message: getProductValidationMessage(intent),
        tone: "validation",
      });
      return;
    }

    startTransition(async () => {
      const actionResult = await saveProductAction({
        formData,
        intent,
        productId: initialValues.id,
      });

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
        message: getProductSuccessMessage({ intent, mode }),
        tone: "success",
      });

      if (actionResult.redirectTo) {
        router.push(actionResult.redirectTo);
        router.refresh();
      }
    });
  }

  function handleArchive() {
    const productId = initialValues.id;

    if (!productId) {
      return;
    }

    startTransition(async () => {
      const actionResult = await archiveProductAction(productId);

      if (!actionResult.ok) {
        showToast({
          message:
            actionResult.formError ??
            "Nao foi possivel concluir a acao. Tente novamente.",
          tone: "error",
        });
        return;
      }

      showToast({
        message: "Produto arquivado com sucesso.",
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
                PRODUCT_CATEGORY_LABELS[value],
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
                PRODUCT_CONDITION_LABELS[value],
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
                PRODUCT_STATUS_LABELS[value],
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
          readOnly
          value={mainImageId}
          name="mainImageId"
          type="hidden"
        />
        <div className="mt-5 grid gap-5">
          <ProductImageUploader
            disabled={isPending}
            imageCount={images.length}
            onImageUploaded={handleImageUploaded}
            productId={initialValues.id}
          />

          {initialValues.id ? (
            <ProductImageGallery
              images={images}
              mainImageId={mainImageId}
              onMainImageChange={handleMainImageChange}
              productId={initialValues.id}
            />
          ) : null}

          <FieldError message={errors.mainImageId} />
        </div>
      </section>

      <div className="flex flex-wrap gap-3">
        <button
          className="inline-flex min-h-11 items-center justify-center rounded-md border border-agromassa-border bg-white px-5 text-sm font-black text-agromassa-forest transition hover:border-agromassa-forest"
          disabled={isPending}
          name="intent"
          type="submit"
          value="draft"
        >
          {isPending ? "Salvando..." : "Salvar rascunho"}
        </button>
        <button
          className="inline-flex min-h-11 items-center justify-center rounded-md bg-agromassa-green px-5 text-sm font-black text-white transition hover:bg-[#2f9714]"
          disabled={isPending}
          name="intent"
          type="submit"
          value="publish"
        >
          {isPending ? "Salvando..." : "Publicar produto"}
        </button>
        {initialValues.id ? (
          <button
            className="inline-flex min-h-11 items-center justify-center rounded-md border border-red-200 bg-white px-5 text-sm font-black text-red-700 transition hover:border-red-600"
            disabled={isPending || initialValues.isArchived}
            onClick={handleArchive}
            type="button"
          >
            {initialValues.isArchived ? "Produto arquivado" : "Arquivar produto"}
          </button>
        ) : null}
      </div>
    </form>
  );
}

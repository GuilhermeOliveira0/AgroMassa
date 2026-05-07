import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import {
  PrismaClient,
  ProductCategory,
  ProductCondition,
  ProductStatus,
} from "@prisma/client";

type TestProduct = {
  slug: string;
  name: string;
  category: ProductCategory;
  subcategory: string;
  brand: string;
  model: string;
  year: number;
  condition: ProductCondition;
  description: string;
  technicalSpecs: string;
  priceCents: number | null;
  priceVisible: boolean;
  status: ProductStatus;
  city: string;
  state: string;
  isFeatured: boolean;
  isPublicVisible: boolean;
  isArchived: boolean;
  publishedAt: Date | null;
  image?: {
    storageKey: string;
    publicUrl: string;
    originalFilename: string;
    width: number;
    height: number;
    isMain: boolean;
  };
};

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL ?? process.env.DIRECT_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL or DIRECT_URL is required to seed test data.");
  }

  const adapter = new PrismaPg({ connectionString });

  return new PrismaClient({
    adapter,
  });
}

function normalizeSearchText(product: Pick<TestProduct, "name" | "brand" | "model" | "subcategory">) {
  return [product.name, product.brand, product.model, product.subcategory]
    .join(" ")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

const testProducts: TestProduct[] = [
  {
    slug: "teste-trator-visivel-com-imagem",
    name: "Trator Massey Ferguson 4292 Teste",
    category: ProductCategory.TRATORES,
    subcategory: "Trator agricola",
    brand: "Massey Ferguson",
    model: "4292",
    year: 2019,
    condition: ProductCondition.USADO,
    description:
      "Produto de teste visivel no catalogo publico, completo e com imagem principal.",
    technicalSpecs: "Motor diesel, tracao 4x4, cabine aberta e tomada de forca.",
    priceCents: 18500000,
    priceVisible: true,
    status: ProductStatus.DISPONIVEL,
    city: "Sao Francisco",
    state: "SP",
    isFeatured: true,
    isPublicVisible: true,
    isArchived: false,
    publishedAt: new Date("2026-05-01T12:00:00.000Z"),
    image: {
      storageKey: "seed/teste-trator-visivel-com-imagem-main.jpg",
      publicUrl: "/seed/products/teste-trator-visivel-com-imagem-main.jpg",
      originalFilename: "teste-trator-visivel-com-imagem-main.jpg",
      width: 1200,
      height: 800,
      isMain: true,
    },
  },
  {
    slug: "teste-produto-rascunho",
    name: "Implemento Rascunho Teste",
    category: ProductCategory.IMPLEMENTOS,
    subcategory: "Grade aradora",
    brand: "Baldan",
    model: "NVCR",
    year: 2021,
    condition: ProductCondition.SEMINOVO,
    description: "Produto de teste em rascunho, nao deve aparecer publicamente.",
    technicalSpecs: "Controle remoto, discos recortados e largura de trabalho media.",
    priceCents: 4200000,
    priceVisible: true,
    status: ProductStatus.RASCUNHO,
    city: "Sao Francisco",
    state: "SP",
    isFeatured: false,
    isPublicVisible: true,
    isArchived: false,
    publishedAt: null,
    image: {
      storageKey: "seed/teste-produto-rascunho-main.jpg",
      publicUrl: "/seed/products/teste-produto-rascunho-main.jpg",
      originalFilename: "teste-produto-rascunho-main.jpg",
      width: 1200,
      height: 800,
      isMain: true,
    },
  },
  {
    slug: "teste-produto-arquivado",
    name: "Trator Arquivado Teste",
    category: ProductCategory.TRATORES,
    subcategory: "Trator agricola",
    brand: "New Holland",
    model: "TL75",
    year: 2015,
    condition: ProductCondition.USADO,
    description: "Produto de teste arquivado, nao deve aparecer publicamente.",
    technicalSpecs: "Motor revisado, pneus em bom estado e direcao hidraulica.",
    priceCents: 12800000,
    priceVisible: true,
    status: ProductStatus.DISPONIVEL,
    city: "Sao Francisco",
    state: "SP",
    isFeatured: false,
    isPublicVisible: true,
    isArchived: true,
    publishedAt: new Date("2026-05-02T12:00:00.000Z"),
    image: {
      storageKey: "seed/teste-produto-arquivado-main.jpg",
      publicUrl: "/seed/products/teste-produto-arquivado-main.jpg",
      originalFilename: "teste-produto-arquivado-main.jpg",
      width: 1200,
      height: 800,
      isMain: true,
    },
  },
  {
    slug: "teste-produto-invisivel",
    name: "Plantadeira Invisivel Teste",
    category: ProductCategory.IMPLEMENTOS,
    subcategory: "Plantadeira",
    brand: "Jumil",
    model: "JM 2980",
    year: 2020,
    condition: ProductCondition.USADO,
    description: "Produto de teste invisivel, nao deve aparecer publicamente.",
    technicalSpecs: "Linhas ajustaveis, caixa de sementes e adubo em bom estado.",
    priceCents: 7600000,
    priceVisible: true,
    status: ProductStatus.DISPONIVEL,
    city: "Sao Francisco",
    state: "SP",
    isFeatured: false,
    isPublicVisible: false,
    isArchived: false,
    publishedAt: new Date("2026-05-03T12:00:00.000Z"),
    image: {
      storageKey: "seed/teste-produto-invisivel-main.jpg",
      publicUrl: "/seed/products/teste-produto-invisivel-main.jpg",
      originalFilename: "teste-produto-invisivel-main.jpg",
      width: 1200,
      height: 800,
      isMain: true,
    },
  },
  {
    slug: "teste-produto-sem-imagem-principal",
    name: "Pulverizador Sem Imagem Principal Teste",
    category: ProductCategory.IMPLEMENTOS,
    subcategory: "Pulverizador",
    brand: "Jacto",
    model: "Columbia",
    year: 2018,
    condition: ProductCondition.USADO,
    description:
      "Produto de teste sem imagem principal, nao deve aparecer publicamente pela regra da T12.",
    technicalSpecs: "Tanque de 2000 litros, barras revisadas e comando manual.",
    priceCents: 5900000,
    priceVisible: false,
    status: ProductStatus.DISPONIVEL,
    city: "Sao Francisco",
    state: "SP",
    isFeatured: false,
    isPublicVisible: true,
    isArchived: false,
    publishedAt: new Date("2026-05-04T12:00:00.000Z"),
    image: {
      storageKey: "seed/teste-produto-sem-imagem-principal-secondary.jpg",
      publicUrl: "/seed/products/teste-produto-sem-imagem-principal-secondary.jpg",
      originalFilename: "teste-produto-sem-imagem-principal-secondary.jpg",
      width: 1200,
      height: 800,
      isMain: false,
    },
  },
];

async function findSeedAdmin(prisma: PrismaClient) {
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();

  if (adminEmail) {
    const adminByEnv = await prisma.adminUser.findUnique({
      where: {
        email: adminEmail,
      },
    });

    if (adminByEnv) {
      return adminByEnv;
    }
  }

  const activeAdmin = await prisma.adminUser.findFirst({
    where: {
      isActive: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  if (!activeAdmin) {
    throw new Error("Create the initial admin with npm run prisma:seed before seeding test data.");
  }

  return activeAdmin;
}

async function upsertSiteSettings(prisma: PrismaClient, adminId: string) {
  const siteSettingsData = {
    companyName: "AgroMassa",
    logoPath: "/brand/agromassa.jpeg",
    institutionalText:
      "A AgroMassa atua na compra, venda, troca e locacao de tratores e implementos agricolas, conectando produtores rurais a maquinas e equipamentos adequados para o trabalho no campo.",
    servicesText:
      "Compra, venda, troca e locacao de tratores e implementos agricolas.",
    phoneDisplay: "17 99727-8876",
    whatsappDisplay: "17 99727-8876",
    whatsappDigits: "5517997278876",
    city: "Sao Francisco",
    state: "SP",
    updatedByAdminId: adminId,
  };

  const existingSiteSettings = await prisma.siteSetting.findFirst({
    orderBy: {
      createdAt: "asc",
    },
  });

  if (existingSiteSettings) {
    await prisma.siteSetting.update({
      where: {
        id: existingSiteSettings.id,
      },
      data: siteSettingsData,
    });
    return;
  }

  await prisma.siteSetting.create({
    data: siteSettingsData,
  });
}

async function upsertTestProduct(
  prisma: PrismaClient,
  adminId: string,
  product: TestProduct,
) {
  const { image, ...productData } = product;

  const savedProduct = await prisma.product.upsert({
    where: {
      slug: product.slug,
    },
    update: {
      ...productData,
      searchTextNormalized: normalizeSearchText(product),
      updatedByAdminId: adminId,
    },
    create: {
      ...productData,
      searchTextNormalized: normalizeSearchText(product),
      createdByAdminId: adminId,
      updatedByAdminId: adminId,
    },
  });

  if (!image) {
    await prisma.product.update({
      where: {
        id: savedProduct.id,
      },
      data: {
        mainImageId: null,
      },
    });
    return;
  }

  const savedImage = await prisma.productImage.upsert({
    where: {
      storageKey: image.storageKey,
    },
    update: {
      productId: savedProduct.id,
      publicUrl: image.publicUrl,
      originalFilename: image.originalFilename,
      mimeType: "image/jpeg",
      fileSizeBytes: 180000,
      width: image.width,
      height: image.height,
      sortOrder: image.isMain ? 0 : 1,
      isMain: image.isMain,
    },
    create: {
      productId: savedProduct.id,
      storageKey: image.storageKey,
      publicUrl: image.publicUrl,
      originalFilename: image.originalFilename,
      mimeType: "image/jpeg",
      fileSizeBytes: 180000,
      width: image.width,
      height: image.height,
      sortOrder: image.isMain ? 0 : 1,
      isMain: image.isMain,
    },
  });

  await prisma.product.update({
    where: {
      id: savedProduct.id,
    },
    data: {
      mainImageId: image.isMain ? savedImage.id : null,
    },
  });
}

async function main() {
  const prisma = createPrismaClient();

  try {
    const admin = await findSeedAdmin(prisma);

    await upsertSiteSettings(prisma, admin.id);

    for (const product of testProducts) {
      await upsertTestProduct(prisma, admin.id, product);
    }

    console.log("Test seed completed: site settings, products, and images are ready.");
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

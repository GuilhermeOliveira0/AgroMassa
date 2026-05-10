import "dotenv/config";
import bcrypt from "bcrypt";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const PASSWORD_HASH_ROUNDS = 12;
type AdminEnvKey = "ADMIN_NAME" | "ADMIN_EMAIL" | "ADMIN_PASSWORD";

function getRequiredEnv(key: AdminEnvKey) {
  const value = process.env[key]?.trim();

  if (!value) {
    throw new Error(`${key} is required to run the database seed.`);
  }

  return value;
}

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL ?? process.env.DIRECT_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL or DIRECT_URL is required to run the database seed.");
  }

  const adapter = new PrismaPg({ connectionString });

  return new PrismaClient({
    adapter,
  });
}

async function main() {
  const prisma = createPrismaClient();
  const adminName = getRequiredEnv("ADMIN_NAME");
  const adminEmail = getRequiredEnv("ADMIN_EMAIL").toLowerCase();
  const adminPassword = getRequiredEnv("ADMIN_PASSWORD");

  try {
    const passwordHash = await bcrypt.hash(adminPassword, PASSWORD_HASH_ROUNDS);

    const admin = await prisma.adminUser.upsert({
      where: {
        email: adminEmail,
      },
      update: {
        name: adminName,
        passwordHash,
        isActive: true,
      },
      create: {
        name: adminName,
        email: adminEmail,
        passwordHash,
        isActive: true,
      },
    });

    const siteSettingsData = {
      companyName: "AgroMassa",
      logoPath: "/brand/agromassa1.jpeg",
      institutionalText:
        "A AgroMassa atua na compra, venda, troca e locacao de tratores e implementos agricolas, conectando produtores rurais a maquinas e equipamentos adequados para o trabalho no campo.",
      servicesText:
        "Compra, venda, troca e locacao de tratores e implementos agricolas.",
      phoneDisplay: "17 99727-8876",
      whatsappDisplay: "17 99727-8876",
      whatsappDigits: "5517997278876",
      city: "Sao Francisco",
      state: "SP",
      updatedByAdminId: admin.id,
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
    } else {
      await prisma.siteSetting.create({
        data: siteSettingsData,
      });
    }

    console.log("Seed completed: admin user and site settings are ready.");
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });

import bcrypt from "bcrypt";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { z } from "zod";

import { prisma } from "@/lib/db/prisma";
import { authSecret } from "@/lib/auth/secret";

const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1),
});
async function getAdminForAuth(email: string) {
  return prisma.adminUser.findUnique({
    where: {
      email: email.toLowerCase(),
    },
    select: {
      id: true,
      name: true,
      email: true,
      passwordHash: true,
      isActive: true,
    },
  });
}

export const authOptions: NextAuthOptions = {
  secret: authSecret,
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Credenciais",
      credentials: {
        email: {
          label: "Email",
          type: "email",
        },
        password: {
          label: "Senha",
          type: "password",
        },
      },
      async authorize(credentials) {
        const parsedCredentials = loginSchema.safeParse(credentials);

        if (!parsedCredentials.success) {
          return null;
        }

        const { email, password } = parsedCredentials.data;
        const admin = await getAdminForAuth(email);

        if (!admin || !admin.isActive) {
          return null;
        }

        const passwordMatches = await bcrypt.compare(password, admin.passwordHash);

        if (!passwordMatches) {
          return null;
        }

        await prisma.adminUser.update({
          where: {
            id: admin.id,
          },
          data: {
            lastLoginAt: new Date(),
          },
        });

        return {
          id: admin.id,
          name: admin.name,
          email: admin.email,
          isActive: admin.isActive,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.email = user.email;
        token.name = user.name;
        token.isActive = user.isActive;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
        session.user.name = token.name;
        session.user.email = token.email ?? "";
        session.user.isActive = token.isActive === true;
      }

      return session;
    },
  },
};

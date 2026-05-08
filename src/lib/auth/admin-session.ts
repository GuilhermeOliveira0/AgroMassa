import { getServerAuthSession } from "@/lib/auth/auth";

export const ADMIN_SESSION_ERROR_MESSAGE =
  "Sessao administrativa invalida. Faca login novamente.";

export async function getActiveAdminId() {
  const session = await getServerAuthSession();

  if (!session?.user?.id || !session.user.isActive) {
    return null;
  }

  return session.user.id;
}

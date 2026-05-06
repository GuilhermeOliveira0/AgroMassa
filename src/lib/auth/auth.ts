import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth/config";

export function getServerAuthSession() {
  return getServerSession(authOptions);
}

const DEVELOPMENT_AUTH_SECRET = "agromassa-local-dev-auth-secret";

export const authSecret =
  process.env.AUTH_SECRET ??
  process.env.NEXTAUTH_SECRET ??
  (process.env.NODE_ENV !== "production" ? DEVELOPMENT_AUTH_SECRET : undefined);

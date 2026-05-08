import { NextResponse } from "next/server";

export const ADMIN_API_ERROR_MESSAGES = {
  badRequest: "Requisicao invalida.",
  serverError: "Nao foi possivel concluir a operacao agora.",
  unauthorized: "Acesso administrativo necessario.",
} as const;

export function adminUnauthorizedResponse() {
  return NextResponse.json(
    {
      error: ADMIN_API_ERROR_MESSAGES.unauthorized,
    },
    {
      status: 401,
    },
  );
}

export function adminBadRequestResponse(
  error: string = ADMIN_API_ERROR_MESSAGES.badRequest,
  extra?: Record<string, unknown>,
) {
  return NextResponse.json(
    {
      error,
      ...extra,
    },
    {
      status: 400,
    },
  );
}

export function adminServerErrorResponse() {
  return NextResponse.json(
    {
      error: ADMIN_API_ERROR_MESSAGES.serverError,
    },
    {
      status: 500,
    },
  );
}

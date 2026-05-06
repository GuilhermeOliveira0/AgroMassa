import { z } from "zod";

export const adminLoginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Informe o email.")
    .email("Informe um email valido."),
  password: z.string().min(1, "Informe a senha."),
});

export type AdminLoginInput = z.infer<typeof adminLoginSchema>;

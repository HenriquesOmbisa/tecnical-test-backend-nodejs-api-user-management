import z from "zod";

export const loginSchema = z.object({
    email: z.string().email("Formato de email inválido"),
    password: z.string().min(1, "Password é obrigatória"),
});

export const registerSchema = z.object({
    name: z.string().min(1, "Nome é obrigatório"),
    email: z.string().email("Formato de email inválido"),
    password: z.string().min(6, "Password deve ter pelo menos 6 caracteres"),
    provinceId: z.string().min(1, "Província é obrigatória"),
    municipalityId: z.string().min(1, "Município é obrigatório"),
});

export type LoginDto = z.infer<typeof loginSchema>;
export type RegisterDto = z.infer<typeof registerSchema>;

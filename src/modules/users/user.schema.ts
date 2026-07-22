import z, { email } from 'zod';

export const createUserSchema = z.object({
    name: z.string().min(1, { message: "Nome é obrigatório" }),
    email: z.email({ message: "Email inválido" }),
    password: z.string().min(6, { message: "Password deve ter pelo menos 6 caracteres" }),
    provinceId: z.string().min(1, { message: "ID da província é obrigatório" }),
    municipalityId: z.string().min(1, { message: "ID do município é obrigatório" }),
});

export const updateUserSchema = z.object({
    name: z.string().optional(),
    email: z.email({ message: "Email inválido" }).optional(),
    password: z.string().min(6, { message: "Password deve ter pelo menos 6 caracteres" }).optional(),
    role: z.enum(["admin", "user"]).optional(),
    provinceId: z.string().optional(),
    municipalityId: z.string().optional(),
});

export const userFilterSchema = z.object({
    name: z.string().optional(),
    email: z.email({ message: "Email inválido" }).optional(),
    provinceId: z.string().optional(),
    municipalityId: z.string().optional(),
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().optional(),
});
import z from 'zod';

export const createProvinceSchema = z.object({
    name: z.string().min(1, { message: "Nome é obrigatório" }),
});

export const updateProvinceSchema = z.object({
    name: z.string().optional(),
});
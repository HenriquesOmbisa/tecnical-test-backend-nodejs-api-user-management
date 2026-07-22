import z from 'zod';

export const createMunicipalitySchema = z.object({
    name: z.string().min(1, { message: "Nome é obrigatório" }),
    provinceId: z.string().min(1, { message: "ID da província é obrigatório" }),
});

export const updateMunicipalitySchema = z.object({
    name: z.string().optional(),
    provinceId: z.string().optional(),
});
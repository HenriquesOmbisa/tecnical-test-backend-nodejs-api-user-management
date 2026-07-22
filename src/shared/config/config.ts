import z from "zod";

const envSchema = z.object({
    PORT: z.coerce.number().default(3000),
    MONGO_URI: z.url("MONGO_URI deve ser uma URL válida!"),
    JWT_SECRET: z.string().min(16, "JWT_SECRET deve ter pelo menos 16 caracteres")
})

export type Config = z.infer<typeof envSchema>;

export function loadConfig(): Config {
    const result = envSchema.safeParse(process.env);
    
    if(!result.success) {
        console.error("Variáveis de ambiente inválidas:", result.error?.flatten().fieldErrors);
        process.exit(1);
    }

    return result.data;
}
import express from "express";
import userRoutes from "@/modules/users/user.routes";
import provinceRoutes from "@/modules/provinces/province.routes";
import municipalityRoutes from "@/modules/municipalities/municipality.routes";
import authRoutes from "@/modules/auth/auth.routes";
import { setupSwagger } from "@/infra/http/swagger";

export async function createApp() {
    const app = express();
    const BASE_URL = "/api/v1";

    app.use(express.json());

    setupSwagger(app);

    app.get("/", (req, res) => {
        res.json({
            message: "API de Gestao de Utilizadores - Angola",
            author: "Nzuzi Henriques Kondo Ombisa",
            email: "henriquesombisa@gmail.com",
            objective: "Teste tecnico para vaga de Backend Developer Pleno na VAM Solucoes",
            version: "1.0.0",
            documentation: "/api-docs",
            json_spec: "/api-docs.json",
        });
    });

    app.use(BASE_URL, userRoutes);
    app.use(BASE_URL, provinceRoutes);
    app.use(BASE_URL, municipalityRoutes);
    app.use(BASE_URL, authRoutes);

    app.use((err: Error, req: any, res: any, next: any) => {
        console.error("Erro não tratado:", err);
        res.status(500).json({ error: "Erro interno do servidor" });
    });

    return app;
}

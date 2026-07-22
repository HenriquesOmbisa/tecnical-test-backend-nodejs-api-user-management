import swaggerJsdoc from "swagger-jsdoc"
import swaggerUi from "swagger-ui-express"
import { Express } from "express"

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "API de Gestao de Utilizadores - Angola",
            version: "1.0.0",
            description: "API RESTful para gestao de utilizadores, provincias e municipios de Angola",
        },
        servers: [
            {
                url: "http://localhost:3000/api/v1",
                description: "Servidor de desenvolvimento",
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: ["./src/modules/**/*.routes.ts"],
}

const swaggerSpec = swaggerJsdoc(options)

export function setupSwagger(app: Express): void {
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec))
    app.get("/api-docs.json", (req, res) => res.json(swaggerSpec))
}

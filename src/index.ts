import "reflect-metadata";
import { container } from "@/shared/container/container";
import { IDatabase } from "@/infra/database/database.interface";
import { createApp } from "@/app";

async function bootstrap() {
    const database = container.resolve<IDatabase>(IDatabase);
    await database.connect();

    const app = await createApp();
    const config = container.resolve<any>("Config");

    app.listen(config.PORT, () => {
        console.log(`Servidor em execução em http://localhost:${config.PORT}`);
        console.log(`DOCUMENTATION: http://localhost:${config.PORT}/api-docs`);
        console.log(`JSON_SPEC: http://localhost:${config.PORT}/api-docs.json`);
        console.log(`API: http://localhost:${config.PORT}/api/v1`);
    });
}

bootstrap().catch((error) => {
    console.error("Falha ao iniciar:", error);
    process.exit(1);
});

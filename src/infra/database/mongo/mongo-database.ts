import mongoose from "mongoose";
import { injectable, inject } from "tsyringe";
import type { Config } from "@/shared/config/config";
import { IDatabase } from "../database.interface";

@injectable()
export class MongoDatabase implements IDatabase {
    constructor(@inject("Config") private readonly config: Config) {}

    async connect(): Promise<void> {
        await mongoose.connect(this.config.MONGO_URI);
        console.log("MongoDB conectado");
    }

    async disconnect(): Promise<void> {
        await mongoose.disconnect();
        console.log("MongoDB desconectado");
    }
}

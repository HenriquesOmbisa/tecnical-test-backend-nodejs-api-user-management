import "reflect-metadata";
import mongoose from "mongoose";
import crypto from "crypto";
import { loadConfig } from "@/shared/config/config";
import ProvinceModel from "@/infra/database/mongo/models/province.mongo-model";
import MunicipalityModel from "@/infra/database/mongo/models/municipality.mongo-model";
import UserModel from "@/infra/database/mongo/models/user.mongo-model";

const SALT_LENGTH = 16;
const KEY_LENGTH = 64;

async function hashPassword(password: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const salt = crypto.randomBytes(SALT_LENGTH).toString("hex");
        crypto.scrypt(password, salt, KEY_LENGTH, (err, key) => {
            if (err) reject(err);
            else resolve(`${salt}:${key.toString("hex")}`);
        });
    });
}

async function seed() {
    const config = loadConfig();

    await mongoose.connect(config.MONGO_URI);
    console.log("MongoDB conectado");

    const provinceName = "Luanda";
    const municipalityName = "Hoji Ya Henda";

    let province = await ProvinceModel.findOne({ name: provinceName });
    if (!province) {
        province = await ProvinceModel.create({ name: provinceName });
        console.log(`Provincia "${provinceName}" criada`);
    } else {
        console.log(`Provincia "${provinceName}" ja existe`);
    }

    const existingMunicipality = await MunicipalityModel.findOne({
        name: municipalityName,
        provinceId: province.id,
    });

    if (!existingMunicipality) {
        await MunicipalityModel.create({
            name: municipalityName,
            provinceId: province.id,
        });
        console.log(`Municipio "${municipalityName}" criado em "${provinceName}"`);
    } else {
        console.log(`Municipio "${municipalityName}" ja existe em "${provinceName}"`);
    }

    const adminEmail = "admin@email.com";
    const existingAdmin = await UserModel.findOne({ email: adminEmail });
    if (!existingAdmin) {
        const hashedPassword = await hashPassword("admin123");
        await UserModel.create({
            name: "Admin",
            email: adminEmail,
            password: hashedPassword,
            role: "admin",
            provinceId: province.id,
            municipalityId: existingMunicipality
                ? existingMunicipality.id
                : (await MunicipalityModel.findOne({ name: municipalityName }))!.id,
        });
        console.log(`Admin criado (${adminEmail} / admin123)`);
    } else {
        console.log("Admin ja existe");
    }

    await mongoose.disconnect();
    console.log("Seed concluido");
}

seed().catch((error) => {
    console.error("Erro no seed:", error);
    process.exit(1);
});

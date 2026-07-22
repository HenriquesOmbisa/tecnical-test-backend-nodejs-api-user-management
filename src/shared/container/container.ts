import { container } from "tsyringe";

// Config
import { loadConfig } from "../config/config";

const config = loadConfig();
container.registerInstance("Config", config);

// Database
import { IDatabase } from "@/infra/database/database.interface";
import { MongoDatabase } from "@/infra/database/mongo/mongo-database";

container.registerSingleton<IDatabase>(IDatabase, MongoDatabase);

// Repositories
import { IUserRepository } from "@/modules/users/user.repository";
import { IProvinceRepository } from "@/modules/provinces/province.repository";
import { IMunicipalityRepository } from "@/modules/municipalities/municipality.repository";
import { UserMongoRepository } from "@/infra/database/mongo/repositories/user.mongo-repository";
import { ProvinceMongoRepository } from "@/infra/database/mongo/repositories/province.mongo-repository";
import { MunicipalityMongoRepository } from "@/infra/database/mongo/repositories/municipality.mongo-repository";

container.registerSingleton<IUserRepository>(IUserRepository, UserMongoRepository);
container.registerSingleton<IProvinceRepository>(IProvinceRepository, ProvinceMongoRepository);
container.registerSingleton<IMunicipalityRepository>(IMunicipalityRepository, MunicipalityMongoRepository);

// Auth (infra)
import { JwtService } from "@/infra/auth/jwt.service";
import { PasswordService } from "@/infra/auth/password.service";

container.registerSingleton(JwtService);
container.registerSingleton(PasswordService);

// Services
import { UserService } from "@/modules/users/user.service";
import { ProvinceService } from "@/modules/provinces/province.service";
import { MunicipalityService } from "@/modules/municipalities/municipality.service";
import { AuthService } from "@/modules/auth/auth.service";

container.registerSingleton(UserService);
container.registerSingleton(ProvinceService);
container.registerSingleton(MunicipalityService);
container.registerSingleton(AuthService);

export { container };

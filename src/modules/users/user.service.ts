import { injectable, inject } from "tsyringe";
import { IUserRepository } from "./user.repository";
import { IProvinceRepository } from "../provinces/province.repository";
import { IMunicipalityRepository } from "../municipalities/municipality.repository";
import { User } from "./user.entity";
import { CreateUserDto, ResponseUserDto, UpdateUserDto } from "./user.dto";
import { PaginatedResult, UserFilter } from "./user.type";

@injectable()
export class UserService {
    constructor(
        @inject(IUserRepository) private readonly userRepo: IUserRepository,
        @inject(IProvinceRepository) private readonly provRepo: IProvinceRepository,
        @inject(IMunicipalityRepository) private readonly munRepo: IMunicipalityRepository
    ) {}

    async list(filter?: UserFilter): Promise<PaginatedResult<ResponseUserDto>> {
        return this.userRepo.findAll(filter);
    }

    async getById(id: string): Promise<User | null> {
        return this.userRepo.findById(id);
    }

    async getByEmail(email: string): Promise<User | null> {
        return this.userRepo.findByEmail(email);
    }

    async register(dto: CreateUserDto): Promise<ResponseUserDto> {
        const existing = await this.userRepo.findByEmail(dto.email);
        if (existing) throw new Error("Email já registado");

        const province = await this.provRepo.findById(dto.provinceId);
        if (!province) throw new Error("Província não encontrada");

        const municipality = await this.munRepo.findById(dto.municipalityId);
        if (!municipality) throw new Error("Município não encontrado");

        if (municipality.provinceId !== dto.provinceId) {
            throw new Error("Município não pertence à província selecionada");
        }

        return this.userRepo.create({ ...dto, role: "user" });
    }

    async update(id: string, dto: UpdateUserDto): Promise<ResponseUserDto | null> {
        if (dto.provinceId || dto.municipalityId) {
            const current = await this.userRepo.findById(id);
            if (!current) throw new Error("Utilizador não encontrado");

            const newProvinceId = dto.provinceId ?? current.provinceId;
            const newMunicipalityId = dto.municipalityId ?? current.municipalityId;

            const municipality = await this.munRepo.findById(newMunicipalityId);
            if (!municipality) throw new Error("Município não encontrado");
            if (municipality.provinceId !== newProvinceId) {
                throw new Error("Município não pertence à província selecionada");
            }
        }

        return this.userRepo.update(id, dto);
    }

    async remove(id: string): Promise<void> {
        const user = await this.userRepo.findById(id);
        if (!user) throw new Error("Utilizador não encontrado");
        await this.userRepo.softDelete(id);
    }
}
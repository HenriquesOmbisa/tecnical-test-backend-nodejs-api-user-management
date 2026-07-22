import { injectable, inject } from "tsyringe";
import { IMunicipalityRepository } from "./municipality.repository";
import { IProvinceRepository } from "../provinces/province.repository";
import { Municipality } from "./municipality.entity";
import { CreateMunicipalityDto, UpdateMunicipalityDto } from "./municipality.dto";

@injectable()
export class MunicipalityService {
    constructor(
        @inject(IMunicipalityRepository) private readonly munRepo: IMunicipalityRepository,
        @inject(IProvinceRepository) private readonly provRepo: IProvinceRepository
    ) {}

    async list(): Promise<Municipality[]> {
        return this.munRepo.findAll();
    }

    async getById(id: string): Promise<Municipality | null> {
        return this.munRepo.findById(id);
    }

    async getByProvince(provinceId: string): Promise<Municipality[]> {
        return this.munRepo.findByProvinceId(provinceId);
    }

    async create(dto: CreateMunicipalityDto): Promise<Municipality> {
        const province = await this.provRepo.findById(dto.provinceId);
        if (!province) throw new Error("Província não encontrada");

        const existing = await this.munRepo.findByNameAndProvince(dto.name, dto.provinceId);
        if (existing) throw new Error("Município já existe nesta província");

        return this.munRepo.create(dto);
    }

    async update(id: string, dto: UpdateMunicipalityDto): Promise<Municipality | null> {
        if (dto.provinceId) {
            const province = await this.provRepo.findById(dto.provinceId);
            if (!province) throw new Error("Província não encontrada");
        }
        return this.munRepo.update(id, dto);
    }

    async remove(id: string): Promise<void> {
        const municipality = await this.munRepo.findById(id);
        if (!municipality) throw new Error("Município não encontrado");
        await this.munRepo.delete(id);
    }
}

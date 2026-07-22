import { injectable, inject } from "tsyringe";
import { IProvinceRepository } from "./province.repository";
import { IMunicipalityRepository } from "../municipalities/municipality.repository";
import { Province } from "./province.entity";
import { CreateProvinceDto, UpdateProvinceDto } from "./province.dto";

@injectable()
export class ProvinceService {
    constructor(
        @inject(IProvinceRepository) private readonly provRepo: IProvinceRepository,
        @inject(IMunicipalityRepository) private readonly munRepo: IMunicipalityRepository
    ) {}

    async list(): Promise<Province[]> {
        return this.provRepo.findAll();
    }

    async getById(id: string): Promise<Province | null> {
        return this.provRepo.findById(id);
    }

    async create(dto: CreateProvinceDto): Promise<Province> {
        const existing = await this.provRepo.findByName(dto.name);
        if (existing) throw new Error("Província já existe");
        return this.provRepo.create(dto);
    }

    async update(id: string, dto: UpdateProvinceDto): Promise<Province | null> {
        return this.provRepo.update(id, dto);
    }

    async remove(id: string): Promise<void> {
        const province = await this.provRepo.findById(id);
        if (!province) throw new Error("Província não encontrada");

        const municipalities = await this.munRepo.findByProvinceId(id);
        if (municipalities.length > 0) {
            throw new Error("Não é possível eliminar província com municípios vinculados");
        }

        await this.provRepo.delete(id);
    }
}

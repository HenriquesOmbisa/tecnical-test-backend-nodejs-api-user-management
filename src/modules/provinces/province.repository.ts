import { CreateProvinceDto, UpdateProvinceDto } from "./province.dto";
import { Province } from "./province.entity";

export const IProvinceRepository = Symbol("IProvinceRepository")

export interface IProvinceRepository {
    findAll(): Promise<Province[]>;
    findById(id: string): Promise<Province | null>;
    findByName(name: string): Promise<Province | null>;
    create(province: CreateProvinceDto): Promise<Province>;
    update(id: string, province: UpdateProvinceDto): Promise<Province | null>;
    delete(id: string): Promise<boolean>;
}
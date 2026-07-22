import { CreateMunicipalityDto, UpdateMunicipalityDto } from "./municipality.dto";
import { Municipality } from "./municipality.entity";

export const IMunicipalityRepository = Symbol("IMunicipalityRepository")

export interface IMunicipalityRepository {
    findAll(): Promise<Municipality[]>;
    findById(id: string): Promise<Municipality | null>;
    findByProvinceId(id: string): Promise<Municipality[]>;
    findByNameAndProvince(name: string, provinceId: string): Promise<Municipality | null>
    create(Municipality: CreateMunicipalityDto): Promise<Municipality>;
    update(id: string, Municipality: UpdateMunicipalityDto): Promise<Municipality | null>;
    delete(id: string): Promise<boolean>;
}
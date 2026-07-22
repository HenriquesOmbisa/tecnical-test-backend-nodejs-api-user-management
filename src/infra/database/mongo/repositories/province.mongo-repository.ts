import { CreateProvinceDto, UpdateProvinceDto } from "@/modules/provinces/province.dto";
import { Province } from "@/modules/provinces/province.entity";
import { IProvinceRepository } from "@/modules/provinces/province.repository";
import { injectable } from "tsyringe";
import ProvinceModel from "../models/province.mongo-model";

@injectable()
export class ProvinceMongoRepository implements IProvinceRepository {
    async findById(id: string): Promise<Province | null> {
        const doc = await ProvinceModel.findById(id).lean();
        return doc ? this.toDomain(doc) : null;
    }

    async findByName(name: string): Promise<Province | null> {
        const doc = await ProvinceModel.findOne({ name }).lean();
        return doc ? this.toDomain(doc) : null;
    }

    async create(province: CreateProvinceDto): Promise<Province> {
        const doc = await ProvinceModel.create(province);
        return this.toDomain(doc.toObject());
    }

    async update(id: string, province: UpdateProvinceDto): Promise<Province | null> {
        const doc = await ProvinceModel.findByIdAndUpdate(id, province, { new: true }).lean();
        return doc ? this.toDomain(doc) : null;
    }

    async delete(id: string): Promise<boolean> {
        const deletedDocument = await ProvinceModel.findByIdAndDelete(id);
        return deletedDocument !== null;
    }
    
    async findAll(): Promise<Province[]> {
        const docs = await ProvinceModel.find().lean()
        return docs.map(this.toDomain);
    }

    private toDomain(doc: any): Province {
        return {
            id: doc._id.toString(),
            name: doc.name,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt,
        };
    }
}
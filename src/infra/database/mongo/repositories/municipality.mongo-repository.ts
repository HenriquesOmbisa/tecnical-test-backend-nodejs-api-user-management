import { CreateMunicipalityDto, UpdateMunicipalityDto } from "@/modules/municipalities/municipality.dto";
import { Municipality } from "@/modules/municipalities/municipality.entity";
import { IMunicipalityRepository } from "@/modules/municipalities/municipality.repository";
import { injectable } from "tsyringe";
import MunicipalityModel from "../models/municipality.mongo-model";


@injectable()
export class MunicipalityMongoRepository implements IMunicipalityRepository {

  async findAll(): Promise<Municipality[]> {
    const docs = await MunicipalityModel.find().lean()
    return docs.map(this.toDomain)
  }

  async findById(id: string): Promise<Municipality | null> {
    const doc = await MunicipalityModel.findById(id).lean()
    return doc ? this.toDomain(doc) : null
  }

  async findByProvinceId(provinceId: string): Promise<Municipality[]> {
    const docs = await MunicipalityModel.find({ provinceId }).lean()
    return docs.map(this.toDomain)
  }

  async findByNameAndProvince(name: string, provinceId: string): Promise<Municipality | null> {
    const doc = await MunicipalityModel.findOne({ name, provinceId }).lean()
    return doc ? this.toDomain(doc) : null
  }

  async create(Municipality: CreateMunicipalityDto): Promise<Municipality> {
    const doc = await MunicipalityModel.create(Municipality)
    return this.toDomain(doc.toObject())
  }

  async update(id: string, Municipality: UpdateMunicipalityDto): Promise<Municipality | null> {
    const doc = await MunicipalityModel.findByIdAndUpdate(id, Municipality, { new: true }).lean()
    return doc ? this.toDomain(doc) : null
  }

  async delete(id: string): Promise<boolean> {
     const  deletedDocument = await MunicipalityModel.findByIdAndDelete(id);
     return deletedDocument !== null;
  }

  private toDomain(doc: Record<string, any>): Municipality {
    return {
      id: doc._id.toString(),
      name: doc.name,
      provinceId: doc.provinceId?.toString() ?? doc.provinceId,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    }
  }
}
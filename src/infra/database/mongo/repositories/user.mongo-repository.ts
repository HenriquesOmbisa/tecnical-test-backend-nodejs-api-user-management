import { injectable } from "tsyringe";
import { IUserRepository } from "@/modules/users/user.repository";
import { CreateUserDto, ResponseUserDto, UpdateUserDto } from "@/modules/users/user.dto";
import { User } from "@/modules/users/user.entity";
import { UserFilter, PaginatedResult } from "@/modules/users/user.type";
import UserModel from "../models/user.mongo-model";

@injectable()
export class UserMongoRepository implements IUserRepository {
    async findById(id: string): Promise<User | null> {
        const doc = await UserModel.findById(id).lean();
        return doc ? this.toDomain(doc) : null;
    }
    async findByEmail(email: string): Promise<User | null> {
        const doc = await UserModel.findOne({ email, deletedAt: null }).lean();
        return doc ? this.toDomain(doc) : null;
    }
    async create(user: CreateUserDto): Promise<ResponseUserDto> {
        const doc = await UserModel.create(user);
        return this.toResponseDto(doc.toObject());
    }
    async update(id: string, user: UpdateUserDto): Promise<ResponseUserDto | null> {
        const doc = await UserModel.findByIdAndUpdate(id, user, { new: true }).lean();
        return doc ? this.toResponseDto(doc) : null;
    }
    async softDelete(id: string): Promise<boolean> {
        const result = await UserModel.findByIdAndUpdate(id, { deletedAt: new Date() });
        return !!result;
    }
    async findAll(filter?: UserFilter): Promise<PaginatedResult<ResponseUserDto>> {
        const where: any = { deletedAt: null };
        if (filter?.name) {
            where.name = { $regex: filter.name, $options: "i" };
        }
        if (filter?.email) {
            where.email = { $regex: filter.email, $options: "i" };
        }
        if (filter?.provinceId) {
            where.provinceId = filter.provinceId;
        }
        if (filter?.municipalityId) {
            where.municipalityId = filter.municipalityId;
        }

        const page = filter?.page || 1;
        const limit = 10;
        const skip = (page - 1) * limit;

        const [docs, total] = await Promise.all([
            UserModel.find(where).skip(skip).limit(limit).lean(),
            UserModel.countDocuments(where),
        ]);

        const users = docs.map(doc => this.toResponseDto(doc));
        return { results: users, total, page, limit, totalPages: Math.ceil(total / limit) };
    }

    private toDomain(doc: any): User {
        return {
            id: doc._id.toString(),
            name: doc.name,
            email: doc.email,
            password: doc.password,
            role: doc.role,
            provinceId: doc.provinceId,
            municipalityId: doc.municipalityId,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt,
            deletedAt: doc.deletedAt,
        };
    }

    private toResponseDto(doc: any): ResponseUserDto {
        const { password, deletedAt, updatedAt, ...user } = this.toDomain(doc)
        return user
    }
}
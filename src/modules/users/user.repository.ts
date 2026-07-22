import { CreateUserDto, ResponseUserDto, UpdateUserDto } from "./user.dto";
import { User } from "./user.entity";
import { PaginatedResult, UserFilter } from "./user.type";

export const IUserRepository = Symbol("IUserRepository")

export interface IUserRepository {
    findAll(filter?: UserFilter): Promise<PaginatedResult<ResponseUserDto>>;
    findById(id: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    create(user: CreateUserDto): Promise<ResponseUserDto>;
    update(id: string, user: UpdateUserDto): Promise<ResponseUserDto | null>;
    softDelete(id: string): Promise<boolean>;
}
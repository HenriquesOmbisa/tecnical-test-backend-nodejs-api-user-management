import { User } from "./user.entity";

export type CreateUserDto = Omit<User, "id" | "createdAt" | "updatedAt" | "deletedAt">;

export type ResponseUserDto = Omit<User, "password" | "deletedAt" | "updatedAt">;

export type UpdateUserDto = Partial<CreateUserDto>;

export type DeleteUserDto = { id: string };
import { Role } from "./user.type";

export type User = {
    id: string;
    name: string;
    email: string;
    password: string;
    role: Role;
    provinceId: string;
    municipalityId: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}
import { Province } from "./province.entity";

export type CreateProvinceDto = Omit<Province, "id" | "createdAt" | "updatedAt">;
export type ResponseProvinceDto = CreateProvinceDto & {id: string, createdAt: Date, updatedAt: Date };
export type UpdateProvinceDto = Partial<CreateProvinceDto>;
export type DeleteProvinceDto = { id: string };
import { Municipality } from "./municipality.entity";

export type CreateMunicipalityDto = Omit<Municipality, "id" | "createdAt" | "updatedAt">;
export type ResponseMunicipalityDto = CreateMunicipalityDto & {id: string, createdAt: Date, updatedAt: Date };
export type UpdateMunicipalityDto = Partial<CreateMunicipalityDto>;
export type DeleteMunicipalityDto = { id: string };
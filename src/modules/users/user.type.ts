export type Role = "admin" | "user";

export type UserFilter = {
    name?: string;
    email?: string;
    provinceId?: string;
    municipalityId?: string;
    page?: number;
    limit?: number;
}

export type PaginatedResult<T> = {
    results: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
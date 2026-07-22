export const IDatabase = Symbol("IDatabase")
export interface IDatabase {
    connect(): Promise<void>;
    disconnect(): Promise<void>
}
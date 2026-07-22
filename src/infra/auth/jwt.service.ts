import { injectable, inject } from "tsyringe";
import jwt from "jsonwebtoken";
import type { Config } from "@/shared/config/config";

export type JwtPayload = {
    userId: string;
    email: string;
    role: "admin" | "user";
};

@injectable()
export class JwtService {
    constructor(@inject("Config") private readonly config: Config) {}

    generateToken(payload: JwtPayload): string {
        return jwt.sign(payload, this.config.JWT_SECRET, { expiresIn: "7d" });
    }

    verifyToken(token: string): JwtPayload {
        return jwt.verify(token, this.config.JWT_SECRET) as JwtPayload;
    }
}

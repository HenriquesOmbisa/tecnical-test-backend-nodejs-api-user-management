import { Request, Response, NextFunction } from "express";
import { container } from "tsyringe";
import { JwtService } from "@/infra/auth/jwt.service";

export async function authMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    const header = req.headers.authorization;

    if (!header?.startsWith("Bearer ")) {
        res.status(401).json({ error: "Acesso negado. Token não fornecido." });
        return;
    }

    try {
        const token = header.split(" ")[1]!;
        const jwtService = container.resolve(JwtService);
        req.user = jwtService.verifyToken(token);
        next();
    } catch {
        res.status(401).json({ error: "Token inválido ou expirado." });
    }
}

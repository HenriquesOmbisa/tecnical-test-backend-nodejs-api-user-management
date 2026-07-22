import { Request, Response, NextFunction } from "express";

type Role = "admin" | "user";

export function authorize(...roles: Role[]) {
    return (req: Request, res: Response, next: NextFunction): void => {
        if (!req.user) {
            res.status(401).json({ error: "Não autorizado." });
            return;
        }

        if (!roles.includes(req.user.role)) {
            res.status(403).json({ error: "Acesso proibido." });
            return;
        }

        next();
    };
}
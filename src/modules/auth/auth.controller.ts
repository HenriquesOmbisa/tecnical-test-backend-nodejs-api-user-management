import { injectable, inject } from "tsyringe";
import { Request, Response } from "express";
import { ZodError } from "zod";
import { AuthService } from "./auth.service";
import { loginSchema, registerSchema } from "./auth.schema";

@injectable()
export class AuthController {
    constructor(
        @inject(AuthService) private readonly authService: AuthService
    ) {}

    async login(req: Request, res: Response): Promise<void> {
        try {
            const { email, password } = loginSchema.parse(req.body);
            const result = await this.authService.login(email, password);
            res.json(result);
        } catch (error) {
            if (error instanceof ZodError) {
                res.status(400).json({ error: "Erro de validação", details: error.issues });
                return;
            }
            if (error instanceof Error) {
                res.status(401).json({ error: error.message });
                return;
            }
            res.status(500).json({ error: "Erro interno do servidor" });
        }
    }

    async register(req: Request, res: Response): Promise<void> {
        try {
            const data = registerSchema.parse(req.body);
            const result = await this.authService.register(data);
            res.status(201).json(result);
        } catch (error) {
            if (error instanceof ZodError) {
                res.status(400).json({ error: "Erro de validação", details: error.issues });
                return;
            }
            if (error instanceof Error) {
                res.status(409).json({ error: error.message });
                return;
            }
            res.status(500).json({ error: "Erro interno do servidor" });
        }
    }
}

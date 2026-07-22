import { injectable, inject } from "tsyringe";
import { Request, Response } from "express";
import { ZodError } from "zod";
import { UserService } from "./user.service";
import { PasswordService } from "@/infra/auth/password.service";
import { createUserSchema, updateUserSchema, userFilterSchema } from "./user.schema";

@injectable()
export class UserController {
    constructor(
        @inject(UserService) private readonly userService: UserService,
        @inject(PasswordService) private readonly passwordService: PasswordService
    ) {}

    async list(req: Request, res: Response): Promise<void> {
        try {
            const filter = userFilterSchema.parse(req.query);
            const result = await this.userService.list(filter);
            res.json(result);
        } catch (error) {
            if (error instanceof ZodError) {
                res.status(400).json({ error: "Filtros inválidos", details: error.issues });
                return;
            }
            res.status(500).json({ error: "Erro interno do servidor" });
        }
    }

    async getById(req: Request, res: Response): Promise<void> {
        try {
            const id = String(req.params.id);
            const user = await this.userService.getById(id);
            if (!user) {
                res.status(404).json({ error: "Utilizador não encontrado" });
                return;
            }
            res.json(user);
        } catch {
            res.status(500).json({ error: "Erro interno do servidor" });
        }
    }

    async create(req: Request, res: Response): Promise<void> {
        try {
            const data = createUserSchema.parse(req.body);
            const hashedPassword = await this.passwordService.hash(data.password);
            const user = await this.userService.register({ ...data, password: hashedPassword, role: "user" });
            res.status(201).json(user);
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

    async update(req: Request, res: Response): Promise<void> {
        try {
            const id = String(req.params.id);
            const data = updateUserSchema.parse(req.body);
            if (data.password) {
                data.password = await this.passwordService.hash(data.password);
            }
            const user = await this.userService.update(id, data);
            if (!user) {
                res.status(404).json({ error: "Utilizador não encontrado" });
                return;
            }
            res.json(user);
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

    async remove(req: Request, res: Response): Promise<void> {
        try {
            const id = String(req.params.id);
            await this.userService.remove(id);
            res.status(204).send();
        } catch (error) {
            if (error instanceof Error) {
                res.status(404).json({ error: error.message });
                return;
            }
            res.status(500).json({ error: "Erro interno do servidor" });
        }
    }
}

import { injectable, inject } from "tsyringe";
import { Request, Response } from "express";
import { ZodError } from "zod";
import { ProvinceService } from "./province.service";
import { createProvinceSchema, updateProvinceSchema } from "./province.schema";

@injectable()
export class ProvinceController {
    constructor(
        @inject(ProvinceService) private readonly provinceService: ProvinceService
    ) {}

    async list(req: Request, res: Response): Promise<void> {
        try {
            const provinces = await this.provinceService.list();
            res.json(provinces);
        } catch {
            res.status(500).json({ error: "Erro interno do servidor" });
        }
    }

    async getById(req: Request, res: Response): Promise<void> {
        try {
            const id = String(req.params.id);
            const province = await this.provinceService.getById(id);
            if (!province) {
                res.status(404).json({ error: "Província não encontrada" });
                return;
            }
            res.json(province);
        } catch {
            res.status(500).json({ error: "Erro interno do servidor" });
        }
    }

    async create(req: Request, res: Response): Promise<void> {
        try {
            const data = createProvinceSchema.parse(req.body);
            const province = await this.provinceService.create(data);
            res.status(201).json(province);
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
            const data = updateProvinceSchema.parse(req.body);
            const province = await this.provinceService.update(id, data);
            if (!province) {
                res.status(404).json({ error: "Província não encontrada" });
                return;
            }
            res.json(province);
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
            await this.provinceService.remove(id);
            res.status(204).send();
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
                return;
            }
            res.status(500).json({ error: "Erro interno do servidor" });
        }
    }
}

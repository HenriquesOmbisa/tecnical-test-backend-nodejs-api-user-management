import { injectable, inject } from "tsyringe";
import { Request, Response } from "express";
import { ZodError } from "zod";
import { MunicipalityService } from "./municipality.service";
import { createMunicipalitySchema, updateMunicipalitySchema } from "./municipality.schema";

@injectable()
export class MunicipalityController {
    constructor(
        @inject(MunicipalityService) private readonly municipalityService: MunicipalityService
    ) {}

    async list(req: Request, res: Response): Promise<void> {
        try {
            const municipalities = await this.municipalityService.list();
            res.json(municipalities);
        } catch {
            res.status(500).json({ error: "Erro interno do servidor" });
        }
    }

    async getById(req: Request, res: Response): Promise<void> {
        try {
            const id = String(req.params.id);
            const municipality = await this.municipalityService.getById(id);
            if (!municipality) {
                res.status(404).json({ error: "Município não encontrado" });
                return;
            }
            res.json(municipality);
        } catch {
            res.status(500).json({ error: "Erro interno do servidor" });
        }
    }

    async getByProvince(req: Request, res: Response): Promise<void> {
        try {
            const provinceId = String(req.params.provinceId);
            const municipalities = await this.municipalityService.getByProvince(provinceId);
            res.json(municipalities);
        } catch {
            res.status(500).json({ error: "Erro interno do servidor" });
        }
    }

    async create(req: Request, res: Response): Promise<void> {
        try {
            const data = createMunicipalitySchema.parse(req.body);
            const municipality = await this.municipalityService.create(data);
            res.status(201).json(municipality);
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
            const data = updateMunicipalitySchema.parse(req.body);
            const municipality = await this.municipalityService.update(id, data);
            if (!municipality) {
                res.status(404).json({ error: "Município não encontrado" });
                return;
            }
            res.json(municipality);
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
            await this.municipalityService.remove(id);
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

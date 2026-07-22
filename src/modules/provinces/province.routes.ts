import { Router } from "express";
import { container } from "tsyringe";
import { ProvinceController } from "./province.controller";
import { authMiddleware } from "@/infra/middlewares/auth.middleware";
import { authorize } from "@/infra/middlewares/authorize";

const router = Router();
const controller = container.resolve(ProvinceController);

/**
 * @swagger
 * /provincias:
 *   get:
 *     tags: [Provincias]
 *     summary: Listar provincias
 *     security: []
 *     responses:
 *       200:
 *         description: Lista de provincias
 */
router.get("/provincias", controller.list.bind(controller));

/**
 * @swagger
 * /provincias/{id}:
 *   get:
 *     tags: [Provincias]
 *     summary: Obter provincia por ID
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Dados da provincia
 *       404:
 *         description: Provincia nao encontrada
 */
router.get("/provincias/:id", controller.getById.bind(controller));

/**
 * @swagger
 * /provincias:
 *   post:
 *     tags: [Provincias]
 *     summary: Criar provincia
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *             required: [name]
 *     responses:
 *       201:
 *         description: Provincia criada
 *       400:
 *         description: Erro de validacao
 *       409:
 *         description: Provincia ja existe
 */
router.post("/provincias", authMiddleware, authorize("admin"), controller.create.bind(controller));

/**
 * @swagger
 * /provincias/{id}:
 *   put:
 *     tags: [Provincias]
 *     summary: Atualizar provincia
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *     responses:
 *       200:
 *         description: Provincia atualizada
 *       404:
 *         description: Provincia nao encontrada
 */
router.put("/provincias/:id", authMiddleware, authorize("admin"), controller.update.bind(controller));

/**
 * @swagger
 * /provincias/{id}:
 *   delete:
 *     tags: [Provincias]
 *     summary: Remover provincia
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       204:
 *         description: Provincia removida
 *       400:
 *         description: Provincia possui municipios vinculados
 */
router.delete("/provincias/:id", authMiddleware, authorize("admin"), controller.remove.bind(controller));

export default router;

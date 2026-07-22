import { Router } from "express";
import { container } from "tsyringe";
import { MunicipalityController } from "./municipality.controller";
import { authMiddleware } from "@/infra/middlewares/auth.middleware";
import { authorize } from "@/infra/middlewares/authorize";

const router = Router();
const controller = container.resolve(MunicipalityController);

/**
 * @swagger
 * /municipios:
 *   get:
 *     tags: [Municipios]
 *     summary: Listar municipios
 *     security: []
 *     responses:
 *       200:
 *         description: Lista de municipios
 */
router.get("/municipios", controller.list.bind(controller));

/**
 * @swagger
 * /municipios/{id}:
 *   get:
 *     tags: [Municipios]
 *     summary: Obter municipio por ID
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Dados do municipio
 *       404:
 *         description: Municipio nao encontrado
 */
router.get("/municipios/:id", controller.getById.bind(controller));

/**
 * @swagger
 * /provincias/{provinceId}/municipios:
 *   get:
 *     tags: [Municipios]
 *     summary: Listar municipios de uma provincia
 *     security: []
 *     parameters:
 *       - in: path
 *         name: provinceId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Lista de municipios da provincia
 */
router.get("/provincias/:provinceId/municipios", controller.getByProvince.bind(controller));

/**
 * @swagger
 * /municipios:
 *   post:
 *     tags: [Municipios]
 *     summary: Criar municipio
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               provinceId: { type: string }
 *             required: [name, provinceId]
 *     responses:
 *       201:
 *         description: Municipio criado
 *       400:
 *         description: Erro de validacao
 *       409:
 *         description: Municipio ja existe nesta provincia
 */
router.post("/municipios", authMiddleware, authorize("admin"), controller.create.bind(controller));

/**
 * @swagger
 * /municipios/{id}:
 *   put:
 *     tags: [Municipios]
 *     summary: Atualizar municipio
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
 *               provinceId: { type: string }
 *     responses:
 *       200:
 *         description: Municipio atualizado
 *       404:
 *         description: Municipio nao encontrado
 */
router.put("/municipios/:id", authMiddleware, authorize("admin"), controller.update.bind(controller));

/**
 * @swagger
 * /municipios/{id}:
 *   delete:
 *     tags: [Municipios]
 *     summary: Remover municipio
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       204:
 *         description: Municipio removido
 *       400:
 *         description: Municipio nao encontrado
 */
router.delete("/municipios/:id", authMiddleware, authorize("admin"), controller.remove.bind(controller));

export default router;

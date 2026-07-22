import { Router } from "express";
import { container } from "tsyringe";
import { UserController } from "./user.controller";
import { authMiddleware } from "@/infra/middlewares/auth.middleware";
import { authorize } from "@/infra/middlewares/authorize";

const router = Router();
const controller = container.resolve(UserController);

/**
 * @swagger
 * /usuarios:
 *   get:
 *     tags: [Utilizadores]
 *     summary: Listar utilizadores
 *     parameters:
 *       - in: query
 *         name: name
 *         schema: { type: string }
 *       - in: query
 *         name: email
 *         schema: { type: string }
 *       - in: query
 *         name: provinceId
 *         schema: { type: string }
 *       - in: query
 *         name: municipalityId
 *         schema: { type: string }
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Lista de utilizadores
 */
router.get("/usuarios", authMiddleware, controller.list.bind(controller));

/**
 * @swagger
 * /usuarios/{id}:
 *   get:
 *     tags: [Utilizadores]
 *     summary: Obter utilizador por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Dados do utilizador
 *       404:
 *         description: Utilizador nao encontrado
 */
router.get("/usuarios/:id", authMiddleware, controller.getById.bind(controller));

/**
 * @swagger
 * /usuarios:
 *   post:
 *     tags: [Utilizadores]
 *     summary: Criar utilizador
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               email: { type: string }
 *               password: { type: string }
 *               provinceId: { type: string }
 *               municipalityId: { type: string }
 *             required: [name, email, password, provinceId, municipalityId]
 *     responses:
 *       201:
 *         description: Utilizador criado
 *       400:
 *         description: Erro de validacao
 */
router.post("/usuarios", authMiddleware, authorize("admin"), controller.create.bind(controller));

/**
 * @swagger
 * /usuarios/{id}:
 *   put:
 *     tags: [Utilizadores]
 *     summary: Atualizar utilizador
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
 *               email: { type: string }
 *               password: { type: string }
 *               provinceId: { type: string }
 *               municipalityId: { type: string }
 *     responses:
 *       200:
 *         description: Utilizador atualizado
 *       404:
 *         description: Utilizador nao encontrado
 */
router.put("/usuarios/:id", authMiddleware, authorize("admin"), controller.update.bind(controller));

/**
 * @swagger
 * /usuarios/{id}:
 *   delete:
 *     tags: [Utilizadores]
 *     summary: Remover utilizador (soft delete)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       204:
 *         description: Utilizador removido
 *       404:
 *         description: Utilizador nao encontrado
 */
router.delete("/usuarios/:id", authMiddleware, authorize("admin"), controller.remove.bind(controller));

export default router;

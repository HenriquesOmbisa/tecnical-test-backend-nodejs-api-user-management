import { Router } from "express";
import { container } from "tsyringe";
import { AuthController } from "./auth.controller";

const router = Router();
const controller = container.resolve(AuthController);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags: [Autenticacao]
 *     summary: Autenticar utilizador
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required: [email, password]
 *     responses:
 *       200:
 *         description: Token de acesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *       400:
 *         description: Erro de validacao
 *       401:
 *         description: Credenciais invalidas
 */
router.post("/auth/login", controller.login.bind(controller));

/**
 * @swagger
 * /auth/register:
 *   post:
 *     tags: [Autenticacao]
 *     summary: Registar novo utilizador
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               provinceId:
 *                 type: string
 *               municipalityId:
 *                 type: string
 *             required: [name, email, password, provinceId, municipalityId]
 *     responses:
 *       201:
 *         description: Utilizador registado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *       400:
 *         description: Erro de validacao
 *       409:
 *         description: Conflito (email ja registado)
 */
router.post("/auth/register", controller.register.bind(controller));

export default router;

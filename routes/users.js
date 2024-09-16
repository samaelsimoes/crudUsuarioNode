const express = require('express');
const router = express.Router();
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Operações sobre usuários.
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Listar todos os usuários
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuários.
 *       401:
 *         description: Token não fornecido ou inválido.
 *       500:
 *         description: Erro ao listar usuários.
 */
router.get('/users', authenticateJWT, async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao listar usuários.' });
    }
});

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Atualizar um usuário
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do usuário a ser atualizado
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: novo_nome
 *               email:
 *                 type: string
 *                 example: novo_email@teste.com
 *               password:
 *                 type: string
 *                 example: nova_senha
 *     responses:
 *       200:
 *         description: Usuário atualizado com sucesso.
 *       400:
 *         description: Erro de validação dos dados.
 *       401:
 *         description: Token não fornecido ou inválido.
 *       404:
 *         description: Usuário não encontrado.
 *       500:
 *         description: Erro ao atualizar usuário.
 */
router.put('/users/:id', authenticateJWT, [
    body('username').notEmpty().withMessage('Username é obrigatório'),
    body('email').isEmail().withMessage('Email inválido'),
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { username, email, password } = req.body;
        const { id } = req.params;

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }

        if (username) user.username = username;
        if (email) user.email = email;
        if (password) user.password = await bcrypt.hash(password, 10);

        await user.save();
        res.json({ message: 'Usuário atualizado com sucesso.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao atualizar o usuário.' });
    }
});

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Excluir um usuário
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do usuário a ser excluído
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuário excluído com sucesso.
 *       401:
 *         description: Token não fornecido ou inválido.
 *       404:
 *         description: Usuário não encontrado.
 *       500:
 *         description: Erro ao excluir usuário.
 */
router.delete('/users/:id', authenticateJWT, async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }
        res.json({ message: 'Usuário excluído com sucesso.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao excluir o usuário.' });
    }
});


module.exports = router;
const express = require('express');
const router = express.Router();
const User = require('../models/user');
const authMiddleware = require('../middleware/auth');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/**
 * @openapi
 * /api/register:
 *   post:
 *     summary: Registra um novo usuário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: teste
 *               email:
 *                 type: string
 *                 example: teste@teste.com
 *               password:
 *                 type: string
 *                 example: teste
 *     responses:
 *       201:
 *         description: Usuário registrado com sucesso
 *       400:
 *         description: Erro de validação ou usuário já existe
 *       500:
 *         description: Erro interno do servidor
 */
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Usuário já existe.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            username,
            email,
            password: hashedPassword,
        });

        await user.save();

        res.status(201).json({ message: 'Usuário registrado com sucesso.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao registrar o usuário.' });
    }
});

/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: Autentica um usuário e retorna um token JWT
 *     tags:
 *       - Autenticação
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
 *     responses:
 *       200:
 *         description: Token JWT gerado com sucesso
 *       400:
 *         description: Credenciais inválidas
 *       500:
 *         description: Erro ao autenticar usuário
 */
router.post('/login', async (req, res) => {
    console.log('Iniciando o login...')
    try {
        const { email, password } = req.body;
        console.log('Recebido email:', email);
        console.log('Recebida senha:', password);

        // Verifique se os campos são preenchidos
        if (!email || !password) {
            console.log('Campos email ou senha ausentes');
            return res.status(400).json({ message: 'Email e senha são obrigatórios.' });
        }

        // Procure o usuário pelo email
        const user = await User.findOne({ email });
        console.log('Usuário encontrado:', user);

        if (!user) {
            console.log('Usuário não encontrado');
            return res.status(400).json({ message: 'Credenciais inválidas.' });
        }

        // Compare a senha fornecida com a senha armazenada
        const isMatch = await bcrypt.compare(password, user.password);
        console.log('Senha corresponde:', isMatch);

        if (!isMatch) {
            console.log('Senha inválida');
            return res.status(400).json({ message: 'Credenciais inválidas.' });
        }

        // Gere o token JWT
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao fazer login.' });
    }
});

module.exports = router;

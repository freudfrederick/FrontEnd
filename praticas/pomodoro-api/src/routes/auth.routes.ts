import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { prisma } from '../lib/prisma.js';

export const authRouter = Router();

const JWT_SECRET = process.env.JWT_SECRET ?? 'dev-secret';
const JWT_EXPIRES_IN = '7d';

authRouter.post('/register', async (req, res) => {
  const { email, name, password } = req.body as { email: string; name: string; password: string };
  if (!email || !name || !password) { res.status(400).json({ message: 'email, name e password são obrigatórios' }); return; }
  if (password.length < 6) { res.status(400).json({ message: 'Senha deve ter ao menos 6 caracteres' }); return; }
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) { res.status(409).json({ message: 'E-mail já cadastrado' }); return; }
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({ data: { email, name, passwordHash } });
  await prisma.settings.create({ data: { userId: user.id, workTime: 25, shortBreakTime: 5, longBreakTime: 15 } });
  const token = jwt.sign({ sub: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  res.status(201).json({ token, user: { id: user.id, email: user.email, name: user.name } });
});

authRouter.post('/login', async (req, res) => {
  const { email, password } = req.body as { email: string; password: string };
  if (!email || !password) { res.status(400).json({ message: 'email e password são obrigatórios' }); return; }
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) { res.status(401).json({ message: 'Credenciais inválidas' }); return; }
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) { res.status(401).json({ message: 'Credenciais inválidas' }); return; }
  const token = jwt.sign({ sub: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
});

authRouter.post('/forgot-password', async (req, res) => {
  const { email } = req.body as { email: string };
  if (!email) { res.status(400).json({ message: 'email é obrigatório' }); return; }
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) { res.json({ message: 'Se o e-mail existir, você receberá o token de recuperação.' }); return; }
  const resetToken = crypto.randomBytes(32).toString('hex');
  const resetTokenExp = new Date(Date.now() + 1000 * 60 * 30);
  await prisma.user.update({ where: { email }, data: { resetToken, resetTokenExp } });
  res.json({ message: 'Token de recuperação gerado. Em produção seria enviado por e-mail.', resetToken });
});

authRouter.post('/reset-password', async (req, res) => {
  const { token, newPassword } = req.body as { token: string; newPassword: string };
  if (!token || !newPassword) { res.status(400).json({ message: 'token e newPassword são obrigatórios' }); return; }
  if (newPassword.length < 6) { res.status(400).json({ message: 'Senha deve ter ao menos 6 caracteres' }); return; }
  const user = await prisma.user.findFirst({ where: { resetToken: token, resetTokenExp: { gt: new Date() } } });
  if (!user) { res.status(400).json({ message: 'Token inválido ou expirado' }); return; }
  const passwordHash = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({ where: { id: user.id }, data: { passwordHash, resetToken: null, resetTokenExp: null } });
  res.json({ message: 'Senha redefinida com sucesso' });
});

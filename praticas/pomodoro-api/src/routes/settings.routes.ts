import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { authMiddleware, type AuthRequest } from '../middlewares/auth.middleware.js';

export const settingsRouter = Router();
settingsRouter.use(authMiddleware);

settingsRouter.get('/', async (req: AuthRequest, res) => {
  let settings = await prisma.settings.findUnique({ where: { userId: req.userId! } });
  if (!settings) {
    settings = await prisma.settings.create({ data: { userId: req.userId!, workTime: 25, shortBreakTime: 5, longBreakTime: 15 } });
  }
  res.json(settings);
});

settingsRouter.put('/', async (req: AuthRequest, res) => {
  const { workTime, shortBreakTime, longBreakTime } = req.body as { workTime: number; shortBreakTime: number; longBreakTime: number };
  if (!Number.isInteger(workTime) || !Number.isInteger(shortBreakTime) || !Number.isInteger(longBreakTime)) {
    res.status(400).json({ message: 'Valores inválidos' }); return;
  }
  const settings = await prisma.settings.upsert({
    where: { userId: req.userId! },
    update: { workTime, shortBreakTime, longBreakTime },
    create: { userId: req.userId!, workTime, shortBreakTime, longBreakTime },
  });
  res.json(settings);
});

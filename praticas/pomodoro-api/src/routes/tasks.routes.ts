import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { authMiddleware, type AuthRequest } from '../middlewares/auth.middleware.js';

export const tasksRouter = Router();
tasksRouter.use(authMiddleware);

tasksRouter.get('/', async (req: AuthRequest, res) => {
  const tasks = await prisma.task.findMany({ where: { userId: req.userId! }, orderBy: { startDate: 'desc' } });
  res.json(tasks);
});

tasksRouter.post('/', async (req: AuthRequest, res) => {
  const { id, name, duration, type, startDate } = req.body as { id: string; name: string; duration: number; type: string; startDate: number };
  const task = await prisma.task.create({ data: { id, name, duration, type, startDate: BigInt(startDate), userId: req.userId! } });
  res.status(201).json(task);
});

tasksRouter.patch('/:id/complete', async (req: AuthRequest, res) => {
  const { id } = req.params;
  const { completeDate } = req.body as { completeDate: number };
  const r = await prisma.task.updateMany({ where: { id, userId: req.userId! }, data: { completeDate: BigInt(completeDate) } });
  if (r.count === 0) { res.status(404).json({ message: 'Task não encontrada' }); return; }
  res.json(await prisma.task.findUnique({ where: { id } }));
});

tasksRouter.patch('/:id/interrupt', async (req: AuthRequest, res) => {
  const { id } = req.params;
  const { interruptDate } = req.body as { interruptDate: number };
  const r = await prisma.task.updateMany({ where: { id, userId: req.userId! }, data: { interruptDate: BigInt(interruptDate) } });
  if (r.count === 0) { res.status(404).json({ message: 'Task não encontrada' }); return; }
  res.json(await prisma.task.findUnique({ where: { id } }));
});

tasksRouter.delete('/', async (req: AuthRequest, res) => {
  await prisma.task.deleteMany({ where: { userId: req.userId! } });
  res.status(204).send();
});

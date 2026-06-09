import express from 'express';
import cors from 'cors';
import { authRouter } from './routes/auth.routes.js';
import { settingsRouter } from './routes/settings.routes.js';
import { tasksRouter } from './routes/tasks.routes.js';

export const app = express();

app.use(cors());
app.use(express.json());

(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

app.use('/auth', authRouter);
app.use('/settings', settingsRouter);
app.use('/tasks', tasksRouter);

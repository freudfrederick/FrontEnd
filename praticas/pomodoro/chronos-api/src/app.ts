import express from 'express';
import cors from 'cors';
import { settingsRouter } from './routes/settings.routes';
import { tasksRouter } from './routes/tasks.routes';

export const app = express();

app.use(cors());
app.use(express.json());

// Serializa BigInt como string no JSON
(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

app.use('/settings', settingsRouter);
app.use('/tasks', tasksRouter);

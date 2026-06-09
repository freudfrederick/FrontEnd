import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export type AuthRequest = Request & { userId?: number; userEmail?: string; userName?: string };

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Token não fornecido' });
    return;
  }

  const token = authHeader.slice(7);
  const secret = process.env.JWT_SECRET ?? 'dev-secret';

  try {
    const payload = jwt.verify(token, secret) as unknown as { sub: number; email: string; name: string };
    req.userId = payload.sub;
    req.userEmail = payload.email;
    req.userName = payload.name;
    next();
  } catch {
    res.status(401).json({ message: 'Token inválido ou expirado' });
  }
}

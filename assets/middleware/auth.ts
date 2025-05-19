import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

// Middleware для проверки JWT-токена
export function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Отсутствует токен авторизации' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    req.body.user = decoded; // Добавляем пользователя в req для дальнейшего использования
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Неверный или истекший токен' });
  }
}
import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Временная "база данных" (для примера)
const users = new Map<string, string>(); // login -> hashedPassword

const router = express.Router();

// Регистрация
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { login, password } = req.body;

    // Проверка существования логина (можно убрать, если не нужна валидация)
    if (users.has(login)) {
      return res.status(400).json({ error: 'Логин уже занят' });
    }

    // Хеширование пароля
    const hashedPassword = await bcrypt.hash(password, 10);

    // Сохраняем в "базу данных"
    users.set(login, hashedPassword);

    console.log(`Регистрация: ${login} | Хеш: ${hashedPassword}`);
    res.status(201).json({ success: true, message: 'Регистрация успешна' });
  } catch (error) {
    console.error('Ошибка:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Вход в систему
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { login, password } = req.body;

    // Ищем пользователя в "базе данных"
    const storedHash = users.get(login);
    if (!storedHash) {
      return res.status(401).json({ error: 'Неверный логин или пароль' });
    }

    // Сравниваем пароль с хешем
    const isPasswordValid = await bcrypt.compare(password, storedHash);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Неверный логин или пароль' });
    }

    // Генерация JWT-токена
    const token = jwt.sign(
      { login },
      process.env.JWT_SECRET!,
      { expiresIn: '1h' }
    );

    res.status(200).json({ success: true, token });
  } catch (error) {
    console.error('Ошибка:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

export default router;
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import 'dotenv/config';
import authRoutes from './routes/auth';
import { authenticateToken } from './middleware/auth';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(express.json());
app.use('/api/auth', authRoutes);

app.get('/protected', authenticateToken, (req: express.Request, res: express.Response) => {
  res.json({ message: 'Вы авторизованы!', user: req.body.user });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
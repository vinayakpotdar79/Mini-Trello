import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db';
import authRoutes from './routes/authRoutes';
import cardRoutes from './routes/cardRoutes';
import boardRoutes from './routes/boardRoutes';
import listRoutes from './routes/listRoutes';
import joinBoardRoutes from './routes/JoinBoardRotes';
import cookieParser from 'cookie-parser';
dotenv.config();

connectDB();

const app: Application = express();

const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL,
];
//cors configuration
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.get('/', (req: Request, res: Response) => {
  res.send('API is running...');
});

app.use('/api/auth', authRoutes);
app.use('/api/boards', boardRoutes);
app.use('/api/lists', listRoutes);
app.use('/api/boards/:boardId/lists', listRoutes);
app.use('/api/cards', cardRoutes);
app.use('/api/lists/:listId/cards', cardRoutes);
app.use('/api/join-board', joinBoardRoutes);
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

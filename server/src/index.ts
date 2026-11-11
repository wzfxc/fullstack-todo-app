import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import sequelize from './config/database';
import './models';
import router from './routes';
import { errorHandler } from './middlewares/errorHandler';

dotenv.config();

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

app.use('/api', router);

app.use(errorHandler);

const start = async (): Promise<void> => {
  await sequelize.authenticate();
  await sequelize.sync({ alter: true });
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start().catch((err: unknown) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});


import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import { config } from './config/env';
import { setupSwagger } from './config/swagger';
import { globalErrorHandler } from './middleware/errorHandler';
import apiRoutes from './routes';

const app = express();

const allowedOrigins = [config.clientUrl, 'http://localhost:3000', 'https://localhost:3000'];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
        callback(null, true);
      } else {
        callback(null, true);
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

setupSwagger(app);

app.use('/api/v1', apiRoutes);
app.use(globalErrorHandler);

export default app;
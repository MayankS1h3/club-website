import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import 'dotenv/config';
import {env} from './config/env.js'
import authRoutes from './routes/auth.routes.js';
import { errorHandler } from './middlewares/error.middleware.js';

const app = express();
app.use(helmet());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// Routes
app.get('/api/v1/health', (req,res) => {res.json({ok: true})});
app.use('/api/v1/auth', authRoutes);

// Error handling middleware (must be last)
app.use(errorHandler);

app.listen(env.PORT, () => {
    console.log(`Server is running on PORT ${env.PORT}`);
})
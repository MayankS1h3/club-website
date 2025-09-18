import express from "express";
import cors from "cors";
import helmet from "helmet";
import 'dotenv/config';

const app = express();
app.use(helmet());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use(express.json());
app.get('/api/v1/health', (req,res) => {res.json({ok: true})});

app.listen(8000, () => {
    console.log(`Server is running on PORT 5173`);
})
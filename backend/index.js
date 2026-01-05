import express from "express";
import cors from "cors"; // 1. Adım: İçe aktar 📥
import authRoutes from "./routes/authRoutes.js";
import noteRoutes from "./routes/noteRoutes.js";
import errorMiddleware from "./middlewares/errorMiddleware.js";

const app = express();
const port = process.env.PORT || 3000;

app.use(cors()); // 2. Adım: Her şeyden önce CORS'u etkinleştir 🔓
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);

app.use(errorMiddleware);

app.listen(port, () => {
    console.log(`Port is on ${port}`);
});
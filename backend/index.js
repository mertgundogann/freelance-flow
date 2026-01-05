import express from "express";
import authRoutes from "./routes/authRoutes.js";
import noteRoutes from "./routes/noteRoutes.js";
import errorMiddleware from "./middlewares/errorMiddleware.js";
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());


app.use('/api/auth',authRoutes)

app.use('/api/notes', noteRoutes);

app.use(errorMiddleware);
app.listen(port,()=>{
    console.log(`Port is on ${port}`);
})
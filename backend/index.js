import express from "express";
import authRoutes from "./routes/authRoutes.js";
import errorMiddleware from "./middlewares/errorMiddleware.js";
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());


app.use('/api/auth',authRoutes)

app.use(errorMiddleware);
app.listen(port,()=>{
    console.log(`Port is on ${port}`);
})
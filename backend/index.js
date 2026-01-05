import express from "express";
import authRoutes from "./routes/authRoutes.js";
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());


app.use('/api/auth',authRoutes)

app.listen(port,()=>{
    console.log(`Port is on ${port}`);
})
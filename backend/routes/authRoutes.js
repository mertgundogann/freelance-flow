import express from "express";
import { register, login } from "../controllers/authController.js"; // login eklendi
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post('/register', register);
router.post('/login', login); 

router.get('/me', authMiddleware, (req, res) => {
    res.status(200).json({
        message: "Profil bilgileri başarıyla getirildi.",
        user: req.user 
    });
});

export default router;
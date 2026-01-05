import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import pool from "../db/db.js";
import asyncHandler from "../utils/asyncHandler.js";
export const register = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    
    if (!username || !email || !password) {
        const error = new Error("Lütfen tüm alanları doldurunuz.");
        error.statusCode = 400;
        throw error;
    }

   
    if (password.length < 6) {
        const error = new Error("Şifre en az 6 karakter olmalıdır.");
        error.statusCode = 400;
        throw error;
    }

    
    const userCheck = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (userCheck.rows.length > 0) {
        const error = new Error("Bu email ile kayıtlı bir kullanıcı var.");
        error.statusCode = 400;
        throw error;
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const query = "INSERT INTO users(username, email, password) VALUES($1, $2, $3) RETURNING id, username, email";
    const values = [username, email, hashedPassword];
    const result = await pool.query(query, values);

    res.status(201).json({
        success: true,
        message: "Kullanıcı oluşturuldu.",
        user: result.rows[0]
    });
});

import asyncHandler from "../utils/asyncHandler.js";

export const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    const user = result.rows[0];

    if (!user) {
        
        const error = new Error("E-posta veya şifre hatalı.");
        error.statusCode = 401;
        throw error;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        const error = new Error("E-posta veya şifre hatalı.");
        error.statusCode = 401;
        throw error;
    }
    // ... isMatch kontrolünden sonra
const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
);

res.status(200).json({
    success: true,
    message: "Giriş başarılı.",
    token
});
    
});
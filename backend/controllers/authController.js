import bcrypt from "bcrypt";
import pool from "../db/db.js";

export const register = async (req,res) => {
    const{username,email,password} = req.body;
    try{
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password,saltRounds);

        const query = "INSERT INTO users(username,email,password) VALUES($1,$2,$3) RETURNING id,username,email";

        const values = [username,email,hashedPassword];

        const result = await pool.query(query,values);

        res.status(201).json({message : "Kullanıcı oluşturuldu.",user : result.rows[0]});
    }
    catch(error){
        console.error("Kayıt hatası:", error);
        res.status(500).json({message : "Bir hata oluştu."})
    }
}
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import pool from "../db/db.js";

export const register = async (req,res) => {
    const{username,email,password} = req.body;


    if(!username || !email || !password){return res.status(400).json({message : "Lütfen tüm alanları doldurunuz."})};
    if(password.length<6){
        return res.status(400).json({message : "Şifre en az 6 karakter olmalıdır."})
    }

    try{

        const userCheck = await pool.query("SELECT * FROM users WHERE email = $1",[email])

        if(userCheck.rows.length>0){
            return res.status(400).json({message : "Bu email ile kayıtlı bir kullanıcı var."})
        }


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

export const login = async (req,res) => {
    const{email,password} = req.body;
    try{
        const result = await pool.query("SELECT * FROM users WHERE email = $1",[email]);
        const user = result.rows[0];
        if(!user){return res.status(400).json({message : "E-posta veya şifre hatalı."})}
        const isMatch= await bcrypt.compare(password,user.password);
        if(!isMatch){return res.status(401).json({message : "E-posta veya şifre hatalıdır."})}
        const token = jwt.sign({
            id:user.id,email : user.email
        },
        process.env.JWT_SECRET,
        {expiresIn:'1h'}        
    )
    res.status(200).json({
    message: "Giriş başarılı.",
    token: token // Token'ı kullanıcıya gönderiyoruz
});
    }
    catch(error){
        console.error("Giriş hatası",error);
        res.status(500).json({message : "Bir hata oluştu."})
    }
    
}
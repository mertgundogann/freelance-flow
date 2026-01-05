import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
    
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; 

    if (!token) {
        return res.status(401).json({ message: "Erişim engellendi, token bulunamadı." });
    }

    try {
      
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        
       
        req.user = verified;
        
       
        next();
    } catch (error) {
        res.status(403).json({ message: "Geçersiz veya süresi dolmuş token." });
    }
};

export default authMiddleware;
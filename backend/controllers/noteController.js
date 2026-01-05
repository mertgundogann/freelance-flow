import pool from "../db/db.js";
import asyncHandler from "../utils/asyncHandler.js";

export const createNote = asyncHandler(async (req, res) => {
    const { title, content } = req.body;
    const userId = req.user.id; 

    if (!title) {
        const error = new Error("Not başlığı boş olamaz.");
        error.statusCode = 400;
        throw error;
    }

    const query = "INSERT INTO notes (user_id, title, content) VALUES ($1, $2, $3) RETURNING *";
    const values = [userId, title, content];
    const result = await pool.query(query, values);

    res.status(201).json({
        success: true,
        message: "Not başarıyla oluşturuldu.",
        note: result.rows[0]
    });
});




export const getNotes = asyncHandler(async (req, res) => {
    const userId = req.user.id; 

    const query = "SELECT * FROM notes WHERE user_id = $1 ORDER BY created_at DESC"; 
    const result = await pool.query(query, [userId]);

    res.status(200).json({
        success: true,
        count: result.rowCount,
        notes: result.rows
    });
});


export const deleteNote = asyncHandler(async (req, res) => {
    const noteId = req.params.id; 
    const userId = req.user.id;   

    const query = "DELETE FROM notes WHERE id = $1 AND user_id = $2 RETURNING *";
    const result = await pool.query(query, [noteId, userId]);

    
    if (result.rowCount === 0) {
        const error = new Error("Not bulunamadı veya bu işlem için yetkiniz yok.");
        error.statusCode = 404;
        throw error;
    }

    res.status(200).json({
        success: true,
        message: "Not başarıyla silindi."
    });
});


export const updateNote = asyncHandler(async (req, res) => {
    const { title, content } = req.body;
    const noteId = req.params.id;
    const userId = req.user.id;

   
    const query = `
        UPDATE notes 
        SET title = $1, content = $2 
        WHERE id = $3 AND user_id = $4 
        RETURNING *`;
    
    const result = await pool.query(query, [title, content, noteId, userId]);

    if (result.rowCount === 0) {
        const error = new Error("Güncellenecek not bulunamadı veya yetkiniz yok.");
        error.statusCode = 404;
        throw error;
    }

    res.status(200).json({
        success: true,
        message: "Not güncellendi.",
        note: result.rows[0]
    });
});
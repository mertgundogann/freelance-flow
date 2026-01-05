import React, { useEffect, useState } from 'react';
import api from '../api/axios';

const Notes = () => {
    const [notes, setNotes] = useState([]);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    
    // Düzenleme durumu için state'ler 🔄
    const [isEditing, setIsEditing] = useState(false);
    const [currentNoteId, setCurrentNoteId] = useState(null);

    useEffect(() => {
        fetchNotes();
    }, []);

    const fetchNotes = async () => {
        try {
            const response = await api.get('/notes');
            setNotes(response.data);
        } catch (error) {
            console.error("Notlar getirilemedi:", error);
        }
    };

    // "Düzenle" butonuna basınca formu dolduran fonksiyon 📝
    const startEditing = (note) => {
        setIsEditing(true);
        setCurrentNoteId(note.id);
        setTitle(note.title);
        setContent(note.content);
    };

    // Her şeyi temizleyen "İptal" fonksiyonu 🧹
    const resetForm = () => {
        setIsEditing(false);
        setCurrentNoteId(null);
        setTitle('');
        setContent('');
    };

    const handleSaveNote = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                // GÜNCELLEME MODU (PUT)
                const response = await api.put(`/notes/${currentNoteId}`, { title, content });
                setNotes(notes.map(n => n.id === currentNoteId ? response.data : n));
            } else {
                // EKLEME MODU (POST)
                const response = await api.post('/notes', { title, content });
                setNotes([...notes, response.data]);
            }
            resetForm(); // İşlem bitince formu temizle
        } catch (error) {
            alert("Hata oluştu!");
        }
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/notes/${id}`);
            setNotes(notes.filter(note => note.id !== id));
        } catch (error) {
            alert("Silme başarısız!");
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
            <h1>Notlarım 📝</h1>

            <form onSubmit={handleSaveNote} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '30px' }}>
                <input type="text" placeholder="Başlık" value={title} onChange={(e) => setTitle(e.target.value)} required />
                <textarea placeholder="İçerik..." value={content} onChange={(e) => setContent(e.target.value)} required rows="4" />
                
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button type="submit" style={{ flex: 1 }}>
                        {isEditing ? 'Güncelle 🔄' : 'Not Ekle ➕'}
                    </button>
                    {isEditing && (
                        <button type="button" onClick={resetForm} style={{ backgroundColor: '#ccc' }}>
                            İptal ❌
                        </button>
                    )}
                </div>
            </form>

            <div className="notes-container">
                {notes.map((note) => (
                    <div key={note.id} style={{ border: '1px solid #ddd', padding: '15px', marginBottom: '10px', borderRadius: '8px' }}>
                        <h3>{note.title}</h3>
                        <p>{note.content}</p>
                        <button onClick={() => startEditing(note)} style={{ marginRight: '10px' }}>Düzenle ✏️</button>
                        <button onClick={() => handleDelete(note.id)} style={{ backgroundColor: '#ff4d4d', color: 'white' }}>Sil 🗑️</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Notes;
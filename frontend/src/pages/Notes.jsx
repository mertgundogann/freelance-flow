import React, { useEffect, useState } from 'react';
import api from '../api/axios';

const Notes = () => {
    const [notes, setNotes] = useState([]);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [currentNoteId, setCurrentNoteId] = useState(null);

    useEffect(() => {
        fetchNotes();
    }, []);

    const fetchNotes = async () => {
        try {
            const response = await api.get('/notes');
            if (response.data && Array.isArray(response.data.notes)) {
                setNotes(response.data.notes);
            } else if (Array.isArray(response.data)) {
                setNotes(response.data);
            } else {
                setNotes([]);
            }
        } catch (error) {
            console.error("Notlar getirilemedi:", error);
            setNotes([]);
        }
    };

    const startEditing = (note) => {
        setIsEditing(true);
        setCurrentNoteId(note.id);
        setTitle(note.title);
        setContent(note.content);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

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
                const response = await api.put(`/notes/${currentNoteId}`, { title, content });
                const updatedNote = response.data.note;
                setNotes(notes.map(n => n.id === currentNoteId ? updatedNote : n));
            } else {
                const response = await api.post('/notes', { title, content });
                const newNote = response.data.note;
                setNotes([...notes, newNote]);
            }
            resetForm();
        } catch (error) {
            alert("Hata oluştu!");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Bu notu silmek istediğinize emin misiniz?")) return;
        try {
            await api.delete(`/notes/${id}`);
            setNotes(notes.filter(note => note.id !== id));
        } catch (error) {
            alert("Silme başarısız!");
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto min-h-screen">
            <header className="mb-10 text-center">
                <h1 className="text-4xl font-black text-gray-800 flex items-center justify-center gap-3">
                    Notlarım <span className="text-3xl">📝</span>
                </h1>
                <p className="text-gray-500 mt-2">Fikirlerini özgürce kaydet.</p>
            </header>

            {/* Form Bölümü */}
            <section className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 mb-12">
                <form onSubmit={handleSaveNote} className="flex flex-col gap-4">
                    <input 
                        type="text" 
                        placeholder="Başlık" 
                        value={title} 
                        onChange={(e) => setTitle(e.target.value)} 
                        required 
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all font-semibold text-lg"
                    />
                    <textarea 
                        placeholder="İçerik..." 
                        value={content} 
                        onChange={(e) => setContent(e.target.value)} 
                        required 
                        rows="4" 
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all resize-none text-gray-700"
                    />
                    
                    <div className="flex gap-3">
                        <button 
                            type="submit" 
                            className="flex-1 bg-brand-blue hover:bg-blue-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-95 flex items-center justify-center gap-2"
                        >
                            {isEditing ? 'Güncelle 🔄' : 'Not Ekle ➕'}
                        </button>
                        {isEditing && (
                            <button 
                                type="button" 
                                onClick={resetForm} 
                                className="px-6 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold py-3 rounded-xl transition-all"
                            >
                                İptal ❌
                            </button>
                        )}
                    </div>
                </form>
            </section>

            {/* Not Listesi (Grid Yapısı) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {notes.map((note) => (
                    <article 
                        key={note.id} 
                        className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group flex flex-col justify-between"
                    >
                        <div>
                            <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-brand-blue transition-colors">
                                {note.title}
                            </h3>
                            <p className="text-gray-600 leading-relaxed mb-6 line-clamp-4">
                                {note.content}
                            </p>
                        </div>
                        
                        <div className="flex justify-end gap-2 pt-4 border-t border-gray-50 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                                onClick={() => startEditing(note)} 
                                className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Düzenle"
                            >
                                ✏️
                            </button>
                            <button 
                                onClick={() => handleDelete(note.id)} 
                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                title="Sil"
                            >
                                🗑️
                            </button>
                        </div>
                    </article>
                ))}
            </div>

            {notes.length === 0 && (
                <div className="text-center py-20">
                    <p className="text-gray-400 text-lg italic">Henüz bir not eklenmemiş...</p>
                </div>
            )}
        </div>
    );
};

export default Notes;
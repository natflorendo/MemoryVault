import { useState, useMemo } from 'react';
import NoteList from '../NoteList/NoteList';
import SearchBar from '@/components/SearchBar/SearchBar';
import type { Note } from '@/components/types';
import './NotesView.css'

interface NotesViewProps {
    allNotes: Note[];
    searchClass?: string;
    noteListClass?: string;
    deleteNote: (id: string) => void;
    onSelectedNote: (note: Note | null) => void;
}

export default function NotesView({ 
    allNotes, searchClass, noteListClass, deleteNote, onSelectedNote 
}: NotesViewProps) {
    const [searchTerm, setSearchTerm] = useState("");

    // memoizes (remembers) the result of a calculation so it's only recomputed when necessary.
    // use when doing expensive calculations (like .filter, .sort, .map on large arrays)
    // or avoid unnecessary computation during re-renders
    const filteredNotes = useMemo(() => {
        return allNotes.filter(note => {
            const content = JSON.stringify(note.body).toLowerCase();
            const tags = ((note.Tags || []).map(t => t.name.toLowerCase()).join(' '));
            return (
                content.includes(searchTerm.toLowerCase()) ||
                tags.includes(searchTerm.toLowerCase())
            );
        });
    }, [allNotes, searchTerm]);

    return (
        <div className="notes-view">
            <SearchBar value={searchTerm} className={searchClass} onChange={setSearchTerm}/>
            <NoteList
                state={filteredNotes}
                searchTerm={searchTerm}
                className={noteListClass}
                deleteNote={deleteNote}
                onSelectedNote={onSelectedNote}
            />
        </div>
    )
}
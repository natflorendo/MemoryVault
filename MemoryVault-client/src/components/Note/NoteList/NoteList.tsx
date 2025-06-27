import NoteItem from '../NoteItem/NoteItem';
import type { Note } from '../../types';
import './NoteList.css'


interface NoteListProp {
    allNotes: Note[];
    searchTerm?: string;
    className?: string; 
    deleteNote: (id: string) => void;
    onSelectedNote: (note: Note | null) => void;
}

const NoteList = ({ allNotes, searchTerm, deleteNote, onSelectedNote, className }: NoteListProp) => {
    return (
        <div className={`note-list ${className}`}>
            {allNotes.map((noteItem: Note) => {
                return(
                    <NoteItem
                        key={noteItem.id}
                        note={noteItem}
                        searchTerm={searchTerm}
                        deleteNote={deleteNote}
                        onSelectedNote={onSelectedNote}
                    />
                )
            })}
        </div>
    )
}

export default NoteList;
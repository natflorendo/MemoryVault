import NoteItem from '../NoteItem/NoteItem';
import type { Note } from '../../types';
import './NoteList.css'


interface NoteListProp {
    state: Note[];
    className?: string; 
    deleteNote: (id: string) => void;
    onSelectedNote: (note: Note | null) => void;
}

const NoteList = ({ state, deleteNote, onSelectedNote, className }: NoteListProp) => {
    return (
        <div className={`note-list ${className}`}>
            {state.map((noteItem: Note) => {
                return(
                    <NoteItem
                        key={noteItem.id}
                        note={noteItem}
                        deleteNote={deleteNote}
                        onSelectedNote={onSelectedNote}
                    />
                )
            })}
        </div>
    )
}

export default NoteList;
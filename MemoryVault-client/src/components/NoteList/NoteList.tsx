import NoteItem from '../NoteItem/NoteItem';
import type { Note } from '../types';
import './NoteList.css'


interface NoteListProp {
    state: Note[];
    deleteNote: (id: string) => void;
    onSelectedNote: (note: Note | null) => void;
}

const NoteList = ({state, deleteNote, onSelectedNote}: NoteListProp) => {
    return (
        <div className="note-list">
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
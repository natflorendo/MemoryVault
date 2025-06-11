import NoteItem from './NoteItem';
import type { Note } from './types';
import './NoteList.css'


interface NoteListProp {
    state: Note[];
    deleteNote: (id: string) => void;
}

const NoteList = ({state, deleteNote}: NoteListProp) => {
    return (
        <div className="note-list">
            {state.map((noteItem: Note) => {
                return(
                    <NoteItem
                        key={noteItem.id}
                        note={noteItem}
                        deleteNote={deleteNote}
                    />
                )
            })}
        </div>
    )
}

export default NoteList;
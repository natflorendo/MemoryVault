import NoteItem from './NoteItem';
import type { Note } from './types';


interface NoteListProp {
    state: Note[];
    deleteNote: (id: string) => void;
}

const NoteList = ({state, deleteNote}: NoteListProp) => {
    return (
        state.map((noteItem: Note) => {
            return(
            <NoteItem
                key={noteItem.id}
                note={noteItem}
                deleteNote={deleteNote}
            />
            )
        })
    )
}

export default NoteList;
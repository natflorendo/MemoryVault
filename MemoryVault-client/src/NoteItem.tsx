import type { Note } from './types';
import './NoteItem.css';

const formatDate = (timestamp: string) => {
    const date = new Date (timestamp);
    return (date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    }));
}

interface NoteItemProp {
    note: Note;
    deleteNote: (id: string) => void;
}

const NoteItem = ({note, deleteNote}: NoteItemProp) => {
    return(
        <div className="note-item">
          <h3>{formatDate(note.timestamp)}</h3>
          <p>{note.body.content}</p>
          <button onClick={() => deleteNote(note.id)}> DELETE</button>
        </div>
    )
}

export default NoteItem;
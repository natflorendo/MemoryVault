import type { Note } from '../../types';
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
    onSelectedNote: (note: Note | null) => void;
}

const extractText = (note: any): string => {
    if (note.type === 'text') return note.text ?? '';
    if (!note.content) return '';
    return note.content.map(extractText).join('');
};


const NoteItem = ({note, deleteNote, onSelectedNote}: NoteItemProp) => {
    return(
        <div className="note-item" onClick={() => onSelectedNote(note)}>
          <h3>{formatDate(note.timestamp)}</h3>
          <h6>Last Updated: {formatDate(note.lastUpdatedAt)}</h6>
          <p>{extractText(note.body)}</p>
          <button onClick={(e) => {
            e.stopPropagation();
            deleteNote(note.id);
          }}> DELETE</button>
        </div>
    )
}

export default NoteItem;
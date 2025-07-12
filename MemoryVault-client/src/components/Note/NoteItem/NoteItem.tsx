import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import type { Note } from '../../types';
import { getHighlightedSnippet } from './noteItemUtils';
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
    searchTerm?: string;
    deleteNote: (id: string) => void;
    onSelectedNote: (note: Note | null) => void;
}


const NoteItem = ({note, searchTerm, deleteNote, onSelectedNote}: NoteItemProp) => {
    return(
        <div className="note-item" onClick={() => onSelectedNote(note)}>
            <h3>{formatDate(note.timestamp)}</h3>
            <h6>Last Updated: {formatDate(note.lastUpdatedAt)}</h6>
            {/* <p>{extractText(note.body)}</p> */}
            <p>{getHighlightedSnippet(note.body, searchTerm || '')}</p>
            <p className="note-tag-container">
                {note.Tags?.map((tag) => (
                    <span key={tag.id} className="note-tag">
                        {tag.name}
                    </span>
                ))}
            </p>
            <button onClick={(e) => {
                e.stopPropagation();
                deleteNote(note.id);
            }}> 
                <FontAwesomeIcon icon={faTrash} />
            </button>
        </div>
    )
}

export default NoteItem;
import { useState } from "react";
import type { Note, Tag } from "@/components/types";
import NoteList from "@/components/Note/NoteList/NoteList";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import './TagFolder.css';

interface TagFolderProp {
    allTags: Tag[];
    deleteNote: (id: string) => void;
    onSelectedNote: (note: Note | null) => void;
}

const TagFolder = ({ allTags, deleteNote, onSelectedNote }: TagFolderProp) => {
    const [activeTabs, setActiveTabs] = useState<string[]>([]);
    
    const toggleTab = (tagName: string) => {
        setActiveTabs(prev =>
            prev.includes(tagName)
                ? prev.filter(name => name !== tagName)
                : [...prev, tagName]
        )
    }

    return (
        <div className="tag-folder-wrapper">
            {allTags.map((tag) => (
                <div className="tag-folder" key={tag.id}>
                    <div className="tag-separator"/>
                    <div
                        className={`tag-folder-link  ${activeTabs.includes(tag.name) ? 'active-link' : ''}`}
                        onClick={() => {
                            toggleTab(tag.name); 
                            if(import.meta.env.DEV) { console.log(activeTabs) }
                        }}
                    >
                        <FontAwesomeIcon 
                            icon={activeTabs.includes(tag.name) ? faChevronDown : faChevronRight} 
                            className="chevron-icon"
                        />
                        {tag.name}
                    </div>

                    {activeTabs.includes(tag.name) && tag.Notes.length > 0 && (
                        <NoteList
                            state={tag.Notes}
                            deleteNote={deleteNote}
                            onSelectedNote={onSelectedNote}
                        />
                    )}    
                </div>
            ))}
        </div>
    )
}


export default TagFolder;
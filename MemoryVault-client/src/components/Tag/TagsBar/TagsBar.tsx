import { useEffect, useState } from 'react';
import TagList from '../TagList/TagList';
import type { Note } from '@/components/types';
import './TagsBar.css'

interface TagsBarProps {
    note?: Note | null;
    tags: string[];
    setTags: React.Dispatch<React.SetStateAction<string[]>>;
    addTag?: (note: Note, tag: string) => void;
    deleteTag?: (note: Note, tag: string) => void;
}

export default function TagsBar({ 
    note, tags, 
    setTags, addTag, deleteTag
}: TagsBarProps) {
    const [input, setInput] = useState('');

    useEffect(() => {
        if(note?.Tags && note.Tags.length > 0) {
            const noteTags = note.Tags.map(tag => tag.name).reverse();
            setTags(noteTags);
        }
    }, [note, setTags]);
    
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if(e.key !== 'Enter' || input.trim() === '') { return; }
        e.preventDefault();
        // Ensure no duplicates
        if(!tags.includes(input.trim())) {
            setTags(prev => [input.trim(), ...prev]);
        }

        // when mode is secondary
        if(note && addTag) {
            addTag(note, input);
        }
        setInput('');
    };

    return (
        <div className="tags-bar">
            <input 
                type="text" 
                placeholder='Add +'
                className="tag-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
            />
            <TagList 
                note={note}
                tags={tags} 
                setTags={setTags}
                deleteTag={deleteTag}
            />
        </div>
    )
}
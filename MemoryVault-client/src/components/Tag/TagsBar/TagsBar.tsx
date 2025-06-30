import { useEffect, useState } from 'react';
import TagList from '../TagList/TagList';
import type { Note, Tag } from '@/components/types';
import './TagsBar.css'

interface TagsBarProps {
    note?: Note | null;
    tags: string[];
    allTags: Tag[];
    setTags: React.Dispatch<React.SetStateAction<string[]>>;
    addTag?: (note: Note, tag: string) => void;
    deleteTag?: (note: Note, tag: string) => void;
}

export default function TagsBar({ 
    note, tags, allTags,
    setTags, addTag, deleteTag
}: TagsBarProps) {
    const [input, setInput] = useState('');
    const [suggestions, setSuggestions] = useState<string[]>([]);

    useEffect(() => {
        if(note?.Tags && note.Tags.length > 0) {
            const noteTags = [...note.Tags].reverse().map(tag => tag.name);
            setTags(noteTags);
        } else {
            setTags([]);
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
        if(note && addTag) { addTag(note, input); }
        setInput('');
    };

    const handleSelectSuggestion = (tag: string) => {
        if (!tags.includes(tag)) {
            setTags(prev => [tag, ...prev]);
            if (note && addTag) { addTag(note, tag); }
        }
        setInput('');
        setSuggestions([]);
    };

    return (
        <div className="tags-bar-wrapper">
            {input.trim() !== '' && suggestions.length > 0 && (
                <ul className="tag-suggestions">
                {suggestions.map((tag, i) => (
                    <li key={i} onClick={() => handleSelectSuggestion(tag)}>
                    {tag}
                    </li>
                ))}
                </ul>
            )}
            <div className="tags-bar">
                <input 
                    type="text" 
                    placeholder='Add +'
                    className="tag-input"
                    value={input}
                    onChange={(e) => {
                        const value = e.target.value;
                        setInput(value);
                        setSuggestions(
                            allTags
                            .filter(tag =>
                                tag.name.includes(value) &&
                                !tags.includes(tag.name)
                            )
                            .map(tag => tag.name)
                        );
                    }}
                    onKeyDown={handleKeyDown}
                />
                <TagList 
                    note={note}
                    tags={tags} 
                    setTags={setTags}
                    deleteTag={deleteTag}
                />
            </div>
        </div>
    )
}
import { useState } from 'react';
import TagList from '../TagList/TagList';
import './TagsBar.css'

interface TagsBarProps {
    tags: string[];
    setTags: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function TagsBar({ tags, setTags }: TagsBarProps) {
    const [input, setInput] = useState('');
    
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if(e.key !== 'Enter' || input.trim() === '') { return; }
        e.preventDefault();
        // Ensure no duplicates
        if(!tags.includes(input.trim())) {
            setTags(prev => [input.trim(), ...prev]);
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
            <TagList tags={tags} setTags={setTags}/>
        </div>
    )
}
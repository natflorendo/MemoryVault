import { useState } from 'react';
import './TagsBar.css'

export default function TagsBar() {
    const [tag, setTag] = useState('');
    
    return (
        <div className="tags-bar">
            <input type="text" />
            hello
        </div>
    )
}
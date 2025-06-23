import type { Note } from '@/components/types';
import './TagItem.css';

interface TagItemProp {
    index: number;
    note?: Note | null;
    tag: string;
    setTags: React.Dispatch<React.SetStateAction<string[]>>;
    deleteTag?: (note: Note, tag: string) => void;
}

const TagItem = ({ 
    note, index, tag, 
    setTags, deleteTag 
}: TagItemProp) => {
    return (
        <span className="tag">
            {tag}
            <button onClick={() => {
                setTags(prev => prev.filter((_, i) => i !== index));
                if(note && deleteTag) { deleteTag(note, tag); }
            }}>
                x
            </button>
        </span>
    )
}

export default TagItem;
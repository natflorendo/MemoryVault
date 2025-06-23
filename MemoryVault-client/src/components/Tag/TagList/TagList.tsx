import type { Note } from '@/components/types';
import TagItem from "../TagItem/TagItem";
import './TagList.css';

interface TagListProp {
    note?: Note | null;
    tags: string[];
    className?: string;
    setTags: React.Dispatch<React.SetStateAction<string[]>>;
    deleteTag?: (note: Note, tag: string) => void;
}

const TagList = ({ 
    note, tags, className, 
    setTags, deleteTag 
}: TagListProp) => {
    return (
        <div className={`tag-list ${className}`}>
            {tags.map((tag, i) => (
                <TagItem 
                    key={i} 
                    note={note}
                    tag={tag} 
                    index={i} 
                    setTags={setTags}
                    deleteTag={deleteTag}
                />
            ))}
        </div>
    )
}

export default TagList;
import TagItem from "../TagItem/TagItem";
import './TagList.css';

interface TagListProp {
    tags: string[];
    className?: string;
    setTags: React.Dispatch<React.SetStateAction<string[]>>;
}

const TagList = ({ tags, className, setTags }: TagListProp) => {
    return (
        <div className={`tag-list ${className}`}>
            {tags.map((tag, i) => (
                <TagItem key={i} tag={tag} index={i} setTags={setTags}/>
            ))}
        </div>
    )
}

export default TagList;
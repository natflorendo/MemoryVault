import './TagItem.css';

interface TagItemProp {
    tag: string;
    index: number;
    setTags: React.Dispatch<React.SetStateAction<string[]>>;
}

const TagItem = ({ tag, index, setTags }: TagItemProp) => {
    return (
        <span className="tag">
            {tag}
            <button onClick={() => {
                setTags(prev => prev.filter((_, i) => i !== index));}}
            >
                x
            </button>
        </span>
    )
}

export default TagItem;
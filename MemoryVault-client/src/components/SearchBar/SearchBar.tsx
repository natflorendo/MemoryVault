import './SearchBar.css'

interface SearchBarProps {
    value: string;
    placeholder?: string;
    className?: string;
    onChange: (newValue: string) => void;
}

export default function SearchBar({ 
    value, placeholder = "Search notes...", className, onChange
} : SearchBarProps) {
    return (
        <div className={`search-bar-wrapper ${className}`}>
            <input 
                type="text" 
                className={"search-bar"}
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
            {value && (
                <button 
                    className="clear-button"
                    onClick={() => onChange('')}
                >
                    ×
                </button>
            )}
        </div>
    );
}
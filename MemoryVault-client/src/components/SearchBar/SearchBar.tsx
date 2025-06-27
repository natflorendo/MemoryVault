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
        <input 
            type="text" 
            className={`search-bar ${className}`}
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
        />
    );
}
import type { FormEvent } from "react";


interface EditorProp {
    input: string;
    onSubmit: (e: FormEvent) => void;
    setInput: (value: string) => void;
}

const Editor = ({ input, onSubmit, setInput }: EditorProp) => {
    return (
        <>
            <form onSubmit={onSubmit}>
            <input type="text" 
            value={input}
            onChange={e => setInput(e.target.value)}/>
            <button type="submit">Submit</button>
            </form>
        </>
    )
}

export default Editor;
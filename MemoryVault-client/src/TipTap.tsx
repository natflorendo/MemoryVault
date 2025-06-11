import { useEditor, EditorContent, EditorContext } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TextStyle from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'
import './TipTap.css'
import ActionBar from './ActionBar';


const extensions = [
  StarterKit,
  TextStyle,
  Color
]

const content = {
    "type": "doc",
    "content": [
        {
        "type": "paragraph",
        "content": [
            {
            "type": "text",
            "text": "Hello World!"
            }
        ]
        }
    ]
    }

interface TipTapProp {
    onSubmit: (content: Record<string, any>) => void;
}

const Tiptap = ({ onSubmit }: TipTapProp) => {
  const editor = useEditor({
    extensions,
    content,
  });

  const handleSubmit = () => {
    console.log("handle");
    if(!editor) { return; }
    const content = editor.getJSON();
    onSubmit(content);
    editor.commands.clearContent();
  };

  return (
    <EditorContext.Provider value={{ editor }}>
      <ActionBar onSubmit={handleSubmit}/>
      <EditorContent editor={editor} role="presentation" className="simple-editor-content" />
    </EditorContext.Provider>
  )
}

export default Tiptap;
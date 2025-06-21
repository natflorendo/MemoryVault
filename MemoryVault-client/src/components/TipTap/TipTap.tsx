import { useEditor, EditorContent, EditorContext } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TaskItem from '@tiptap/extension-task-item'
import TaskList from '@tiptap/extension-task-list';
import TextStyle from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import Placeholder from '@tiptap/extension-placeholder';

import ActionBar from '../ActionBar/ActionBar';
import TagsBar from '../Tag/TagsBar/TagsBar';
import type { Note } from '../types';
import { useState, useEffect } from 'react';
import './TipTap.css';

import { clearEditorHistory, useTiptapHandlers } from './tiptapUtils';

const extensions = [
  StarterKit,
  TextStyle,
  Color,
  Placeholder.configure({
    placeholder: "What's on your mind?",
  }),
  TaskList,
  TaskItem.configure({
    nested: true,
  }),
];

interface TipTapProp {
    onSubmit?: (content: Record<string, any>) => void;
    onClose?: (note: Note | null) => void;
    deleteNote?: (id: string) => void;
    note?: Note | null;
    mode?: 'primary' | 'secondary';
}

const Tiptap = ({ onSubmit, onClose, deleteNote, note, mode }: TipTapProp) => {
  const editor = useEditor({
    extensions,
    content: note?.body,
  });
  const [tags, setTags] = useState<string[]>([]);

  const { handleSubmit, handleClose, handleDelete } = useTiptapHandlers({
    onSubmit,
    onClose,
    deleteNote,
    note: note ?? null,
    editor
  });

  useEffect(() => {
    if (!editor) return;

    note?.body ? editor.commands.setContent(note?.body) : editor.commands.clearContent();

    // Clear undo/redo history
    clearEditorHistory(editor);
  }, [editor, note?.body]);

  return (
    <div className="editor-wrapper">
      <EditorContext.Provider value={{ editor }}>
        <ActionBar 
          mode={mode}
          handleSubmit={handleSubmit}
          handleClose={handleClose}
          handleDelete={handleDelete}
        />
        <EditorContent editor={editor} role="presentation" className="simple-editor-content" />
        <TagsBar tags={tags} setTags={setTags}/>
      </EditorContext.Provider>
    </div>
  )
}

export default Tiptap;
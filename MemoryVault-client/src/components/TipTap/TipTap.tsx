import { useEditor, EditorContent, EditorContext } from '@tiptap/react';
import { EditorState } from 'prosemirror-state';
import StarterKit from '@tiptap/starter-kit';
import TaskItem from '@tiptap/extension-task-item'
import TaskList from '@tiptap/extension-task-list';
import TextStyle from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import Placeholder from '@tiptap/extension-placeholder';
import './TipTap.css';

import ActionBar from '../ActionBar/ActionBar';
import TagsBar from '../Tag/TagsBar/TagsBar';
import type { Note } from '../types';
import { useEffect } from 'react';
import isEqual from 'lodash.isequal'; 


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

  // Clear undo/redo history
  const clearEditorHistory = () => {
    if (!editor) return;
    const newState = EditorState.create({
      schema: editor.state.schema,
      doc: editor.state.doc,
      plugins: editor.state.plugins,
    });
    editor.view.updateState(newState);
  };

  const handleSubmit = () => {
    if(!editor) { return; }
    const content = editor.getJSON();
    onSubmit?.(content)
    editor.commands.clearContent();

    clearEditorHistory();
  };

  const handleClose = () => {
    if(!editor || !note) { return; }
    const content = editor.getJSON();
    
    if(!isEqual(note.body, content)) {
      note.body = content
      onClose?.(note);
    } else {
      onClose?.(null);
    }
  }

  const handleDelete = () => {
    if(!(note?.id && deleteNote)) { return; }
    
    deleteNote(note.id);
    handleClose();
  }

  useEffect(() => {
    if (!editor) return;

    note?.body ? editor.commands.setContent(note?.body) : editor.commands.clearContent();

    // Clear undo/redo history
    clearEditorHistory();
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
        <TagsBar/>
      </EditorContext.Provider>
    </div>
  )
}

export default Tiptap;
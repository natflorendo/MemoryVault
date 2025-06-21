import { Editor } from '@tiptap/react';
import { EditorState } from 'prosemirror-state';
import isEqual from 'lodash.isequal';
import type { Note } from '../types';

// Clear undo/redo history
export const clearEditorHistory = (editor: Editor | null) => {
    if (!editor) return;
    const newState = EditorState.create({
      schema: editor.state.schema,
      doc: editor.state.doc,
      plugins: editor.state.plugins,
    });
    editor.view.updateState(newState);
  };

interface HandlersProp {
    onSubmit?: (content: Record<string, any>) => void;
    onClose?: (note: Note | null) => void;
    deleteNote?: (id: string) => void;
    note: Note | null;
    editor: Editor | null;
}

export const useTiptapHandlers = ({
    onSubmit,
    onClose,
    deleteNote,
    note,
    editor

}: HandlersProp) => {
    const handleSubmit = () => {
        if(!editor) { return; }
        const content = editor.getJSON();
        onSubmit?.(content)
        editor.commands.clearContent();
    
        clearEditorHistory(editor);
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
      };
    
      const handleDelete = () => {
        if(!(note?.id && deleteNote)) { return; }
        
        deleteNote(note.id);
        handleClose();
      };

      return { handleSubmit, handleClose, handleDelete };
};
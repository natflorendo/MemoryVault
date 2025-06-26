import { Editor } from '@tiptap/react';
import { EditorState } from 'prosemirror-state';
import isEqual from 'lodash.isequal';
import type { Note } from '../types';
import { EditorView } from '@tiptap/pm/view';

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

export function insertIndent(view: EditorView): boolean {
  const { state, dispatch } = view;
  const { selection } = state;
  const tr = state.tr.insertText('\t', selection.from, selection.to);
  dispatch(tr);
  return true;
}

export function removeIndent(view: EditorView): boolean {
  const { state, dispatch } = view;
  const { selection } = state;
  const { from } = selection;
  const $from = state.doc.resolve(from);
  const lineStart = $from.start();
  const lineText = state.doc.textBetween(lineStart, from);
  const match = lineText.match(/(\t| {1,4})$/);

  if (match) {
    const tr = state.tr.delete(from - match[0].length, from);
    dispatch(tr);
  }
  return true;
}

interface HandlersProp {
    onSubmit?: (content: Record<string, any>, tags: string[]) => void;
    onClose?: (note: Note | null) => void;
    deleteNote?: (id: string) => void;
    note: Note | null;
    editor: Editor | null;
    tags: string[];
    setTags: React.Dispatch<React.SetStateAction<string[]>>;
}

export const useTiptapHandlers = ({
    onSubmit,
    onClose,
    deleteNote,
    note,
    editor,
    tags,
    setTags
}: HandlersProp) => {
    const handleSubmit = () => {
        if(!editor) { return; }
        const content = editor.getJSON();
        onSubmit?.(content, tags ?? [])
        editor.commands.clearContent();
        setTags([]);
    
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
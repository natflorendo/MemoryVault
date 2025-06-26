import { useEditor, EditorContent, EditorContext } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TaskItem from '@tiptap/extension-task-item'
import TaskList from '@tiptap/extension-task-list';
import TextStyle from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import { EditorView } from '@tiptap/pm/view';

import ActionBar from '../ActionBar/ActionBar';
import TagsBar from '../Tag/TagsBar/TagsBar';
import type { Note, Tag } from '../types';
import { useState, useEffect } from 'react';
import './TipTap.css';

import { 
  clearEditorHistory, useTiptapHandlers,
  insertIndent, removeIndent
} from './tiptapUtils';

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
  Link.extend({inclusive: false,}).configure({
    autolink: true,
    linkOnPaste: true,
    openOnClick: true,
    HTMLAttributes: {
      rel: 'noopener noreferrer',
      target: '_blank',
    },
  }),
];

interface TipTapProp {
    onSubmit?: (content: Record<string, any>, tags: string[]) => void;
    onClose?: (note: Note | null) => void;
    deleteNote?: (id: string) => void;
    addTag?: (note: Note, tag: string) => void;
    deleteTag?: (note: Note, tag: string) => void;
    note?: Note | null;
    allTags: Tag[];
    mode?: 'primary' | 'secondary';
}

const Tiptap = ({ 
  onSubmit, 
  onClose, 
  deleteNote, 
  addTag,
  deleteTag,
  note,
  allTags,
  mode 
}: TipTapProp) => {
  const editor = useEditor({
    extensions,
    content: note?.body,
    editorProps: {
      attributes: {
        class:"simple-editor-content",
        spellcheck: 'true',
        autocorrect: 'on',
        autocomplete: 'on',
      },
      //Indent/Outdent
      handleKeyDown(view: EditorView, event: KeyboardEvent): boolean {
        if (event.key !== 'Tab') { return false; }

        event.preventDefault();
        const isList = editor?.isActive('listItem') || editor?.isActive('taskItem');

        if (event.shiftKey) {
          return isList
            ? editor?.commands.liftListItem('listItem') ?? false
            : removeIndent(view);
        } else {
          return isList
            ? editor?.commands.sinkListItem('listItem') ?? false
            : insertIndent(view);
        }
      },
    }
  });
  const [tags, setTags] = useState<string[]>([]);

  const { handleSubmit, handleClose, handleDelete } = useTiptapHandlers({
    onSubmit,
    onClose,
    deleteNote,
    note: note ?? null,
    editor,
    tags,
    setTags
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
        <EditorContent editor={editor} role="presentation"/>
        <TagsBar
          note={note}
          tags={tags}
          allTags={allTags}
          setTags={setTags}
          addTag={mode === 'secondary' ? addTag : undefined}
          deleteTag={mode === 'secondary' ? deleteTag : undefined}
        />
      </EditorContext.Provider>
    </div>
  )
}

export default Tiptap;
// --- UI Primatives ---
import { Toolbar, ToolbarGroup, ToolbarSeparator } from '@/components/tiptap-ui-primitive/toolbar';
import { Spacer } from '@/components/tiptap-ui-primitive/spacer';
import { Button } from '@/components/tiptap-ui-primitive/button';

// --- Tiptap UI ---
import { UndoRedoButton } from '@/components/tiptap-ui/undo-redo-button'
import { MarkButton } from '@/components/tiptap-ui/mark-button';
import { ListDropdownMenu } from '@/components/tiptap-ui/list-dropdown-menu';

import { useCurrentEditor } from '@tiptap/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

import './ActionBar.css';

interface ActionBarProp {
    handleSubmit?: () => void;
    handleClose?: () => void;
    handleDelete?: () => void;
    mode?: 'primary' | 'secondary';
}

export default function ActionBar({handleSubmit, handleClose, handleDelete, mode}: ActionBarProp) {
    const { editor } = useCurrentEditor();

    if(!editor) return null;

    return (
        <div className="action-bar">
            <Toolbar>
                <ToolbarGroup>
                    <UndoRedoButton action ="undo"/>
                    <UndoRedoButton action ="redo"/>
                </ToolbarGroup>

                <ToolbarSeparator/>

                <ToolbarGroup>
                    <MarkButton type="bold" />
                    <MarkButton type="italic" />
                    <MarkButton type="strike" />
                    <MarkButton type="code" />
                </ToolbarGroup>

                <ToolbarSeparator/>
                
                <ToolbarGroup>
                    <ListDropdownMenu types={["bulletList", "orderedList", "taskList"]}/>
                </ToolbarGroup>

                <ToolbarSeparator/>

                <ToolbarGroup>
                    <input
                        type="color"
                        onChange={event => editor.chain().focus().setColor(event.currentTarget.value).run()}
                        value={editor.getAttributes('textStyle').color}
                        data-testid="setColor"
                    />
                </ToolbarGroup>

                <Spacer/>
                <Spacer/>

                <ToolbarGroup>
                {mode == 'primary' && (
                    <Button 
                        className="save-btn"
                        data-style="primary" 
                        onClick={handleSubmit}
                        disabled={editor.isEmpty}
                    >
                        <strong>Save</strong>
                    </Button>
                )}
                {mode == 'secondary' && (
                    <Button 
                        className="close-btn"
                        data-style="secondary" 
                        onClick={handleClose}
                        disabled={editor.isEmpty}
                    >
                        <strong>Close</strong>
                    </Button>
                )}
                </ToolbarGroup>

                <Spacer/>

                {mode == 'secondary' && (
                    <Button 
                        className="delete-btn"
                        onClick={handleDelete}
                    >
                        <strong><FontAwesomeIcon icon={faTrash} /></strong>
                    </Button>
                )}
            </Toolbar>
        </div>
    )
}
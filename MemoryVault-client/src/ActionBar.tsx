// --- UI Primatives ---
import { Toolbar, ToolbarGroup, ToolbarSeparator } from '@/components/tiptap-ui-primitive/toolbar';
import { Spacer } from '@/components/tiptap-ui-primitive/spacer';
import { Button } from '@/components/tiptap-ui-primitive/button';

// --- Tiptap UI ---
import { UndoRedoButton } from '@/components/tiptap-ui/undo-redo-button'
import { MarkButton } from '@/components/tiptap-ui/mark-button';

import { useCurrentEditor } from '@tiptap/react';

interface ActionBarProp {
    onSubmit: () => void;
}

const presetColors = ['#000000', '#FF0000', '#00FF00', '#0000FF', '#FFA500'];

export default function ActionBar({onSubmit}: ActionBarProp) {
    const { editor } = useCurrentEditor();

    if(!editor) return null;

    return (
        <>
            <Toolbar>
                <Spacer/>
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
                    <input
                        type="color"
                        onInput={event => editor.chain().focus().setColor(event.currentTarget.value).run()}
                        value={editor.getAttributes('textStyle').color}
                        data-testid="setColor"
                    />
                </ToolbarGroup>

                <ToolbarSeparator/>

                <ToolbarGroup>
                    <Button 
                        data-style="primary" 
                        onClick={onSubmit}
                        disabled={editor.isEmpty}
                    >
                        Save
                    </Button>
                </ToolbarGroup>
            </Toolbar>
        </>
    )
}
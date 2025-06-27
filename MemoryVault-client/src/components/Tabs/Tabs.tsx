import { useState } from 'react';
import './Tabs.css';
import NotesView from '../Note/NotesView/NotesView';
import Calendar from '../Calendar/Calendar';
import TagFolder from '../Tag/TagFolder/TagFolder';
import type { Note, Tag } from '../types'; 

interface TabsProp {
    allNotes: Note[];
    allTags: Tag[];
    deleteNote: (id: string) => void;
    onSelectedNote: (note: Note | null) => void;
}

export default function Tabs({allNotes, allTags, deleteNote, onSelectedNote}: TabsProp) {
    const [activeTab, setActiveTab] = useState("Recent");

    const tabs = [
        {
            name: 'Recent',
            content: (
                // <NoteList
                //     allNotes={allNotes}
                //     deleteNote={deleteNote}
                //     onSelectedNote={onSelectedNote}
                // />
                <NotesView
                    allNotes={allNotes}
                    deleteNote={deleteNote}
                    onSelectedNote={onSelectedNote}
                />
            ),
        },
        {
            name: 'Tags',
            content: (
                <TagFolder
                    allTags={allTags}
                    deleteNote={deleteNote}
                    onSelectedNote={onSelectedNote}
                />
            ),
        },
        {
            name: 'Calendar',
            content: (
                <Calendar 
                    notes={allNotes}
                    onSelectedNote={onSelectedNote}
                />
            ),
        }
    ]

    return (
        <>
            <div className="tab-titles">
                {tabs.map((tab) => (
                    <div
                        key={tab.name}
                        className={`tab-links ${activeTab === tab.name ? 'active-link' : ''}`}
                        onClick={() => setActiveTab(tab.name)}
                    >
                        {tab.name}
                    </div>
                ))}
            </div>

            {tabs.map((tab) => (
                <div
                    key={tab.name}
                    className={`tab-contents ${activeTab === tab.name ? 'active-tab' : ''}`}
                >
                    {activeTab === tab.name && tab.content}
                </div>
            ))}
        </>
    );
}
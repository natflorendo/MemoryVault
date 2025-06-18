import { useState } from 'react';
import './Tabs.css';
import NoteList from '../NoteList/NoteList';
import Calendar from '../Calendar/Calendar';
import type { Note } from '../types';

interface TabsProp {
    state: Note[];
    deleteNote: (id: string) => void;
    onSelectedNote: (note: Note | null) => void;
}

export default function Tabs({state, deleteNote, onSelectedNote}: TabsProp) {
    const [activeTab, setActiveTab] = useState("Recent");

    const tabs = [
        {
            name: 'Recent',
            content: (
                <NoteList
                    state={state}
                    deleteNote={deleteNote}
                    onSelectedNote={onSelectedNote}
                />
            ),
        },
        {
            name: 'Calendar',
            content: (
                <Calendar 
                    notes={state}
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
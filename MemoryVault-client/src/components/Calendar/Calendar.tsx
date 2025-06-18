import { useState } from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';
import { Tooltip } from 'react-tooltip';
import 'react-calendar-heatmap/dist/styles.css';
import './Calendar.css';
import type { Note } from '../types';
import { formatDate, generateValues, processNotesToHeatmap, shiftDate} from './calendarUtils'
import NoteList from '../NoteList/NoteList';
import Key from './Key';

interface CalendarProps {
    notes: Note[];
    onSelectedNote: (note: Note | null) => void;
}

export default function Calendar({ notes, onSelectedNote }: CalendarProps) {
    const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    
    const endDate = new Date();  //today
    const startDate = shiftDate(endDate, -365);

    const processedData = processNotesToHeatmap(notes);

    const values = generateValues(startDate, endDate, processedData);

    // For classForValue
    const counts = values.map(v => v.count)
    const min = Math.min(...counts);
    const max = Math.max(...counts);
    
    return (
        <div className="calendar-section">
            <div className="calendar-wrapper">
                <CalendarHeatmap
                    startDate={startDate}
                    endDate={endDate}
                    values={values}
                    classForValue={(value) => {
                        if (!value || value.count === 0) return 'color-empty';
                        // avoid divide by 0
                        const percentage = (value.count - min) / (max - min || 1);
                        const level = Math.ceil(percentage * 4);
                        return `color-scale-${level}`;
                    }}
                    tooltipDataAttrs={(value): Record<string, string> => {
                        if (!value) return {};
                        return {
                            'data-tooltip-id': 'heatmap-tooltip',
                            'data-tooltip-content': `${formatDate(value.date)} has count: ${value.count}`,
                        };

                    }}
                    showWeekdayLabels={true}
                    onClick={value => {
                        if (!value) { return; }

                        const clickedDate = value.date.toLocaleString('en-CA').slice(0, 10);

                        if(clickedDate === selectedDate) {
                            setFilteredNotes([]);
                            setSelectedDate(null);
                            return;
                        }
                        
                        const notesOnDate = notes.filter(note => {
                            return new Date(note.timestamp).toLocaleString('en-CA').slice(0, 10) === clickedDate
                        });
                        setFilteredNotes(notesOnDate);
                        setSelectedDate(clickedDate);
                    }}
                />
                <Tooltip id="heatmap-tooltip"/>
            </div>
            <Key/>
            {filteredNotes.length > 0 && (
                <NoteList
                    className="calendar-note-list"
                    state={filteredNotes}
                    deleteNote={() => {}}
                    onSelectedNote={onSelectedNote}
                />
            )}
       </div>
    )
}
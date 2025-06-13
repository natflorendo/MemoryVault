import { useEffect, useState } from 'react'
import type { Note } from './types';
import axios from 'axios'
import './App.css'
import NoteList from './NoteList';
import Tiptap from './TipTap';

function App() {
  const HOST = import.meta.env.VITE_API_URL;
  const [state, setState] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [showSecondEditor, setShowSecondEditor] = useState(false);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    const response = await axios.get<Note[]>(`${HOST}/notes`);
    const notes = response.data;
    console.log(notes);
    notes.sort((a, b) => {
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(); 
    });
    setState(notes);
  }

  const addNote = async (body: Record<string, any>) => {
    await axios.post(`${HOST}/notes`, { body })
    await fetchNotes();
  }

  const deleteNote = async (id: String) => {
    await axios.delete(`${HOST}/notes/${id}`);
    await fetchNotes();
  }

  const updateNote = async (note: Note) => {
    await axios.put(`${HOST}/notes/${note.id}`, { body: note.body});
    await fetchNotes();
  }

  const onSubmit = async (content: Record<string, any>) => {
    await addNote(content);
  }

  const onSelectedNote = (note: Note | null) => {
    setSelectedNote(note);
    setShowSecondEditor(true);
  }

  const onClose = async (note: Note | null) => {
    setShowSecondEditor(false);
    if(note) { updateNote(note); }
  }

  //test if note was selected
  useEffect(() => {
    if (selectedNote !== null) {
      console.log("Selected note updated:", selectedNote);
    }
  }, [selectedNote]);

  return (
    <div className="columns">
      <div className="left-column">
        <Tiptap
          onSubmit={onSubmit}
          mode='primary'
        />
        {showSecondEditor && (
          <Tiptap
            onClose={onClose}
            deleteNote={deleteNote}
            note={selectedNote}
            mode='secondary'
          />
        )}
      </div>

      <div className="separator"></div>

      <div className="right-column">
        <NoteList
          state={state}
          deleteNote={deleteNote}
          onSelectedNote={onSelectedNote}
      />
      </div>
    </div>
  )
}

export default App

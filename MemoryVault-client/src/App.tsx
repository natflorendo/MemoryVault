import { useEffect, useState } from 'react'
import type { Note } from './types';
import axios from 'axios'
import './App.css'
import NoteList from './NoteList';
import Tiptap from './TipTap';

function App() {
  const HOST = import.meta.env.VITE_API_URL;
  const [state, setState] = useState<Note[]>([]);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    const response = await axios.get<Note[]>(`${HOST}/notes`);
    const notes = response.data;
    console.log(notes);
    // notes.sort((a, b) => {
    //   return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(); 
    // });
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

  const onSubmit = async (content: Record<string, any>) => {
    console.log("here");
    await addNote(content);
  }

  return (
    <div className="columns">
      <div className="left-column">
        <Tiptap
          onSubmit={onSubmit}
        />
      </div>

      <div className="seperator"></div>

      <div className="right-column">
        <NoteList
          state={state}
          deleteNote={deleteNote}
      />
      </div>
    </div>
  )
}

export default App

import { useEffect, useState } from 'react'
import type { FormEvent } from 'react';
import type { Note } from './types';
import axios from 'axios'
import './App.css'
import NoteList from './NoteList';
import Editor from './Editor';

function App() {
  const HOST = import.meta.env.VITE_API_URL;
  const [state, setState] = useState<Note[]>([]);
  const [input, setInput] = useState<string>("");

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
    setInput("");
  }

  const addNote = async () => {
    await axios.post(`${HOST}/notes`, { body: { content: input } })
    await fetchNotes();
  }

  const deleteNote = async (id: String) => {
    await axios.delete(`${HOST}/notes/${id}`);
    await fetchNotes();
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await addNote();
  }

  return (
    <>
      <Editor
        input={input}
        onSubmit={onSubmit}
        setInput={setInput}
      />
      <NoteList
          state={state}
          deleteNote={deleteNote}
      />
    </>
  )
}

export default App

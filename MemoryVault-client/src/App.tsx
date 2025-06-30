import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Note, Tag, User } from './components/types';
import Tiptap from './components/TipTap/TipTap';
import Tabs from './components/Tabs/Tabs';
import { 
  fetchNotes, fetchTags,
  addNote, addTag,
  deleteNote, deleteTag,
  updateNote
} from './NoteService';
import { fetchCurrentUser } from './Login/auth';
import './App.css';
import './styles/theme.css';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [allNotes, setAllNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [showSecondEditor, setShowSecondEditor] = useState(false);
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCurrentUser(setUser, loadNotesAndTags, navigate);
    // loadNotesAndTags();
  }, []);

  const loadNotesAndTags = async () => {
    const notes = await fetchNotes();
     notes.sort((a, b) => {
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(); 
    });
    console.log(notes);
    setAllNotes(notes);

    const tags = await fetchTags();
    console.log(tags);
    setAllTags(tags);
  }

  const handleAddNote = async (body: Record<string, any>, tags: string[]) => {
    await addNote(body, tags);
    await loadNotesAndTags();
  };

  const handleUpdateNote = async (note: Note) => {
    await updateNote(note);
    await loadNotesAndTags();
  };

  const handleDeleteNote = async (id: string) => {
    await deleteNote(id);
    await loadNotesAndTags();
  };

  const handleAddTag = async (note: Note, tag: string) => {
    await addTag(note, tag);
    await loadNotesAndTags();
  };

  const handleDeleteTag = async (note: Note, tag: string) => {
    await deleteTag(note, tag);
    await loadNotesAndTags();
  }

  const onSubmit = async (content: Record<string, any>, tags: string[]) => {
    await handleAddNote(content, tags);
  }

  const onSelectedNote = (note: Note | null) => {
    setSelectedNote(note);
    setShowSecondEditor(true);
  }

  const onClose = async (note: Note | null) => {
    setShowSecondEditor(false);
    if(note) { handleUpdateNote(note); }
  }

  const handleSignOut = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
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
          allTags={allTags}
          mode='primary'
        />
        {showSecondEditor && (
          <Tiptap
            onClose={onClose}
            deleteNote={handleDeleteNote}
            addTag={handleAddTag}
            deleteTag={handleDeleteTag}
            note={selectedNote}
            allTags={allTags}
            mode='secondary'
          />
        )}
      </div>

      <div className="separator"/>

      <div className="header-actions">
        <button onClick={handleSignOut} className="sign-out-btn">
          Sign Out
        </button>
      </div>
      
      <div className="right-column">
        <Tabs
          allNotes={allNotes}
          allTags={allTags}
          deleteNote={handleDeleteNote}
          onSelectedNote={onSelectedNote}
        />
      </div>
    </div>
  )
}

export default App;
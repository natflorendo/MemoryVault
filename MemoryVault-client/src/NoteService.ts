import type { Note, Tag } from './components/types';
import axios from 'axios';

const HOST = import.meta.env.VITE_API_URL;

export const fetchNotes = async () => {
    const response = await axios.get<Note[]>(`${HOST}/notes`);
    return response.data;
};

export const addNote = async (body: Record<string, any>, tags: string[]) => {
    const response = await axios.post<Note>(`${HOST}/notes`, { body });
    const note = response.data;

    for(const tag of [...tags].reverse()) {
      await axios.post(`${HOST}/notes/${note.id}/tags`, { tag });
    }
};

export const deleteNote = async (id: String) => {
    await axios.delete(`${HOST}/notes/${id}`);
};

export const updateNote = async (note: Note) => {
    await axios.put(`${HOST}/notes/${note.id}`, { body: note.body});
};



export const fetchTags = async () => {
      const response = await axios.get<Tag[]>(`${HOST}/tags`);
      return response.data.sort((a: Tag, b: Tag) => a.name.localeCompare(b.name));
};

export const addTag = async (note: Note, tag: string) => {
    await axios.post<Note>(`${HOST}/notes/${note.id}/tags`, { tag });
};

export const deleteTag = async (note: Note, tag: string) => {
    await axios.delete<Note>(`${HOST}/notes/${note.id}/tags`, { 
      data: { tag },
    });
};
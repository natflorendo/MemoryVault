import type { Note, Tag } from './components/types';
import axios from 'axios';

const HOST = import.meta.env.VITE_API_URL;

export const fetchNotes = async () => {
    try {
        const response = await axios.get<Note[]>(`${HOST}/notes`);
        return response.data;
    } catch (error: any) {
        console.error('Failed to fetch notes:', error);
        throw new Error('Unable to fetch notes. Please try again.');
    }
};

export const addNote = async (body: Record<string, any>, tags: string[]) => {
    try {
        const response = await axios.post<Note>(`${HOST}/notes`, { body });
        const note = response.data;

        for(const tag of [...tags].reverse()) {
            try {
                await axios.post(`${HOST}/notes/${note.id}/tags`, { tag });
            } catch (tagError: any) {
                console.error(`Failed to add tag "${tag}" to note:`, tagError);
            }
        }
    } catch (error: any) {
        console.error('Failed to add note:', error);
        throw new Error('Unable to add note. Please try again.');
    }
};

export const deleteNote = async (id: String) => {
    try {
        await axios.delete(`${HOST}/notes/${id}`);
    } catch (error: any) {
        console.error(`Failed to delete note with ID ${id}:`, error);
        throw new Error('Unable to delete note. Please try again.');
    }
};

export const updateNote = async (note: Note) => {
    try {
        await axios.put(`${HOST}/notes/${note.id}`, { body: note.body});
    } catch (error: any) {
        console.error(`Failed to update note with ID ${note.id}:`, error);
        throw new Error('Unable to update note. Please try again.');
    }
};



export const fetchTags = async () => {
    try {
        const response = await axios.get<Tag[]>(`${HOST}/tags`);
        return response.data.sort((a: Tag, b: Tag) => a.name.localeCompare(b.name));
    } catch (error: any) {
        console.error('Failed to fetch tags:', error);
        throw new Error('Unable to fetch tags. Please try again.');
    }
};

export const addTag = async (note: Note, tag: string) => {
    try {
        await axios.post<Note>(`${HOST}/notes/${note.id}/tags`, { tag });
    } catch (error: any) {
        console.error(`Failed to add tag "${tag}" to note ${note.id}:`, error);
        throw new Error('Unable to add tag. Please try again.');
    }
};

export const deleteTag = async (note: Note, tag: string) => {
    try {
        await axios.delete<Note>(`${HOST}/notes/${note.id}/tags`, { 
            data: { tag },
        });
    } catch (error: any) {
        console.error(`Failed to delete tag "${tag}" from note ${note.id}:`, error);
        throw new Error('Unable to delete tag. Please try again.');
    }
};
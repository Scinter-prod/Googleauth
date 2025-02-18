import { create } from "zustand"
import type { Note, FileTreeItem } from "@/types"

interface NotesState {
  notes: Note[]
  currentNote: Note | null
  fileTree: FileTreeItem[]
  setCurrentNote: (note: Note | null) => void
  addNote: (note: Note) => void
  updateNote: (id: string, content: string) => void
  toggleFolder: (id: string) => void
}

export const useNotesStore = create<NotesState>((set) => ({
  notes: [],
  currentNote: null,
  fileTree: [],
  setCurrentNote: (note) => set({ currentNote: note }),
  addNote: (note) =>
    set((state) => ({
      notes: [...state.notes, note],
      fileTree: [...state.fileTree, { id: note.id, name: note.title, type: "file" }],
    })),
  updateNote: (id, content) =>
    set((state) => ({
      notes: state.notes.map((note) =>
        note.id === id
          ? {
              ...note,
              content,
              updatedAt: new Date().toISOString(),
            }
          : note,
      ),
      currentNote:
        state.currentNote && state.currentNote.id === id
          ? { ...state.currentNote, content, updatedAt: new Date().toISOString() }
          : state.currentNote,
    })),
  toggleFolder: (id) =>
    set((state) => ({
      fileTree: state.fileTree.map((item) =>
        item.id === id && item.type === "folder" ? { ...item, isOpen: !item.isOpen } : item,
      ),
    })),
}))


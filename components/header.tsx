"use client"

import { Search, Bookmark, FolderKanban, Plus, ChevronDown, LayoutGrid } from "lucide-react"
import { useNotesStore } from "@/store/notes"
import { useState } from "react"

export function Header() {
  const { currentNote } = useNotesStore()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen)
  }

  const handleNewNote = () => {
    const newNote = {
      id: Math.random().toString(36).substr(2, 9),
      title: "Untitled " + Math.floor(Math.random() * 1000),
      content: "",
      type: "note" as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    useNotesStore.getState().addNote(newNote)
    useNotesStore.getState().setCurrentNote(newNote)
  }

  return (
    <header className="flex h-12 items-center justify-between border-b border-zinc-800 bg-zinc-900 px-4">
      <div className="flex items-center gap-2">
        <button className="p-1.5 hover:bg-zinc-800 rounded-sm">
          <FolderKanban size={18} />
        </button>
        <button className="p-1.5 hover:bg-zinc-800 rounded-sm" onClick={toggleSearch}>
          <Search size={18} />
        </button>
        <button className="p-1.5 hover:bg-zinc-800 rounded-sm">
          <Bookmark size={18} />
        </button>
      </div>
      <div className="flex items-center">
        <div className="flex items-center gap-1 px-4 py-1 hover:bg-zinc-800 rounded-sm">
          <span>{currentNote?.title || "Untitled"}</span>
          <button className="p-0.5" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <ChevronDown size={16} />
          </button>
        </div>
        <button className="p-1.5 hover:bg-zinc-800 rounded-sm" onClick={handleNewNote}>
          <Plus size={18} />
        </button>
      </div>
      <div className="flex items-center gap-2">
        <button className="p-1.5 hover:bg-zinc-800 rounded-sm">
          <LayoutGrid size={18} />
        </button>
      </div>
      {isSearchOpen && (
        <div className="absolute top-full left-0 w-full bg-zinc-800 p-2">
          <input type="text" placeholder="Search..." className="w-full bg-zinc-700 text-zinc-100 px-2 py-1 rounded" />
        </div>
      )}
    </header>
  )
}


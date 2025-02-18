"use client"

import { Link2, Pencil } from "lucide-react"
import { useNotesStore } from "@/store/notes"

export function StatusBar() {
  const { currentNote } = useNotesStore()

  const wordCount = currentNote?.content.trim().split(/\s+/).length || 0
  const charCount = currentNote?.content.length || 0

  return (
    <footer className="flex h-6 items-center justify-between border-t border-zinc-800 bg-zinc-900 px-4 text-xs text-zinc-400">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
          <Link2 size={12} />
          <span>0 backlinks</span>
        </div>
        <div className="flex items-center gap-1">
          <Pencil size={12} />
          <span>{wordCount} words</span>
          <span>{charCount} characters</span>
        </div>
      </div>
    </footer>
  )
}


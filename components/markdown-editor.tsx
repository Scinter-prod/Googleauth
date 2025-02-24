"use client"

import { useEffect, useState } from "react"
import { useNotesStore } from "@/store/notes"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"

export default function MarkdownEditor() {
  const { currentNote, updateNote } = useNotesStore()
  const [content, setContent] = useState("")

  useEffect(() => {
    if (currentNote) {
      setContent(currentNote.content)
    }
  }, [currentNote])

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value
    setContent(newContent)
    if (currentNote) {
      updateNote(currentNote.id, newContent)
    }
  }

  return (
    <ScrollArea className="h-[calc(100vh-3rem)]">
      <div className="p-4">
        <Textarea
          value={content}
          onChange={handleChange}
          placeholder="Start writing..."
          className="min-h-[calc(100vh-4rem)] resize-none border-none bg-transparent focus-visible:ring-0"
        />
      </div>
    </ScrollArea>
  )
}


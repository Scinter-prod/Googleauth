import { useState } from "react"
import { Tag, X } from "lucide-react"

interface TagInputProps {
  tags: string[]
  onAddTag: (tag: string) => void
  onRemoveTag: (tag: string) => void
}

export function TagInput({ tags = [], onAddTag, onRemoveTag }: TagInputProps) {
  const [newTag, setNewTag] = useState("")

  const handleAddTag = () => {
    if (newTag.trim() !== "" && !tags.includes(newTag.trim())) {
      onAddTag(newTag.trim())
      setNewTag("")
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      {tags.map((tag) => (
        <div key={tag} className="flex items-center bg-zinc-700 text-zinc-200 px-2 py-1 rounded">
          <Tag size={14} className="mr-1" />
          <span>{tag}</span>
          <button onClick={() => onRemoveTag(tag)} className="ml-1 text-zinc-400 hover:text-zinc-200">
            <X size={14} />
          </button>
        </div>
      ))}
      <div className="flex">
        <input
          type="text"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleAddTag()}
          placeholder="Add tag..."
          className="bg-zinc-800 text-zinc-200 px-2 py-1 rounded-l"
        />
        <button onClick={handleAddTag} className="bg-blue-500 text-white px-2 py-1 rounded-r hover:bg-blue-600">
          Add
        </button>
      </div>
    </div>
  )
}


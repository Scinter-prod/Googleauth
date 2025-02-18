import { useState } from "react"
import { Plus, Trash } from "lucide-react"

interface PropertiesEditorProps {
  properties: Record<string, any>
  onUpdateProperties: (properties: Record<string, any>) => void
}

export function PropertiesEditor({ properties = {}, onUpdateProperties }: PropertiesEditorProps) {
  const [newKey, setNewKey] = useState("")
  const [newValue, setNewValue] = useState("")

  const handleAddProperty = () => {
    if (newKey.trim() !== "" && !properties.hasOwnProperty(newKey.trim())) {
      onUpdateProperties({ ...properties, [newKey.trim()]: newValue.trim() })
      setNewKey("")
      setNewValue("")
    }
  }

  const handleRemoveProperty = (key: string) => {
    const { [key]: _, ...rest } = properties
    onUpdateProperties(rest)
  }

  return (
    <div className="mb-4">
      <h3 className="text-lg font-semibold mb-2">Properties</h3>
      {Object.entries(properties).map(([key, value]) => (
        <div key={key} className="flex items-center mb-2">
          <span className="mr-2 font-medium">{key}:</span>
          <input
            type="text"
            value={value}
            onChange={(e) => onUpdateProperties({ ...properties, [key]: e.target.value })}
            className="bg-zinc-800 text-zinc-200 px-2 py-1 rounded flex-grow"
          />
          <button onClick={() => handleRemoveProperty(key)} className="ml-2 text-zinc-400 hover:text-zinc-200">
            <Trash size={14} />
          </button>
        </div>
      ))}
      <div className="flex items-center">
        <input
          type="text"
          value={newKey}
          onChange={(e) => setNewKey(e.target.value)}
          placeholder="New property key"
          className="bg-zinc-800 text-zinc-200 px-2 py-1 rounded mr-2"
        />
        <input
          type="text"
          value={newValue}
          onChange={(e) => setNewValue(e.target.value)}
          placeholder="New property value"
          className="bg-zinc-800 text-zinc-200 px-2 py-1 rounded mr-2"
        />
        <button onClick={handleAddProperty} className="text-zinc-400 hover:text-zinc-200">
          <Plus size={14} />
        </button>
      </div>
    </div>
  )
}


export interface Note {
  id: string
  title: string
  content: string
  type: "note" | "canvas"
  createdAt: string
  updatedAt: string
  tags?: string[]
  links?: string[]
  backlinks?: string[]
  properties?: Record<string, any>
}

export interface FileTreeItem {
  id: string
  name: string
  type: "file" | "folder" | "canvas"
  children?: FileTreeItem[]
  isOpen?: boolean
}


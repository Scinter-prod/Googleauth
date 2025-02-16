"use client"

import { useState } from "react"
import { Share2, Grid2X2, Calendar, Files, ChevronRight, HelpCircle, Settings } from "lucide-react"
import { useNotesStore } from "@/store/notes"
import type { FileTreeItem } from "@/types"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isExpanded, setIsExpanded] = useState(true)
  const { fileTree, currentNote, toggleFolder, setCurrentNote } = useNotesStore()

  const handleFileClick = (item: FileTreeItem) => {
    if (item.type === "folder") {
      toggleFolder(item.id)
    } else {
      const note = useNotesStore.getState().notes.find((n) => n.id === item.id)
      if (note) setCurrentNote(note)
    }
  }

  const renderFileTree = (items: FileTreeItem[]) => {
    return items.map((item) => (
      <div key={item.id} className="ml-2">
        <div
          className={`flex items-center gap-2 px-2 py-1 cursor-pointer hover:bg-zinc-800 rounded-sm ${
            currentNote?.id === item.id ? "bg-zinc-800" : ""
          }`}
          onClick={() => handleFileClick(item)}
        >
          <ChevronRight size={16} className={`transition-transform ${item.isOpen ? "rotate-90" : ""}`} />
          <span>{item.name}</span>
        </div>
        {item.children && item.isOpen && renderFileTree(item.children)}
      </div>
    ))
  }

  return (
    <TooltipProvider>
      <div className={`flex h-full transition-all duration-300 ${isExpanded ? "w-64" : "w-16"}`}>
        <div className="flex w-12 flex-col justify-between border-r border-zinc-800 bg-zinc-900 py-2">
          <div className="flex flex-col gap-4">
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="p-2 hover:bg-zinc-800 rounded-sm transition-colors duration-200">
                  <Files size={20} />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Files</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="p-2 hover:bg-zinc-800 rounded-sm transition-colors duration-200">
                  <Share2 size={20} />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Share</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="p-2 hover:bg-zinc-800 rounded-sm transition-colors duration-200">
                  <Grid2X2 size={20} />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Grid View</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="p-2 hover:bg-zinc-800 rounded-sm transition-colors duration-200">
                  <Calendar size={20} />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Calendar</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <div className="flex flex-col gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="p-2 hover:bg-zinc-800 rounded-sm transition-colors duration-200">
                  <HelpCircle size={20} />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Help</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="p-2 hover:bg-zinc-800 rounded-sm transition-colors duration-200">
                  <Settings size={20} />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Settings</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
        <div
          className={`border-r border-zinc-800 bg-zinc-900 p-2 transition-all duration-300 ${isCollapsed ? "w-0" : "w-60"}`}
        >
          <div className="flex items-center justify-between p-2 border-b border-zinc-800">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1.5 hover:bg-zinc-800 rounded-sm transition-colors"
            >
              <ChevronRight
                size={18}
                className={`transform transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
              />
            </button>
            {isExpanded && <span className="text-sm font-medium">Files</span>}
          </div>
          {isExpanded && <div className="p-2 space-y-1">{renderFileTree(fileTree)}</div>}
        </div>
      </div>
    </TooltipProvider>
  )
}


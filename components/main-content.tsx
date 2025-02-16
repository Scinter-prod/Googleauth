"use client"

import { useState } from "react"
import { useNotesStore } from "@/store/notes"
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels"
import { Maximize2, Minimize2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import dynamic from "next/dynamic"

const DynamicMarkdownEditor = dynamic(() => import("@/components/markdown-editor"), { ssr: false })
const DynamicGraphView = dynamic(() => import("@/components/graph-view"), { ssr: false })

export default function MainContent() {
  const { currentNote } = useNotesStore()
  const [isGraphFullscreen, setIsGraphFullscreen] = useState(false)
  const [isGraphExpanded, setIsGraphExpanded] = useState(false)
  const [markdownContent, setMarkdownContent] = useState("") // State to store markdown content

  


  return (
    <main className="flex-1 overflow-hidden bg-zinc-900">
      <PanelGroup direction="horizontal">
        <Panel defaultSize={50} minSize={25}>
          <Card className="h-full rounded-none border-none">
            <DynamicMarkdownEditor onContentChange={setMarkdownContent} />
          </Card>
        </Panel>
        <PanelResizeHandle className="w-1 bg-zinc-700 hover:bg-zinc-600 transition-colors" />
        <Panel minSize={25}>
          <Card className="h-full rounded-none border-none relative">
            <div className="absolute top-2 right-2 z-10 flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsGraphExpanded(!isGraphExpanded)}
                className="hover:bg-zinc-800"
              >
                {isGraphExpanded ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
              </Button>
            </div>
            <div
              className={`transition-all duration-300 ${isGraphExpanded ? "fixed inset-0 z-50 bg-zinc-900" : "h-full"}`}
            >
              <DynamicGraphView />
            </div>
          </Card>
        </Panel>
      </PanelGroup>
    </main>
  )
}


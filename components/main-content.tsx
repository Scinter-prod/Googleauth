"use client"

import { useState, useEffect } from "react"
import { useNotesStore } from "@/store/notes"
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels"
import { Maximize2, Minimize2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import dynamic from "next/dynamic"
import { TextInput } from "@/components/TextInput"

const DynamicGraphView = dynamic(() => import("@/components/graph-view"), { ssr: false })

export default function MainContent() {
  const { currentNote } = useNotesStore()
  const [isGraphExpanded, setIsGraphExpanded] = useState(false)
  const [streamlitUrl, setStreamlitUrl] = useState("")

  useEffect(() => {
    // Start the Streamlit app when the component mounts
    const startStreamlit = async () => {
      try {
        const response = await fetch("/api/start-streamlit", { method: "POST" })
        const data = await response.json()
        setStreamlitUrl(data.url)
      } catch (error) {
        console.error("Failed to start Streamlit app:", error)
      }
    }
    startStreamlit()
  }, [])

  return (
    <main className="flex-1 overflow-hidden bg-zinc-900">
      <PanelGroup direction="horizontal">
        <Panel defaultSize={50} minSize={25}>
          <Card className="h-full rounded-none border-none">
            <div className="p-4">
              <TextInput />
            </div>
          </Card>
        </Panel>
        <PanelResizeHandle className="w-1 bg-zinc-700 hover:bg-zinc-600 transition-colors" />

        {/* <Panel minSize={25}>
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
              {streamlitUrl ? (
                <iframe src={streamlitUrl} width="100%" height="100%" frameBorder="0" />
              ) : (
                <DynamicGraphView />
              )}
            </div>
          </Card>
        </Panel> */}

      </PanelGroup>
    </main>
  )
}


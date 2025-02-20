"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useNotesStore } from "@/store/notes"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import { Loader2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import axios from 'axios';

interface GraphData {
  entities: string[]
  edges: [string, string][]
  graph_image: string
  entity_count: number
  edge_count: number
}

export function TextInput() {
  const [content, setContent] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [graphData, setGraphData] = useState<GraphData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { currentNote, updateNote } = useNotesStore()

  useEffect(() => {
    if (currentNote) {
      setContent(currentNote.content)
    }
  }, [currentNote])

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value
    setContent(newContent)

    // Live update
    if (currentNote) {
      updateNote(currentNote.id, newContent)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  // const handleSubmit = useCallback(async () => {
  //   if (currentNote) {
  //     updateNote(currentNote.id, content)
  //   }

  //   setIsLoading(true)
  //   setGraphData(null)
  //   setError(null)

  //   // Send text and file to the API
  //   const formData = new FormData()
  //   formData.append("text", content)
  //   if (file) {
  //     formData.append("file", file)
  //   }

  //   try {
  //     const response = await fetch("/api/generate-graph", {
  //       method: "POST",
  //       body: formData,
  //     })

  //     if (!response.ok) {
  //       throw new Error("Network response was not ok")
  //     }

  //     const data: GraphData = await response.json()
  //     setGraphData(data)
  //   } catch (error) {
  //     console.error("Error:", error)
  //     setError("An error occurred while generating the graph. Please try again.")
  //   } finally {
  //     setIsLoading(false)
  //   }
  // }, [content, file, currentNote, updateNote])


  const handlePostRequest = async () => {
    const url = 'https://vm.api.scinter.org/api/submit-text'; // Correct URL without query params
    const data = { text: content };

    try {
      const res = await axios.post(url, data, {
        headers: { 'Content-Type': 'application/json' },
        httpsAgent: new (require('https').Agent)({ rejectUnauthorized: false }) // Disable SSL verification
      });

      console.log("Response received:", res.data);
      setGraphData(res.data);
    } catch (error) {
        if (error.response) {
          console.error('Server responded with:', error.response.data);
        } else if (error.request) {
          console.error('No response received:', error.request);
        } else {
          console.error('Error setting up request:', error.message);
      }
    }
  };
  const handleSubmit = () => { 
    handlePostRequest();
  }
  return (
    <div className="flex flex-row space-x-6">
      {/* Left Side: Inputs and Controls */}
      <div className="flex flex-col space-y-4 w-1/2">
        <Textarea
          value={content}
          onChange={handleContentChange}
          placeholder="Start typing or paste your content here..."
          className="min-h-[200px] p-2 text-sm"
        />
        <div>
          <Label htmlFor="file-upload">Upload a file (optional)</Label>
          <Input id="file-upload" type="file" onChange={handleFileChange} />
        </div>
        <Button onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating Graph...
            </>
          ) : (
            "Generate Graph"
          )}
        </Button>
        {error && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </div>

      {/* Right Side: Graph Visualization */}
      <div className="w-1/2">
        {graphData && (
          <div className="ml-4">
            <h2 className="text-xl font-bold mb-2">Graph Information</h2>
            <p>Entities: {graphData.entity_count}</p>
            <p>Edges: {graphData.edge_count}</p>
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Graph Visualization</h3>
              <Image
                src={`data:image/png;base64,${graphData.graph_image}`}
                alt="Graph Visualization"
                width={500}
                height={500}
                layout="responsive"
              />
            </div>
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Entities</h3>
              <ul className="list-disc pl-5">
                {graphData.entities.map((entity, index) => (
                  <li key={index}>{entity}</li>
                ))}
              </ul>
            </div>
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Edges</h3>
              <ul className="list-disc pl-5">
                {graphData.edges.map(([from, to], index) => (
                  <li key={index}>
                    {from} → {to}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  )

}


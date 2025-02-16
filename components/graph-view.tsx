"use client"

import { useEffect, useRef } from "react"
import { useNotesStore } from "@/store/notes"
import { Network } from "vis-network/standalone"
import { DataSet } from "vis-data/standalone"

export default function GraphView() {
  const { notes } = useNotesStore()
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const nodes = new DataSet(
      notes.map((note) => ({
        id: note.id,
        label: note.title,
        color: {
          background: "#4c1d95",
          border: "#6d28d9",
          highlight: {
            background: "#5b21b6",
            border: "#7c3aed",
          },
        },
      })),
    )

    const edges = new DataSet(
      notes.flatMap((note) => {
        const links = note.content.match(/\[\[(.*?)\]\]/g) || []
        return links
          .map((link) => {
            const title = link.slice(2, -2)
            const targetNote = notes.find((n) => n.title === title)
            return targetNote
              ? {
                  from: note.id,
                  to: targetNote.id,
                  color: { color: "#6b7280", opacity: 0.5 },
                  width: 1,
                }
              : null
          })
          .filter(Boolean)
      }),
    )

    const options = {
      nodes: {
        shape: "dot",
        size: 16,
        font: {
          color: "#f3f4f6",
          size: 14,
        },
        borderWidth: 2,
        shadow: {
          enabled: true,
          color: "rgba(0,0,0,0.2)",
          size: 7,
          x: 2,
          y: 2,
        },
      },
      edges: {
        smooth: {
          type: "continuous",
        },
        arrows: {
          to: { enabled: true, scaleFactor: 0.5 },
        },
      },
      physics: {
        enabled: true,
        barnesHut: {
          gravitationalConstant: -2000,
          centralGravity: 0.3,
          springLength: 200,
          springConstant: 0.04,
          damping: 0.09,
          avoidOverlap: 0.1,
        },
      },
      interaction: {
        hover: true,
        tooltipDelay: 200,
      },
    }

    const network = new Network(containerRef.current, { nodes, edges }, options)

    return () => {
      network.destroy()
    }
  }, [notes])

  return <div ref={containerRef} className="w-full h-full" />
}


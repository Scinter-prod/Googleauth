"use client"

import { useEffect, useRef } from "react"
import { Network } from "vis-network/standalone"
import { DataSet } from "vis-data/standalone"

const KnowledgeGraph = () => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const nodes = new DataSet([
      { id: 1, label: "Node 1" },
      { id: 2, label: "Node 2" },
      { id: 3, label: "Node 3" },
    ])

    const edges = new DataSet([
      { from: 1, to: 2 },
      { from: 1, to: 3 },
    ])

    const data = { nodes, edges }

    const options = {
      nodes: {
        shape: "dot",
        size: 16,
        font: {
          size: 12,
          color: "#ffffff",
        },
        borderWidth: 2,
        color: {
          border: "#9333ea",
          background: "#4c1d95",
        },
      },
      edges: {
        width: 1,
        color: { color: "#6b7280", opacity: 0.5 },
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
    }

    const network = new Network(containerRef.current, data, options)

    return () => {
      network.destroy()
    }
  }, [])

  return <div ref={containerRef} className="w-full h-full bg-zinc-900" />
}

export default KnowledgeGraph


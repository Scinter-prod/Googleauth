import { Configuration, OpenAIApi } from "openai"
import * as d3 from "d3"
import { JSDOM } from "jsdom"
import { svg2png } from "svg2png-converter"
import { logger } from "./logger"

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})
const openai = new OpenAIApi(configuration)

export async function generateGraph(text: string) {
  try {
    // Use OpenAI to extract entities and relationships
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that extracts entities and their relationships from text.",
        },
        {
          role: "user",
          content: `Extract entities and their relationships from the following text. Return the result as a JSON object with 'entities' and 'edges' keys. 'entities' should be an array of strings, and 'edges' should be an array of arrays, where each inner array contains two strings representing a relationship.\n\nText: ${text}`,
        },
      ],
    })

    const result = JSON.parse(completion.data.choices[0].message?.content || '{"entities":[],"edges":[]}')

    // Generate graph visualization
    const graphImage = await generateGraphVisualization(result.entities, result.edges)

    logger.info("Graph generated successfully", { entityCount: result.entities.length, edgeCount: result.edges.length })

    return {
      entities: result.entities,
      edges: result.edges,
      graph_image: graphImage,
      entity_count: result.entities.length,
      edge_count: result.edges.length,
    }
  } catch (error) {
    logger.error("Error in generateGraph", { error })
    throw error
  }
}

async function generateGraphVisualization(entities: string[], edges: [string, string][]) {
  try {
    const dom = new JSDOM("<!DOCTYPE html><html><body></body></html>")
    const document = dom.window.document

    const svg = d3.select(document.body).append("svg").attr("width", 800).attr("height", 600)

    const simulation = d3
      .forceSimulation(entities.map((d) => ({ id: d })))
      .force(
        "link",
        d3.forceLink(edges.map((d) => ({ source: d[0], target: d[1] }))).id((d: any) => d.id),
      )
      .force("charge", d3.forceManyBody())
      .force("center", d3.forceCenter(400, 300))

    const link = svg
      .append("g")
      .selectAll("line")
      .data(edges)
      .enter()
      .append("line")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", 2)

    const node = svg
      .append("g")
      .selectAll("circle")
      .data(entities)
      .enter()
      .append("circle")
      .attr("r", 5)
      .attr("fill", "#69b3a2")

    const text = svg
      .append("g")
      .selectAll("text")
      .data(entities)
      .enter()
      .append("text")
      .text((d) => d)
      .attr("font-size", 10)
      .attr("dx", 8)
      .attr("dy", 3)

    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y)

      node.attr("cx", (d: any) => d.x).attr("cy", (d: any) => d.y)

      text.attr("x", (d: any) => d.x).attr("y", (d: any) => d.y)
    })

    // Convert SVG to base64-encoded PNG
    const svgString = dom.window.document.body.innerHTML
    const svgBuffer = Buffer.from(svgString)
    const pngBuffer = await svg2png(svgBuffer)
    return pngBuffer.toString("base64")
  } catch (error) {
    logger.error("Error in generateGraphVisualization", { error })
    throw error
  }
}


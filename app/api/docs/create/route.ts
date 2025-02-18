import { google } from "googleapis"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { noteId, content } = await req.json()
    const auth = new google.auth.GoogleAuth({
      credentials: JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS || ""),
      scopes: ["https://www.googleapis.com/auth/drive.file"],
    })

    const drive = google.drive({ version: "v3", auth })

    const response = await drive.files.create({
      requestBody: {
        name: `Note ${noteId}`,
        mimeType: "application/vnd.google-apps.document",
      },
      media: {
        mimeType: "text/plain",
        body: content,
      },
    })

    return NextResponse.json({ docId: response.data.id })
  } catch (error) {
    console.error("Error creating Google Doc:", error)
    return NextResponse.json({ error: "Failed to create Google Doc" }, { status: 500 })
  }
}


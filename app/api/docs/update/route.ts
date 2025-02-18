import { google } from "googleapis"
import { NextResponse } from "next/server"

export async function PUT(req: Request) {
  try {
    const { noteId, content } = await req.json()
    const auth = new google.auth.GoogleAuth({
      credentials: JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS || ""),
      scopes: ["https://www.googleapis.com/auth/drive.file"],
    })

    const drive = google.drive({ version: "v3", auth })
    const docs = google.docs({ version: "v1", auth })

    // First, find the Google Doc ID associated with this note
    const files = await drive.files.list({
      q: `name = 'Note ${noteId}'`,
      fields: "files(id)",
    })

    if (files.data.files && files.data.files.length > 0) {
      const docId = files.data.files[0].id

      // Update the Google Doc content
      await docs.documents.batchUpdate({
        documentId: docId,
        requestBody: {
          requests: [
            {
              replaceAllText: {
                containsText: {
                  text: "*",
                  matchCase: false,
                },
                replaceText: content,
              },
            },
          ],
        },
      })

      return NextResponse.json({ message: "Google Doc updated successfully" })
    } else {
      return NextResponse.json({ error: "Google Doc not found" }, { status: 404 })
    }
  } catch (error) {
    console.error("Error updating Google Doc:", error)
    return NextResponse.json({ error: "Failed to update Google Doc" }, { status: 500 })
  }
}


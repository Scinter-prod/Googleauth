import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { token, title, content } = await req.json();

    // Step 1: Create a new Google Doc
    const createResponse = await fetch("https://docs.googleapis.com/v1/documents", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title }),
    });

    if (!createResponse.ok) {
      throw new Error("Failed to create Google Doc");
    }

    const doc = await createResponse.json();

    // Step 2: Update the document with the provided content
    const updateResponse = await fetch(`https://docs.googleapis.com/v1/documents/${doc.documentId}:batchUpdate`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        requests: [
          {
            insertText: {
              location: {
                index: 1,
              },
              text: content,
            },
          },
        ],
      }),
    });

    if (!updateResponse.ok) {
      throw new Error("Failed to update Google Doc with content");
    }

    return NextResponse.json(doc);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
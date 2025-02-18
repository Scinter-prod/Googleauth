const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export async function fetchNotes() {
  const response = await fetch(`${API_URL}/notes`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  })
  if (!response.ok) {
    throw new Error("Failed to fetch notes")
  }
  return response.json()
}

export async function createNote(note: { title: string; content: string }) {
  const response = await fetch(`${API_URL}/notes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(note),
  })
  if (!response.ok) {
    throw new Error("Failed to create note")
  }
  return response.json()
}

// Add other API calls (updateNote, deleteNote, etc.) following the same pattern


const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export async function signIn(username: string, password: string) {
  const response = await fetch(`${API_URL}/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      username: username,
      password: password,
    }),
  })
  if (!response.ok) {
    throw new Error("Authentication failed")
  }
  const data = await response.json()
  localStorage.setItem("token", data.access_token)
  return data
}

export function signOut() {
  localStorage.removeItem("token")
}

export async function getCurrentUser() {
  const token = localStorage.getItem("token")
  if (!token) {
    return null
  }
  const response = await fetch(`${API_URL}/users/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  if (!response.ok) {
    localStorage.removeItem("token")
    return null
  }
  return response.json()
}


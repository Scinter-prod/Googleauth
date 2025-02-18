import { google } from "googleapis"

const SCOPES = ["https://www.googleapis.com/auth/documents"]

export const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/callback/google`,
)

export const getAuthUrl = () => {
  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
  })
}

export const createDocument = async (token: string, title: string) => {
  oauth2Client.setCredentials({ access_token: token })

  const docs = google.docs({ version: "v1", auth: oauth2Client })

  try {
    const res = await docs.documents.create({
      requestBody: {
        title: title,
      },
    })
    return res.data
  } catch (error) {
    console.error("Error creating document:", error)
    throw error
  }
}


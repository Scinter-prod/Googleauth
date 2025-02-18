import { type NextRequest, NextResponse } from "next/server"
import { oauth2Client } from "@/utils/googleDocsApi"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get("code")

  if (code) {
    try {
      const { tokens } = await oauth2Client.getToken(code)
      oauth2Client.setCredentials(tokens)

      // Redirect to the main page with the access token
      // In a production app, you'd want to store this securely, not in a URL
      return NextResponse.redirect(new URL(`/?access_token=${tokens.access_token}`, request.url))
    } catch (error) {
      console.error("Error getting tokens:", error)
      return NextResponse.json({ error: "Failed to authenticate" }, { status: 500 })
    }
  } else {
    return NextResponse.json({ error: "No code provided" }, { status: 400 })
  }
}


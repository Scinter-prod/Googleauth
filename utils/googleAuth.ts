// import { google } from "googleapis";

// const SCOPES = [
//   "https://www.googleapis.com/auth/documents",
//   "https://www.googleapis.com/auth/documents.readonly",
//   "https://www.googleapis.com/auth/drive",
//   "https://www.googleapis.com/auth/drive.file",
//   "https://www.googleapis.com/auth/userinfo.profile",
//   "https://www.googleapis.com/auth/userinfo.email",
// ];

// export const oauth2Client = new google.auth.OAuth2(
//   process.env.GOOGLE_CLIENT_ID,
//   process.env.GOOGLE_CLIENT_SECRET,
//   `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/callback/google`
// );

// export const getAuthUrl = () => {
//   return oauth2Client.generateAuthUrl({
//     access_type: "offline",
//     scope: SCOPES,
//     include_granted_scopes: true,
//   });

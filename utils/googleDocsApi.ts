import { google } from "googleapis";
// import { oauth2Client } from "./googleAuth";

export const createDocument = async (token: string, title: string) => {
  oauth2Client.setCredentials({ access_token: token });

  const docs = google.docs({ version: "v1", auth: oauth2Client });

  try {
    const res = await docs.documents.create({
      requestBody: {
        title: title,
      },
    });
    return res.data;
  } catch (error) {
    console.error("Error creating document:", error);
    throw error;
  }
};
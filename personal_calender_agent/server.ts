import express from "express";
import { google } from "googleapis";

const app = express();

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URL,
);

app.get("/auth", (req, res) => {
  const scopes = ["https://www.googleapis.com/auth/calendar"];

  const url = oauth2Client.generateAuthUrl({
    // 'online' (default) or 'offline' (gets refresh_token)
    access_type: "offline",
    prompt: "consent",
    // If you only need one scope, you can pass it as a string
    scope: scopes,
  });

  console.log("URL", url);
  res.redirect(url);
});

app.get("/callback", async (req, res) => {
  const code = req.query.code as string;

  const { tokens } = await oauth2Client.getToken(code);
  console.log("Tokens", tokens);

  res.send("Connected.");
});

app.listen(process.env.PORT, () => {
  console.log("Server has been started successfuly..");
});

const express = require("express");
const axios = require("axios");
const qs = require("qs");
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Replace with your details
const CLIENT_ID = `${ process.env.ZOHO_CLIENT_ID }`;
const CLIENT_SECRET = `${ process.env.ZOHO_CLIENT_SECRET }`;
const REDIRECT_URI = `${ process.env.ZOHO_REDIRECT_URI }`;
const ZOHO_DOMAIN = `${ process.env.ZOHO_DOMAIN }`;
const PEOPLE_API = `${ process.env.PEOPLE_API }`;

let accessToken = "";
let refreshToken = "";

// Step 1: Redirect user to Zoho OAuth
app.get("/auth", (req, res) => {
  // const authUrl = `${ZOHO_DOMAIN}/oauth/v2/auth?scope=ZohoPeople.timesheets.READ,ZohoPeople.timesheets.WRITE&client_id=${CLIENT_ID}&response_type=code&access_type=offline&redirect_uri=${REDIRECT_URI}`;
  const authUrl = `${ZOHO_DOMAIN}/oauth/v2/auth?scope=ZohoPeople.timecards.READ,ZohoPeople.timecards.CREATE&client_id=${CLIENT_ID}&response_type=code&access_type=offline&redirect_uri=${REDIRECT_URI}`;

  res.redirect(authUrl);
});

// Step 2: Handle OAuth Callback
app.get("/auth/callback", async (req, res) => {
  const code = req.query.code;
  try {
    const tokenRes = await axios.post(
      `${ZOHO_DOMAIN}/oauth/v2/token`,
      qs.stringify({
        grant_type: "authorization_code",
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
        code
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );
    accessToken = tokenRes.data.access_token;
    refreshToken = tokenRes.data.refresh_token;
    res.send("✅ Authentication successful! You can now call /timesheets");
  } catch (err) {
    res.status(500).send(err.response?.data || err.message);
  }
});

// Step 3: Call Zoho People Timesheet API
app.get("/timesheets", async (req, res) => {
  if (!accessToken) return res.send("⚠️ Please authenticate via /auth first");

  try {
    const result = await axios.get(
      `${PEOPLE_API}/timetracker/gettimesheet`,
      { headers: { Authorization: `Zoho-oauthtoken ${accessToken}` } }
    );
    res.json(result.data);
  } catch (err) {
    res.status(500).send(err.response?.data || err.message);
  }
});

app.listen(process.env.PORT, () => console.log(`🚀 Server running on http://localhost:${process.env.PORT}`));

import axios from "axios";
import qs from "qs";
import dotenv from "dotenv";
import {
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI,
  ZOHO_DOMAIN
} from "../config/config.js";

dotenv.config();

let accessToken = "";
let refreshToken = "";

export async function authenticate(req, res) {
  const scopes = ["ZohoPeople.timetracker.ALL", "ZohoPeople.forms.ALL", "ZohoPeople.employee.ALL"].join(",");
  const authUrl = `${ZOHO_DOMAIN}/oauth/v2/auth?scope=${scopes}&client_id=${CLIENT_ID}&response_type=code&access_type=offline&redirect_uri=${REDIRECT_URI}&prompt=consent`;
  res.redirect(authUrl);
};

export async function oauthCallback(req, res) {
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
    res.send({
      success: true,
      message: "Authentication successful! You can now call zoho APIs",
      data: {
        accessToken,
        refreshToken
      }
    });
  } catch (err) {
    res.status(500).send(err.response?.data || err.message);
  }
};

export async function refreshAccessToken() {
  if (!refreshToken) {
    throw new Error("No refresh token available. Please re-authenticate.");
  }

  try {
    const refreshRes = await axios.post(
      `${ZOHO_DOMAIN}/oauth/v2/token`,
      qs.stringify({
        grant_type: "refresh_token",
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        refresh_token: refreshToken
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    accessToken = refreshRes.data.access_token;
    console.log("Access token refreshed successfully!");
    return accessToken;
  } catch (err) {
    console.error("Failed to refresh access token:", err.response?.data || err.message);
    throw err;
  }
}

export function getAccessToken() {
  return accessToken;
}
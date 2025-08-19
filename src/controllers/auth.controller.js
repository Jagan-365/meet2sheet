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
  const scopes = ["ZOHOPEOPLE.timetracker.ALL", "ZOHOPEOPLE.forms.ALL", "ZOHOPEOPLE.employee.ALL"].join(",");
  const authUrl = `${ZOHO_DOMAIN}/oauth/v2/auth?scope=${scopes}&client_id=${CLIENT_ID}&response_type=code&access_type=offline&redirect_uri=${REDIRECT_URI}`;
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
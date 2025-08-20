import { getAccessToken, refreshAccessToken } from "../controllers/auth.controller.js";

export async function authenticateToken(req, res, next) {
  try {
    let token = req.headers.authorization?.replace("Zoho-oauthtoken ", "") || getAccessToken();

    if (!token) {
      return res.status(401).json({ message: "Token missing. Please authenticate first." });
    }

    req.accessToken = token;
    next();
  } catch (err) {
    if (err.response?.status === 401) {
      try {
        const newToken = await refreshAccessToken();
        req.accessToken = newToken;
        console.log("Access token refreshed successfully.");
        next();
      } catch (refreshErr) {
        res.status(403).json({ message: "Token expired and refresh failed. Please re-authenticate." });
      }
    } else {
      res.status(403).json({ message: "Invalid token", error: err.message });
    }
  }
}

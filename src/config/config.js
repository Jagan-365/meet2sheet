import dotenv from "dotenv";
dotenv.config();

const CLIENT_ID = `${ process.env.ZOHO_CLIENT_ID }`;
const CLIENT_SECRET = `${ process.env.ZOHO_CLIENT_SECRET }`;
const REDIRECT_URI = `${ process.env.ZOHO_REDIRECT_URI }`;
const ZOHO_DOMAIN = `${ process.env.ZOHO_DOMAIN }`;
const PEOPLE_API = `${ process.env.PEOPLE_API }`;

export {
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI,
  ZOHO_DOMAIN,
  PEOPLE_API
};

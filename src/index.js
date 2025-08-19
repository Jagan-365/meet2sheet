import express from"express";
import routes from "./routes/index.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 3003;
app.use(express.json()); // parses JSON body
app.use(express.urlencoded({ extended: true })); // for form-urlencoded payloads

app.use('/api', routes);

app.listen(port, async () => {
  try {
    console.log(`Server is running on http://localhost:${port}`);
  } catch (error) {
    console.log('Unable to connect to the server:', error);
  }
});

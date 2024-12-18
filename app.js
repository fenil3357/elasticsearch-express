import express from "express";
import * as dotenv from 'dotenv'
import cors from 'cors'
import morgan from "morgan";

import client from "./config/elasticsearch.config.js";

dotenv.config();

const PORT = process.env.PORT || 3030;
const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json({
  limit: '50mb'
}));

app.listen(PORT, async () => {
  try {
    await client.ping();
    console.log(`Server is listening on port ${PORT}...`)
  } catch (error) {
    console.log("🚀 ~ Something went wrong ~ error:", error);
    process.exit(1);
  }
})
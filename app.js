import express from "express";
import * as dotenv from 'dotenv'
import cors from 'cors'
import morgan from "morgan";

import client from "./config/elasticsearch.config.js";

import productRouter from "./routes/product.routes.js";
import searchRouter from "./routes/search.routes.js";
import analyticsRouter from "./routes/analytics.routes.js";
import geoSpatialRouter from "./routes/geospatial.routes.js";

dotenv.config();

const PORT = process.env.PORT || 3030;
const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json({
  limit: '50mb'
}));

app.use('/api/products', productRouter);
app.use('/api/search', searchRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/geo', geoSpatialRouter);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

app.listen(PORT, async () => {
  try {
    await client.ping();
    console.log(`Server is listening on port ${PORT}...`)
  } catch (error) {
    console.log("🚀 ~ Something went wrong ~ error:", error);
    process.exit(1);
  }
})
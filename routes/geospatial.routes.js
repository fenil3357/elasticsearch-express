import { Router } from "express";
import { coverageAnalysisController, nearbyProductsController } from "../controllers/geospatial.controller.js";

const geoSpatialRouter = Router();

geoSpatialRouter.get('/nearby', nearbyProductsController);
geoSpatialRouter.get('/coverage-analysis', coverageAnalysisController);

export default geoSpatialRouter;
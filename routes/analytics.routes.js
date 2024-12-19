import { Router } from "express";
import { categoryStatsController, popularProductsController, pricesDistributionController, trendingProductsController } from "../controllers/analytics.controller.js";

const analyticsRouter = Router();

analyticsRouter.get('/popular-products', popularProductsController);
analyticsRouter.get('/category-stats', categoryStatsController);
analyticsRouter.get('/price-distribution', pricesDistributionController);
analyticsRouter.get('/trending-products', trendingProductsController);

export default analyticsRouter;
import { Router } from "express";

import { personalizedRecommendationsController, similarProductsController } from "../controllers/recommendations.controller.js";

const recommendationsRouter = Router();

recommendationsRouter.get('/similar/:id', similarProductsController)
recommendationsRouter.post('/personalized', personalizedRecommendationsController);

export default recommendationsRouter;
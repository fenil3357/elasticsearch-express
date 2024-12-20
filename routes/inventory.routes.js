import { Router } from "express";
import { inventoryForecastController, inventoryInsightsController, lowStockAlertController } from "../controllers/inventory.controller.js";

const inventoryRouter = Router();

inventoryRouter.get('/low-stock', lowStockAlertController);
inventoryRouter.get('/insights', inventoryInsightsController)
inventoryRouter.get('/forecast/:id', inventoryForecastController);

export default inventoryRouter;
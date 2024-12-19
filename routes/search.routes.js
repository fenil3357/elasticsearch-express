import { Router } from "express";

import { advancedSearchController, autoCompleteSearchController, basicSearchController, facetedSearchController } from "../controllers/search.controller.js";

const searchRouter = Router();

searchRouter.get('/basic', basicSearchController)
searchRouter.post('/advanced', advancedSearchController)
searchRouter.get('/autocomplete', autoCompleteSearchController)
searchRouter.post('/faceted', facetedSearchController);

export default searchRouter;
import { Router } from "express";
import { bulkIndexProductsController, createProductIndexController, deleteProductController, updateProductController } from "../controllers/product.controller.js";

const productRouter = Router();

productRouter.post('/create-index', createProductIndexController);
productRouter.post('/bulk-index', bulkIndexProductsController)
productRouter.put('/:id', updateProductController)
productRouter.delete('/:id', deleteProductController);

export default productRouter;

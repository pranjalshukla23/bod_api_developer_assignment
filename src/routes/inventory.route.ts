import { Router } from 'express';
import { inventoryControllers } from '../controllers/inventory.controller';
import { limiter } from '../middlewares/middleware';

export const inventoryRoutes = Router();

inventoryRoutes.get('/', inventoryControllers.getAllInventory);
inventoryRoutes.get('/:sku', inventoryControllers.getInventory);
inventoryRoutes.post('/', limiter, inventoryControllers.syncInventory);

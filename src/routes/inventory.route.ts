import { Router } from 'express';
import { inventoryControllers } from '../controllers/inventory.controller';
import { limiter } from '../middlewares/middleware';

export const inventoryRoutes = Router();

/**
 * @swagger
 * /inventory:
 *   get:
 *     summary: Get all inventory items
 *     responses:
 *       200:
 *         description: List of all inventory items
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 skuItems:
 *                   - id: 1
 *                     sku: "ABC-1234"
 *                     quantity: 50
 *                     location: "Warehouse-A"
 *                     lastUpdated: "2025-09-08T22:49:28.448Z"
 *                   - id: 3
 *                     sku: "XYZ-5678"
 *                     quantity: 100
 *                     location: "Warehouse-B"
 *                     lastUpdated: "2025-09-08T22:49:28.611Z"
 *                   - id: 5
 *                     sku: "LMN-9999"
 *                     quantity: 5
 *                     location: "Warehouse-A"
 *                     lastUpdated: "2025-09-08T22:50:34.166Z"
 */
inventoryRoutes.get('/', inventoryControllers.getAllInventory);
/**
 * @swagger
 * /inventory/{sku}:
 *   get:
 *     summary: Get inventory by SKU (Stock Keeping Unit)
 *     parameters:
 *       - in: path
 *         name: sku
 *         required: true
 *         schema:
 *           type: string
 *         description: Stock Keeping Unit
 *     responses:
 *       200:
 *         description: Inventory item found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 sku: "XYZ-5678"
 *                 quantity: 100
 *                 location: "Warehouse-B"
 *                 lastUpdated: "2025-09-08T22:49:28.611Z"
 */
inventoryRoutes.get('/:sku', inventoryControllers.getInventory);
/**
 * @swagger
 * /inventory/sync:
 *   post:
 *     summary: Sync inventory items from external WMS to database
 *     requestBody:
 *       description: Optional provider and SKU list to sync specific items
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               provider:
 *                 type: string
 *                 example: "mock-wms"
 *               skuList:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["ABC-1234", "XYZ-5678"]
 *     responses:
 *       200:
 *         description: Sync completed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 synced: 2
 *                 errors: []
 *                 timestamp: "2025-08-01T13:45:00Z"
 */
inventoryRoutes.post('/', limiter, inventoryControllers.syncInventory);

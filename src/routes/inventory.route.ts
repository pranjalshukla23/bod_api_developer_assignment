import { Router } from "express";
import { inventoryControllers } from "../controllers/inventory.controller";

export const inventoryRoutes = Router();

inventoryRoutes.get("/", inventoryControllers.getAllInventory)
inventoryRoutes.get("/:sku", inventoryControllers.getInventory)
inventoryRoutes.post("/", inventoryControllers.createInventory)
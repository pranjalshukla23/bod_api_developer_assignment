import type { Request, Response } from "express"
import { prisma } from "../lib/prisma"
import { isValidSku } from "../utils/validation"
import { Inventory, InventorySyncRequest } from "../types/inventory"
import { loadAllWMSData } from "../utils/dataLoader"

export const inventoryControllers = {
    getAllInventory: async(req: Request, res: Response) => {
        try {

            console.log("Retreiving all sku items from the database...")

            // get all sku items from the db
            const skuItems = await prisma.inventory.findMany({})
            if(!skuItems) return res.status(404).json({
                success: false,
                message: "Inventory items not found!"
            })

            res.status(200).json({
                success: true,
                skuItems
            })
            
        } catch (error) {
            console.error("Internal server error while fetching inventory item")
            res.status(500).json({
                message: "Internal server error while fetching inventory item"
            })
        }
    },
    getInventory: async(req: Request, res: Response) => {
        try {

            const {sku} = req.params

            // if sku is not passed in params
            if(!sku) {
                return res.status(400).json({
                    message: "SKU is required"
                })
            }

            // ifsku is not in alphanumeric format
            if(!isValidSku(sku)) {
                return res.status(400).json({
                    message: "SKU format is invalid"
                })
            }

            console.log(`fetching items from db with sku: ${sku}... `)
            // fetch sku item which matches the sku 
            const skuItem = await prisma.inventory.findUnique({
                where: {
                    sku
                }
            })

            // if sku is not found in db
            if(!skuItem) {
                return res.status(404).json({
                    message: "SKU not found in database"
                })
            }

        res.status(200).json({
            skuItem
        })
    
        } catch (error) {
            console.error("Internal server error while fetching inventory item")
            res.status(500).json({
                message: "Internal server error while fetching inventory item"
            })
        }
    },
    syncInventory: async(req: Request, res: Response) => {
        try {
            let wmsItemsToSync: Inventory[] = []
            // fetch all sku items from wms if provider or skillset is not passed
            if(!req.body) {
                wmsItemsToSync = loadAllWMSData()
            }

            const {provider, skuList} = req.body as InventorySyncRequest
            
            
            
        } catch (error) {
            console.error("Internal server error while syncing inventory items", error)
            res.status(500).json({
                message: "Internal server error while syncing inventory items",
                error
            })
        }
    },
}
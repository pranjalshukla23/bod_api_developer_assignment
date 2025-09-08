import type { Request, Response, NextFunction } from "express"
import { prisma } from "../lib/prisma"
import { isValidSku } from "../utils/validation"
import { Inventory, InventoryParams, InventorySyncRequest } from "../types/inventory"
import { loadAllWMSData, loadWMSData } from "../utils/dataLoader"

export const inventoryControllers = {
    getAllInventory: async(req: Request, res: Response, next: NextFunction) => {
        try {

            console.log("Retreiving inventory information for all SKU from the database...")

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
            console.error("Error detected while fetching inventory information from db...", error)
            next(error)
        }
    },
    getInventory: async(req: Request<InventoryParams>, res: Response, next: NextFunction) => {
        try {

            const {sku} = req.params

            // if sku is not passed in params
            if(!sku) {
                return res.status(400).json({
                    message: "SKU is required"
                })
            }

            // if sku is not in alphanumeric format
            if(!isValidSku(sku)) {
                return res.status(400).json({
                    message: "SKU format is invalid"
                })
            }

            console.log(`fetching inventory information from db for SKU: ${sku}... `)
            
            // fetch sku item which matches the sku 
            const skuItem = await prisma.inventory.findUnique({
                where: {
                    sku
                }
            })

            // if sku is not found in db
            if(!skuItem) {
                return res.status(404).json({
                    message: `SKU ${sku} not found in database`
                })
            }

        res.status(200).json({skuItem})
    
        } catch (error) {
           console.error("Error detected while fetching inventory information from db...", error)
           next(error)
        }
    },
    syncInventory: async(req: Request, res: Response, next: NextFunction) => {
        try {

            let wmsItemsToSync: Inventory[] = []
            let {provider, skuList} = req.body as InventorySyncRequest || {}
            let responseMessage = {}

            // get inventory information for all SKU items
            if(!req.body || Object.keys(req.body).length === 0) {
                wmsItemsToSync = loadAllWMSData()

            } else {
                // if provider is not passed
                if(!provider) {
                    return res.status(400).json({
                        message: "skuList is required and it needs to be a non-empty array"
                    })
                }
                // if skuList is empty or is not an array
                if(skuList?.length === 0 || !Array.isArray(skuList)) {
                    return res.status(400).json({
                        message: "skuList is required and it needs to be a non-empty array"
                    })
                }

                //get the matching SKUs
                wmsItemsToSync = loadWMSData(skuList, provider)
            }

            let syncedRecordsCount = 0
            const errorRecordsList: string[] = []

            // sync items in db
            console.log(`process to sync items in db started...`)
            for(const item of wmsItemsToSync) {
                try {
                    await prisma.inventory.upsert({
                        create: {
                            sku: item.sku,
                            quantity: item.quantity,
                            location: item.location,
                            lastUpdated: new Date()
                        },
                        update: {
                            quantity: item.quantity,
                            location: item.location,
                            lastUpdated: new Date()
                        },
                        where: {
                            sku: item.sku
                        }
                    })
                        syncedRecordsCount ++
                } catch (error) {
                    console.error(`Error while syncing SKU ${item.sku}`)
                    errorRecordsList.push(`Error updating SKU ${item.sku}`)
                }
            }
            console.log(`process to sync items in db completed...`)

            //scenrio: where wms doesn't contain the sku item passed in the request
            const wmsSkusList = new Set(wmsItemsToSync.map(w => w.sku));
            if(skuList) {
                const itemsNotFound = skuList.filter((sku: string) => !wmsSkusList.has(sku))
                console.log(itemsNotFound)
                for (const item of itemsNotFound) {
                    errorRecordsList.push(`SKU ${item} not found in wms`)
                }
            }
            responseMessage = {
                synced: syncedRecordsCount,
                errors: errorRecordsList,
                timestamp: new Date().toISOString()
            }

            //check for failures in syncing
            if(syncedRecordsCount === 0 && errorRecordsList.length > 0) {
                return res.status(500).json(responseMessage)
            }
                
            return res.status(200).json(responseMessage)
            
        } catch (error) {
            console.error("Error detected while syncing inventory...", error)
            next(error)
        }
    },
}

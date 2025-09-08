import path from "path"
import fs from "fs"
import { Inventory } from "../types/inventory"

const filePath = path.join(__dirname, "../data/mockedData.json")

export const loadAllWMSData = (): Inventory[] => {

    const fileData = fs.readFileSync(filePath, "utf-8")

    return JSON.parse(fileData)

}

export const loadWMSData = (skuList: string[], provider: string): Inventory[] => {

    const fileData = fs.readFileSync(filePath, "utf-8")
    const jsonData = JSON.parse(fileData)

    return jsonData.filter((item: Inventory) => skuList.includes(item.sku))

}
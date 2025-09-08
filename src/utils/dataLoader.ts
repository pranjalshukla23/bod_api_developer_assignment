import path from "path"
import fs from "fs"
import { Inventory } from "../types/inventory"

export const loadAllWMSData = (): Inventory[] => {

    const filePath = path.join(__dirname, "../data/mockedData.json")
    const fileData = fs.readFileSync(filePath, "utf-8")

    return JSON.parse(fileData)

}
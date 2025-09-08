export interface Inventory {
  sku: string,
  quantity: number
  location: string
  lastUpdated: string
}

export interface InventorySyncRequest {
  provider?: string;          // optional string
  skuList?: string[];         // optional array of SKUs
}
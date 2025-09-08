export interface Inventory {
  sku: string;
  quantity: number;
  location: string;
  lastUpdated: string;
}

export interface InventoryParams {
  sku: string;
}

export interface InventorySyncRequest {
  provider?: string; //  provider name
  skuList?: string[]; // array of SKUs
}

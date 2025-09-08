export const isValidSku = (sku: string): boolean => /^[a-zA-Z0-9\-]+$/.test(sku);

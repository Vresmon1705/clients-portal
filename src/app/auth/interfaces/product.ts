export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    quantity: number;
    images?: string[];
    videos?: string[];
    itemNumber?: string;
    itemType?: string;
    color?: string;
    pattern?: string;
    inventoryItemStatusCode?: string;
    catInv?: string;
    catPrice?: string;
    g_class?: string;
    g_qPackingUnit?: number;
    g_itemClassCode?: string;
    g_itemType?: string;
  }
  
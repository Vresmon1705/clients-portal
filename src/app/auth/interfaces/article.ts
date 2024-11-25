  export interface IArticle {
    id: string;
    lastSyncTime: number;
    organizationId: number;
    organizationCode: string;
    itemNumber: string;
    description: string;
    itemType: string;
    inventoryItemStatusCode: string;
    catInv: string;
    catPrice?: string;
    color?: string;
    pattern?: string;
    outputTaxClassificationCode?: string;
    g_class?: string;
    g_qPackingUnit?: number;
    g_itemClassCode: string;
    g_itemType: string;
    quantity: number;
    price: number;
    images: string;
    }
  
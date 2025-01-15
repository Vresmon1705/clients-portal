export interface IOrder {
    author:           string;
    partySiteNumber:  string;
    deliveryDate:     string;
    notes:            string;
    discountPP:       string;
    discountNumberPP: number;
    paymentCondition: string;
    purchaseOrder:    string;
    articles: {
        itemNumber:     string;
        description:    string;
        quantity:       number;
        g_qPackingUnit: number;
        basePrice:      number;
        subtotal:       number;
        taxPercentage:  number;
        iva:            number;
        catPrice:       string;
        g_class:        string;
        currency:       string;
    }[];
}
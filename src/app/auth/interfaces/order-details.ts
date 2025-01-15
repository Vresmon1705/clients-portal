export interface IOrderDetails {
    internalOrderNumber: string;
    orderDate: string;
    articleItemNumber: string;
    articleDescription: string;
    quantityRequired: number;
    unitPrice: number;
    totalUnitPrice: number;
    articleTaxPercentage: number;
    tax: number;
    articleCatPrice: string;
    articleClass: string;
    status: string;
    currency: string;
    lastModifiedBy: string;
  }
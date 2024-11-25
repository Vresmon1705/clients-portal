export interface Customer {
    id: string;
    lastSyncTime: number;
    name: string;
    category?: string;
    taxIdentificationNumber?: string;
    partySiteNumber: string;
    paymentCondition?: string;
    orderLimit?: number;
    seller?: string;
    address: string;
    city: string;
    country: string;
    state?: string;
    paymentConditionId?: number;
    codSeller?: number;
    creditLimit?: number;
    buyingPartyId: number;
    accountNumber: string;
    billToPartyName: string;
    billToAccountNumber: string;
    billToAddress: string;
    billToCity: string;
    billToState?: string;
    billToCountry: string;
    shipToPartyName: string;
    shipToAddress: string;
    shipToCity: string;
    shipToState?: string;
    shipToCountry: string;

}

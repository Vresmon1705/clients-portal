export interface ICustomer {
    id:                      string;
    name:                    string;
    city:                    string;
    state:                   string;
    seller:                  string;
    address:                 string;
    country:                 string;
    category:                string;
    codSeller:               number;
    orderLimit:              number;
    billToCity:              string;
    shipToCity:              string;
    shipToState:             string;
    billToState?:            string;
    lastSyncTime:            number;
    creditLimit?:            number;
    buyingPartyId:           number;
    accountNumber:           string;
    billToAddress:           string;
    billToCountry:           string;
    shipToAddress:           string;
    shipToCountry:           string;
    shipToPartyName:         string;
    billToPartyName:         string;
    partySiteNumber:         string;
    paymentCondition:        string;
    paymentConditionId:      number;
    billToAccountNumber:     string;
    taxIdentificationNumber: string;
}

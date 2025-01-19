
interface PriceUpdateMessage {
    type: 'price-update';
    priceInfo: ProductPriceInput;
}

export interface ProductPriceInput {
    price?: number;
    asin?: string;
    description?: string;
}

interface PriceRequestMessage {
    type: 'price-request';
}
export type Message = PriceUpdateMessage | PriceRequestMessage;

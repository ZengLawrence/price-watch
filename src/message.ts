import { ProductPrice } from "./product";

export interface PriceUpdateMessage {
    type: 'price-update';
    priceInfo: ProductPrice;
}

export interface ProductPriceInput {
    price?: number;
    asin?: string;
    description?: string;
}

export interface PriceRequestMessage {
    type: 'price-request';
}

export type Message = PriceUpdateMessage | PriceRequestMessage;

export interface PriceInfoResponse {
    type: 'price-info';
    priceInfo: ProductPrice;
}

export interface NoPriceInfoResponse {
    type: 'no-price-info';
}
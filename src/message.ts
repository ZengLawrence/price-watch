import { BuySignal } from "./buySignal";
import { ProductPrice } from "./product";

export interface PriceUpdateMessage {
    type: 'price-update';
    priceInfo: ProductPrice;
}

export interface PriceRequestMessage {
    type: 'price-request';
}

export interface MultiplePriceUpdateMessage {
    type: 'multiple-price-update';
    prices: ProductPrice[];
}

export type Message = PriceUpdateMessage | PriceRequestMessage | MultiplePriceUpdateMessage;

export interface PriceInfoResponse {
    type: 'price-info';
    priceInfo: ProductPrice;
}

export interface NoPriceInfoResponse {
    type: 'no-price-info';
}

export interface BuySignalResponse {
    type: 'buy-signal';
    buySignal: BuySignal;
}
import { PriceInfo } from "./PriceInfo";

export function buySignal(priceInfo: PriceInfo, existingPriceInfo: PriceInfo) {
    if (priceInfo.price < existingPriceInfo.price) {
        return { 
            shouldBuy: true, 
            reason: 'Price lowered',
            previousPrice: existingPriceInfo.price,
        };
    } else {
        return { 
            shouldBuy: false, 
            reason: 'Price no changed or higher',
            previousPrice: existingPriceInfo.price,
        };
    }
}

export type BuySignal = ReturnType<typeof buySignal>;
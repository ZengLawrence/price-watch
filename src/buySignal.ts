import { PriceInfo } from "./PriceInfo";

export function buySignal(priceInfo: PriceInfo, existingPriceInfo: PriceInfo) {
    if (priceInfo.price < existingPriceInfo.price) {
        return { shouldBuy: true, reason: 'Price lowered' };
    } else {
        return { shouldBuy: false, reason: 'Price no changed or higher' };
    }
}

export type BuySignal = ReturnType<typeof buySignal>;
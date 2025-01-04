import { PriceInfo } from "./PriceInfo";

export function buySignal(priceInfo: PriceInfo, existingPriceInfo: PriceInfo) {
    if (priceInfo.price < existingPriceInfo.price) {
        return { buySignal: true, reason: 'Price lowered' };
    } else {
        return { buySignal: false, reason: 'Price no changed or higher' };
    }
}

export type BuySignal = ReturnType<typeof buySignal>;
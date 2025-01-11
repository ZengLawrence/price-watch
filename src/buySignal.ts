import { Product } from "./PriceInfo";

export function buySignal(priceInfo: Product, existingPriceInfo: Product) {
    const previousPrice = existingPriceInfo.price;
    if (priceInfo.price < existingPriceInfo.price) {
        return { 
            shouldBuy: true, 
            reason: 'Price lowered',
            previousPrice,
        };
    } else {
        return { 
            shouldBuy: false, 
            reason: 'Price not changed or higher',
            previousPrice,
        };
    }
}

export type BuySignal = ReturnType<typeof buySignal>;
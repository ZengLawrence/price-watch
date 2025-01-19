import { ProductPrice } from "./product";

export interface BuySignal {
    shouldBuy: boolean;
    reason: string;
    previousPrice: number;
}

export function buySignal(priceInfo: ProductPrice, existingPriceInfo: ProductPrice): BuySignal {
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

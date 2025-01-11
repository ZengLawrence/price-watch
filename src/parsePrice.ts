import { Product } from "./product";
import { getBasePriceInfo } from './twisterPrice';

export function getPriceInfo(): Product | null {
    const twisterPriceInfo =  getBasePriceInfo(document);

    if (twisterPriceInfo) {
        const {price, asin} = twisterPriceInfo;
        console.log('price=' + price);
        console.log('asin=' + asin);
        const description = document.getElementById('productTitle')?.innerText || "not found";
        console.log('description=' + description);
        return { price, asin, description };
    }
    return null;
}

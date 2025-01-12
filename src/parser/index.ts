import { BaseProduct, Product } from "../product";
import * as twister from './twisterPrice';
import * as addToCart from './corePriceFeature';

export function getProduct(): Product | null {
    const baseProduct =  getBaseProduct(document);

    if (baseProduct) {
        const {price, asin} = baseProduct;
        console.log('price=' + price);
        console.log('asin=' + asin);
        const description = document.getElementById('productTitle')?.innerText || "not found";
        console.log('description=' + description);
        return { price, asin, description };
    }
    return null;
}

function getBaseProduct(document: Document): BaseProduct | null {
    const basePriceInfo =  twister.getBaseProduct(document);

    if (basePriceInfo) {
        return basePriceInfo;
    }
    return addToCart.getBaseProduct(document);
}

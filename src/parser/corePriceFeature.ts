import { BaseProductPrice } from "../product";

export function getBaseProduct(document: Document): BaseProductPrice | null {
    const corePrice: HTMLElement | null = document.querySelector('#corePrice_feature_div');
    if (corePrice) {
        const price = parsePrice(corePrice);
        const asin = corePrice.getAttribute('data-csa-c-asin');
        if (price && asin) {
            return { price, asin };
        }
    }
    return null;
}

function parsePrice(corePrice: HTMLElement): number | null {
    const price = corePrice.querySelector('.a-price')?.querySelector('.a-offscreen')?.textContent;
    if (price) {
        return parseFloat(price.replace('$', ''));
    }
    return null;
}
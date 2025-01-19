import _ from 'lodash';
import { BaseProduct, ProductPrice } from "../product";
import * as corePriceFeature from './corePriceFeature';
import * as twister from './twisterPrice';

export function getProduct(): ProductPrice | null {
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
    return corePriceFeature.getBaseProduct(document);
}

export function getProductsInCart(document: Document): ProductPrice[] {
    const cart = document.querySelector('div[data-cart-type].ewc-active-cart--selected');
    if (cart) {
        return _.map(cart.querySelectorAll('div[data-asin]'), (el): ProductPrice | null => {
            const asin = el.getAttribute('data-asin');
            const price = el.getAttribute('data-price');
            const description = el.querySelector('img')?.getAttribute('alt');
            if (asin && price && description) {
                return { asin, price: parseFloat(price), description };
            }
            return null;
        }).filter((product) => product !== null);
    }
    console.log('cart not found');
    return [];
} 
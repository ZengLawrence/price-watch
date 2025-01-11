import { PriceInfo } from "./PriceInfo";
import { getPrice } from './twisterPrice';

export function getPriceInfo(): PriceInfo | null {
    const twister = document.querySelector('#twisterPlusWWDesktop');

    if (twister) {
        const price = getPrice(twister);

        if (!price) {
            console.log('Price is null or undefined');
            return null;
        }

        const asin = (document.getElementById('twister-plus-asin')?.getAttribute('value'))!;
        console.log('asin=' + asin);
        const description = document.getElementById('productTitle')?.innerText;
        console.log('description=' + description);
        return { price, asin, description };
    }
    return null;
}

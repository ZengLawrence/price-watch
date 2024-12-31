import { PriceInfo } from "./PriceInfo";

interface TwisterPriceData {
    desktop_buybox_group_1: {
        priceAmount: number;
    }[];
}

function getPrice(twister: Element): number | null {
    const json = twister.querySelector('.twister-plus-buying-options-price-data')?.textContent;
    if (json) {
        const priceData: TwisterPriceData = JSON.parse(json);
        if (priceData) {
            const g = priceData.desktop_buybox_group_1;
            const price = g[g.length - 1].priceAmount;
            console.log('price=' + price);
            return price;
        }
    }
    return null;
}

function getPriceInfo(): PriceInfo | null {
    const twister = document.querySelector('#twisterPlusWWDesktop');

    if (twister) {
        const price = getPrice(twister);

        if (!price) {
            console.log('Price is null or undefined');
            return null;
        }

        const asin = document.getElementById('twister-plus-asin')?.getAttribute('value')!;
        console.log('asin=' + asin);
        const description = document.getElementById('productTitle')?.innerText;
        console.log('description=' + description);
        return { price, asin, description };
    }
    return null;
}

const priceInfo = getPriceInfo();
if (priceInfo) {
    chrome.runtime.sendMessage({ type: 'price-info-update', priceInfo });
} else {
    console.log('Price is null or undefined');
}

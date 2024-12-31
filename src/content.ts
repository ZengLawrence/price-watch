import { PriceInfo } from "./PriceInfo";

function getPriceByTwister(): PriceInfo | null {
    const twister = document.querySelector('#twisterPlusWWDesktop');
    let price = null;
    let asin = null;

    if (twister) {
        const json = twister.querySelector('.twister-plus-buying-options-price-data')?.textContent;
        if (json) {
            const priceData = JSON.parse(json);
            if (priceData) {
                const g = priceData.desktop_buybox_group_1;
                price = g[g.length - 1].priceAmount;
                console.log('price=' + price);
            }
        }

        asin = document.getElementById('twister-plus-asin')?.getAttribute('value')!;
        console.log('asin=' + asin);
        const description = document.getElementById('productTitle')?.innerText;
        console.log('description=' + description);
        return {price, asin, description};
    }
    return null;
}

const  priceInfo = getPriceByTwister();
if (priceInfo) {
    chrome.runtime.sendMessage({ type: 'price-info-update', priceInfo });
} else {
    console.log('Price is null or undefined');
}

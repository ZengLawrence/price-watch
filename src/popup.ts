import { PriceInfo } from "./PriceInfo";

function updatePriceInfo(price: number) {
    const productInfo = document.getElementById('price-info');
    if (productInfo) {
        const priceEl = document.createElement('div');
        priceEl.textContent = `Price: ${price}`;
        productInfo.appendChild(priceEl);
    }
}   

chrome.runtime.sendMessage({ type: 'price-info-request' }, (response: {type: string; priceInfo?: PriceInfo}) => {
    if (response.type === 'price-info') {
        console.log('price-info');
        if (response.priceInfo) {
            console.log('price-info=' + JSON.stringify(response.priceInfo));
            updatePriceInfo(response.priceInfo.price);
        }
    }
});

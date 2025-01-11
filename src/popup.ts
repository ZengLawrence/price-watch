import { Product } from "./PriceInfo";

function updatePriceInfo(priceInfo: Product) {
    const productInfo = document.getElementById('price-info');
    if (productInfo) {
        const priceInfoEl = document.createElement('div');
        priceInfoEl.textContent = `Price: ${priceInfo.price}\nASIN: ${priceInfo.asin}\nDescription: ${priceInfo.description}`;
        productInfo.appendChild(priceInfoEl);
    }
}   

chrome.runtime.sendMessage({ type: 'price-info-request' }, (response: {type: string; priceInfo?: Product}) => {
    if (response.type === 'price-info') {
        console.log('price-info');
        if (response.priceInfo) {
            console.log('price-info=' + JSON.stringify(response.priceInfo));
            updatePriceInfo(response.priceInfo);
        }
    }
});

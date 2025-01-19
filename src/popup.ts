import { PriceRequestMessage } from "./message";
import { ProductPrice } from "./product";

function updatePriceInfo(priceInfo: ProductPrice) {
    const productInfo = document.getElementById('price-info');
    if (productInfo) {
        const priceInfoEl = document.createElement('div');
        priceInfoEl.textContent = `Price: ${priceInfo.price}\nASIN: ${priceInfo.asin}\nDescription: ${priceInfo.description}`;
        productInfo.appendChild(priceInfoEl);
    }
}

const reqMsg: PriceRequestMessage = { type: 'price-request' };
chrome.runtime.sendMessage(reqMsg, (response: {type: string; priceInfo?: ProductPrice}) => {
    if (response.type === 'price-info') {
        console.log('price-info');
        if (response.priceInfo) {
            console.log('price-info=' + JSON.stringify(response.priceInfo));
            updatePriceInfo(response.priceInfo);
        }
    }
});

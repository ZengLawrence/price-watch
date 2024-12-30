import { PriceInfo } from "./PriceInfo";

function updatePriceInfo(price: number) {
    const productInfo = document.getElementById('price-info');
    if (productInfo) {
        const priceEl = document.createElement('div');
        priceEl.textContent = `Price: ${price}`;
        productInfo.appendChild(priceEl);
    }
}   

chrome.runtime.onMessage.addListener((message: {type: string; priceInfo: PriceInfo}, sender, sendResponse) => {
    if (message.type === 'price-info') {
      updatePriceInfo(message.priceInfo.price);
    }
  });

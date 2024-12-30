import { PriceInfo } from "./PriceInfo";

function updatePriceInfo(priceInfo: PriceInfo) {
    chrome.storage.local.set({ priceInfo });
}

chrome.runtime.onMessage.addListener((message: {type: string; priceInfo?: PriceInfo}, _sender, sendResponse) => {
    if (message.type === 'price-info-update') {
        console.log('price-info-update');
        if (message.priceInfo) {
            console.log('price-info-update=' + message.priceInfo);
            updatePriceInfo(message.priceInfo);
        }
    } else if (message.type === 'price-info-request') {
        chrome.storage.local.get('priceInfo', (data) => {
            sendResponse({type: 'price-info', priceInfo: data.priceInfo});
        });
        return true;
    }
  });


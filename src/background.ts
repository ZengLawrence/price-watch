import { BuySignal, buySignal } from "./buySignal";
import { Message, PriceUpdateMessage, ProductPriceInput } from "./message";
import { ProductPrice } from "./product";

const BLANK: string = '';

function saveLatestPrice(productPrice: ProductPrice) {
    chrome.storage.local.set({
        latest: productPrice.asin,
        [productPrice.asin]: productPrice,
    });
}

async function getPrice(asin: string): Promise<ProductPrice | undefined> {
    const result = await chrome.storage.local.get([asin]);
    return result[asin];
}

async function getLatestPrice(sendResponse: (response: { type: string, priceInfo?: ProductPrice }) => void) {
    const { latest } = await chrome.storage.local.get(['latest']);
    if (latest) {
        const priceInfo = await getPrice(latest);
        sendResponse({ type: 'price-info', priceInfo });
    } else {
        sendResponse({ type: 'price-info' });
    }
}

async function updatePrice(message: PriceUpdateMessage, sendResponse: (response: BuySignal) => void) {
    const { priceInfo } = message;
    console.log('update price: ' + JSON.stringify(message));
    const existingPriceInfo = await getPrice(priceInfo.asin);
    saveLatestPrice(priceInfo);
    if (existingPriceInfo) {
        sendResponse(buySignal(priceInfo, existingPriceInfo));
    }
}

chrome.runtime.onMessage.addListener((message: Message, _sender, sendResponse) => {
    if (message.type === 'price-update') {
        console.log('price-update');
        updatePrice(message, sendResponse);
        return true; // return true to indicate that sendResponse will be called asynchronously
    } else if (message.type === 'price-request') {
        getLatestPrice(sendResponse);
        return true; // return true to indicate that sendResponse will be called asynchronously
    }
});
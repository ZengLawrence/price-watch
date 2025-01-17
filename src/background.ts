import { buySignal } from "./buySignal";
import { BuySignalResponse, Message, NoPriceInfoResponse, PriceInfoResponse, PriceUpdateMessage } from "./message";
import { ProductPrice } from "./product";

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

async function getLatestPrice(sendResponse: (response: PriceInfoResponse | NoPriceInfoResponse) => void) {
    const { latest } = await chrome.storage.local.get(['latest']);
    if (latest) {
        const priceInfo = await getPrice(latest);
        if (priceInfo) {
            sendResponse({ type: 'price-info', priceInfo });
        }
    }
    sendResponse({ type: 'no-price-info' });
}

async function updatePrice(message: PriceUpdateMessage, sendResponse: (response: BuySignalResponse) => void) {
    const { priceInfo } = message;
    console.log('update price: ' + JSON.stringify(message));
    const existingPriceInfo = await getPrice(priceInfo.asin);
    saveLatestPrice(priceInfo);
    if (existingPriceInfo) {
        sendResponse({
            type: 'buy-signal',
            buySignal: buySignal(priceInfo, existingPriceInfo),
        });
    }
}

function updatePrices(prices: ProductPrice[]) {
    const pricesMap = prices.reduce((acc, p) => {
        acc[p.asin] = p;
        return acc;
    }, {} as { [key: string]: ProductPrice });
    console.log('transformed prices: ' + JSON.stringify(pricesMap));
    chrome.storage.local.set(pricesMap);
}

chrome.runtime.onMessage.addListener((message: Message, _sender, sendResponse) => {
    switch (message.type) {
        case 'price-update':
            updatePrice(message, sendResponse);
            return true; // return true to indicate that sendResponse will be called asynchronously
        case 'price-request':
            getLatestPrice(sendResponse);
            return true; // return true to indicate that sendResponse will be called asynchronously
        case 'multiple-price-update':
            updatePrices(message.prices);
            return false; // return false to indicate that sendResponse will not be called
        default:
            return false; // return false for unhandled message types
    }
});
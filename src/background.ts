import { PriceInfo } from "./PriceInfo";

function updatePriceInfo(priceInfo: PriceInfo) {
    chrome.storage.local.set({
        latest: priceInfo.asin,
        [priceInfo.asin]: priceInfo,
    });
}

function validate(priceInfoInput: PriceInfoInput): PriceInfo | null {
    const { price, asin, description } = priceInfoInput;
    if (price === undefined || price === null || price <= 0) {
        console.error('Invalid price');
        return null;
    }
    if (asin === undefined || asin === null || asin.trim() === '') {
        console.error('Invalid asin');
        return null;
    }
    return { price, asin, description };
}

async function getPriceInfo(asin: string): Promise<PriceInfo | undefined> {
    const result = await chrome.storage.local.get([asin]);
    return result[asin];
}

async function getLatestPriceInfo(sendResponse: (response: { type: string, priceInfo?: PriceInfo }) => void) {
    const { latest } = await chrome.storage.local.get(['latest']);
    if (latest) {
        const priceInfo = await getPriceInfo(latest);
        sendResponse({ type: 'price-info', priceInfo });
    } else {
        sendResponse({ type: 'price-info' });
    }
}

async function processPriceInfoUpdate(message: { priceInfo?: PriceInfoInput; }, sendResponse: (response?: any) => void) {
    if (message.priceInfo) {
        console.log('price-info-update=' + JSON.stringify(message.priceInfo));
        const priceInfo = validate(message.priceInfo);
        if (priceInfo) {
            const existingPriceInfo = await getPriceInfo(priceInfo.asin);
            updatePriceInfo(priceInfo);
            if (existingPriceInfo) {
                sendResponse(buySignal(priceInfo, existingPriceInfo));
            }
        }
    }
}

function buySignal(priceInfo: PriceInfo, existingPriceInfo: PriceInfo) {
    const priceDiff = priceInfo.price - existingPriceInfo.price;
    if (priceDiff < 0) {
        return { buySignal: true, reason: 'Price lowered' };
    } else {
        return { buySignal: false, reason: 'Price no changed or higher' };
    }
}

interface PriceInfoInput {
    price?: number;
    asin?: string;
    description?: string;
}

chrome.runtime.onMessage.addListener((message: { type: string; priceInfo?: PriceInfoInput }, sender, sendResponse) => {
    if (message.type === 'price-info-update') {
        console.log('price-info-update');
        processPriceInfoUpdate(message, sendResponse);
        return true;
    } else if (message.type === 'price-info-request') {
        getLatestPriceInfo(sendResponse);
        return true;
    }
});



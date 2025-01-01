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

function getLatestPriceInfo(sendResponse: (response: { type: string, priceInfo?: PriceInfo }) => void) {
    chrome.storage.local.get(['latest'], (result) => {
        const latest = result.latest;
        if (latest) {
            chrome.storage.local.get([latest], (result) => {
                const priceInfo = result[latest];
                sendResponse({ type: 'price-info', priceInfo });
            });
        } else {
            sendResponse({ type: 'price-info' });
        }
    });
}

interface PriceInfoInput {
    price?: number;
    asin?: string;
    description?: string;
}

chrome.runtime.onMessage.addListener((message: { type: string; priceInfo?: PriceInfoInput }, _sender, sendResponse) => {
    if (message.type === 'price-info-update') {
        console.log('price-info-update');
        if (message.priceInfo) {
            console.log('price-info-update=' + JSON.stringify(message.priceInfo));
            const priceInfo = validate(message.priceInfo);
            if (priceInfo) updatePriceInfo(priceInfo);
        }
    } else if (message.type === 'price-info-request') {
        getLatestPriceInfo(sendResponse);
        return true;
    }
});


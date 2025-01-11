import { BuySignal, buySignal } from "./buySignal";
import { ProductPrice } from "./PriceInfo";

const BLANK: string = '';

function updatePriceInfo(priceInfo: ProductPrice) {
    chrome.storage.local.set({
        latest: priceInfo.asin,
        [priceInfo.asin]: priceInfo,
    });
}

function validate(priceInfoInput: PriceInfoInput): ProductPrice | null {
    const { price, asin, description } = priceInfoInput;
    if (price === undefined || price === null || price <= 0) {
        console.error('Invalid price');
        return null;
    }
    if (asin === undefined || asin === null || asin.trim() === '') {
        console.error('Invalid asin');
        return null;
    }
    if (description === undefined || description === null || description.trim() === '') {
        console.warn('Invalid description, setting to blank');
    }
    return { price, asin, description: description ?? BLANK };
}

async function getPriceInfo(asin: string): Promise<ProductPrice | undefined> {
    const result = await chrome.storage.local.get([asin]);
    return result[asin];
}

async function getLatestPriceInfo(sendResponse: (response: { type: string, priceInfo?: ProductPrice }) => void) {
    const { latest } = await chrome.storage.local.get(['latest']);
    if (latest) {
        const priceInfo = await getPriceInfo(latest);
        sendResponse({ type: 'price-info', priceInfo });
    } else {
        sendResponse({ type: 'price-info' });
    }
}

async function processPriceInfoUpdate(message: { priceInfo?: PriceInfoInput; }, sendResponse: (response: BuySignal) => void) {
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

interface PriceInfoInput {
    price?: number;
    asin?: string;
    description?: string;
}

chrome.runtime.onMessage.addListener((message: { type: string; priceInfo?: PriceInfoInput }, _sender, sendResponse) => {
    if (message.type === 'price-info-update') {
        console.log('price-info-update');
        processPriceInfoUpdate(message, sendResponse);
        return true; // return true to indicate that sendResponse will be called asynchronously
    } else if (message.type === 'price-info-request') {
        getLatestPriceInfo(sendResponse);
        return true; // return true to indicate that sendResponse will be called asynchronously
    }
});



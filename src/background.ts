import { BuySignal, buySignal } from "./buySignal";
import { Message, ProductPriceInput } from "./message";
import { ProductPrice } from "./product";

const BLANK: string = '';

function saveLatestPrice(productPrice: ProductPrice) {
    chrome.storage.local.set({
        latest: productPrice.asin,
        [productPrice.asin]: productPrice,
    });
}

function validate(productPriceInput: ProductPriceInput): ProductPrice | null {
    const { price, asin, description } = productPriceInput;
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

async function updatePrice(message: { priceInfo?: ProductPriceInput; }, sendResponse: (response: BuySignal) => void) {
    if (message.priceInfo) {
        console.log('price-info-update=' + JSON.stringify(message.priceInfo));
        const priceInfo = validate(message.priceInfo);
        if (priceInfo) {
            const existingPriceInfo = await getPrice(priceInfo.asin);
            saveLatestPrice(priceInfo);
            if (existingPriceInfo) {
                sendResponse(buySignal(priceInfo, existingPriceInfo));
            }
        }
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
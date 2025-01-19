import { BuySignal, buySignal } from "./buySignal";
import { ProductPrice } from "./product";

const BLANK: string = '';

function updateProductPrice(productPrice: ProductPrice) {
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

async function processPriceInfoUpdate(message: { priceInfo?: ProductPriceInput; }, sendResponse: (response: BuySignal) => void) {
    if (message.priceInfo) {
        console.log('price-info-update=' + JSON.stringify(message.priceInfo));
        const priceInfo = validate(message.priceInfo);
        if (priceInfo) {
            const existingPriceInfo = await getPriceInfo(priceInfo.asin);
            updateProductPrice(priceInfo);
            if (existingPriceInfo) {
                sendResponse(buySignal(priceInfo, existingPriceInfo));
            }
        }
    }
}

interface ProductPriceInput {
    price?: number;
    asin?: string;
    description?: string;
}

chrome.runtime.onMessage.addListener((message: { type: string; priceInfo?: ProductPriceInput }, _sender, sendResponse) => {
    if (message.type === 'price-info-update') {
        console.log('price-info-update');
        processPriceInfoUpdate(message, sendResponse);
        return true; // return true to indicate that sendResponse will be called asynchronously
    } else if (message.type === 'price-info-request') {
        getLatestPriceInfo(sendResponse);
        return true; // return true to indicate that sendResponse will be called asynchronously
    }
});



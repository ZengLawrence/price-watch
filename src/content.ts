import { BuySignal } from "./buySignal";
import { PriceInfo } from "./PriceInfo";

interface TwisterPriceData {
    desktop_buybox_group_1: {
        priceAmount: number;
        buyingOptionType: string;
    }[];
}

function getPrice(twister: Element): number | null {
    const json = twister.querySelector('.twister-plus-buying-options-price-data')?.textContent;
    if (json) {
        const priceData: TwisterPriceData = JSON.parse(json);
        if (priceData) {
            const newItemBuyOptions = getBuyOptions(priceData, p => p.buyingOptionType === 'NEW');
            const price = head(newItemBuyOptions)?.priceAmount || null;
            console.log('price=' + price);
            return price;
        }
    }
    return null;
}

function head<T>(arr: T[]): T | undefined {
    if (arr && arr.length > 0) {
        return arr[0];
    } else {
        return undefined;
    }
}

function getBuyOptions(priceData: TwisterPriceData, filterFn: (buyOption: { buyingOptionType: string }) => void) {
    const g = priceData.desktop_buybox_group_1;
    return g?.filter(filterFn);
}

function getPriceInfo(): PriceInfo | null {
    const twister = document.querySelector('#twisterPlusWWDesktop');

    if (twister) {
        const price = getPrice(twister);

        if (!price) {
            console.log('Price is null or undefined');
            return null;
        }

        const asin = document.getElementById('twister-plus-asin')?.getAttribute('value')!;
        console.log('asin=' + asin);
        const description = document.getElementById('productTitle')?.innerText;
        console.log('description=' + description);
        return { price, asin, description };
    }
    return null;
}

function createDivElement(html: string): HTMLElement {
    const dom = new DOMParser().parseFromString(html, 'text/html');
    return dom.body.getElementsByTagName('div')[0];
}

function showPopover(reason: string, previousPrice: number) {
    const popover = createDivElement(
        `<div id='price-watch-popover' 
            popover 
            style='background-color: #198754; color: white;'
            >
            <div>
                ${reason}
            </div>
            <div>
                Previous price: ${previousPrice}
            </div>
        </div>`
    );
    document.body.appendChild(popover);
    popover.showPopover();
}

async function showBuySignal() {
    const priceInfo = getPriceInfo();
    if (priceInfo) {
        chrome.runtime.sendMessage({ type: 'price-info-update', priceInfo }, (buySignal: BuySignal) => {
            const { shouldBuy, reason, previousPrice } = buySignal;
            if (shouldBuy) {
                showPopover(reason, previousPrice);
            } else {
                console.log('No buy recommendation. buySignal=' + JSON.stringify(buySignal));
            }
        });
    } else {
        console.log('Price is null or undefined');
    }
}

showBuySignal();


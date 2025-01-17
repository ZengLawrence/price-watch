import _ from "lodash";
import { getProduct, getProductsInCart } from "./parser";
import { BuySignalResponse, MultiplePriceUpdateMessage, PriceUpdateMessage } from "./message";

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
    const priceInfo = getProduct();
    if (priceInfo) {
        const message: PriceUpdateMessage = { type: 'price-update', priceInfo };
        chrome.runtime.sendMessage(message, (resp: BuySignalResponse) => {
            const buySignal = resp.buySignal;
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

function getPricesInCartThenSave() {
    const productsInCart = getProductsInCart(document);
    console.log('productsInCart=' + JSON.stringify(productsInCart));
    const msg : MultiplePriceUpdateMessage = { 
        type: 'multiple-price-update', 
        prices: productsInCart };
    chrome.runtime.sendMessage(msg);
}

showBuySignal();

// Shopping cart div gets populated after the page is loaded
const shoppingCartNode = document.getElementById("nav-flyout-ewc");
if (shoppingCartNode) {
    const config = { childList: true, subtree: true };
    const observer = new MutationObserver(_.debounce(getPricesInCartThenSave, 1000));
    observer.observe(shoppingCartNode, config);
} else {
    console.log('Element "nav-flyout-ewc" not found');
}

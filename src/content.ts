import { BuySignal } from "./buySignal";
import { getProduct, getProductsInCart } from "./parser";

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

function logProductsInCart() {
    const productsInCart = getProductsInCart(document);
    console.log('productsInCart=' + JSON.stringify(productsInCart));
}

showBuySignal();

// Shopping cart div gets populated after the page is loaded
const targetNode = document.getElementById("nav-flyout-ewc");
if (targetNode) {
    const config = { childList: true, subtree: true };
    const observer = new MutationObserver(logProductsInCart);
    observer.observe(targetNode, config);
} else {
    console.log('targetNode not found');
}

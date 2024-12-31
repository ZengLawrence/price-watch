function getPriceByAttachAccessoryFeature() {
    const attachAccessoryFeature = document.getElementById('attachAccessoryModal_feature_div');

    let price = null;
    if (attachAccessoryFeature) {
        console.log('attachAccessoryFeature found');
        price = document.getElementById('attach-base-product-price')?.getAttribute('value');
        console.log('price=' + price);
        const asin = document.getElementById('attach-baseAsin')?.getAttribute('value');
        console.log('asin=' + asin);
        const description = document.getElementById('productTitle')?.innerText;
        console.log('description=' + description);
    } else {
        console.log('attachAccessoryFeature not found');
    }
    return price;
}

function getPriceByTwister(): number | null {
    const twister = document.querySelector('#twisterPlusWWDesktop');
    let price = null;
    if (twister) {
        const json = twister.querySelector('.twister-plus-buying-options-price-data')?.textContent;
        if (json) {
            const priceData = JSON.parse(json);
            if (priceData) {
                const g = priceData.desktop_buybox_group_1;
                price = g[g.length - 1].priceAmount;
                console.log('price=' + price);
            }
        }
    }
    return price;
}

const  price = getPriceByTwister();
if (price) {
    chrome.runtime.sendMessage({ type: 'price-info-update', priceInfo: { price } });
} else {
    console.log('Price is null or undefined');
}

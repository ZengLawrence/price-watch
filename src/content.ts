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

const price = getPriceByAttachAccessoryFeature();
if (price) {
    chrome.runtime.sendMessage({ type: 'price-info-update', priceInfo: { price: parseFloat(price) } });
} else {
    console.error('Price is null or undefined');
}

const attachAccessoryFeature = document.getElementById('attachAccessoryModal_feature_div');

if (attachAccessoryFeature) {
    console.log('attachAccessoryFeature found');
    const price = document.getElementById('attach-base-product-price')?.getAttribute('value');
    console.log('price=' + price);
    const asin = document.getElementById('attach-baseAsin')?.getAttribute('value');
    console.log('asin=' + asin);
    const description = document.getElementById('productTitle')?.innerText;
    console.log('description=' + description);

    if (price) {
        chrome.runtime.sendMessage({ type: 'price-info', priceInfo: { price: parseFloat(price) } });
    } else {
        console.error('Price is null or undefined');
    }
} else {
    console.log('attachAccessoryFeature not found');
}
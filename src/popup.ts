const productInfo = document.getElementById('price-info');
if (productInfo) {
    const price = 100;
    const priceEl = document.createElement('div');
    priceEl.textContent = `Price: ${price}`;
    productInfo.appendChild(priceEl);
}

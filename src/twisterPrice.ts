import _ from 'lodash';

interface BasePriceInfo {
    price: number;
    asin: string;
}

interface TwisterPriceData {
    desktop_buybox_group_1: {
        priceAmount: number;
        buyingOptionType: string;
    }[];
}

export function getBasePriceInfo(document: Document): BasePriceInfo | null {
    const twister = document.querySelector('#twisterPlusWWDesktop');

    if (twister) {
        const price = getPrice(twister);

        if (!price) {
            console.log('Price is null or undefined');
            return null;
        }

        const asin = (document.getElementById('twister-plus-asin')?.getAttribute('value'))!;
        return { price, asin };
    }
    return null;
}

function getPrice(twister: Element): number | null {
    const json = twister.querySelector('.twister-plus-buying-options-price-data')?.textContent;
    if (json) {
        const priceData: TwisterPriceData = JSON.parse(json);
        if (priceData) {
            const newItemBuyOptions = getBuyOptions(priceData, p => p.buyingOptionType === 'NEW');
            const price = _.head(newItemBuyOptions)?.priceAmount || null;
            return price;
        }
    }
    return null;
}

function getBuyOptions(priceData: TwisterPriceData, filterFn: (buyOption: { buyingOptionType: string; }) => void) {
    const g = priceData.desktop_buybox_group_1;
    return g?.filter(filterFn);
}

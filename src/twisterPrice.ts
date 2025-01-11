import _ from 'lodash';

interface TwisterPriceData {
    desktop_buybox_group_1: {
        priceAmount: number;
        buyingOptionType: string;
    }[];
}
export function getPrice(twister: Element): number | null {
    const json = twister.querySelector('.twister-plus-buying-options-price-data')?.textContent;
    if (json) {
        const priceData: TwisterPriceData = JSON.parse(json);
        if (priceData) {
            const newItemBuyOptions = getBuyOptions(priceData, p => p.buyingOptionType === 'NEW');
            const price = _.head(newItemBuyOptions)?.priceAmount || null;
            console.log('price=' + price);
            return price;
        }
    }
    return null;
}
function getBuyOptions(priceData: TwisterPriceData, filterFn: (buyOption: { buyingOptionType: string; }) => void) {
    const g = priceData.desktop_buybox_group_1;
    return g?.filter(filterFn);
}

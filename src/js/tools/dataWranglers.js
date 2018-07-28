import { formatDate, parseCurrency } from '../tools/dataHelpers';

export const splitDataIntoYears = (data, years) =>
    years.map(year => ({
        year: year,
        data: data.filter(dataEntry => {
            return parseInt(formatDate(dataEntry.date, 'X', 'YYYY')) === year;
        })
    }));

const countMonthsActive = data => {
    const allDates = data.map(entry => entry.date);
    const firstMonth = formatDate(Math.min(...allDates), 'X', 'MM');
    const lastMonth = formatDate(Math.max(...allDates), 'X', 'MM');
    return lastMonth - firstMonth + 1;
};

export const topupsPerMonth = data => {
    const activeMonths = countMonthsActive(data);
    return (data.length / activeMonths).toFixed(1);
};

export const totalSpend = data => data.reduce((acc, curr) => acc + curr.petrol, 0);

export const spendPerMonth = data => parseCurrency(totalSpend(data) / data.length);

export const sortByAlternateKey = (results, sortKey, reverse = false) =>
    results.sort((a, b) => {
        if (a[sortKey] < b[sortKey]) {
            return reverse ? -1 : 1;
        }
        if (a[sortKey] > b[sortKey]) {
            return reverse ? 1 : -1;
        }
        return 0;
    });

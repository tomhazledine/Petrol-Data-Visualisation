import moment from 'moment';

export function formatDate(input, inputFormat = 'YYYYMMDD', outputFormat = 'YYYY MMM DD') {
    let dateObject = moment(input, inputFormat);
    return dateObject.format(outputFormat);
}

export function parseCurrency(pence, decimal = 2, showDecimal = decimal) {
    let pounds = (pence / Math.pow(10, decimal)).toFixed(showDecimal);
    return `£${pounds}`;
}

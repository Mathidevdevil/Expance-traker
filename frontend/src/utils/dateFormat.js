import moment from 'moment';

export const dateFormat = (date) => {
    if (!date) return '';
    const m = moment(date);
    return m.isValid() ? m.format('DD/MM/YYYY') : '';
}

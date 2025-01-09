export const formatNumberWithUnit = (num: number): string => {
    if (num >= 1000000000) {
        return (num / 1000000000).toFixed(3) + 'B';
    } else if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M'; 
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
};

export const formatNumberWithCommas = (num: number): string => {
    return num.toLocaleString('en-US');
}

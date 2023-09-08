const isNumber = (value) => {
    return Object.prototype.toString.call(value) === '[object Number]';
}
// 报告页中的百分比应都使用此方法格式化，以便统一修改格式、小数位等
export const percentDigitalFormatter = (value, digits = 1)=> {
    if (isNumber(value)) {
        value = value || 0
        if (value === 100 || value === 0) {
            return value.toFixed(0)
        }
        return (Math.round(value * 10) / 10).toFixed(digits)
    } else {
        return value;
    }
}

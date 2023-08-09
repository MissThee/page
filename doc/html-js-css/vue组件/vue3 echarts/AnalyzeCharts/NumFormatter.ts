const isNumber = (value: any): value is number => {
  return Object.prototype.toString.call(value) === '[object Number]';
}
// 报告页中的百分比应都使用此方法格式化，以便统一修改格式、小数位等
export const percentDigitalFormatter = (value: string | number): string => {
  if (isNumber(value)) {
    value = value || 0
    if (value === 100 || value===0) {
      return value.toFixed(0)
    }
    return value.toFixed(1)
  } else {
    return value;
  }
}

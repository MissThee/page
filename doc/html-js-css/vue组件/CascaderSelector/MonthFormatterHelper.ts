export const monthFormat = (val: string) => {
  if (val.includes('-')) {
    const tmp = val.split('-')
    if (tmp.length === 2 && !Number.isNaN(Number(tmp[0])) && !Number.isNaN(Number(tmp[1]))) {
      return tmp[0] + '-' + tmp[1].padStart(2, '0')
    }
  }
  return val
}
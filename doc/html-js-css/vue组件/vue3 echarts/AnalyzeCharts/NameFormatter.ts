export const legendWrap = (val: string, maxLength: number) => {
  if (!val) {
    return ''
  }

  for (let i = val.length; i > 0; i--) {
    // console.log(i, maxLength, val, i % maxLength === 0)
    if (i !== val.length && i !== 0 && i % maxLength === 0) {
      console.log( val.slice(0, i - 1) ,val.slice(i - 1))
      val = val.slice(0, i - 1) + '\n' + val.slice(i - 1)
    }
  }
  return val

}
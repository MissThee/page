export const legendWrap = (val, maxLength) => {
    if (!val) {
        return ''
    }

    for (let i = val.length; i > 0; i--) {
        // console.log(i, maxLength, val, i % maxLength === 0)
        if (i !== val.length && i !== 0 && i % maxLength === 0) {
            val = val.slice(0, i) + '\n' + val.slice(i)
        }
    }
    return val

}

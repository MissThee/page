export const pieDataConvert = (data: { emotion: string[], number: number[] }) =>
  data.emotion.map((e, index) => {
    if (e === 'p') {
      return {value: data.number[index], name: '正面体验', color: '#3769FA'}
    }
    if (e === 'n') {
      return {value: data.number[index], name: '负面体验', color: '#F7B500'}
    }
    if (e === 'm') {
      return {value: data.number[index], name: '中立体验', color: '#CFCFCF'}
    }
  })

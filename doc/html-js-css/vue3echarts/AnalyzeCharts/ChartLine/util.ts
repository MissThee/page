export const lineData3TypeConvert = (data: { time_value: string[], [key: string]: any }, propSuffix: string) =>
  ({
    labels: data.time_value || [],
    values: [
      {name: '正面体验', color: '#3769FA', data: data['p_' + propSuffix]},
      {name: '负面体验', color: '#F7B500', data: data['n_' + propSuffix]},
      {name: '中立体验', color: '#CFCFCF', data: data['m_' + propSuffix]},
    ]
  })

export const lineData1TypeConvert = (data: { time_value: string[], [key: string]: any }, name: string, prop: string) =>
  ({
    labels: data.time_value || [],
    values: [
      {name, color: '#3769FA', data: data[prop] || []},
    ]
  })


export const lineData1TypeConvert_1 = (data: { dataX: string[], dataY: number[] }, name: string) =>
  ({
    labels: data.dataX || [],
    values: [
      {name, color: '#3769FA', data: data.dataY?.map(e => e || 0) || []},
    ]
  })

export const lineDataMultiConvert = (data: { time_value: string[], lines: Record<string, any>[] }, props: { name: string, data: string } = {name: 'name', data: 'data'}) =>
  ({
    labels: data.time_value || [],
    values: data.lines.map((e: Record<string, any>) => ({
      name: e[props.name] || [],
      data: e[props.data] || []
    }))
  })

export const lineDataMultiConvert_1 = (data: { dataX: string[], dataY: number[][], title: string[] }) =>
  ({
    labels: data.dataX || [],
    values: data.dataY.map((e: number[], index) => ({
      name: data.title[index] || '',
      data: e?.map(val => val || 0) || []
    }))
  })
import dayjs from "dayjs";

export enum DateType {
  day = 1,
  week,
  month,
  quarter,
  year,
}

export type BtnData = {
  name: string,
  type: DateType,
  pickerType?: string
}

export type DateSelectorRes = {
  time_cycle: DateType,
  time_value: string,
  textForComponent?: string,
  valueForComponent?: string
}

export const dateSelectorValueFormat = 'YYYY-MM-DD'

export const btnDate: BtnData[] = [
  {name: '日度', type: DateType.day, pickerType: 'date'},
  {name: '周度', type: DateType.week, pickerType: 'week'},
  {name: '月度', type: DateType.month, pickerType: 'month'},
  {name: '季度', type: DateType.quarter},
  {name: '年度', type: DateType.year, pickerType: 'year'},
]

// 返回年和周数(2023-06-01 后端王涛统一，本年第一个周一，为第一周)
export const getWeekInYear = (dt: Date): { year: number, week: number } => {
  const d1 = new Date(dt);
  const d2 = new Date(dt);
  d2.setMonth(0);
  // 周日默认是0，此处改为7
  const dayInWeekNum = new Date(dt.getFullYear() + '-01-01').getDay() || 7
  const setDateTmp = 7 - (dayInWeekNum - 1)
  d2.setDate(setDateTmp === 7 ? 0 : setDateTmp);
  const rq = d1.getTime() - d2.getTime();
  const days = Math.ceil(rq / (24 * 60 * 60 * 1000));
  if (days <= 0) { // 是负数表明应该是去年的最后一周
    if (new Date(dt.getFullYear() + '-01-01').getDay() !== 1) {
      return getWeekInYear(new Date(dt.getFullYear() - 1 + '-12-31'))
    }
  }
  return {year: dt.getFullYear(), week: Math.ceil(days / 7)};
}
// console.log('！！！', getWeekInYear(new Date('2018-01-01')))
// console.log('52', getWeekInYear(new Date('2017-01-01')))
// console.log('1', getWeekInYear(new Date('2017-01-02')))
// console.log('52', getWeekInYear(new Date('2019-01-06')))
// console.log('1', getWeekInYear(new Date('2019-01-07')))
// console.log('51', getWeekInYear(new Date('2019-12-29')))
// console.log('52', getWeekInYear(new Date('2019-12-31')))
// console.log('52', getWeekInYear(new Date('2020-01-01')))
// console.log('1', getWeekInYear(new Date('2020-01-06')))
// 传入时间类型，获取对应的默认值。
export const getParamByDateType = (dateType: DateType, date?: Date, needAuxiliaryParam = false): DateSelectorRes => {
  const btnTmp = btnDate.find(e => e.type === dateType)
  if (!btnTmp) {
    throw new Error('invalid dateType')
  }
  // 默认昨天
  const currentDay = date ? dayjs(date) : dayjs().add(-1, 'day')
  // 请求用的参数值
  let time_value
  // 辅助展示的参数值
  let textForComponent
  switch (dateType) {
    case DateType.day: {
      time_value = currentDay.format('YYYY-MM-DD')
      textForComponent = currentDay.format('YYYY年MM月DD日')
      break
    }
    case DateType.week: {
      const dateTmp = getWeekInYear(currentDay.toDate())
      time_value = dateTmp.year + '-' + dateTmp.week
      textForComponent = dateTmp.year + '年' + dateTmp.week + '周'
      break
    }
    case DateType.month: {
      time_value = currentDay.format('YYYY-M')
      textForComponent = currentDay.format('YYYY年MM月')
      break
    }
    case DateType.quarter: {
      time_value = currentDay.format('YYYY-[Q]Q')
      textForComponent = currentDay.format('YYYY年Q季度')
      break
    }
    case DateType.year: {
      time_value = currentDay.format('YYYY')
      textForComponent = currentDay.format('YYYY年')
      break
    }
  }
  const valueForComponent = currentDay.format(dateSelectorValueFormat)
  if (needAuxiliaryParam) {
    return {
      time_cycle: dateType,
      time_value,
      textForComponent,
      valueForComponent
    }
  } else {
    return {
      time_cycle: dateType,
      time_value,
    }
  }
}

// 使用参数获取时间对应的文字
// 如
// 日 {time_cycle: 1, time_value: '2023-05-11'} => 2023年5月11
// 周 {time_cycle: 2, time_value: '2023-19'} => 2023年19周
// 月 {time_cycle: 3, time_value: '2023-5'} => 2023年5月
// 季 {time_cycle: 4, time_value: '2023-Q2'} => 2023年2季度
// 年 {time_cycle: 5, time_value: '2023'} => 2023年
export const getDateTextByParam = (param: DateSelectorRes) => {
  let result = ''
  const dateParts = param.time_value?.split('-')
  result += dateParts[0] + '年';
  switch (param.time_cycle) {
    case 1:
      result += Number(dateParts[1]) + '月';
      result += Number(dateParts[2]) + '日';
      return result;
    case 2 :
      result += Number(dateParts[1]) + '周';
      return result;
    case 3:
      result += Number(dateParts[1]) + '月';
      return result;
    case 4:
      result += Number(dateParts[1]?.replace('Q', '') || '') + '季度';
      return result;
    case 5:
      return result
    default:
      throw new Error('invalid param in function getDateTextByParam')
  }
}
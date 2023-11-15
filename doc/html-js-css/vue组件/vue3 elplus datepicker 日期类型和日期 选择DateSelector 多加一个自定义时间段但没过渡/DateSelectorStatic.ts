import dayjs from "dayjs";

export enum DateType {
    day = 1,
    week = 2,
    month = 3,
    quarter = 4,
    year = 5,
    custom = 7,
}

export type BtnData = {
    name: string,
    type: DateType,
    pickerType?: string
}


export const dateSelectorValueFormat = 'YYYY-MM-DD'

export const btnDate: BtnData[] = [
    {name: '日度', type: DateType.day, pickerType: 'date'},
    {name: '周度', type: DateType.week, pickerType: 'week'},
    {name: '月度', type: DateType.month, pickerType: 'month'},
    {name: '季度', type: DateType.quarter},
    {name: '年度', type: DateType.year, pickerType: 'year'},
    {name: '自定义', type: DateType.custom, pickerType: 'daterange'},
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

export type DateSelectorRes = {
    time_cycle: DateType.day | DateType.week | DateType.month | DateType.quarter | DateType.year,
    time_value: string,
    textForComponent?: string,
    valueForComponent?: string
} | {
    time_cycle: DateType.custom,
    time_value: string,
    textForComponent?: string,
    valueForComponent?: string[]
}

export const disabledDateForReport = (date: Date) => {
    const minYear = Number(process.env.VITE_DATE_MIN_LIMIT?.trim() || 0)
    let minLimitRes
    if (minYear) {
        minLimitRes = date.getTime() < dayjs(minYear + '-01-01').toDate().getTime()
    } else {
        minLimitRes = false
    }
    // 限制选择今日之前
    const maxLimitRes = date.getTime() > dayjs().add(-1, 'day').toDate().getTime()
    return maxLimitRes || minLimitRes
}

export function getParamByDateType(dateType: DateType.day | DateType.week | DateType.month | DateType.quarter | DateType.year, date?: Date, needAuxiliaryParam?: boolean): DateSelectorRes
export function getParamByDateType(dateType: DateType.custom, date?: Date | Date[], needAuxiliaryParam?: boolean): DateSelectorRes
// 传入时间类型，获取对应的默认值。
export function getParamByDateType(dateType: DateType, date?: Date | Date[], needAuxiliaryParam = false): DateSelectorRes {
    const btnTmp = btnDate.find(e => e.type === dateType)
    if (!btnTmp) {
        throw new Error('invalid dateType')
    }
    // 请求用的参数值
    let time_value
    // 辅助展示的参数值
    let textForComponent
    // 时间组件赋值的参数值
    let valueForComponent
    switch (dateType) {
        case DateType.day: {
            // 默认昨天

            const currentDay = date ? dayjs(date as Date) : dayjs().add(-1, 'day')
            time_value = currentDay.format('YYYY-MM-DD')
            textForComponent = currentDay.format('YYYY年MM月DD日')
            valueForComponent = currentDay.format(dateSelectorValueFormat)
            return {
                time_cycle: dateType,
                time_value,
                ...(needAuxiliaryParam ? {textForComponent, valueForComponent} : {})
            }
        }
        case DateType.week: {
            // 默认昨天
            const currentDay = date ? dayjs(date as Date) : dayjs().add(-1, 'day')
            const dateTmp = getWeekInYear(currentDay.toDate())
            time_value = dateTmp.year + '-' + dateTmp.week
            textForComponent = dateTmp.year + '年' + dateTmp.week + '周'
            valueForComponent = currentDay.format(dateSelectorValueFormat)
            return {
                time_cycle: dateType,
                time_value,
                ...(needAuxiliaryParam ? {textForComponent, valueForComponent} : {})
            }
        }
        case DateType.month: {
            // 默认昨天
            const currentDay = date ? dayjs(date as Date) : dayjs().add(-1, 'day')
            time_value = currentDay.format('YYYY-M')
            textForComponent = currentDay.format('YYYY年MM月')
            valueForComponent = currentDay.format(dateSelectorValueFormat)
            return {
                time_cycle: dateType,
                time_value,
                ...(needAuxiliaryParam ? {textForComponent, valueForComponent} : {})
            }
        }
        case DateType.quarter: {
            // 默认昨天
            const currentDay = date ? dayjs(date as Date) : dayjs().add(-1, 'day')
            time_value = currentDay.format('YYYY-[Q]Q')
            textForComponent = currentDay.format('YYYY年Q季度')
            valueForComponent = currentDay.format(dateSelectorValueFormat)
            return {
                time_cycle: dateType,
                time_value,
                ...(needAuxiliaryParam ? {textForComponent, valueForComponent} : {})
            }
        }
        case DateType.year: {
            // 默认昨天
            const currentDay = date ? dayjs(date as Date) : dayjs().add(-1, 'day')
            time_value = currentDay.format('YYYY')
            textForComponent = currentDay.format('YYYY年')
            valueForComponent = currentDay.format(dateSelectorValueFormat)
            return {
                time_cycle: dateType,
                time_value,
                ...(needAuxiliaryParam ? {textForComponent, valueForComponent} : {})
            }
        }
        case DateType.custom: {
            // 默认昨天
            const currentDay = date ? [dayjs((date as Date[])[0]), dayjs((date as Date[])[1])] : [dayjs().add(-1, 'day'), dayjs().add(-1, 'day')]
            time_value = [currentDay[0].format('YYYY-MM-DD'), currentDay[1].format('YYYY-MM-DD')].join(',')
            textForComponent = currentDay[0].format('YYYY年MM月DD日') + ' ~ ' + currentDay[1].format('YYYY年MM月DD日')
            valueForComponent = [currentDay[0].format(dateSelectorValueFormat), currentDay[1].format(dateSelectorValueFormat)]
            return {
                time_cycle: dateType,
                time_value,
                ...(needAuxiliaryParam ? {textForComponent, valueForComponent} : {})
            }
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
    switch (param.time_cycle) {
        case DateType.day: {
            const dateParts = param.time_value?.split('-')
            let result = dateParts[0] + '年';
            result += Number(dateParts[1]) + '月';
            result += Number(dateParts[2]) + '日';
            return result;
        }
        case DateType.week : {
            const dateParts = param.time_value?.split('-')
            let result = dateParts[0] + '年';
            result += Number(dateParts[1]) + '周';
            return result;
        }
        case DateType.month: {
            const dateParts = param.time_value?.split('-')
            let result = dateParts[0] + '年';
            result += Number(dateParts[1]) + '月';
            return result;
        }
        case DateType.quarter: {
            const dateParts = param.time_value?.split('-')
            let result = dateParts[0] + '年';
            result += Number(dateParts[1]?.replace('Q', '') || '') + '季度';
            return result;
        }
        case DateType.year: {
            const dateParts = param.time_value?.split('-')
            let result = dateParts[0] + '年';
            return result
        }
        case DateType.custom: {
            let result = ''
            const dateParts1 = param.time_value?.split(',')[0]?.split('-')
            result += dateParts1[0] + '年';
            result += Number(dateParts1[1]) + '月';
            result += Number(dateParts1[2]) + '日';
            result += ' ~ '
            const dateParts2 = param.time_value?.split(',')[0]?.split('-')
            result += dateParts2[0] + '年';
            result += Number(dateParts2[1]) + '月';
            result += Number(dateParts2[2]) + '日';
            return result
        }
        default:
            throw new Error('invalid param in function getDateTextByParam')
    }
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
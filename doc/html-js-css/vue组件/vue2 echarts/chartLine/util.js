// 固定配置
import {colorDefault} from "../ChartColors.js";
import {legendWrap} from "../NameFormatter.js";

export const overallLineMultiOption = {
    color: ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc'],
    grid: {
        right: 90,
        containLabel: true
    },
    legend: {
        show: true,
        right: 0,
        width: 90,
        height: '72%',
        formatter: (value) => {
            value = value.replaceAll('（', '(').replaceAll('）', ')')
            if (value.includes('(')) {
                if (value.length > 9) {
                    return value.replaceAll('(', '\n(')
                }
                return value
            } else {
                return legendWrap(value, 7)
            }
        },
        top: 'center',
        orient: 'vertical',
        itemGap: 10
    }
}
// 固定配置
export const overallLineSingleOption = {
    color: colorDefault,
    grid: {},
    legend: {
        show: false,
    }
}


declare type SingleRingData = {
  total: number, // 总数
  percent: number,
  positive: number, // 圆环蓝色百分比
  positivePercent: number, // 圆环蓝色百分比
  negative: number, // 圆环橙色百分比
  negativePercent: number, // 圆环橙色百分比
  neutral: number,  // 圆环灰色百分比
  neutralPercent: number, // 圆环灰色百分比
}
declare interface CircleInRect{
  r: number,
  x: number,
  y: number
}
declare interface ChartRingScatterData extends SingleRingData {
  id: number,
  name:'',
}

declare interface ChartRingScatterDataForShow extends ChartRingScatterData ,CircleInRect{

}

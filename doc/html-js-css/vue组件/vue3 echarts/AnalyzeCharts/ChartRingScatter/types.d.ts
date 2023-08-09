declare type SingleRingData = {
  total: number, // 总数
  percent: number,
  [key: string]: number
}

declare interface CircleInRect {
  r: number,
  x: number,
  y: number
}

declare interface ChartRingScatterData extends SingleRingData {
  id: number,
  name: string,
}

declare interface ChartRingScatterDataForShow extends ChartRingScatterData, CircleInRect {

}

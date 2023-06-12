// 将圆设置比例（数量越大，圆环越大），并分布（百分比差值越大，越远离中心横轴）到指定的矩形中
// data 数据
// rMax 最大圆环的半径
// rectHeight 矩形高
// rectHeight 矩形宽
// isCompactLayout 是否使用紧凑视图。使用fakeData，并切换本参数可见效果。目前紧凑视图只能处理直接相邻圆环紧凑
const setBubbleInRect = (data: ChartRingScatterData[], rMax: number, rectHeight: number, rectWidth: number, isCompactLayout?: boolean): ChartRingScatterDataForShow[] => {
  const dataTmp: ChartRingScatterDataForShow[] = JSON.parse(JSON.stringify(data))
  // 宽度限制的每个圆的最大半径（所有圆排列成一行的最大半径）
  const rLimitByWidth = rectWidth / dataTmp.length / 2
  const rMin = Math.min(rLimitByWidth, rMax / 3 * 2)

  // 正负体验点差值的 最大最小值
  let minDiff = 100000000
  let maxDiff = 0
  // 体验数的 最大最小值
  let minTotal = 100000000
  let maxTotal = 0
  dataTmp.forEach(e => {
    minDiff = Math.min(minDiff, Math.abs(e.negativePercent - e.positivePercent))
    maxDiff = Math.max(maxDiff, Math.abs(e.negativePercent - e.positivePercent))
    minTotal = Math.min(minTotal, e.total)
    maxTotal = Math.max(maxTotal, e.total)
  })
  let dataForShowTmpUp: ChartRingScatterDataForShow[] = []
  let dataForShowTmpDown: ChartRingScatterDataForShow[] = []
  const dataForShowTmpMiddle: ChartRingScatterDataForShow[] = []
  dataTmp
    // 添加圆环大小 r 属性
    .forEach(e => {
      const tmp = {...e}
      if (maxTotal === 0 || maxTotal === minTotal) {
        tmp.r = rMax // 此处是所有数据均为0的情况
      } else {
        const rGrowMax = (rMax - rMin)
        const paramX = (e.total - minTotal) / (maxTotal - minTotal)
        const rGrow = rGrowMax * Math.pow(Math.sin(Math.PI / 2 * paramX), 3 / 5) // 不使用y=x方式等比增长,使用曲线增长，增加占比较小的圆环半径差值
        tmp.r = rMin + rGrow
      }
      // 正向负向分别记录到对应数组中
      if (tmp.positivePercent - tmp.negativePercent > 0) {
        dataForShowTmpUp.push(tmp);
      } else if (tmp.positivePercent - tmp.negativePercent < 0) {
        dataForShowTmpDown.push(tmp)
      } else {
        dataForShowTmpMiddle.push(tmp)
      }
    })

  //分别将上下两半，正负差值最大的数据排在前面
  dataForShowTmpUp = dataForShowTmpUp.sort((a, b) => (a.positivePercent - a.negativePercent) > (b.positivePercent - b.negativePercent) ? 1 : -1)
  dataForShowTmpDown = dataForShowTmpDown.sort((a, b) => (a.positivePercent - a.negativePercent) > (b.positivePercent - b.negativePercent) ? 1 : -1)

  const dataForShowTmp = []
  // 数据分上中下三部分，每次从数组里各取一个，放入总集合
  for (let i = 0; i < Math.max(dataForShowTmpUp.length, dataForShowTmpDown.length, dataForShowTmpMiddle.length); i++) {
    dataForShowTmpUp[i] && dataForShowTmp.push(dataForShowTmpUp[i]);
    dataForShowTmpMiddle[i] && dataForShowTmp.push(dataForShowTmpMiddle[i]);
    dataForShowTmpDown[i] && dataForShowTmp.push(dataForShowTmpDown[i]);
  }
  // 圆环在y轴正负差值关联的位移步长（之后每个圆环y = yPerPercent * (负向百分数-正向百分数) ）
  const yPerPercent = maxDiff ? (rectHeight / 2 - rMax) / maxDiff : 0

  const nextIsRight = { // 下一个圆圈分布在左还是右
    up: true,
    middle: false,
    bottom: true,
  }
  const currentCenterX = {
    left: rectWidth / 2, // 当前最左圆心
    right: rectWidth / 2 // 当前最右圆心
  }
  const addedCircleArr: CircleInRect[] = []

  // 从中间开始向两边依次添加圆环
  dataForShowTmp.forEach((e) => {
    e.y = yPerPercent * (e.positivePercent - e.negativePercent)
    let isRight
    if (e.y > 0) {
      isRight = nextIsRight.up
      nextIsRight.up = !nextIsRight.up
    } else if (e.y < 0 || 1 / e.y === -Infinity) { // 判断极小负数e.y=-0
      isRight = nextIsRight.bottom
      nextIsRight.bottom = !nextIsRight.bottom
    } else {
      isRight = nextIsRight.middle
      nextIsRight.middle = !nextIsRight.middle
    }
    if (isRight) { // 在整体右侧放置
      addedCircleArr.forEach(item => {
        if (isCompactLayout) {
          if (Math.abs(item.y - e.y) < item.r + e.r) {  // 紧凑并列圆环方法
            currentCenterX.right = Math.max(currentCenterX.right, item.x + Math.sqrt(Math.pow(item.r + e.r, 2) - Math.pow(item.y - e.y, 2)))
          }
        } else {
          currentCenterX.right = Math.max(currentCenterX.right, item.x + item.r + e.r)
        }
      })
      e.x = currentCenterX.right

    } else { // 在整体左侧放置
      addedCircleArr.forEach(item => {
        if (isCompactLayout) {
          if (Math.abs(item.y - e.y) < item.r + e.r) { // 紧凑并列圆环方法
            currentCenterX.left = Math.min(currentCenterX.left, item.x - Math.sqrt(Math.pow(item.r + e.r, 2) - Math.pow(item.y - e.y, 2)))
          }
        } else {
          currentCenterX.left = Math.min(currentCenterX.left, item.x - item.r - e.r)
        }
      })
      e.x = currentCenterX.left
    }
    addedCircleArr.push({
      r: e.r,
      x: e.x,
      y: e.y
    })
  })
  return dataForShowTmp
}
export default setBubbleInRect
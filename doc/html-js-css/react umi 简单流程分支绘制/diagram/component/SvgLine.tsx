import React, {useEffect, useState} from 'react'

export interface SvgLineProps {
  x1: number
  y1: number
  x2: number
  y2: number
  bendingXOffset?: number

  isDone?: boolean // 是否已经经过本线。false未经过：灰色； true已经过：蓝色
  strokeWidth?: number
  radius?: number

}

const SvgLine = (props: SvgLineProps) => {
  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)
  const [path, setPath] = useState('')
  const getColor = () => {
    return props.isDone ? '#2D528B' : '#CCD3DF'
  }
  useEffect(() => {

    const strokeWidth = props.strokeWidth || 2

    const xInSvg = Math.abs(props.x2 - props.x1)
    const yInSvg = props.y2 - props.y1
    let radius = props.radius || 0
    radius = Math.min(radius, Math.abs(xInSvg) / 2)
    radius = Math.min(radius, Math.abs(yInSvg) / 2)

    let bendingXOffset = props.bendingXOffset || 0
    bendingXOffset = Math.min(bendingXOffset, Math.abs(xInSvg) / 2 - radius)

    const yDirection = yInSvg >= 0 ? 1 : -1


    let pathTmp = ''
    if (yInSvg >= 0) {
      pathTmp = ` m 0 ${strokeWidth / 2} `
    } else {
      pathTmp = ` m 0 ${Math.abs(yInSvg) + strokeWidth / 2} `
    }
    if (!xInSvg || !yInSvg) {
      pathTmp += `l ${xInSvg} ${yInSvg}`
    } else {
      const halfX = xInSvg / 2
      const lineXLength = halfX - radius
      pathTmp += ` l ${lineXLength + (bendingXOffset || 0)} 0 `
      pathTmp += ` q ${radius} 0 ${radius} ${yDirection * radius} `
      const lineYLength = Math.abs(yInSvg) - radius * 2
      pathTmp += ` l 0 ${yDirection * lineYLength} `
      pathTmp += ` q 0 ${yDirection * radius} ${radius} ${yDirection * radius} `
      pathTmp += ` l ${lineXLength - (bendingXOffset || 0)} 0 `
    }
    setPath(pathTmp)

    setWidth(Math.abs(xInSvg))
    setHeight(Math.abs(yInSvg) + strokeWidth * 2)
  }, [props])

  const logPositionInfo = () => {
    console.log('svg position', `(${props.x1},${props.y1})`, `(${props.x2},${props.y2})`,)
  }
  return (
    <svg version="1.1" xmlns="http://www.w3.org/2000/svg"
         width={width}
         height={height}
         style={{
           position: "absolute",
           top: Math.min(props.y1, props.y2) || 0,
           left: Math.min(props.x1, props.x2) || 0,
           zIndex: 99
         }}
         onClick={logPositionInfo}
    >
      <path d={path} stroke={getColor()} fill="none" strokeWidth={props.strokeWidth}/>
    </svg>
  )
}
export default SvgLine

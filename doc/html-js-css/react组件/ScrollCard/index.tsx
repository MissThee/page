import React, {forwardRef, Ref, useEffect, useImperativeHandle, useRef, useState} from 'react'

export interface ScrollCardProps {
  data: ScrollCardItem[], // 卡片数据
  cardBgImage?: string, // 卡片背景
  onCenterCardChanged?: (scrollCardItem: ScrollCardItem) => void, // 中间卡片改变时触发
  onCardClick?: (scrollCardItem: ScrollCardItem) => void, // 卡片点击时触发

  width?: number // 轮播组件宽度
  height?: number // 轮播组件高度
}


export interface ScrollCardFunction {
  setActiveCardId: (id: number | string) => void;
}

// 卡片数据
export interface ScrollCardItem {
  id?: string | number,
  url?: string,
  name?: string,
  image?: string,
  CARD_INNER_ID?: number | null// 组件内部给卡片编制的id
}

// 组件内辅助参数
interface AuxiliaryParam {
  moveSpeed: number, // 滚动速度；滚动距离/帧
  moveSpeedDirectionLast: number, // 滚动速度最后的方向，不含无方向情况
  prePerformanceTimestamp: number, // 配合requestAnimationFrame记录时间间隔用的时间戳
  moveDistanceTmp: number, // 记录卡片移动距离
  isDragging: boolean, // 是否正在用鼠标拖拽。（拖拽时会取消自动对齐）
  sideCardNumber: number, // 无渐隐效果的单边卡片数量
  cardHalfNum: number, // 记录数据的中间下标
  activeCardInnerId: number | null | undefined,// 当前在中间的卡片的内部id
  clickedCardInnerId: number | null | undefined,// 点击的卡片的内部id。此id不为null时会触发滚动聚焦动画
  clickedCardIndex: number | null,// 点击时，点击的卡片的所在位置下标。用来和中间位置下标比较，确定滚动方向
  centerCardLeftX: number, // 居中的卡片距离容器左侧的距离。为了让所有卡片以容器中间为基准
  refreshTimeout: NodeJS.Timeout | number | null, // 循环刷新的控制器
}

// 配置参数（暂时未整理到props中，使用固定值）
const moveMaxSpeed = 60 // 最大滚动速度；滚动距离/帧
const moveFriction = 20 // 阻力；距离/帧
const moveAcceleration = 23 // 加速度；作用于滑轮，每触发一次滑轮，累加一次加速符
const refreshSplitTime = 16 // 动画刷新时间间隔，为达到60FPS,设置为1秒/60,约为16毫秒。此间隔在浏览器不支持requestAnimationFrame时，做settimeout降级方案使用
const cardHeight = 370 // 卡片高度
const cardWidth = 300 // 卡片宽度
const showPlaceWidth = 2400 // 容纳原大小卡片的视窗宽度
const cardMinScaleRate = 0.7 // 卡片最小缩放比例
const autoFocusMoveSpeed = 15 // 进入自动聚焦卡片状态的最低速度阈值；也是自动聚焦时的滚动速度
const clickedFocusMoveSpeed = 25 // 点击卡片后，聚焦滚动速度
const sideCardMaxNumber = 4 // 无渐隐效果的单边卡片最大数量


const ScrollCard = (props: ScrollCardProps, ref: Ref<ScrollCardFunction>) => {
  // 辅助参数（存储一些动画实现相关的变量，此对象中属性的改变均无需直接触发视图渲染）
  const auxiliaryParam = useRef<AuxiliaryParam>({
    moveSpeed: 0,
    moveSpeedDirectionLast: 0,
    prePerformanceTimestamp: 0,
    moveDistanceTmp: 0,
    isDragging: false,
    sideCardNumber: 0,
    cardHalfNum: 0,
    activeCardInnerId: null,
    clickedCardInnerId: null,
    clickedCardIndex: null,
    centerCardLeftX: 0,
    refreshTimeout: null,
  })
  // 展示的卡片数据
  const [showCardData, setShowCardData] = useState<ScrollCardItem[]>([])
  // 卡片偏移距离
  const [moveDistance, setMoveDistance] = useState<number>(0)
  // 偏移卡片(使用margin偏移卡片，充当滚动动画。当偏移距离达到一个卡片的宽度时，重排卡片顺序，并重置偏移距离)
  const moveCard = (x: number) => {
    setMoveDistance((old) => {
      if (old + x > cardWidth) {
        setShowCardData((oldCardData) => {
          return [...oldCardData.slice(-1), ...oldCardData.slice(0, -1)]
        })
        auxiliaryParam.current.moveDistanceTmp = 0
        return 0
      }
      if (old + x < -cardWidth) {
        setShowCardData((oldCardData) => {
          return [...oldCardData.slice(1), ...oldCardData.slice(0, 1)]
        })
        auxiliaryParam.current.moveDistanceTmp = 0
        return 0
      }
      auxiliaryParam.current.moveDistanceTmp = old + x
      return old + x
    })
  }
  // 鼠标移动监听事件
  const mouseMoveHandler = (e: MouseEvent) => {
    if (e.buttons !== 0) { // 鼠标有按钮按下时
      auxiliaryParam.current.isDragging = true
      auxiliaryParam.current.moveSpeed = e.movementX
      auxiliaryParam.current.clickedCardInnerId = null
    } else {
      auxiliaryParam.current.isDragging = false
    }
  }
  // 鼠标滚轮监听事件（兼容chrome与ff）
  const mouseWheelHandler = (e: WheelEvent) => {
    if (e.deltaY !== undefined) { // chrome
      auxiliaryParam.current.moveSpeed -= e.deltaY / Math.abs(e.deltaY) * moveAcceleration
    } else if (e.detail !== undefined) { // ff
      auxiliaryParam.current.moveSpeed -= e.detail / Math.abs(e.detail) * moveAcceleration
    }
    auxiliaryParam.current.clickedCardInnerId = null
    auxiliaryParam.current.clickedCardIndex = null
  }
  // 卡片点击事件
  const cardClickHandler = (item: ScrollCardItem, index: number) => {
    if (auxiliaryParam.current.isDragging) {
      return
    }
    auxiliaryParam.current.clickedCardInnerId = item.CARD_INNER_ID
    auxiliaryParam.current.clickedCardIndex = index
    auxiliaryParam.current.moveSpeed = clickedFocusMoveSpeed * (auxiliaryParam.current.cardHalfNum - index)
    if (props.onCardClick) {
      const outputItem = item ? JSON.parse(JSON.stringify(item)) : null
      if (outputItem) {
        delete outputItem.CARD_INNER_ID
      }
      props.onCardClick(outputItem)
    }
  }
  // 卡片滚动动画 执行方法 (分不同情况对卡片进行不同的移动方式，达成卡片就近聚焦的效果)
  const moveAnimate = (delta: number) => {
    const direction = auxiliaryParam.current.moveSpeed / Math.abs(auxiliaryParam.current.moveSpeed || 1)
    if (direction) {
      auxiliaryParam.current.moveSpeedDirectionLast = direction
    }
    if (auxiliaryParam.current.isDragging) {
      moveCard(auxiliaryParam.current.moveSpeed)
      auxiliaryParam.current.moveSpeed = Math.round(Math.min(Math.abs(auxiliaryParam.current.moveSpeed), moveMaxSpeed) - moveFriction / delta) * direction
      return
    }
    // 聚焦点击的卡片
    if (auxiliaryParam.current.clickedCardInnerId !== null) {
      if (auxiliaryParam.current.clickedCardInnerId === auxiliaryParam.current.activeCardInnerId) {
        if (Math.floor(Math.abs(auxiliaryParam.current.moveDistanceTmp)) === 0) {
          auxiliaryParam.current.moveSpeed = 0
          auxiliaryParam.current.clickedCardInnerId = null
          auxiliaryParam.current.clickedCardIndex = null
        } else {
          auxiliaryParam.current.moveSpeed = clickedFocusMoveSpeed * auxiliaryParam.current.moveSpeedDirectionLast
          moveCard(auxiliaryParam.current.moveSpeed)
          return
        }
      } else if (auxiliaryParam.current.clickedCardIndex !== null) {
        auxiliaryParam.current.moveSpeed = clickedFocusMoveSpeed * (auxiliaryParam.current.cardHalfNum - auxiliaryParam.current.clickedCardIndex)
        moveCard(auxiliaryParam.current.moveSpeed)
        return
      }
    }
    // 低速时自动对准卡片
    if (Math.abs(auxiliaryParam.current.moveSpeed) <= autoFocusMoveSpeed && Math.floor(Math.abs(auxiliaryParam.current.moveDistanceTmp)) !== 0) {
      auxiliaryParam.current.moveSpeed = autoFocusMoveSpeed * auxiliaryParam.current.moveSpeedDirectionLast
      moveCard(auxiliaryParam.current.moveSpeed)
      if (Math.floor(Math.abs(auxiliaryParam.current.moveDistanceTmp)) === 0) {
        auxiliaryParam.current.moveSpeed = 0
      }
      return
    }

    if (Math.abs(auxiliaryParam.current.moveSpeed) > autoFocusMoveSpeed) {
      moveCard(auxiliaryParam.current.moveSpeed)
      auxiliaryParam.current.moveSpeed = Math.round(Math.min(Math.abs(auxiliaryParam.current.moveSpeed), moveMaxSpeed) - moveFriction / delta) * direction
    }
  }
  // 卡片滚动动画 循环刷新方法
  const refreshAnimate = () => {
    if (window.requestAnimationFrame) {
      auxiliaryParam.current.refreshTimeout = window.requestAnimationFrame(() => {
        if (auxiliaryParam.current.prePerformanceTimestamp) {
          moveAnimate(window.performance.now() - auxiliaryParam.current.prePerformanceTimestamp)
        }
        auxiliaryParam.current.prePerformanceTimestamp = window.performance.now()
        refreshAnimate()
      })
    } else {
      auxiliaryParam.current.refreshTimeout = setTimeout(() => {
        moveAnimate(refreshSplitTime)
        refreshAnimate()
      }, refreshSplitTime)
    }
  }

  // 监听卡片数据改变时，重置组件
  useEffect(() => {
    const dataTmp = JSON.parse(JSON.stringify(props.data))
    dataTmp.forEach((item: ScrollCardItem, index: number) => {
      item.CARD_INNER_ID = index
    })
    auxiliaryParam.current.cardHalfNum = Math.floor(dataTmp.length / 2)
    auxiliaryParam.current.centerCardLeftX = showPlaceWidth / 2 - cardWidth / 2
    auxiliaryParam.current.activeCardInnerId = auxiliaryParam.current.cardHalfNum
    auxiliaryParam.current.sideCardNumber = Math.min(sideCardMaxNumber, Math.ceil(auxiliaryParam.current.cardHalfNum - 1))

    setShowCardData([...dataTmp.slice(-auxiliaryParam.current.cardHalfNum), ...dataTmp.slice(0, -auxiliaryParam.current.cardHalfNum)])
    setMoveDistance(0)
  }, [props.data])

  useEffect(() => {
    if (showCardData[auxiliaryParam.current.cardHalfNum]) {
      auxiliaryParam.current.activeCardInnerId = showCardData[auxiliaryParam.current.cardHalfNum].CARD_INNER_ID
    }
    const outputActiveCard = showCardData[auxiliaryParam.current.cardHalfNum] ? JSON.parse(JSON.stringify(showCardData[auxiliaryParam.current.cardHalfNum])) : null
    if (outputActiveCard) {
      delete outputActiveCard.CARD_INNER_ID
    }
    props.onCenterCardChanged?.(outputActiveCard)
  }, [showCardData])

  useEffect(() => {
    refreshAnimate()
    const mousewheelEventName = (/Firefox/i.test(navigator.userAgent)) ? "DOMMouseScroll" : "mousewheel";
    window.addEventListener('mousemove', mouseMoveHandler)
    // @ts-ignore
    window.addEventListener(mousewheelEventName, mouseWheelHandler)
    return () => {
      if (auxiliaryParam.current.refreshTimeout) {
        clearInterval(auxiliaryParam.current.refreshTimeout as NodeJS.Timeout)
        if (typeof auxiliaryParam.current.refreshTimeout === "number") {
          window.cancelAnimationFrame(auxiliaryParam.current.refreshTimeout)
        }
        auxiliaryParam.current.refreshTimeout = null
      }
      window.removeEventListener('mousemove', mouseMoveHandler)
      // @ts-ignore
      window.removeEventListener(mousewheelEventName, mouseWheelHandler)
    }
  }, [])


  useImperativeHandle(ref, () => ({
    setActiveCardId: (id: string | number) => {
      if (id === undefined || id === null) {
        return
      }
      for (let index = 0; index < showCardData.length; index += 1) {
        const item = showCardData[index]
        if (item.id === id) {
          auxiliaryParam.current.clickedCardInnerId = item.CARD_INNER_ID
          auxiliaryParam.current.clickedCardIndex = index
          auxiliaryParam.current.moveSpeed = clickedFocusMoveSpeed * (auxiliaryParam.current.cardHalfNum - auxiliaryParam.current.clickedCardIndex)
          break
        }
      }
    },
  }));

  return (
    <>
      <div style={{
        textAlign: "left",
        width: props.width || 1300,
        height: props.height || (cardHeight + 10),
        overflow: "hidden",
        position: "relative",
        marginLeft: 200
      }}>
        <div style={{
          // border:'1px solid red',
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: 'translate(-50%,-50%)',
          width: showPlaceWidth,
          userSelect: 'none',
          overflow: "hidden",
          height: cardHeight,
          whiteSpace: 'nowrap',
        }}>
          <div style={{
            display: "inline-block",
            marginLeft: `${moveDistance + auxiliaryParam.current.centerCardLeftX - cardWidth * auxiliaryParam.current.cardHalfNum}px`,
          }}>
            {showCardData.map((item, index) => {
              return (
                <div key={index}
                     style={{
                       width: cardWidth,
                       height: cardHeight,
                       display: "inline-block",
                       // backgroundColor: "deepskyblue",
                       position: "relative",
                       cursor: "pointer",
                       overflow: "hidden",
                       // border: '1px solid black',
                     }}
                     ref={el => {
                       // 计算缩放率。依据卡片距中间位置距离。均以左侧边为准计算
                       const dynamicScaleRate = (1 - cardMinScaleRate) * Math.min((auxiliaryParam.current.centerCardLeftX - Math.abs(auxiliaryParam.current.centerCardLeftX - (el?.offsetLeft || 0))) / auxiliaryParam.current.centerCardLeftX, 1)
                       // 计算位移距离。依据卡片距中间位置距离。均以左侧边为准计算
                       const cardMoveX = auxiliaryParam.current.centerCardLeftX - (el?.offsetLeft || 0)
                       const dynamicTranslateX = cardWidth / 2 * ((cardMoveX / cardWidth / 1.6) ** 2) * ((Math.floor(cardMoveX) / Math.abs(Math.floor(cardMoveX))) || 0)
                       // 计算层叠。直接使用缩放率当层级，大的在前面
                       const zIndex = Math.floor(dynamicScaleRate * 10) + 100
                       const opacity = 1 - Math.max(Math.abs(auxiliaryParam.current.centerCardLeftX - (el?.offsetLeft || 0)) - cardWidth * auxiliaryParam.current.sideCardNumber, 0) / (cardWidth * Math.max(auxiliaryParam.current.cardHalfNum - auxiliaryParam.current.sideCardNumber, 1))
                       if (el) {
                         el.style.transform = `scale(${cardMinScaleRate + dynamicScaleRate}) translateX(${dynamicTranslateX}px)`
                         el.style.zIndex = `${zIndex}`
                         el.style.opacity = `${opacity}`
                       }
                     }}
                     onClick={() => {
                       cardClickHandler(item, index)
                     }}
                >
                  {/* 卡片内部内容 */}
                  <div style={{
                    height: '100%',
                    textAlign: 'center',
                    borderRadius: 7,
                    fontSize: 24,
                    fontWeight: 'bold',
                    color: 'white',
                    backgroundImage: `url(${props.cardBgImage})`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                    backgroundSize: "cover"
                  }}>
                    <div style={{
                      height: 260,
                      color: 'white',
                      backgroundImage: `url(${item.image})`,
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "center",
                    }}/>
                    <div>{item.name}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
}

export default forwardRef<ScrollCardFunction, ScrollCardProps>(ScrollCard);

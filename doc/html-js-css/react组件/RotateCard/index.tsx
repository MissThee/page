import './style.less'
import React, {useState} from "react";

interface Props {
  children?: React.ReactNode
}

const RotateCard = (props: Props) => {
  const [isHover, setIsHover] = useState(false)
  const [myTimeout, setMyTimeout] = useState<NodeJS.Timeout | null>(null)
  const mouseHoverHandler = () => {
    if (myTimeout) {
      clearTimeout(myTimeout)
    }
    setIsHover(true)
  }
  const mouseLeaveHandler = () => {
    const t = setTimeout(() => {
      setIsHover(false)
    }, 1500)
    setMyTimeout(t)
  }
  return (
    <div className='rotate-card' onMouseOver={mouseHoverHandler} onFocus={mouseHoverHandler} onMouseLeave={mouseLeaveHandler}>
      <div className='rotate-card__body'>
        <div className={`rotate-card__front ${isHover ? 'rotate-card__front--hover' : ''}`}>
          {props.children && props.children[0]}
        </div>
        <div className={`rotate-card__back ${isHover ? 'rotate-card__back--hover' : ''}`}>
          {props.children && props.children[1]}
        </div>
      </div>
    </div>
  )
}
export default RotateCard

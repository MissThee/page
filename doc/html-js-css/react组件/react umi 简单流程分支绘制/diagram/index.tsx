import React, {CSSProperties, useEffect, useState} from "react";
import AbsoluteBox from "@/pages/item/view/component/diagram/component/AbsoluteBox/index";
import SvgLine from "@/pages/item/view/component/diagram/component/SvgLine";
import styles from './style.less'

export interface DiagramData {
  id: number
  name: string
  real_name: string
  parent_id: number[]
  color: string
}

// 支持简单的从左向右、分支、汇合 的流程图。（不支持循环路径：采用处理完父节点才会处理子节点的处理方式，循环的部分会全部不处理
interface NodeData {
  key: number | string,
  x?: number,
  y?: number,
  width?: number,
  children?: React.ReactNode
  style?: CSSProperties
  color?: string
  title?: string
  name?: string
  titleStyle?: CSSProperties
  nameStyle?: CSSProperties
}

interface LineData {
  from: number | string,
  to: number | string,
}

interface DiagramProps {
  data: {
    lineData: LineData[],
    nodeData: NodeData[]
  }
}

export const diagramDataFormat = (data: DiagramData[]) => {
  const nodeData: NodeData[] = []
  let lineData: LineData[] = []

  data.forEach((item: any) => {
    nodeData.push({key: item.id, title: item.name, name: item.real_name, color: item.color})
    if (item.parent_id) {
      item.parent_id.forEach((parentId: any) => {
        if (String(parentId) !== String(item.id)) {
          lineData.push({from: parentId, to: item.id})
        }
      })
    }
  })
  // 过滤掉父节点不存在的关系
  lineData = lineData.filter(line => !!nodeData.find(node => node.key === line.from))
  return {nodeData, lineData}
}

const Diagram = (props: DiagramProps) => {
  const startPosition = {x: 60, y: 75} // 起始定位
  const childRowTotalHeight = 300 // 出现分支时，分支平分高度
  const nodeMarginSide = 14 // node间距
  const textPadding = 4 // 文字左右padding
  const textWidth = 12 // 单个文字宽度
  const nodeMinWidth = 60 // node最小宽度

  const [nodeData, setNodeData] = useState<NodeData[]>([])
  const [lineData, setLineData] = useState<LineData[]>([])

  // useEffect(() => {
  //   // 测试数据
  //   setNodeData([
  //     {key: 'A1', title: '提交', name: 'A1'},
  //     {key: 'A2', title: '审批', name: 'A2'},
  //     {key: 'A3', title: '竞标取消竞标取消', name: 'A3'},
  //     {key: 'B1', title: '指派指派指派', name: 'B1'},
  //     {key: 'B2', title: '提交', name: 'B2'},
  //     {key: 'B3', title: '审批', name: 'B3'},
  //     {key: 'C1', title: '审批', name: 'C1'},
  //     {key: 'D1', title: '审批', name: 'D1'},
  //     {key: 'D2', title: '立项丢标签订', name: 'D2'},
  //     {key: 'D3', title: '提交', name: 'D3'},
  //     {key: 'D4', title: '审批', name: 'D4'},
  //     {key: 'D5', title: '立项', name: 'D5'},
  //     {key: 'E1', title: '指派', name: 'E1'},
  //     {key: 'E2', title: '审批', name: 'E2'},
  //     {key: 'F1', title: '审批', name: 'F1'},
  //     {key: 'G1', title: '启动', name: 'G1'},
  //     {key: 'G2', title: '审批', name: 'G2'},
  //     {key: 'G3', title: '交付', name: 'G3'},
  //     {key: 'G4', title: '审批', name: 'G4'},
  //     {key: 'G5', title: '审批', name: 'G5'},
  //   ])
  //   setLineData([
  //     {from: 'A1', to: 'A2'},
  //     {from: 'A2', to: 'A3'},
  //     {from: 'A3', to: 'B1'},
  //     {from: 'B1', to: 'B2'},
  //     {from: 'B2', to: 'B3'},
  //     {from: 'A3', to: 'C1'},
  //     {from: 'B3', to: 'D1'},
  //     {from: 'C1', to: 'D1'},
  //     {from: 'D1', to: 'D2'},
  //     {from: 'D2', to: 'D3'}, {from: 'D3', to: 'D4'}, {from: 'D4', to: 'D5'}, {from: 'D5', to: 'E1'}, {from: 'D5', to: 'F1'},
  //     // {from: 'D2', to: 'E1'},{from: 'D2', to: 'F1'},
  //     {from: 'E1', to: 'E2'},
  //     {from: 'E2', to: 'G1'},
  //     {from: 'F1', to: 'G1'},
  //     {from: 'G1', to: 'G2'},
  //     {from: 'G2', to: 'G3'},
  //     {from: 'G3', to: 'G4'},
  //     {from: 'G4', to: 'G5'},
  //   ])
  // }, [])

  // useEffect(() => {
  //   // 测试数据
  //   setNodeData([
  //     {color: 'green', key: 'A1', title: '客户经理提交', name: '高源'},
  //     {color: 'green', key: 'A2', title: '客户经理领导审批', name: '马腾'},
  //     {color: 'green', key: 'A3', title: '客户经理选择竞标/取消', name: '高源'},
  //     {color: 'green', key: 'B1', title: '项目归属部门负责人指派竞标负责人', name: '邓涛'},
  //     {color: 'green', key: 'B2', title: '竞标负责人提交', name: '李明迪'},
  //     {color: 'green', key: 'B3', title: '项目归属部门负责人审批', name: '邓涛'},
  //     {color: 'green', key: 'C1', title: '客户经理提交', name: '高源'},
  //     {color: 'green', key: 'C2', title: '客户经理领导审批', name: '马腾'},
  //     {color: 'green', key: 'D1', title: 'sbu负责人审批', name: '高源'},
  //     {color: 'green', key: 'D2', title: '客户经理选择丢标/立项', name: '高源'},
  //     {color: 'green', key: 'D3', title: '提交', name: '高源'},
  //     {color: 'green', key: 'D4', title: '审批', name: '高源'},
  //     {color: 'green', key: 'D5', title: '立项', name: '高源'},
  //     {color: 'green', key: 'E1', title: '项目归属部门负责人指派项目经理', name: '高源'},
  //     {color: 'green', key: 'E2', title: '项目经理提交', name: '高源'},
  //     {color: 'green', key: 'F1', title: '客户经理提交', name: '高源'},
  //     {color: 'green', key: 'G1', title: '项目经理启动', name: '高源'},
  //     {color: 'green', key: 'G2', title: '项目经理提交', name: '高源'},
  //     {color: 'green', key: 'G3', title: '项目经理领导审批', name: '高源'},
  //     {color: 'green', key: 'G4', title: '项目经理交付', name: '高源'},
  //     {color: 'green', key: 'G5', title: '项目经理提交', name: '高源'},
  //     {color: 'green', key: 'G6', title: '项目归属部门负责人审批', name: '高源'},
  //     {color: 'green', key: 'G7', title: '专家组审批', name: '高源'},
  //   ])
  //   setLineData([
  //     {from: 'A1', to: 'A2'},
  //     {from: 'A2', to: 'A3'},
  //     {from: 'A3', to: 'B1'},
  //     {from: 'B1', to: 'B2'},
  //     {from: 'B2', to: 'B3'},
  //     {from: 'A3', to: 'C1'},
  //     {from: 'C1', to: 'C2'},
  //     {from: 'B3', to: 'D1'},
  //     {from: 'C2', to: 'D1'},
  //     {from: 'D1', to: 'D2'},
  //     {from: 'D2', to: 'D3'}, {from: 'D3', to: 'D4'}, {from: 'D4', to: 'D5'}, {from: 'D5', to: 'E1'}, {from: 'D5', to: 'F1'},
  //     // {from: 'D2', to: 'E1'},{from: 'D2', to: 'F1'},
  //     {from: 'E1', to: 'E2'},
  //     {from: 'E2', to: 'G1'},
  //     {from: 'F1', to: 'G1'},
  //     {from: 'G1', to: 'G2'},
  //     {from: 'G2', to: 'G3'},
  //     {from: 'G3', to: 'G4'},
  //     {from: 'G4', to: 'G5'},
  //   ])
  // }, [])

  useEffect(() => {
    setNodeData(JSON.parse(JSON.stringify(props.data?.nodeData || [])))
    setLineData(JSON.parse(JSON.stringify(props.data?.lineData || [])))
  }, [props.data])

  const buildNodes = (currentProcessingKeys: string[], currentPosition: { x: number, y: number }, childMap: Record<string, string[]>, parentMap: Record<string, string[]>, doneNodes?: NodeData[], doneKeys?: Record<number, boolean>) => {
    if (!doneKeys) { // 处理过的节点。value为true表明已被处理
      doneKeys = {}
    }
    if (!currentProcessingKeys) { // 开始节点/当前处理的节点key
      return
    }
    currentProcessingKeys.forEach((key, index) => {
      // 已处理过的节点不再做处理，直接跳过
      if (doneKeys?.[key]) {
        return
      }
      // 判断当前节点的所有父节点，尚未处理完，则先不处理本节点；所有父节点已处理完，则处理本节点
      const parentKeys = parentMap[key]
      if (parentKeys && parentKeys.filter(parentKey => !doneKeys?.[parentKey]).length > 0) {
        return
      }
      // 当前节点
      const node = nodeData.find(e => String(e.key) === String(key))
      if (node) {
        const broNums = currentProcessingKeys.length
        node.width = Math.max(nodeMinWidth, Math.max(node.name?.length || 0, node.title?.length || 0) * textWidth + textPadding * 2) // 当前节点宽度
        if (parentKeys) { // 如果有父节点，则需要以父节点位置，计算相对原点
          let minY = Number.MAX_VALUE
          let maxY = 0
          let maxX = 0
          let maxWidth = 0
          if (doneNodes) {
            doneNodes.forEach((e: NodeData) => {
              if (parentKeys.includes(String(e.key))) {
                minY = Math.min(minY, e.y || Number.MAX_VALUE)
                maxY = Math.max(maxY, e.y || 0)
                maxX = Math.max(maxX, e.x || 0)
                maxWidth = Math.max(maxWidth, e.width || 0)
              }
            })
          }
          currentPosition.y = (maxY + minY) / 2
          currentPosition.x = maxX + maxWidth / 2 + node.width / 2 + nodeMarginSide
        }
        node.x = currentPosition.x
        node.y = currentPosition.y - (1 / 2 - (index + 1) / (broNums + 1)) * childRowTotalHeight
        if (doneKeys) {
          doneKeys[key] = true
        }
        if (doneNodes) {
          doneNodes.push(node)
        }
        buildNodes(childMap[key], {y: node.y, x: node.x}, childMap, parentMap, doneNodes, doneKeys)
      }
    })
  }

  const setNodeColor = (activeNodeKeys: (string | number)[], nodes: NodeData[], doneKeys?: (string | number)[]) => {
    if (!doneKeys) {
      doneKeys = [] // 记录已经设置过的节点key，防止重复设置
    }
    doneKeys.push(...activeNodeKeys.map(e => String(e)))
    activeNodeKeys.forEach(activeNodeKey => {
      const passedNodeKeys = lineData.filter(line => String(line.to) === String(activeNodeKey)).map(line => String(line.from))
      // 给已经经过的节点设置颜色
      // nodes.forEach(e => {
      //   if (passedNodeKeys.includes(String(e.key))) {
      //     if (!e.color) {
      //       e.color = '#3761FF'
      //     }
      //   }
      // })
      setNodeColor(passedNodeKeys.filter(key => !doneKeys?.includes(key)), nodes, doneKeys)
    })
  }

  const buildDiagram = () => {
    if (!nodeData.length && !lineData.length) {
      return null
    }
    // ------------------------构建节点------------------------
    const childMap: Record<string, string[]> = {}
    const parentMap: Record<string, string[]> = {}

    lineData.forEach(line => {
      if (!childMap[line.from]) {
        childMap[line.from] = []
      }
      childMap[line.from].push(String(line.to))

      if (!parentMap[line.to]) {
        parentMap[line.to] = []
      }
      parentMap[line.to].push(String(line.from))
    })
    const nodes: NodeData[] = []
    let startKey
    if (lineData.length > 0) {
      startKey = String(lineData.filter(line => !parentMap[line.from])[0]?.from || lineData[0]?.from)
    } else if (nodeData.length > 0) {
      startKey = String(nodeData[0].key)
    }
    if (!startKey) {
      return null
    }
    buildNodes([startKey], startPosition, childMap, parentMap, nodes, {}) // 这个方法会改变nodes中数据

    // 处理已经过的节点颜色
    const activeNodeKeys = nodes.filter(node => node.color).map(e => String(e.key))
    setNodeColor(activeNodeKeys, nodes) // 这个方法会改变nodes中数据

    const nodeEls = nodes.map(node => {
        node.style = {width: node.width, fontSize: `${textWidth}px`}
        return <AbsoluteBox key={node.key} x={node.x || 0} y={node.y || 0} title={node.title} name={node.name} color={node.color} style={node.style} titleStyle={node.titleStyle} nameStyle={node.nameStyle}/>
      }
    )

    // ------------------------构建线------------------------
    const lineEls = lineData.map((line, index) => {
      const fromNode = nodeData.find(e => String(e.key) === String(line.from))
      const toNode = nodeData.find(e => String(e.key) === String(line.to))
      if (fromNode &&
        toNode &&
        fromNode.x !== undefined &&
        fromNode.y !== undefined &&
        fromNode.width !== undefined &&
        toNode.x !== undefined &&
        toNode.y !== undefined &&
        toNode.width !== undefined
      ) {
        let bendingXOffset = 0
        if (parentMap[line.to]) {
          let maxParentNodeX = 0
          parentMap[line.to].forEach(parentKey => {
            const parentNode = nodes.find(e => String(e.key) === String(parentKey))
            if (parentNode) {
              maxParentNodeX = Math.max(maxParentNodeX, (parentNode.x || 0) + (parentNode.width || 0) / 2)
            }
          })
          bendingXOffset = (maxParentNodeX - ((fromNode?.x || 0) + (fromNode?.width || 0) / 2)) / 2
        }
        const isDone = !!(fromNode?.color && toNode?.color)

        return <SvgLine key={`line${index}`} x1={fromNode.x + fromNode.width / 2} y1={fromNode.y} x2={toNode.x - toNode.width / 2} y2={toNode.y} isDone={isDone} bendingXOffset={bendingXOffset}/>
      }
      return null
    }).filter(e => !!e)
    return [...nodeEls, ...lineEls]
  }

  return (
    <div className={styles.diagrams} style={{height: startPosition.y * 2 + 10}}>
      <div className={styles.diagrams__content}>
        {/* 左上角为(0,0)，向下为y正向，向右为x正向 */}
        {nodeData.length ? buildDiagram() : null}
      </div>
    </div>
  )
}
export default Diagram

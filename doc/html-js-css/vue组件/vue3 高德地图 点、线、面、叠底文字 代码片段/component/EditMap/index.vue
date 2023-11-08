<template>
  <div class="lose-map">
    <div class="chart-map" ref="chartEl"/>
    <div class="recommend-info" v-if="recommendInfo">
      <span>{{ recommendInfo }}</span>
    </div>
    <div class="version">{{ props.version }}</div>
    <!--  路线查询  -->
    <SearchWay v-if="!hideSearchWay" ref='searchWayRef'
               :mapInstance="mapInstance"
               :city="props.mapParams?.cityName"
    />
    <!--  工单详情面板  -->
    <ServiceDetail :data="markerDetail"
                   :isReadOnly="props.isReadOnly"
                   @addressClick="addAddressToWaySearch"
                   @close=" markerDetail.order_no =''"
                   @orderDateChange="orderDateChangeHandler"
    />
    <!--  点附加菜单  -->
    <el-cascader-panel
        v-if="opationalStyle.isPointMenuShow"
        v-model="opationalActive"
        class="opational_box"
        @change="opationalChangeHandler"
        @expand-change="getCheckedNodes"
        :style="{ top: opationalStyle.top + 'px', left: opationalStyle.left + 'px'}"
        :options="opationalList"
    />
    <!--  原因输入框  -->
    <div v-if="opationalStyle.isReasonShow"
         :style="(opationalStyle.top!==null && opationalStyle.left !==null) ? { top: opationalStyle.top + 'px', left: opationalStyle.left + 'px'}:{top:'50%',left:'50%',transform:'translate(-50%,-50%)'}"
         class="reason_wrap">
      <el-input v-model="operateSaveInfo.reason" type="textarea" placeholder="请输入修改原因"/>
      <div style="text-align: right">
        <el-button @click="defaultReason">取消</el-button>
        <el-button type="primary" @click="saveReason">确定</el-button>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
export default {
  name: 'editMap',
}

export enum MarkBtn {
  Insert = 'insert',
  Swap = 'swap',
  Copy = 'copy',
  Delete = 'delete',
}
</script>
<script lang="ts" setup>
import {shallowRef} from '@vue/reactivity'
import Moment from 'moment'
import {reactive, ref, onMounted, defineExpose, defineProps, defineEmits, watch, withDefaults, onBeforeUnmount} from 'vue'
import * as intelliSchedulingApi from '@/api/intelliScheduling'

import {ElMessage} from 'element-plus'
import SearchWay from "./components/searchWay.vue";
import ServiceDetail from "./components/serviceDetail.vue";
import {buildIcon, SVGBgPart, SVGIconPart} from "@/views/admin/wayMap/intelliScheduling/component/EditMap/svgIconBuilder";

const emits = defineEmits(['updatePoint', 'save', 'polygonClick'])

interface point {
  [key: string]: any;
}

declare let AMap: any

// 获得当前的城市
const props = withDefaults(defineProps<{
  isReadOnly?: boolean
  mapParams?: { cityName: string, chooseDate: string },
  mapMarkAll: any[],
  mapLineShow: Record<string, any> | Record<never, never>,
  mapLineAll: Record<string, any> | Record<never, never>,
  mapPolygonAll: any[]
  version?: string,
  recommendInfo?: string,
  hideSearchWay?: boolean
  showRegionName?: boolean
}>(), {
  mapMarkAll: () => [],
  mapLineShow: () => ({}),
  mapLineAll: () => ({}),
  mapPolygonAll: () => [],
  version: undefined,
  recommendInfo: undefined,
})

const mapInstance = shallowRef<any>(null)
let massMarkInMap: any = null
let lineInMap: Record<string, any> = ({})
let polygonInMap: any[] = []
const labelsLayerInMap: any = new AMap.LabelsLayer({
  zooms: [3, 20],
  collision: false,
})
let labelMarkInMap: any[] = []

const activePolygonKey = ref<string>()
const getActivePolygonKeyByExtData = (extData: any) => extData.cityCode + "-" + extData.regionNo
const searchWayRef = ref()
// 服务单详情
const markerDetail = reactive({
  identity_card_no: '',
  engineer_name: '',
  engineer: '',
  time: '',
  value: [],
  service_duration: '',
  area_size: '',
  order_no: '',
  products: '',
  service_pcount: '',
  last_engineer: '',
  service_times: '',
  lng: '',
  lat: '',
  children: [],
  appointment_time: '',
  address: '',
  onsite_remark: '',
  order_remark: '',
  ago_time: '',
  modification_record: [],
  is_mars: false,
  is_mars_appoint: false,
  is_xpest_self: false,
  is_edited: false
})


let opationalList = ref([])
let opationalActive = ref<any[]>([])
const opationalStyle = reactive({// 操作下拉框和修改原因的位置
  top: null,
  left: null,
  isReasonShow: '',
  isPointMenuShow: false
})
const closeOpationalFloatItem = () => {
  opationalStyle.left = null
  opationalStyle.top = null
  opationalStyle.isPointMenuShow = false
  opationalStyle.isReasonShow = ''
}
// 保存时提交的操作信息
const operateSaveInfo = reactive({
  operate_type: '',
  order_no_arr: [],
  reason: ''
})

const mapInitOption = {
  zoom: 4,   //初始化地图级别
  center: [105.602725, 37.076636], //初始化地图中心点位置
  resizeEnable: true,
  mapStyle: "amap://styles/whitesmoke",
  viewMode: '2D',
  animateEnable: true
}
const chartEl = ref()
onMounted(() => {
  closeOpationalFloatItem()
  // 1. 创建地图组件
  mapInstance.value = new AMap.Map(chartEl.value, mapInitOption);
  mapInstance.value.addControl(new AMap.ToolBar({position: 'RB'}));
  ['click', 'movestart', 'resize', 'zoomstart'].forEach(actionKey => {
    mapInstance.value.on(actionKey, () => {
      closeOpationalFloatItem()
    })
  })
  if (props.showRegionName) {
    polygonNameLabelsLayer()
  }
  highlightHoverPolygon()
})
onBeforeUnmount(() => {
  mapInstance.value.destroy()
})

// 地图展示点、线、面相关数据
const pointCurrent = ref<any[]>([]) // 当前地图展示的点
const moveLinesCurrent = ref<Record<string, any>>({}) // 当前地图展示的线段
const moveLinesAll = ref<any[]>([]) // 地图所有的线
const polygonCurrent = ref<any[]>([]) // 当前地图展示的区域


const pointMap = reactive<point>({
  first: {
    lng: '',
    lat: '',
    engineer_eid: '',
    optional_val: null,
    optional_name: '',
    order: '',
    is_home: '',
    opationalList: [] // 用于判断该点是否有服务单
  },
  second: {
    lng: '',
    lat: '',
    engineer_eid: '',
    optional_val: null,
    optional_name: '',
    order: '',
    is_home: '',
    opationalList: []
  }
})

const isFirstPoint = ref(true)

const markBtnOption = [
  {value: MarkBtn.Insert, label: '插入'},
  {value: MarkBtn.Swap, label: '交换'},
  {value: MarkBtn.Copy, label: '复制'},
  {value: MarkBtn.Delete, label: '删除'},
]
// 根据点的相关参数，制作地图上显示的图标
const getMarkIcon = (item: any) => {
  let resultSvg: any = null
  if (item.is_home) {
    resultSvg = buildIcon({
      bg: SVGBgPart.circle,
      color: item.service_info_arr.length <= 1 ? item.color : '#333',
      icon: item.service_info_arr.length > 1 ? SVGIconPart.starMulti : SVGIconPart.star,
      isBig: item.service_info_arr.length > 1,
      isShowRing: item.is_disabled === false
    })
  } else {
    if (item.color.length <= 1) {
      resultSvg = buildIcon({
        bg: item.is_mars ? SVGBgPart.triangle : SVGBgPart.circle,
        color: item.color,
        icon: item.is_edited ? SVGIconPart.edit : (item.is_mars_appoint ? SVGIconPart.person : undefined),
        isShowRing: item.is_disabled === false
      })
    } else {
      resultSvg = buildIcon({
        bg: SVGBgPart.circle,
        color: '#333',
        icon: item.is_edited ? SVGIconPart.edit : SVGIconPart.dot,
        isBig: true,
        isShowRing: item.is_disabled === false
      })
    }
  }
  return resultSvg

}
const addOptionalChild = (info_arr: any, isGray = false) => {
  if (props.isReadOnly) {
    return info_arr
  }
  let result: any = []
  if (!info_arr.length) return
  info_arr.forEach((item: any) => {
    result.push(item)
    if (!item.children) {
      item['children'] = markBtnOption.filter(e => isGray ? e.value !== MarkBtn.Delete : true)
    } else {
      item['children'] = addOptionalChild(item.children, isGray)
    }
  })
  return result
}

interface MassMarkData {
  lnglat: [number, number],
  style: number,
  _size: number,
  _extData: any
}

const setMarkInMap = () => {
  // 处理海量点数据、样式
  const dataArr: MassMarkData[] = [];
  const styleArr: { url: string, anchor: any, size: any }[] = []
  pointCurrent.value.forEach((item: any, index: number) => {
    const svgObj = getMarkIcon(item)
    const styleTmp = {
      url: svgObj.imgUrl,
      anchor: new AMap.Pixel(svgObj.size / 2, svgObj.size / 2),
      size: new AMap.Size(svgObj.size, svgObj.size),
    }
    let existIndex = styleArr.findIndex(e => e.url === styleTmp.url)
    if (existIndex === -1) {
      styleArr.push(styleTmp)
      existIndex = styleArr.length - 1
    }
    dataArr.push({lnglat: item.value, style: existIndex, _size: svgObj.size, _extData: {...item, orderId: index}})
  })
  // 添加海量点
  // 清理旧覆盖物
  {
    massMarkInMap?.setMap(null)
    massMarkInMap?.clear(null)
  }
  massMarkInMap = new AMap.MassMarks(
      dataArr,
      {
        zIndex: 110, 	// 海量点图层叠加的顺序，默认120。这个数值大于等于110时，会在多边形上层，不论多边形zIndex是多少
        style: styleArr,	//多种样式对象的数组
        cursor: 'pointer'
      }
  );
  console.log('styleArr', styleArr.length)
  massMarkInMap.setMap(mapInstance.value)
  // 海量点交互事件
  massMarkInMap.on('click', (e: { data: MassMarkData }) => {
    closeOpationalFloatItem()
    setTimeout(() => {
      const {x, y} = mapInstance.value.lngLatToContainer(e.data._extData.value)
      opationalStyle.left = x
      opationalStyle.top = y
      opationalStyle.isPointMenuShow = true
      const {service_info_arr = [], is_home, color, is_edited} = e.data._extData

      let service_info_arr_copy = JSON.parse(JSON.stringify(service_info_arr)) // 获取额外信息

      markerDetail.is_edited = is_edited

      const [lng, lat] = e.data._extData.value // 起始点的位置

      currentLngLat.lng = lng
      currentLngLat.lat = lat

      isFirstPoint.value = pointMap.first.optional_val == null || (pointMap.first.lng === lng && pointMap.first.lat === lat)
      // 点击第一个点
      if (isFirstPoint.value) {
        console.log('第一个点', lng, lat)
        if (is_home) {
          markerDetail.order_no = '-'
          markerDetail.engineer_name = service_info_arr_copy.map((item: any) => item.children[0].value).join(' ')
          resetOpational()
          if (!props.isReadOnly) {
            ElMessage.warning('第一个点不能选择工程师家')
          }
          return
        }
        opationalList.value = service_info_arr_copy.length ? addOptionalChild(service_info_arr_copy, color[0] === 'gray') : markBtnOption.filter(e => e.value === MarkBtn.Insert)
        pointMap.first = {
          lng,
          lat,
          is_home,
          opationalList: service_info_arr_copy
        }
      } else { // 点击第二个点
        opationalList.value = service_info_arr_copy
        pointMap.second = {
          lng,
          lat,
          is_home,
          opationalList: service_info_arr_copy
        }
      }
    })
  })
  massMarkInMap.on('mouseover', (e: { data: MassMarkData }) => {
    polygonInMap.forEach((po: any) => {
      if (po.contains(e.data._extData.value)) {
        activePolygonKey.value = getActivePolygonKeyByExtData(po.getExtData())
      }
    })
  })
}

const setLineInMap = () => {
  Object.keys(lineInMap).forEach(key => {
    lineInMap[key]?.setMap(null)
    lineInMap[key]?.destroy()
  })
  lineInMap = {}
  Object.keys(moveLinesCurrent.value).forEach((key, index) => {
    if (moveLinesCurrent.value[key]) {
      lineInMap[key] = new AMap.Polyline({
        map: mapInstance.value,
        path: moveLinesCurrent.value[key].coords,
        strokeColor: moveLinesCurrent.value[key]?.ext?.strokeColor,  //线颜色
        strokeOpacity: 1,     //线透明度
        strokeWeight: 5,      //线宽
        strokeStyle: "solid",  //线样式
        showDir: true,
        lineJoin: 'round',
        extData: {orderId: index},
        bubble: true,
        zIndex: 120, // 这个值大于等于多边形的zIndex，会在多边形上层。当线与海量点在多边形的同一侧时，线总是会显示在点下层
      })
    }
  })
}
const highlightHoverPolygon = () => {
  // 使用地图的mousemove事件，判断鼠标的位置是否包含在多边形中，设置激活的多边形
  // 如果使用多边形对象的mousemove、mouseout事件判断激活多边形，在拖动、缩放地图时，总有时候会被判定为鼠标移出了区域，导致闪烁，故不采用
  mapInstance.value.on('mousemove', (e: any) => {
    for (const po of polygonInMap) {
      if (po.contains(e.lnglat)) {
        activePolygonKey.value = getActivePolygonKeyByExtData(po.getExtData())
        return
      }
    }
    activePolygonKey.value = undefined
  })
}
const setPolygonInMap = () => {
  // ------------添加面------------
  polygonInMap.forEach(p => {
    // 清理旧覆盖物
    p.setMap(null)
    p.destroy()
  })
  polygonInMap = []
  // 清理旧覆盖物
  labelsLayerInMap.clear()
  labelMarkInMap = []

  polygonCurrent.value.forEach((e: any) => {
    // -------处理面-------
    const polygon = new AMap.Polygon({
      map: mapInstance.value,
      path: e.fence,
      fillColor: e.color,
      strokeOpacity: 1,
      // fillOpacity: 0.08,
      strokeColor: '#3c3ceb',
      strokeWeight: 1,
      strokeStyle: 'dashed',
      strokeDasharray: [5, 5],
      extData: {
        regionNo: e.region_no,
        cityCode: e.city_code,
        regionShow: e.region_show
      },
      bubble: true,
      zIndex: 120, //
    });
    setPolygonStyle(polygon)
    polygonInMap.push(polygon)
    polygon.on('click', (e: any) => {
      if (props.isReadOnly) {
        return
      }
      closeOpationalFloatItem()
      const extData = e.target.getExtData()
      activePolygonKey.value = getActivePolygonKeyByExtData(extData)
      emits('polygonClick', extData || {})
    })
    // -------处理面内名称--------
    if (props.showRegionName) {
      let fenceHeight = 0
      let fenceWidth = 0
      e.fence.forEach((f1: any) => {
        e.fence.forEach((f2: any) => {
          fenceWidth = Math.max(Math.abs(f1[0] - f2[0]), fenceWidth)
          fenceHeight = Math.max(Math.abs(f1[1] - f2[1]), fenceHeight)
        })
      })
      const fenceFontSize = Math.max(Math.min(fenceWidth, fenceHeight) * 10, 2)// 根据区域宽高的的最小值，确定一个字号
      const labelMarker = new AMap.LabelMarker({
        position: getPolygonBaryCenter(e.fence),
        zIndex: 1,
        text: {
          content: e.region_show,
          style: {
            fontSize: fenceFontSize * (mapInstance.value?.getZoom() || 1),
            fontWeight: 'bold',
            direction: 'center',
            fontFamily: 'SimHei, 黑体, sans-serif',
            fillColor: 'rgba(0,0,0,0.3)'
          }
        },
      })
      labelMarkInMap.push({labelMarker, size: fenceFontSize})
      labelsLayerInMap.add(labelMarker)
    }
  })
}

const getPolygonBaryCenter = (points: [number, number][]) => {
  // 计算多边形的质心位置
  if (!Array.isArray(points) || points.length < 3) {
    console.error("多边形坐标集合不能少于3个");
    return;
  }
  const result = [0, 0]
  let area = 0;
  for (let i = 1; i <= points.length; i++) {
    const curX = points[i % points.length][0];
    const curY = points[i % points.length][1];
    const nextX = points[i - 1][0];
    const nextY = points[i - 1][1];
    const temp = (curX * nextY - curY * nextX) / 2;
    area += temp;
    result[0] += (temp * (curX + nextX)) / 3;
    result[1] += (temp * (curY + nextY)) / 3;
  }
  result[0] /= area;
  result[1] /= area;
  return result;
}

const polygonNameLabelsLayer = () => {
  mapInstance.value.add(labelsLayerInMap)

  mapInstance.value.on('zoomchange', () => {
    labelMarkInMap.forEach(({labelMarker, size}) => {
      const newStyle = labelMarker.getText()
      newStyle.style.fontSize = size * (mapInstance.value?.getZoom() || 1)
      labelMarker.setText(newStyle)
    })
  })
}
// 设置选中的分区的高亮样式
watch(() => activePolygonKey.value, () => {
  polygonInMap.forEach((item: any) => {
    setPolygonStyle(item, activePolygonKey.value === getActivePolygonKeyByExtData(item.getExtData()))
  })
})

// 设置分区样式(普通、高亮)
const setPolygonStyle = (polygonItem: any, isActive?: boolean) => {
  if (isActive) {
    polygonItem.setOptions({
      fillOpacity: 0.5,
      strokeDasharray: [5, 0]
    })
  } else {
    polygonItem.setOptions({
      fillOpacity: 0.08,
      strokeDasharray: [5, 5],
    })
  }
}

const engineerEidArr = ref<any[]>([])
const currentOrder = ref('') // 当前操作框选的订单id

// 获取操作弹框的选中值
const getCheckedNodes = (value: any) => {
  let {lng, lat} = currentLngLat
  if (value.length !== 1 || value[0].indexOf('OR') == -1) return
  currentOrder.value = value[0]
  // 服务单信息
  let detail: any
  // 点击第一个点
  if (isFirstPoint.value) {
    detail = pointMap.first.opationalList.find((item: any) => (item as any).value === value[0])
  } else {
    detail = pointMap.second.opationalList.find((item: any) => (item as any).value === value[0])
  }
  detail && Object.keys(detail).forEach(key => {
    (markerDetail as any)[key] = detail[key]
  })
  markerDetail.order_no = value[0]
  markerDetail.lng = lng
  markerDetail.lat = lat

  // 用于时间校验
  detail.children.forEach((item: any) => {
    engineerEidArr.value.push(item.engineer_eid)
  });
}

watch(() => props.mapMarkAll,
    (value) => {
      console.log('watch 全部点')
      pointCurrent.value = JSON.parse(JSON.stringify(value))
      setMarkInMap()
    },
    {immediate: true, deep: true}
)

watch(() => props.mapLineShow,
    (value) => {
      console.log('watch 当前线')
      moveLinesCurrent.value = JSON.parse(JSON.stringify(value))
      setLineInMap()
    },
    {immediate: true, deep: true}
)

watch(() => props.mapLineAll,
    (value) => {
      console.log('watch 所有线')
      moveLinesAll.value = JSON.parse(JSON.stringify(value))
    },
    {immediate: true, deep: true}
)

watch(() => moveLinesAll.value,
    (value) => {
      console.log('watch 给当前覆盖新的值')
      const value_copy = JSON.parse(JSON.stringify(value))
      Object.keys(moveLinesCurrent.value).forEach((key) => {
        moveLinesCurrent.value[key] = value_copy[key]
      })
      setLineInMap()
    },
    {immediate: true, deep: true}
)

watch(() => props.mapPolygonAll,
    () => {
      console.log('watch 全部分区', props.mapPolygonAll)
      polygonCurrent.value = JSON.parse(JSON.stringify(props.mapPolygonAll))
      activePolygonKey.value = undefined
      setPolygonInMap()
    },
    {immediate: true, deep: true}
)

// 当前点的经纬度
const currentLngLat = reactive({
  lng: '',
  lat: ''
})

const opationalChangeHandler = () => { // 进行具体操作
  if (props.isReadOnly) return
  const len = opationalActive.value.length
  console.log('具体操作', opationalActive.value, opationalList.value)

  if (isFirstPoint.value) { // 悬浮框是第一个点
    if (!pointMap.first.opationalList.length) { //没有服务单
      // 该点只有坐标
    } else { // 有服务单
      const order = opationalActive.value[0] // 起始点的订单信息
      const engineer_name = opationalActive.value[1] // 起始点的工程师名称
      const optional_name = opationalActive.value[len - 1] // 起始点的操作名称

      const {children, appointment_time} = opationalList.value.find((item: any) => item.value === order)
      const {engineer_eid} = children.find((item: any) => item.value === engineer_name) // 起始点线上的工程师key
      pointMap.first.engineer_eid = engineer_eid
      pointMap.first.optional_name = optional_name
      pointMap.first.order = order
      pointMap.first.optional_val = opationalActive.value

      if ([MarkBtn.Insert, MarkBtn.Copy, MarkBtn.Swap].includes(optional_name)) {
        emits('updatePoint', {type: optional_name, value1: appointment_time, value2: order})
      } else if (optional_name === MarkBtn.Delete) {
        opationalStyle.isReasonShow = 'change'
      } else {
        ElMessage.success('请选择第二个点')
      }
    }
    opationalStyle.isPointMenuShow = false
  } else { // 悬浮框是第二个点
    if (pointMap.second.opationalList.length) { //没有服务单
      opationalStyle.isReasonShow = 'change'
    }
  }
}
// 第二个点的具体操作
const secondOption = () => {
  if (pointMap.first.optional_name === MarkBtn.Delete) {
    optionalMap[pointMap.first.optional_name]()
    opationalStyle.isReasonShow = ''
    return
  }
  let order = opationalActive.value[0] // 起始点的订单信息
  let engineer_name = opationalActive.value[1] // 起始点的工程师名称
  let engineer_eid = ''
  if (order === '-') {
    // const { engineer_eid:engineer_eid_home  } = opationalList.value.find(item => item.children[0]['value'] === engineer_name)
    opationalList.value.forEach(item => {
      if (item.children[0]['value'] === engineer_name) {
        engineer_eid = item.children[0]['engineer_eid']
      }
    })
  } else {
    const {children} = opationalList.value.find(item => item.value === order)
    const {engineer_eid: engineer_eid_normal} = children.find(item => item.value === engineer_name) // 起始点线上的工程师key
    engineer_eid = engineer_eid_normal
  }
  pointMap.second.engineer_eid = engineer_eid
  pointMap.second.order = order
  pointMap.second.optional_val = opationalActive.value
  if (!pointMap.first.opationalList.length) { // 判断第一个点是否有服务单
    optionMap_noServe[pointMap.first.optional_name]()
  } else {
    optionalMap[pointMap.first.optional_name]()
  }
  console.log('收集到的两个点为:', pointMap)
  opationalStyle.isReasonShow = ''
}
//  取消
const defaultReason = () => {
  opationalStyle.isReasonShow = ''
  emits('updatePoint')
  markerDetail.order_no = ''
  operateSaveInfo.reason = ''
}

// 确认
const saveReason = () => {
  if (!operateSaveInfo.reason) {
    ElMessage.error('请输入修改原因')
    return
  }
  if (opationalStyle.isReasonShow === 'change') {
    secondOption()
  } else if (opationalStyle.isReasonShow === 'updateTime') {
    requestChangeTime()
  }
}

const orderDateChangeHandler = (val: string) => {
  markerDetail.appointment_time = val
  closeOpationalFloatItem()
  opationalStyle.isReasonShow = 'updateTime'
}

const optionMap_noServe = {
  [MarkBtn.Insert]: function () {
    // 在第二条线新增点
    const {lng: lng_first, lat: lat_first, order: order_first} = pointMap.first
    const {engineer_eid: engineer_eid_second, lng: lng_second, lat: lat_second} = pointMap.second
    Object.keys(moveLinesAll.value).forEach((key) => {
      if (key === engineer_eid_second) {
        mapInstance.value.remove(lineInMap[key])
        const selectedPointIndex = moveLinesAll.value[key]['coords'].findIndex(val => JSON.stringify(val) == `[${[lng_second, lat_second]}]`)
        moveLinesAll.value[key]['coords'].splice(selectedPointIndex + 1, 0, [lng_first, lat_first])
        moveLinesAll.value[key]['order_no_arr'].splice(selectedPointIndex + 1, 0, order_first)
        moveLinesAll.value[key]['handle_time_arr'].splice(selectedPointIndex + 1, 0, Moment(new Date()).format('YYYY-MM-DD HH:mm:ss'))
      }
    })
    // ElMessage.info('操作已完成')
    updateAllLine()
  }
}


const optionalMap = {
  [MarkBtn.Insert]: function () {
    // 先删除原来线上的点
    const {engineer_eid: engineer_eid_first, lng: lng_first, lat: lat_first, order: order_first, is_home: is_home_first} = pointMap.first
    if (engineer_eid_first !== '-') {
      Object.keys(moveLinesAll.value).forEach((key) => {
        if (key === engineer_eid_first) {
          const selectedPointIndex = moveLinesAll.value[key]['coords'].findIndex(val => val.toString() == [lng_first, lat_first].toString())
          moveLinesAll.value[key]['coords'].splice(selectedPointIndex, 1)
          moveLinesAll.value[key]['order_no_arr'].splice(selectedPointIndex, 1)
          moveLinesAll.value[key]['handle_time_arr'].splice(selectedPointIndex, 1)
        }
      })
    }
    // 在第二条线新增点
    const {engineer_eid: engineer_eid_second, lng: lng_second, lat: lat_second, order: order_second} = pointMap.second
    let isOnline = Object.keys(moveLinesAll.value).find(key => key === engineer_eid_second)
    if (isOnline) {
      Object.keys(moveLinesAll.value).forEach((key) => {
        if (key === engineer_eid_second) {
          const selectedPointIndex = moveLinesAll.value[key]['coords'].findIndex(val => val.toString() == [lng_second, lat_second].toString())
          moveLinesAll.value[key]['coords'].splice(selectedPointIndex + 1, 0, [lng_first, lat_first]) // 1
          moveLinesAll.value[key]['order_no_arr'].splice(selectedPointIndex + 1, 0, order_first)
          moveLinesAll.value[key]['handle_time_arr'].splice(selectedPointIndex + 1, 0, Moment(new Date()).format('YYYY-MM-DD HH:mm:ss'))
        }
      })
    } else {
      console.log('创建一条线', engineer_eid_second)
      if (is_home_first) { // 判断两个点中哪个是工程师家
        moveLinesAll.value[engineer_eid_second] = {}
        moveLinesAll.value[engineer_eid_second]['coords'] = [[lng_first, lat_first], [lng_second, lat_second]] // 1
        moveLinesAll.value[engineer_eid_second]['order_no_arr'] = [order_first, order_second]
        moveLinesAll.value[engineer_eid_second]['handle_time_arr'] = [Moment(new Date()).format('YYYY-MM-DD HH:mm:ss'), Moment(new Date()).format('YYYY-MM-DD HH:mm:ss')]
      } else {
        moveLinesAll.value[engineer_eid_second] = {}
        moveLinesAll.value[engineer_eid_second]['coords'] = [[lng_second, lat_second], [lng_first, lat_first]] // 1
        moveLinesAll.value[engineer_eid_second]['order_no_arr'] = [order_second, order_first]
        moveLinesAll.value[engineer_eid_second]['handle_time_arr'] = [Moment(new Date()).format('YYYY-MM-DD HH:mm:ss'), Moment(new Date()).format('YYYY-MM-DD HH:mm:ss')]
      }
    }
    // ElMessage.info('操作已完成')
    updateAllLine()
  },
  [MarkBtn.Swap]: function () {
    console.log('交换')
    const {engineer_eid: engineer_eid_first, lng: lng_first, lat: lat_first, order: order_first, opationalList: opational_options_first} = pointMap.first
    const {engineer_eid: engineer_eid_second, lng: lng_second, lat: lat_second, order: order_second, opationalList: opational_options_second} = pointMap.second
    // 交换的校验
    // 获取起始点的服务时间点
    let prev_point: any = null
    let next_point: any = null
    let prev_order: any = null
    let next_order: any = null
    let current_appointment_time = null
    let prev_appointment_time = null
    let next_appointment_time = null
    current_appointment_time = opational_options_first.find(item => item.value === order_first).appointment_time
    Object.keys(moveLinesAll.value).forEach((key) => {
      if (key === engineer_eid_first) {
        const selectedPointIndex = moveLinesAll.value[key]['coords'].findIndex(val => val.toString() == [lng_first, lat_first].toString())
        prev_point = moveLinesAll.value[key]['coords'][selectedPointIndex - 1] // 前一个点
        next_point = moveLinesAll.value[key]['coords'][selectedPointIndex + 1] // 后一个点
        prev_order = moveLinesAll.value[key]['order_no_arr']?.[selectedPointIndex - 1] // 前一个点对应订单号
        next_order = moveLinesAll.value[key]['order_no_arr']?.[selectedPointIndex + 1] // 后一个点对应订单号
      }
    })
    pointCurrent.value.forEach(item => {
      if (prev_point && (item.value.toString() == prev_point.toString())) {
        prev_appointment_time = item.service_info_arr.find(i => i.value === prev_order)?.appointment_time
      }
      if (next_point && (item.value.toString() == next_point.toString())) {
        next_appointment_time = item.service_info_arr.find(i => i.value === next_order)?.appointment_time
      }
    })

    // 获取目标点的服务时间点
    let current_appointment_time_second = null
    let prev_point_second = null
    let next_point_second = null
    let prev_order_second = null
    let next_order_second = null
    let prev_appointment_time_second = null
    let next_appointment_time_second = null
    current_appointment_time_second = opational_options_second.find(item => item.value === order_second).appointment_time
    Object.keys(moveLinesAll.value).forEach((key) => {
      if (key === engineer_eid_second) {
        const selectedPointIndex = moveLinesAll.value[key]['coords'].findIndex(val => val.toString() == [lng_second, lat_second].toString())
        prev_point_second = moveLinesAll.value[key]['coords'][selectedPointIndex - 1] // 前一个点
        next_point_second = moveLinesAll.value[key]['coords'][selectedPointIndex + 1] // 后一个点
        prev_order_second = moveLinesAll.value[key]['order_no_arr']?.[selectedPointIndex - 1] // 前一个点对应订单号
        next_order_second = moveLinesAll.value[key]['order_no_arr']?.[selectedPointIndex + 1] // 后一个点对应订单号
        // console.log('第二条线', engineer_eid_second, selectedPointIndex, prev_point_second)
      }
    })
    pointCurrent.value.forEach(item => {
      if (prev_point_second && (item.value.toString() == prev_point_second.toString())) {
        prev_appointment_time_second = item.service_info_arr.find(i => i.value === prev_order_second)?.appointment_time
      }
      if (next_point_second && (item.value.toString() == next_point_second.toString())) {
        next_appointment_time_second = item.service_info_arr.find(i => i.value === next_order_second)?.appointment_time
      }
    })


    if (prev_point && !prev_order) { // 前一个点为家
      prev_appointment_time = `${props.mapParams?.chooseDate} 6:00`
    }
    if (!prev_point) { // 前面为空
      prev_appointment_time = '2000-01-01 00:00:00'
    }

    if (!next_point) { // 后一个点为空
      next_appointment_time = '2030-01-01 00:00:00'
    }

    if (prev_point_second && !prev_order_second) { // 前一个点为家
      prev_appointment_time_second = `${props.mapParams?.chooseDate} 6:00`
    }
    if (!prev_point_second) { // 前面为空
      prev_appointment_time_second = '2000-01-01 00:00:00'
    }

    if (!next_point_second) {// 后一个点为空
      next_appointment_time_second = '2030-01-01 00:00:00'
    }
    const firstIsTure = new Date(prev_appointment_time_second).getTime() < new Date(current_appointment_time).getTime() && (next_appointment_time_second ? new Date(current_appointment_time).getTime() < new Date(next_appointment_time_second).getTime() : true)
    const secondIsTure = new Date(prev_appointment_time).getTime() < new Date(current_appointment_time_second).getTime() && (next_appointment_time ? new Date(current_appointment_time_second).getTime() < new Date(next_appointment_time).getTime() : true)
    // console.log('交换时间的值', new Date(prev_appointment_time_second).getTime(), new Date(current_appointment_time).getTime(), new Date(next_appointment_time_second).getTime())
    // console.log('交换时间的值1', new Date(prev_appointment_time).getTime(), new Date(current_appointment_time_second).getTime(), new Date(next_appointment_time).getTime())
    if (!firstIsTure || !secondIsTure) {
      ElMessage.error('时间不符')
      emits('updatePoint')
      return
    }

    // 先替换原来线上的点
    Object.keys(moveLinesAll.value).forEach((key) => {
      if (key === engineer_eid_first) {
        const selectedPointIndex = moveLinesAll.value[key]['coords'].findIndex(val => val.toString() == [lng_first, lat_first].toString())
        moveLinesAll.value[key]['coords'].splice(selectedPointIndex, 1, [lng_second, lat_second])
        moveLinesAll.value[key]['order_no_arr'].splice(selectedPointIndex, 1, order_second)
        moveLinesAll.value[key]['handle_time_arr'].splice(selectedPointIndex, 1, Moment(new Date()).format('YYYY-MM-DD HH:mm:ss'))
      }
    })
    // 在替换第二条线新增点
    Object.keys(moveLinesAll.value).forEach((key) => {
      if (key === engineer_eid_second) {
        const selectedPointIndex = moveLinesAll.value[key]['coords'].findIndex(val => val.toString() == [lng_second, lat_second].toString())
        moveLinesAll.value[key]['coords'].splice(selectedPointIndex, 1, [lng_first, lat_first])
        moveLinesAll.value[key]['order_no_arr'].splice(selectedPointIndex, 1, order_first)
        moveLinesAll.value[key]['handle_time_arr'].splice(selectedPointIndex, 1, Moment(new Date()).format('YYYY-MM-DD HH:mm:ss'))
      }
    })
    // ElMessage.info('操作已完成')
    updateAllLine()
  },
  [MarkBtn.Copy]: function () {
    console.log('复制')
    // 在第二条线新增点
    const {lng: lng_first, lat: lat_first, order: order_first, is_home: is_home_first} = pointMap.first
    const {engineer_eid: engineer_eid_second, lng: lng_second, lat: lat_second, order: order_second} = pointMap.second
    let isOnline = Object.keys(moveLinesAll.value).find(key => key === engineer_eid_second)
    if (isOnline) {
      Object.keys(moveLinesAll.value).forEach((key) => {
        if (key === engineer_eid_second) {
          const selectedPointIndex = moveLinesAll.value[key]['coords'].findIndex(val => val.toString() == [lng_second, lat_second].toString())
          moveLinesAll.value[key]['coords'].splice(selectedPointIndex + 1, 0, [lng_first, lat_first])
          moveLinesAll.value[key]['order_no_arr'].splice(selectedPointIndex + 1, 0, order_first)
          moveLinesAll.value[key]['handle_time_arr'].splice(selectedPointIndex + 1, 0, Moment(new Date()).format('YYYY-MM-DD HH:mm:ss'))
        }
      })
    } else {
      if (is_home_first) { // 判断两个点中哪个是工程师家
        moveLinesAll.value[engineer_eid_second] = {}
        moveLinesAll.value[engineer_eid_second]['coords'] = [[lng_first, lat_first], [lng_second, lat_second]]
        moveLinesAll.value[engineer_eid_second]['order_no_arr'] = [order_first, order_second]
        moveLinesAll.value[engineer_eid_second]['handle_time_arr'] = [Moment(new Date()).format('YYYY-MM-DD HH:mm:ss'), Moment(new Date()).format('YYYY-MM-DD HH:mm:ss')]
      } else {
        moveLinesAll.value[engineer_eid_second] = {}
        moveLinesAll.value[engineer_eid_second]['coords'] = [[lng_second, lat_second], [lng_first, lat_first]]
        moveLinesAll.value[engineer_eid_second]['order_no_arr'] = [order_second, order_first]
        moveLinesAll.value[engineer_eid_second]['handle_time_arr'] = [Moment(new Date()).format('YYYY-MM-DD HH:mm:ss'), Moment(new Date()).format('YYYY-MM-DD HH:mm:ss')]
      }
    }
    // ElMessage.info('操作已完成')
    updateAllLine()
  },
  [MarkBtn.Delete]: function () {
    console.log('删除')
    // 先删除原来线上的点
    const {engineer_eid: engineer_eid_first, lng: lng_first, lat: lat_first} = pointMap.first
    Object.keys(moveLinesAll.value).forEach((key) => {
      if (key === engineer_eid_first) {
        const selectedPointIndex = moveLinesAll.value[key]['coords'].findIndex(val => val.toString() === [lng_first, lat_first].toString())
        if (selectedPointIndex !== -1) {
          moveLinesAll.value[key]['coords'].splice(selectedPointIndex, 1)
          moveLinesAll.value[key]['order_no_arr'].splice(selectedPointIndex, 1)
          moveLinesAll.value[key]['handle_time_arr'].splice(selectedPointIndex, 1)
        } else {
          ElMessage.error('获取线中点信息失败')
        }
      }
    })
    // ElMessage.info('操作已完成')
    updateAllLine()
  }
}

const updateAllLine = () => {
  operateSaveInfo.operate_type = pointMap.first.optional_name
  operateSaveInfo.order_no_arr = pointMap.second.order ? [pointMap.first.order, pointMap.second.order] : [pointMap.first.order]
  emits('save', moveLinesAll.value, operateSaveInfo)
}

const resetOpational = () => {
  pointMap.first = {
    lng: '',
    lat: '',
    optional_val: null,
    engineer_eid: '',
    optional_name: '',
    order: '',
    opationalList: [] // 用于判断该点是否有服务单
  }
  pointMap.second = {
    lng: '',
    lat: '',
    engineer_eid: '',
    optional_val: null,
    order: '',
    opationalList: []
  }
  opationalActive.value = []
  opationalList.value = []
  operateSaveInfo.reason = ''
}

const addAddressToWaySearch = (type?: string) => {
  searchWayRef.value.setAddress({
    lng: currentLngLat.lng,
    lat: currentLngLat.lat,
    address: type === 'home' ? `${markerDetail.engineer_name}的家` : markerDetail.address
  })
}

const requestChangeTime = async () => {
  let hasSameTime = false
  engineerEidArr.value.forEach(item => {
    Object.keys(moveLinesAll.value).forEach(key => {
      if (key === item) {
        hasSameTime = moveLinesAll.value[key].appointment_time.find(i => i === markerDetail.appointment_time)
      }
    });
  });
  if (hasSameTime) {
    operateSaveInfo.reason = ''
    opationalStyle.isReasonShow = ''
    ElMessage.warning('同一工程师下的服务单时间不能重复！')
    return
  }
  const res = await intelliSchedulingApi.editTime({
    appointment_time: markerDetail.appointment_time,
    order_no: markerDetail.order_no,
    version: props.version,
    reason: operateSaveInfo.reason
  })
  if (res.errcode === 0) {
    emits('updatePoint')
    ElMessage.success('保存成功！')
  }
  operateSaveInfo.reason = ''
  opationalStyle.isReasonShow = ''
}

const setFitView = () => {
  const arr = mapInstance.value?.getAllOverlays()
  if (arr?.length) {
    const tmp = mapInstance.value?.getFitZoomAndCenterByOverlays(arr, [30, 30, 30, 30])
    if (tmp?.length) {
      mapInstance.value?.setZoomAndCenter(Math.min(11, tmp[0]), tmp[1], false, 600)
    }
  }
  // setFitView 不能自定义边距、不能调过渡速度
  // mapInstance.value?.setFitView(undefined)
}
const closeServiceDetail = () => {
  markerDetail.order_no = ''
}
const closeSearchWay = () => {
  searchWayRef.value?.close()
}
const setZoomAndCenter = (zoom?: number, center?: [number, number], immediate?: boolean, duration?: number) => {
  mapInstance.value?.setZoomAndCenter(zoom || mapInitOption.zoom, center || mapInitOption.center, immediate, duration || 300)
}
const clearMap = () => {
  mapInstance.value?.clearMap()
}
defineExpose({
  resetOpational,
  closeServiceDetail,
  closeSearchWay,
  setFitView,
  setZoomAndCenter,
  clearMap,
})
</script>
<style lang="scss" scoped>
.lose-map {
  overflow: hidden;
  position: relative;
  height: 100%;
  width: 100%;

  .version {
    position: absolute;
    bottom: 2px;
    left: 2px;
    cursor: pointer;
    font-size: 15px;
    line-height: 1.5em;
    font-weight: bold;
    text-shadow: 0 0 5px white;
  }

  .recommend-info {
    position: absolute;
    top: 0;
    left: 100px;
    background-color: #fff;
    height: 32px;
    display: flex;
    align-items: center;
    font-size: 18px;
    border: 1px solid red;
    padding: 0 10px;
    white-space: pre-wrap;
  }


  .chart-map {
    width: 100%;
    height: 100%;
  }

  .date_input {
    height: 24px !important;
  }

  .reason_wrap {
    z-index: 9999;
    position: absolute;
    width: 320px;
    min-height: 156px;
    background: #FFFFFF;
    box-shadow: 0px 2px 8px 0px rgba(47, 53, 71, 0.16);
    border-radius: 2px;
    padding: 12px;

    :deep(.el-textarea) {
      margin-bottom: 12px;
    }

    :deep(.el-textarea__inner) {
      min-height: 88px !important;
    }

    :deep(.el-button) {
      width: 80px;
      height: 32px;
      line-height: 0px;
      min-height: 32px;
      border-radius: 4px;
    }

    :deep(.el-button--default) {
      margin-right: 8px;
    }
  }
}
</style>

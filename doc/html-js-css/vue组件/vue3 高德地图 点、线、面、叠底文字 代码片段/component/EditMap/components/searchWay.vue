<template>
  <div class="search-way" :class="{'search-way--full-height':isShowResult}" v-loading="isSearchLoading">
    <div class="planBtn" v-show="!isShow" @click="isShow=true">
      <el-button><img :src="Assets.line" alt="">路线</el-button>
    </div>
    <div class="content" v-show="isShow">
      <div class="plan-form">
        <div class="tabs">
          <div v-for="item in wayTypeTabs" :key="item.id" class="tab" :class="{'tab--active': active === item.id}" @click="changePlanHandler(item.id)">
            <img :src="item.icon" alt=""/>
          </div>
        </div>
        <el-icon @click="closeHandler(false)" class="close-btn">
          <Close/>
        </el-icon>
        <div class="line-search">
          <div class="line-search-left icon_exchange" @click="changSortHandler">
            <el-icon size="20">
              <Sort/>
            </el-icon>
          </div>
          <div class="line-search__form">
            <el-form :model="form">
              <el-form-item v-for="(item, i) of formOption" :key="item.id">
                <el-select-v2
                    v-model="form[item.id]"
                    style="width: 240px"
                    size="medium"
                    filterable
                    remote
                    :remote-method="changeWordHandler"
                    clearable
                    :options="options"
                    :loading="resultLoading"
                    :placeholder="`请输入${ i ? '终' : '起'}点`"
                    @change="planSwitchHandler(active)"
                />
              </el-form-item>
            </el-form>
          </div>
        </div>
        <div class="btn-wrapper">
          <el-button type="primary" @click="closeHandler(true)">清除路线</el-button>
        </div>
      </div>
      <div ref="planResultRef" class="plan-result"/>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: "SearchWay",
}
</script>

<script setup lang="ts">
import * as Assets from './assets'
import {Sort, Close} from "@element-plus/icons-vue";
import {reactive, ref, defineProps, defineEmits, defineExpose} from "vue";

const props = defineProps<{
  mapInstance: any
  city?: string,
}>()

const wayTypeTabs = [
  {id: 1, icon: Assets.bus},
  {id: 2, icon: Assets.car},
  {id: 3, icon: Assets.riding},
]
const isShow = ref<boolean>(false)
const options = ref([])
const resultLoading = ref(false)
const active = ref(1)
const form = reactive<any>({
  start: '',
  end: ''
})
const formOption = [
  {id: 'start', label: '起'},
  {id: 'end', label: '终'}
]
// 路线规划方式
let transfer: any = null
let driving: any = null
let riding: any = null
const AMap: any = (window as any).AMap

const planLineMap = reactive({
  first: {
    lng: '',
    lat: ''
  },
  second: {
    lng: '',
    lat: ''
  }
})

const changSortHandler = () => {
  const {start, end} = form
  form.start = end
  form.end = start
  planSwitchHandler(active.value)
}

const changePlanHandler = (index: number) => {
  active.value = index
  planSwitchHandler(index)
}

const clearAllPlanHandler = () => {
  if (transfer) transfer.clear()
  if (driving) driving.clear()
  if (riding) riding.clear()
}
const isSearchLoading = ref(false)
const isShowResult = ref(false)
const planResultRef = ref()

const planSwitchHandler = (index: number) => {
  planResultRef.value.innerHTML = ''
  isShowResult.value = false
  const isLngLat = planLineMap.second.lng
  let start = ''
  let end = ''
  if (isLngLat) {
    start = new AMap.LngLat(planLineMap.first.lng, planLineMap.first.lat)
    end = new AMap.LngLat(planLineMap.second.lng, planLineMap.second.lat)
  }
  const cityName = props.city
  let points = [
    {keyword: form.start, city: cityName},
    {keyword: form.end, city: cityName}
  ]
  if ((!start || !end) && (!form.start || !form.end)) {
    return
  }
  const finishHandler = (status: string, result: any) => {
    if (status === 'complete') {
      console.log('绘制路线完成（' + index + '）', result)
      if (result.info !== 'NO_DATA') {
        isShowResult.value = true
      }
    } else {
      console.log('路线数据查询失败（' + index + '）' + result)
    }
    isSearchLoading.value = false
  }
  isSearchLoading.value = true
  switch (index) {
    case 1: {
      // 公交地铁出行路线
      transfer = new AMap.Transfer({
        map: props.mapInstance,
        panel: planResultRef.value,
        city: cityName || '北京市'
      })
      if (isLngLat) {
        transfer.search(start, end, finishHandler);
      } else {
        transfer.search(points, finishHandler);
      }
      break;
    }
    case 2: {
      // 驾车出行路线
      driving = new AMap.Driving({
        map: props.mapInstance,
        panel: planResultRef.value
      })
      if (isLngLat) {
        driving.search(start, end, finishHandler)
      } else {
        driving.search(points, finishHandler)
      }
      break;
    }
    case 3: {
      // 骑行路线
      riding = new AMap.Riding({
        map: props.mapInstance,
        panel: planResultRef.value
      })
      if (isLngLat) {
        riding.search(start, end, finishHandler);
      } else {
        riding.search(points, finishHandler);
      }
      break;
    }
    default:
      break;
  }
}
const emits = defineEmits(['close'])

const closeHandler = (value: boolean) => {
  isShowResult.value = false
  isShow.value = value
  form.start = ''
  form.end = ''
  planLineMap.first = {
    lng: '',
    lat: ''
  }
  planLineMap.second = {
    lng: '',
    lat: ''
  }
  clearAllPlanHandler()
  emits('close')
}

const changeWordHandler = (query: string) => {
  resultLoading.value = true
  new AMap.plugin('AMap.AutoComplete', () => {
    // input 为绑定输入提示功能的input的DOM ID
    let autoOptionsStart = new AMap.AutoComplete({
      city: '全国'
    })
    autoOptionsStart.search(query, (status: string, result: Record<never, never> | Record<string, any>) => {
      if (query !== '' && status === 'complete') {
        options.value = result?.tips?.map((item: any) => ({value: item.name, label: item.name}))
      } else {
        options.value = []
      }
      resultLoading.value = false
    })
  })
}

const setAddress = (params: { lng: any, lat: any, address: string }) => {
  isShow.value = true
  if (!planLineMap.first.lng) {
    planLineMap.first.lng = params.lng
    planLineMap.first.lat = params.lat
    form.start = params.address
  } else {
    planLineMap.second.lng = params.lng
    planLineMap.second.lat = params.lat
    form.end = params.address
    planSwitchHandler(1)
  }
}
const close = () => {
  closeHandler(false)
}

defineExpose({setAddress, close})
</script>

<style scoped lang="scss">
.search-way {
  background-color: rgba(255, 255, 255, 0.7);
  overflow: hidden;
  position: absolute;
  top: 0;
  left: 0;

  &--full-height {
    height: 100%
  }

  .planBtn {
    cursor: pointer;
    font-size: 30px;

    .el-button {
      vertical-align: top;
      width: 88px;
      background: #5682FF;
      border-radius: 4px;
      color: #fff;
      font-size: 14px;
    }
  }

  .content {
    position: relative;
    overflow: hidden;
    height: 100%;
    width: 300px;
    display: flex;
    flex-direction: column;
    box-shadow: 0 0 1px 1px #ccc inset;

    .plan-form {
      flex-shrink: 0;
      padding: 10px;
      background: #5682FF;
      border-radius: 3px;
      position: relative;

      .close-btn {
        position: absolute;
        right: 8px;
        top: 8px;
        font-size: 25px;
        color: #fff;
        cursor: pointer;
      }

      .btn-wrapper {
        text-align: right;
      }

      .tabs {
        border: 0;
        border-radius: 0;
        background: none;
        height: 25px;
        margin: 0 30px;
        white-space: nowrap;
        position: relative;
        display: flex;
        justify-content: space-around;

        .tab {
          flex: 1;
          text-align: center;
          cursor: pointer;

          & > img {
            height: 25px;
            width: 25px;
            opacity: 0.5;
          }

          &--active {
            & > img {
              opacity: 1
            }
          }
        }
      }

      .line-search {
        position: relative;
        margin-top: 11px;

        .icon_exchange {
          top: 50%;
          left: 0;
          width: 18px;
          height: 28px;
          margin-top: -14px;
          position: absolute;
          cursor: pointer;
          color: #fff
        }

        &__form {
          margin-left: 25px;

          :deep(.el-form-item) {
            margin: 8px 0;
          }

          :deep(.el-select-v2__wrapper) {
            height: 32px;
            background: #446FE7;
            border: none;
            line-height: 32px;
          }

          :deep(.el-select-v2__placeholder) {
            color: #fff;
          }

          :deep(.el-select-v2__combobox-input) {
            color: #fff;
          }
        }
      }
    }

    .plan-result {
      overflow: auto;
      border: 1px solid #ccc;
      border-bottom: none;

      :deep(.amap-call) {
        display: none !important;
      }

      :deep(.amap-lib-transfer) {
        border: none;
      }
    }
  }
}
</style>
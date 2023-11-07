<template>
  <div class="intelli-scheduling" :class="{'global-is-busy':isAreaLoading||isFilterLoading||isLineSaveLoading||isMapLoading}">
    <el-form inline class="global-filter-wrapper">
      <el-form-item label="围栏城市">
        <el-input v-if="isDetailMode" v-model="route.query.city_name" disabled/>
        <el-select v-else v-model="params.city_code" @change="changeCityHandler" filterable :disabled="isDetailMode" v-loading="isFilterLoading">
          <el-option v-for="(item) in filters" :key="item.id" :label="item.name" :value="item.id"/>
        </el-select>
      </el-form-item>
      <el-form-item label="日期">
        <el-date-picker v-model="params.choose_date" value-format="YYYY-MM-DD" format="YYYY-MM-DD" :disabled="isDetailMode" :disabledDate="disabledDate" :clearable="false"/>
      </el-form-item>
      <el-form-item label="修改时间" v-if="isDetailMode">
        <el-input v-model="params.updated_at" disabled/>
      </el-form-item>
      <el-form-item v-if="!isDetailMode">
        <el-button type="primary" @click="searchHandler()">查询</el-button>
        <el-button plain @click="searchHandler(true)">重置</el-button>
      </el-form-item>
      <div style="white-space: nowrap;margin-right:20px;float: right; ">
        <template v-if="!isDetailMode">
          <el-button type="warning" style="margin-left:24px" @click="addPlanHandler(true)" :loading="isAddPlanOriginLoading" :disabled="isAddPlanLoading||isAddPlanOriginLoading" v-if="checkAuth('wayMap:function:intelliScheduling:originScheduling')">原排划</el-button>
          <el-button type="primary" style="margin-left:24px" plain @click="addPlanHandler()" :loading="isAddPlanLoading" :disabled="isAddPlanLoading||isAddPlanOriginLoading" v-if="checkAuth('wayMap:function:intelliScheduling:scheduling')">排划</el-button>
        </template>
        <el-button type="primary" style="margin-left:24px" @click="openDrawer" v-if="checkAuth('wayMap:function:intelliScheduling:overallView')">排划总览</el-button>
      </div>
    </el-form>
    <div class="main">
      <div class="aside" v-loading="isEngineerListLoading">
        <EngineerList :data="engineerListData" v-model="engineerListActiveIds"/>
      </div>
      <div class="container">
        <!-- 地图 -->
        <div class="chart-map-wrapper" v-loading="isMapLoading||isLineSaveLoading||isAreaLoading">
          <EditMap ref="editMapRef"
                   :isReadOnly="isDetailMode"
                   :mapParams="mapParams"
                   :mapMarkAll="mapMarkAll"
                   :mapLineShow="mapLineShow"
                   :mapLineAll="mapLineAll"
                   :mapPolygonAll="mapPolygonAll"
                   @updatePoint="updatePoint"
                   @save="saveAllLine"
                   @polygonClick="regionActiveHandler"
                   :recommendInfo="isDetailMode?'': mapRecommendInfo"
                   :version="mapLineVersion"/>
        </div>
        <div class="footer" v-if="!isDetailMode">
          <MapLegend/>
          <div class="btn-wrapper">
            <el-button class="cancel-btn" @click="updatePoint()" v-show="params.appointment_time_of_person_handle || isShowCancelBtn">取消当前操作</el-button>
            <el-button class="save-btn" @click="isVersionDialogVisible = true" :loading="isVersionSaveLoading" v-if="checkAuth('wayMap:function:intelliScheduling:saveVersion')">保存该版本</el-button>
          </div>
        </div>
      </div>
      <el-drawer append-to-body v-model="isShowPlanOverview" :size="650" :with-header="false" destroy-on-close>
        <OverviewBoard :data="planOverviewData"/>
      </el-drawer>
    </div>
    <el-dialog v-model="isVersionDialogVisible" title="请输入该版本名称" width="320px" custom-class="version-dialog">
      <el-input v-model="versionName" autocomplete="off"/>
      <template #footer>
        <el-button @click="isVersionDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveResult">确定</el-button>
      </template>
    </el-dialog>
    <RegionEngineerEditor ref="regionEngineerEditorRef"/>
  </div>
</template>

<script setup lang="ts">
import {computed, onMounted, reactive, ref, watch} from 'vue'
import {useRoute} from 'vue-router'
import {ElMessage} from 'element-plus'
import EditMap, {MarkBtn} from './component/EditMap/index.vue'
import * as CommonApi from '@/api/common'
import * as intelliSchedulingApi from '@/api/intelliScheduling'
import checkAuth from "@/utils/checkAuth";
import RegionEngineerEditor from "./component/RegionEngineerEditor/index.vue";
import dayjs from "dayjs";
import OverviewBoard from "@/components/overviewBoard/index.vue";
import EngineerList from "./component/EngineerList/index.vue";
import MapLegend from "./component/MapLegend/index.vue";

const filters = ref<Record<string, any>>([])
const dateListData = ref<Record<string, any>>([])
const engineerListData = ref<Record<string, any>>([])
const engineerListActiveIds = ref<any[]>([])
const editMapRef = ref();

const isEngineerListLoading = ref<boolean>(false)
const isMapLoading = ref<boolean>(false)
const isVersionSaveLoading = ref(false)

const mapMarkAll = ref<Record<string, any>>([])
const mapLineAll = ref<Record<string, any>>({})
const mapPolygonAll = ref<any>([])
const mapLineVersion = ref('')
const mapRecommendInfo = ref('')
const mapParams = ref<Record<string, any>>({})

const regionEngineerEditorRef = ref()
const route = useRoute()

let isDetailMode = ref(false)
watch(() => route, () => {
  isDetailMode.value = !!route.query.version
}, {immediate: true, deep: true})


const getTomorrow = () => {
  let day_now = new Date();
  day_now.setTime(day_now.getTime() + 24 * 60 * 60 * 1000);
  return day_now.getFullYear() + "-" + (day_now.getMonth() + 1) + "-" + day_now.getDate();
}
const storageParams = localStorage.getItem('params') || '{}'
const params = reactive<Record<string, any>>({
  city_code: JSON.parse(storageParams).city_code || '',
  choose_date: JSON.parse(storageParams).choose_date || getTomorrow(),
  appointment_time_of_person_handle: '',
  version: route.query.version,
  order_no_of_person_handle: '',
  updated_at: ''
})

const disabledDate = (e: Date) => !dateListData.value.some((d: any) => d.id === dayjs(e).format('YYYY-MM-DD'))

const isVersionDialogVisible = ref(false)
const versionName = ref('')
const recommendLogId = ref('')
// 排划总览数据
const planOverviewData = ref({})
const isShowPlanOverview = ref(false)

const mapLineShow = computed(() => {
  const lineTmp: any = {}
  Object.keys(mapLineAll.value).forEach(key => {
    if (engineerListActiveIds.value.includes(key)) {
      lineTmp[key] = mapLineAll.value[key]
    }
  })
  return lineTmp
})

const openDrawer = () => {
  isShowPlanOverview.value = true
  updatePoint()
}
let currentCityCode: any
const searchHandler = async (isReset?: boolean) => {
  if (currentCityCode !== params.city_code) {
    editMapRef.value?.setZoomAndCenter(undefined, undefined, undefined, 1000)
    editMapRef.value?.clearMap()
    currentCityCode = params.city_code
  }
  if (isReset) {
    params.choose_date = getTomorrow()
    params.appointment_time_of_person_handle = ''
    params.order_no_of_person_handle = ''
    params.version = ''
    params.updated_at = ''
    try {
      await requestListAndMap({needResetParams: true})
    } catch (e) {
      console.error(e)
    }
  } else {
    try {
      await Promise.all([
        requestArea(),
        requestListAndMap({needResetParams: true})
      ])
    } catch (e) {
      console.error(e)
    }
  }
  setTimeout(() => {
    editMapRef.value.setFitView()
    editMapRef.value.closeServiceDetail()
    editMapRef.value.closeSearchWay()
  })

}

// 请求地图的数据
const requestListAndMap = async (opt?: { needResetParams?: boolean, keepEngineerListCheck?: boolean }) => {
  if (opt?.needResetParams) {
    params.appointment_time_of_person_handle = ''
    params.order_no_of_person_handle = ''
    params.version = ''
    isShowCancelBtn.value = false
    editMapRef.value?.resetOpational()
  }
  if (isDetailMode.value) {
    params.choose_date = route.query.choose_date
    params.updated_at = route.query.updated_at
    params.version = route.query.version
    params.city_code = route.query.city_code
    params.id = route.query.id
  }
  if (!isDetailMode.value) {
    localStorage.setItem('params', JSON.stringify(params))
  }

  try {
    isMapLoading.value = true
    const resAll = await Promise.all([
      requestEngineerList(),
      intelliSchedulingApi.getDetail(params) // 此处需要等工程师列表获取完。再继续处理地图中覆盖物。因为线的显示与隐藏与工程师有关
    ])
    if (!opt?.keepEngineerListCheck) {
      engineerListActiveIds.value = engineerListData.value.map((e: any) => e.id)
    }
    const res = resAll[1]
    if (res.errcode === 0) {
      planOverviewData.value = res.data
      recommendLogId.value = res.data.recommend_log_id
      mapRecommendInfo.value = res.data.system_recommend_version ? res.data.system_recommend_version + '  ' + res.data.system_recommend_time : ''
      if (res.data.version) {
        mapLineVersion.value = res.data.version
      }
      mapLineAll.value = res.data.line_arr
      mapMarkAll.value = res.data.spot_arr
    } else {
      mapLineAll.value = {}
      mapMarkAll.value = []
    }
  } catch (e) {
    mapLineAll.value = {}
    mapMarkAll.value = []
    console.error(e)
  } finally {
    isMapLoading.value = false
  }
  mapParams.value = {
    cityName: filters.value.find((e: any) => e.id === params.city_code)?.name,
    chooseDate: params.choose_date,
  }
  intelliSchedulingApi.setWeblog({
    action: 'detail',
    type: 'search',
    line_arr: mapLineAll.value,
    current: ''
  })
}
const updatePoint = async (param?: { type: string, value1: string, value2: string }) => { // 高亮可选的点
  if (!param?.type) {
    params.appointment_time_of_person_handle = ''
    params.order_no_of_person_handle = ''
    isShowCancelBtn.value = false
    editMapRef?.value?.resetOpational()
    requestListAndMap()
  } else if (param.type === MarkBtn.Insert || param.type === MarkBtn.Copy) {
    params.appointment_time_of_person_handle = param.value1
    params.order_no_of_person_handle = param.value2
    requestListAndMap()
  } else if (param.type === MarkBtn.Swap) {
    isShowCancelBtn.value = true
  }
}

const isShowCancelBtn = ref(false)
// 获取城市数据
const isFilterLoading = ref(false)
const getFilter = async () => {
  try {
    isFilterLoading.value = true
    const res = await CommonApi.getFilterList()
    if (res.errcode === 0) {
      filters.value = res.data
      params.city_code = JSON.parse(localStorage.getItem('params') || '{}').city_code || res.data?.[0]?.id
      changeCityHandler(params.city_code)
    }
  } catch (e) {
    console.error(e)
  }
  isFilterLoading.value = false
}
// 切换城市获取日期
const changeCityHandler = (val: any) => {
  filters.value.forEach((item: any) => {
    if (item.id == val) {
      dateListData.value = item.date_children
    }
  })
  params.choose_date = JSON.parse(localStorage.getItem('params') || '{}').choose_date || params.choose_date
}
// 请求左侧工程师列表数据
const requestEngineerList = async () => {
  try {
    isEngineerListLoading.value = true
    const res = await intelliSchedulingApi.getEngineerList({
      city_code: params.city_code,
      choose_date: params.choose_date,
      version: params.version,
    })
    if (res.errcode == 0) {
      engineerListData.value = res.data.engineer_arr || []
    } else {
      engineerListData.value = []
    }
  } catch (e) {
    engineerListData.value = []
    console.error(e)
  }
  isEngineerListLoading.value = false
}

// 排划、原排划
const isAddPlanOriginLoading = ref(false)
const isAddPlanLoading = ref(false)
const addPlanHandler = async (isOrigin?: boolean) => {
  const paramTmp: any = {
    city_code: params.city_code,
    choose_date: params.choose_date
  }
  if (isOrigin) {
    paramTmp.region_dispatch = false
  }
  try {
    if (isOrigin) {
      isAddPlanOriginLoading.value = true
    } else {
      isAddPlanLoading.value = true
    }
    const res = await intelliSchedulingApi.logAdd(paramTmp)
    if (res.errcode === 0) {
      ElMessage.success(isOrigin ? '原排划成功' : '排划成功')
    }
  } catch (e) {
    console.error(e)
  }
  isAddPlanOriginLoading.value = false
  isAddPlanLoading.value = false
}

// 收集操作后的数据
const isLineSaveLoading = ref(false)
const saveAllLine = async (value: any, operate_info: any) => {
  intelliSchedulingApi.setWeblog({action: 'edit', type: '', line_arr: mapLineAll.value, current: value})
  isLineSaveLoading.value = true
  try {
    const {errcode} = await intelliSchedulingApi.saveDetail({
      line_arr: {...mapLineAll.value, ...value},
      version: mapLineVersion.value,
      is_end: false,
      operate_info,
      recommend_log_id: recommendLogId.value
    })
    if (errcode === 0) {
      ElMessage.success('操作已完成')
    }
    editMapRef?.value?.resetOpational()
    requestListAndMap({needResetParams: true, keepEngineerListCheck: true})
  } catch (e) {
    console.error(e)
  }
  isLineSaveLoading.value = false
}

const saveResult = async () => {
  if (!versionName.value) {
    ElMessage.error('请输入版本名称')
    return
  }
  isVersionSaveLoading.value = true
  try {
    const res = await intelliSchedulingApi.saveDetail({
      line_arr: mapLineAll.value,
      version: mapLineVersion.value,
      version_name: versionName.value,
      is_end: true,
      recommend_log_id: recommendLogId.value
    })
    if (res.errcode === 0) {
      ElMessage.success('保存成功！')
      isVersionDialogVisible.value = false
    }
  } catch (e) {
    console.error(e)
  } finally {
    isVersionSaveLoading.value = false
  }
}

onMounted(() => {
  if (isDetailMode.value) {
    searchHandler()
  } else {
    getFilter()
  }
})

// --------------区域划分-------------
const isAreaLoading = ref(false)
const requestArea = async () => {
  isAreaLoading.value = true
  try {
    const res = await intelliSchedulingApi.regionFenceOfCity({city_code: isDetailMode.value ? route.query.city_code : params.city_code})
    if (res.errcode === 0) {
      mapPolygonAll.value = res.data.region_arr
    }
  } catch (e) {
    console.error(e)
  }
  isAreaLoading.value = false
}
// 点击区域编辑
const regionActiveHandler = (data: { regionNo: string, cityCode: string, regionShow: string }) => {
  regionEngineerEditorRef.value.show({
    regionNo: data.regionNo,
    cityCode: data.cityCode,
    chooseDate: params.choose_date,
    recommendLogId: recommendLogId.value,
    regionShow: data.regionShow
  })
}

</script>
<style lang="scss" scoped>
.intelli-scheduling {
  height: 100%;
  display: flex;
  flex-direction: column;

  .main {
    flex: 1;
    width: 100%;
    display: flex;
    position: relative;
    overflow: hidden;
    background: #fff;

    .aside {
      position: relative;
      width: 180px;
      height: 100%;
      box-shadow: 5px 0 5px rgba(0, 0, 0, 0.05);

      :deep(.el-loading-mask) {
        opacity: 0.65;
      }
    }

    .container {
      flex: 1;
      display: flex;
      flex-direction: column;
      height: 100%;

      .chart-map-wrapper {
        flex: 1;

        :deep(.el-loading-mask) {
          opacity: 0.65;
        }
      }

      .footer {
        background: white;
        width: 100%;
        height: 50px;
        line-height: 50px;
        text-align: right;
        padding-right: 12px;
        display: flex;

        .btn-wrapper {
          margin-left: auto;

          .cancel-btn {
            cursor: pointer;
            font-size: 14px;
            background: #D24F4F;
            color: #fff;
          }

          .save-btn {
            height: 32px;
            background: #5682FF;
            color: #fff;
            border-radius: 4px;
          }
        }
      }

    }
  }

}
</style>

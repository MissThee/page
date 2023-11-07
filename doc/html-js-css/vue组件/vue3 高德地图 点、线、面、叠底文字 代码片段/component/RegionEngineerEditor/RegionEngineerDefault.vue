<template>
  <div class="region-engineer-default" v-loading="isLoading||isEngineerListLoading||isSaveLoading">
    <div class="row" style="display: flex;justify-content: space-between">
      <div>
        <div class="label">区域</div>
        <span>{{ props.regionShow || '' }}</span>
      </div>
      <el-button @click="emits('jump')" type="primary" link>
        <span>返回</span>
        <el-icon>
          <ArrowRight/>
        </el-icon>
      </el-button>
    </div>
    <div class="row">
      <div class="label">
        <span>默认工程师设置</span>
      </div>
      <div>
        <el-date-picker :disabledDate="disabledDate" v-model="paramsInner.month" value-format="YYYY-MM" format="YYYY-MM" type="month" :clearable="false" @change="monthChangeHandler"/>
      </div>
      <el-table v-loading="isSaveLoading"
                :data="engineerTableData"
                row-key="id"
                class="table"
                header-cell-class-name="region-table-header"
                cell-class-name="region-table-cell"
                border
      >
        <el-table-column label="工号" prop="identity_card_no" align="center">
          <template #default="{row,column,$index}">
            <el-input v-if="engineerIsEditing" readonly v-model="row[column.property]" style="pointer-events: none"/>
            <div style="text-align: center;min-height: 1.5em" v-else @click="engineerEditHandler(row,$index)">{{ row[column.property] }}</div>
          </template>
        </el-table-column>
        <el-table-column label="姓名" prop="name" align="center">
          <template #default="{row,column,$index}">
            <template v-if="engineerIsEditing">
              <el-input @focus="engineerEditHandler(row,$index)" v-model="row.name" v-if="editingRowIndex!==$index"/>
              <el-select popper-class="region-engineer-default-list" filterable v-if="editingRowIndex===$index" readonly v-model="editingEngineerId" @change="(val)=>engineerChangeHandler(val,$index)">
                <el-option v-for="item in engineerList" :key="item.id" :value="item.id" :label="item.name" :style="engineerTableData.some(t => t.id === item.id) && {display:'none !important' }">
                  <div class="region-engineer-default-item">
                    <div>{{ item.identity_card_no }}-{{ item.name }}</div>
                  </div>
                </el-option>
              </el-select>
            </template>
            <div style="text-align: center;min-height: 1.5em" v-else @click="engineerEditHandler(row,$index)">{{ row[column.property] }}</div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100" align="center" v-if="engineerIsEditing">
          <template #default="{row,$index}">
            <el-button type="danger" link icon="Delete" style="font-size: 20px" @click="engineerDeleteHandler(row,$index)"/>
          </template>
        </el-table-column>
      </el-table>
      <div style="text-align: right">
        <el-button type="primary" plain class="add-btn" icon="Plus" size="small" v-if="engineerIsEditing" style="width: 100px;" @click="engineerAddHandler"/>
      </div>
      <div style="margin-top: 20px;text-align: right" v-if="checkAuth('wayMap:function:intelliScheduling:regionDefaultEngineer')">
        <!--        <div style="margin-top: 20px;text-align: right">-->
        <el-button type="primary" @click="editStartHandler" v-if="!engineerIsEditing">编辑</el-button>
        <el-button type="primary" @click="editSubmitHandler" v-if="engineerIsEditing" :loading="isSaveLoading">保存</el-button>
        <el-button @click="editCancelHandler" v-if="engineerIsEditing" :disabled="isSaveLoading">取消</el-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: "RegionEngineerDefault",
}

</script>

<script setup lang="ts">
import {ArrowRight} from '@element-plus/icons-vue'
import * as intelliScheduling from '@/api/intelliScheduling'

import {withDefaults, defineProps, watch, ref, defineEmits, computed} from "vue";
import {ElMessage, ElMessageBox} from "element-plus";
import dayjs from "dayjs";
import checkAuth from "@/utils/checkAuth";

const props = withDefaults(defineProps<{
  params: {
    city_code: string,
    region_no: string,
    choose_date: string,
  }
  regionShow: string
}>(), {})
const isNextMonthEnable = ref<boolean>(false)

const getMonthMaxDayjs = () => dayjs().add(isNextMonthEnable.value ? 1 : 0, "month").startOf('month')
const chooseMonthDayjs = dayjs(props.params.choose_date).startOf('month')
const getDefaultMonth = () => {
  if (chooseMonthDayjs.isAfter(getMonthMaxDayjs())) {
    return getMonthMaxDayjs()
  } else {
    return chooseMonthDayjs
  }
}

const disabledDate = (date: Date) => {
  return dayjs(date).startOf('month').isAfter(getMonthMaxDayjs())
}
const paramsInner = ref<any>({
  city_code: props.params.city_code,
  region_no: props.params.region_no,
  month: getDefaultMonth().format('YYYY-MM')
})

const regionInfo = ref<any>({})

const isLoading = ref(false)
const requestData = async () => {
  editingRowIndex.value = null// 取消编辑行
  isLoading.value = true
  try {
    const res = await intelliScheduling.getDefaultEngineerOfRegion(paramsInner.value)
    if (res.errcode === 0) {
      regionInfo.value = res.data
      engineerTableData.value = JSON.parse(JSON.stringify(res.data.engineer_arr || []))
      isNextMonthEnable.value = !!res.data.is_optional_next_month
    } else {
      throw new Error('errcode not 0')
    }
  } catch (e) {
    console.error(e)
    regionInfo.value = {}
    engineerTableData.value = []
  }
  isLoading.value = false
}

// 编辑工程师
const engineerTableData = ref<any[]>([])
const editingRowIndex = ref<any>(null)
const editingEngineerId = ref<any>(null)
const engineerIsEditing = ref(false)

const engineerEditHandler = (row: any, rowIndex: any) => {
  editingRowIndex.value = rowIndex
  // 如果这个人在列表中则绑定id；如果没在则把名字赋值给绑定值进行显示
  if (engineerList.value.some(e => e.id === row.id)) {
    editingEngineerId.value = row.id
  } else {
    editingEngineerId.value = row.name
  }
}
let newRowIdTmp = -1
const editStartHandler = () => {
  engineerIsEditing.value = true
}
const editSubmitHandler = () => {
  saveEngineer()
}
const editCancelHandler = () => {
  engineerIsEditing.value = false
  requestData()
}

const isSaveLoading = ref()
const engineerDeleteHandler = async (row: any, rowIndex: any) => {
  try {
    // await ElMessageBox.confirm('确认删除？', '提示', {type: 'warning'})
    // await ElMessageBox.confirm('真的确认删除吗？', '提示', {type: 'warning'})
    engineerTableData.value.splice(rowIndex, 1)
  } catch (e) {
    // empty
  }
}

const engineerChangeHandler = (id: any, rowIndex: any) => {
  const targetData = engineerList.value.find(e => e.id === id) || {}
  engineerTableData.value[rowIndex] = {...targetData}
}

const engineerAddHandler = () => {
  engineerTableData.value.push({id: newRowIdTmp--})
  editingEngineerId.value = null
  editingRowIndex.value = engineerTableData.value.length - 1
}
// 下拉
const engineerList = ref<any[]>([])
const isEngineerListLoading = ref(false)
const requestEngineerList = async () => {
  isEngineerListLoading.value = true
  try {
    const res = await intelliScheduling.engineerFilterOfRegion({
      city_code: paramsInner.value.city_code,
      choose_month: paramsInner.value.month,
    })
    if (res.errcode === 0) {
      engineerList.value = res.data.engineer_arr || []
    }
  } catch (e) {
    console.error(e)
  }
  isEngineerListLoading.value = false
}

watch(() => props.params, requestData, {deep: true, immediate: true})
watch(() => props.params, requestEngineerList, {deep: true, immediate: true})

const saveEngineer = async () => {
  try {
    isSaveLoading.value = true
    const res = await intelliScheduling.setDefaultEngineerOfRegion({
      city_code: paramsInner.value.city_code,
      month: paramsInner.value.month,
      region_no: paramsInner.value.region_no,
      engineer_arr: engineerTableData.value.map(e => e.id).filter(e => e !== null)
    })
    if (res.errcode === 0) {
      ElMessage.success('操作成功')
      requestData()
      requestEngineerList()
      engineerIsEditing.value = false
    }
  } catch (e) {
    console.error(e)
  }
  isSaveLoading.value = false
}
const monthChangeHandler = () => {
  requestData()
  requestEngineerList()
}
const emits = defineEmits(['jump', 'loading'])

watch(() => isLoading.value || isEngineerListLoading.value || isSaveLoading.value, (newVal) => {
  emits('loading', newVal)
}, {immediate: true})
</script>

<style scoped lang="scss">
.region-engineer-default {
  font-size: 14px;

  .row + .row {
    margin-top: 25px;
  }

  .label {
    display: inline-flex;
    align-items: baseline;

    &--blue {
      color: var(--el-color-primary)
    }

    &--big {
      font-weight: bold;
      font-size: 1.3em;
    }

    & > * {
      &:after {
        content: ''
      }
    }

    &:after {
      content: '：'
    }
  }

  .table {
    margin-top: 10px;

    :deep(.el-input) {
      width: 100%;
      height: 26px;
    }

    :deep(.el-input__inner) {
      text-align: center;
      padding: 0;
      min-height: 0;
      font-size: 14px !important;
    }
  }
}

</style>
<style lang="scss">

</style>
<template>
  <div class="region-engineer" v-loading="isLoading||isEngineerListLoading||isSaveLoading">
    <div class="row" style="display: flex;justify-content: space-between">
      <div>
        <div class="label">区域</div>
        <span>{{ props.regionShow || '' }}</span>
      </div>
      <el-button @click="emits('jump')" type="primary" link>
        <span>默认工程师设置</span>
        <el-icon>
          <ArrowRight/>
        </el-icon>
      </el-button>
    </div>
    <div class="row" v-if="false">
      <div class="label label--blue">*建议工程师数量</div>
    </div>
    <div class="row">
      <div class="label">
        <div class="label--big">{{ regionInfo.choose_date && dayjs(regionInfo.choose_date).format('M月D日') }}</div>
        <span>该区产能比如下</span>
      </div>
      <el-table class="table" header-cell-class-name="region-table-header" cell-class-name="region-table-cell" :data="[regionInfo.productivity_ratio]" border>
        <el-table-column v-for="columnItem in columnOptionForRegion" :key="columnItem.prop" :label="columnItem.label" :prop="columnItem.prop" v-bind="columnItem.opt" align="center">
          <template #default="{row}" v-if="columnItem.prop==='ratio'">
            <span style="color:var(--el-color-primary)">{{ row?.ratio }}{{ row?.ratio && row?.ratio !== 'N/A' ? '%' : '' }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="row">
      <div class="label">
        <div class="label--big">{{ regionInfo.choose_date && dayjs(regionInfo.choose_date).format('M月D日') }}</div>
        <span>工程师如下</span>
      </div>
      <el-table v-loading="isSaveLoading" :data="engineerTableData" row-key="id" class="table" header-cell-class-name="region-table-header" cell-class-name="region-table-cell" border>
        <el-table-column label="工号" prop="identity_card_no" width="110" align="center">
          <template #default="{row,column,$index}">
            <el-input v-if="engineerIsEditing" readonly v-model="row[column.property]" style="pointer-events: none"/>
            <span v-else>{{ row[column.property] }}</span>
          </template>
        </el-table-column>
        <el-table-column label="姓名" prop="name" width="100" align="center">
          <template #default="{row,column,$index}">
            <div style="width:100%;display: flex;align-items: center;justify-content: center">
              <el-popover v-if="row.now_time_show!==row.ago_time_show" placement="top">
                <div style="white-space: nowrap">{{ row.now_time_show === '-' ? '工程师变为不可用' : '工程师可用时间更新' }}</div>
                <template #reference>
                  <img class="table-icon" v-if="row.now_time_show === '-'" :src="Assets.warningRed" alt=""/>
                  <img class="table-icon" v-else :src="Assets.warningOrange" alt=""/>
                </template>
              </el-popover>

              <div class="table-text" :class="row.is_all_day?'table-text--green':'table-text--orange'">
                <template v-if="engineerIsEditing">
                  <el-input @focus="engineerEditHandler(row,$index)" v-model="row.name" v-if="editingRowIndex!==$index"/>
                  <el-select popper-class="region-engineer-list" filterable v-if="editingRowIndex===$index" readonly v-model="editingEngineerId" @change="(val)=>engineerChangeHandler(val,$index)">
                    <el-option v-for="item in engineerList" :key="item.id" :value="item.id" :label="item.name" :style="engineerTableData.some(t => t.id === item.id) && {display:'none !important' }">
                      <div class="region-engineer-item">
                        <div>{{ item.identity_card_no }}-{{ item.name }}</div>
                        <div class="region-engineer-item__dot" :class="item.is_all_day?'region-engineer-item__dot--green':'region-engineer-item__dot--orange'"/>
                      </div>
                    </el-option>
                  </el-select>
                </template>
                <span v-else>{{ row[column.property] }}</span>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="可用时间" prop="time_show" align="center">
          <template #default="{row}">
            <div class="time-text">
              <span class="now" v-if="row.time_show">{{ row.time_show }}</span>
              <template v-else>
                <span class="old" v-if="row.ago_time_show!==row.now_time_show">{{ row.ago_time_show }}</span>
                <span class="now">{{ row.now_time_show }}</span>
              </template>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100" align="center" v-if="engineerIsEditing">
          <template #default="{row,$index}">
            <el-button type="danger" link icon="Delete" style="font-size: 20px" @click="engineerDeleteHandler(row,$index)"/>
          </template>
        </el-table-column>
      </el-table>
      <div style="text-align: right">
        <el-button type="primary" v-if="engineerIsEditing" plain class="add-btn" icon="Plus" size="small" style="width: 100px;" @click="engineerAddHandler"/>
      </div>
      <div style="margin-top: 20px;text-align: right" v-if="checkAuth('wayMap:function:intelliScheduling:regionCurrentEngineer')">
        <!--        <div style="margin-top: 20px;text-align: right" >-->
        <el-button type="primary" @click="editStartHandler" v-if="!engineerIsEditing">编辑</el-button>
        <el-button type="primary" @click="editSubmitHandler" v-if="engineerIsEditing" :loading="isSaveLoading">保存</el-button>
        <el-button @click="editCancelHandler" v-if="engineerIsEditing" :disabled="isSaveLoading">取消</el-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: "RegionEngineer",
}
</script>

<script setup lang="ts">
import {ArrowRight} from '@element-plus/icons-vue'
import * as intelliScheduling from '@/api/intelliScheduling'
import {withDefaults, defineProps, watch, ref, defineEmits, computed} from "vue";
import dayjs from "dayjs";
import {ElMessage} from "element-plus";
import * as Assets from './assets'
import checkAuth from "@/utils/checkAuth";

const columnOptionForRegion = [
  {prop: 'city_name', label: '城市'},
  {prop: 'region_name', label: '区域'},
  {prop: 'job_count', label: '预测作业单数', opt: {width: 120}},
  {prop: 'job_people_day', label: '做单人天'},
  {prop: 'ratio', label: '产能比'},
]

const props = withDefaults(defineProps<{
  params: {
    city_code: any,
    choose_date: any,
    region_no: any,
  },
  regionShow: string
}>(), {})
const regionInfo = ref<any>({})

const isLoading = ref(false)
const requestData = async () => {
  editingRowIndex.value = null// 取消编辑行
  isLoading.value = true
  try {
    const res = await intelliScheduling.regionDetail({
      city_code: props.params.city_code,
      choose_date: props.params.choose_date,
      region_no: props.params.region_no,
    })
    if (res.errcode === 0) {
      regionInfo.value = res.data
      engineerTableData.value = JSON.parse(JSON.stringify(res.data.engineer_arr || []))
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
const engineerIsEditing = ref(false)
const engineerTableData = ref<any[]>([])
const editingRowIndex = ref<any>(null)
const editingEngineerId = ref<any>(null) // 正在编辑的下拉列表的选中值

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
    console.error(e)
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
      city_code: props.params.city_code,
      choose_date: props.params.choose_date,
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
  // console.log('engineerTableData', engineerTableData.value)
  // return
  try {
    isSaveLoading.value = true
    const res = await intelliScheduling.saveEngineerOfRegion({
      city_code: regionInfo.value.city_code,
      choose_date: regionInfo.value.choose_date,
      region_no: regionInfo.value.region_no,
      engineer_arr: engineerTableData.value.map(e => e.id).filter(id => {
        if (!id) {
          return false
        }
        if (!Number.isNaN(id) && id < 0) {
          return false
        }
        return true
      })
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
const emits = defineEmits(['jump', 'loading'])

watch(() => isLoading.value || isEngineerListLoading.value || isSaveLoading.value, (newVal) => {
  emits('loading', newVal)
}, {immediate: true})
</script>

<style scoped lang="scss">
.region-engineer {
  font-size: 14px;

  .row {

  }

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

    .table-icon {
      height: 1em;
      width: 1em;
      margin-right: 3px;
    }

    .table-text {

      &--green {
        color: var(--el-color-success);

        :deep(.el-input__inner) {
          color: var(--el-color-success);
        }
      }

      &--orange {
        color: var(--el-color-warning);

        :deep(.el-input__inner) {
          color: var(--el-color-warning);
        }
      }

      &--red {
        color: var(--el-color-danger);

        :deep(.el-input__inner) {
          color: var(--el-color-danger);
        }
      }
    }

    .time-text {
      .old {
        opacity: 0.4;
      }

      & > * {
        white-space: nowrap;
        margin-left: 10px;

        &:first-child {
          margin-left: 0;
        }
      }
    }

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
.region-engineer-list {
  .el-select-dropdown__item {
    padding-right: 10px;
    padding-left: 10px;
  }

  .region-engineer-item {
    display: flex;
    align-items: center;
    justify-content: space-between;

    &__dot {
      margin-left: 10px;
      height: 8px;
      width: 8px;
      border-radius: 50%;
      flex-shrink: 0;

      &--green {
        background-color: var(--el-color-success);
      }

      &--orange {
        background-color: var(--el-color-warning);
      }
    }
  }
}
</style>
<template>
  <div class="industry">
    <div class="content__top">
      <breadcrumb />
    </div>
    <div class="industry__content" v-loading="isListLoading||isAddOrEditLoading||isDeleteLoading">
      <div class="left-block">
        <div class="block-head">
          <InputWithBtn @submit="leftEditSubmitHandler" name="场景" />
        </div>
        <div class="block-body">
          <el-scrollbar>
            <el-tree :data="industryTreeDataLeft"
                     :indent="0"
                     class="tree"
                     node-key="_nodeKey"
                     :highlight-current="false"
                     :expand-on-click-node="false"
                     :default-expanded-keys="expandNodeKeys"
                     :props="{
                        children: 'sublevel',
                        label: 'name',
                     }"
                     @node-click="leftNodeClickHandler"
                     @node-expand="nodeExpandHandler"
                     @node-collapse="nodeCollapseHandler"
            >
              <template #default="{ node, data }">
                <div class="custom-tree-row" :class="{'custom-tree-row--active': data.id===leftActiveData.id && data.level===leftActiveData.level}">
                  <el-input v-model="data.name" class="tree-input" :clearable="data.name!==data._name" @clear="data.name=data._name" />
                  <div>
                    <el-button type="primary" v-if="data.name!==data._name" :icon="Check" size="small" @click="addOrEditRequest({id:data.id, name:data.name, level:data.level, p_id:data.p_id})" title="确定修改" />
                    <PopperInputWithBtn v-if="data.level===-1" name="行业" @submit="(val)=>addOrEditRequest({p_id:data.id, name:val, level: data.level+1})" />
                    <el-popconfirm title="确定删除？" @confirm="removeHandler(data.id)">
                      <template #reference>
                        <el-button type="danger" :icon="Minus" size="small" plain title="删除"></el-button>
                      </template>
                    </el-popconfirm>
                  </div>
                </div>
              </template>
            </el-tree>
          </el-scrollbar>
        </div>
      </div>
      <div class="right-block">
        <template v-if="leftActiveData.id">
          <div class="block-head">
            <div class="head-title">{{ leftActiveData.name }}</div>
            <InputWithBtn style="width: 300px" @submit="rightEditSubmitHandler" name="区域" />
          </div>
          <div class="block-body">
            <el-scrollbar>
              <el-tree :data="leftActiveData.sublevel||[]"
                       node-key="_nodeKey"
                       :indent="0"
                       class="tree"
                       :highlight-current="false"
                       :expand-on-click-node="false"
                       :default-expanded-keys="expandNodeKeys"
                       :props="{
                        children: 'sublevel',
                        label: 'name',
                       }"
                       @node-expand="nodeExpandHandler"
                       @node-collapse="nodeCollapseHandler"
              >
                <template #default="{ node, data }">
                  <div class="custom-tree-row">
                    <el-input v-model="data.name" class="tree-input" :clearable="data.name!==data._name" @clear="data.name=data._name" />
                    <div>
                      <el-button type="primary" v-if="data.name!==data._name" :icon="Check" size="small" @click="addOrEditRequest({id:data.id, name:data.name, level:data.level, p_id:data.p_id})" title="确定修改" />
                      <PopperInputWithBtn v-if="data.level===1" name="位置" @submit="(val)=>addOrEditRequest({p_id:data.id, name:val, level: data.level+1})" />
                      <el-popconfirm title="确定删除？" @confirm="removeHandler(data.id)">
                        <template #reference>
                          <el-button type="danger" :icon="Minus" size="small" plain title="删除"></el-button>
                        </template>
                      </el-popconfirm>
                    </div>
                  </div>
                </template>
              </el-tree>
            </el-scrollbar>
          </div>
        </template>
        <div v-else style="position: absolute;left: 50%;top: 50%;transform: translate(-50% ,-50%);color:#ccc;font-size: 20px">（尚未选中行业）</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, watch } from "vue";
import { ElMessage } from "element-plus";
import * as api from "src/api";
import Breadcrumb from "src/components/breadcrumb.vue";
import { Minus, Plus, EditPen, Check } from "@element-plus/icons-vue";
import { IndustryAddOrEditParam } from "src/api/industry";
import InputWithBtn from "src/views/configuration/industry/InputWithBtn.vue";
import PopperInputWithBtn from "src/views/configuration/industry/PopperInputWithBtn.vue";

interface IndustryTreeData {
  _nodeKey: string;
  id: number;
  name: string;
  _name?: string; // 用于存储修改前的原值
  level: number;
  p_id: number;
  sublevel?: IndustryTreeData[];
  _sublevel?: IndustryTreeData[]; // 别名，用于在第二层将数断开
}

const industryTreeDataLeft = ref<IndustryTreeData[]>([]);

const leftActiveData = ref<{ id: any, level: any, name: any, sublevel?: IndustryTreeData[] }>({
  id: null, level: null, name: null, sublevel: []
});

let isFirstRequestData = true;
const expandNodeKeys = ref<string[]>([]);
const nodeCollapseHandler = (data) => {
  const existIndex = expandNodeKeys.value.indexOf(data._nodeKey);
  if (existIndex !== -1) {
    expandNodeKeys.value.splice(existIndex, 1);
  }
};
const nodeExpandHandler = (data) => {
  if (!expandNodeKeys.value.includes(data._nodeKey)) {
    expandNodeKeys.value.push(data._nodeKey);
  }
};
const leftEditSubmitHandler = (val: string) => {
  addOrEditRequest({ level: -1, name: val });
};
const rightEditSubmitHandler = (val: string) => {
  addOrEditRequest({ p_id: leftActiveData.value.id, level: leftActiveData.value.level + 1, name: val });
};
const isAddOrEditLoading = ref(false);
const addOrEditRequest = async (data: IndustryAddOrEditParam) => {
  if (!data.name?.trim()) {
    ElMessage.warning("名称不能为空");
  }
  try {
    isAddOrEditLoading.value = true;
    const res = await api.industry.induAdd(data);
    if (res.errcode === 0) {
      ElMessage.success(data.id ? "修改成功" : "添加成功");
      getDataList();
    } else {
      ElMessage.error(res.message);
    }
  } catch (e) {
    console.error(e);
  } finally {
    isAddOrEditLoading.value = false;
  }
};


const isDeleteLoading = ref(false);
const removeHandler = async (id: number) => {
  try {
    isDeleteLoading.value = true;
    const res = await api.industry.removeIndu({ id });
    if (res.errcode === 0) {
      ElMessage.success("删除成功");
      if (leftActiveData.value.id === id) {
        leftActiveData.value = { id: null, level: null, name: null, sublevel: [] };
      }
      getDataList();
    } else {
      ElMessage.error(res.message);
    }
  } catch (e) {
    console.error(e);
  } finally {
    isDeleteLoading.value = false;
  }
};


const leftNodeClickHandler = (data) => {
  if (data.level === 0) {
    leftActiveData.value = {
      id: data.id,
      level: data.level,
      name: data.name,
      sublevel: data._sublevel || data.sublevel || []
    };
  }
};

// 添加_name记录编辑前的原值；重命名 sublevel 将树从第二层截断
const initDataForTree = (tree: IndustryTreeData[]) => {
  tree?.forEach(e => {
    e._name = e.name;
    e._nodeKey = e.level + "," + e.id;
    if (isFirstRequestData && (e.level === -1 || e.level === 1)) {
      expandNodeKeys.value.push(e._nodeKey);
    }
    if (e.sublevel?.length) {
      initDataForTree(e.sublevel);
      if (e.level === 0) {
        e._sublevel = e.sublevel;
        delete e.sublevel;
      }
    } else {
      delete e.sublevel;
    }
  });
};

const updateLeftActiveData = (tree: IndustryTreeData[]) => {
  if (!tree?.length) {
    return;
  }
  for (let e of tree) {
    if (leftActiveData.value.id === e.id && leftActiveData.value.level === e.level) {
      leftActiveData.value.sublevel = e.sublevel || e._sublevel;
      return;
    }
    if (e.sublevel?.length) {
      updateLeftActiveData(e.sublevel);
    }
  }
};

const isListLoading = ref(false);
const getDataList = async () => {
  isListLoading.value = true;
  try {
    const res = await api.industry.induList();
    if (res.errcode === 0) {
      initDataForTree(res.data);
      industryTreeDataLeft.value = res.data || [];
      if (leftActiveData.value.id) {
        leftActiveData.value.sublevel = [];
        updateLeftActiveData(industryTreeDataLeft.value);
      }
    }
  } catch (e) {
    console.error(e);
  } finally {
    isListLoading.value = false;
    isFirstRequestData = false;
  }
};

getDataList();

</script>

<style scoped lang="scss">
.industry {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: white;

  .industry__content {
    padding: 10px;
    flex: 1;
    position: relative;
    overflow: hidden;
    min-height: 0;
    display: flex;

    .left-block {
      z-index: 2;
      position: relative;
      min-width: 370px;
      border-radius: 6px;
      border: 1px solid #ccc;

      height: 100%;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
    }

    .right-block {
      z-index: 1;
      position: relative;
      border-top: 1px solid #ccc;
      border-bottom: 1px solid #ccc;
      flex: 1;
      height: 100%;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .block-head {
      width: 100%;
      display: flex;
      align-items: center;
      padding: 10px
    }

    .block-body {
      min-height: 0;
      flex: 1;
      overflow: hidden;
    }

    .head-title {
      white-space: nowrap;
      margin-right: 10px;
      font-weight: bold;
      color: var(--el-color-primary)
    }
  }

  .custom-tree-row {
    height: 40px;
    display: flex;
    align-items: center;
    width: 100%;
    padding: 0 10px 0 5px;
    border-radius: 8px 0 0 8px;

    .tree-input {
      margin-right: 15px;
      width: 180px;
    }

    &--active {
      background-color: var(--el-color-primary-light-7);
      //&::before {
      //  content: '';
      //  position: absolute;
      //  left: 0;
      //  height: 100%;
      //  width: 100%;
      //  background-color: var(--el-color-primary-light-9);
      //  z-index: 0;
      //}
    }
  }


  :deep(.el-button) {
    padding: 5px;
  }

  .tree {
    width: 100%;
  }

  // plain 按钮不要背景
  :deep(.el-button.is-plain) {
    background-color: white;
  }

  :deep(.el-button--primary.is-plain ) {
    color: var(--el-color-primary);
  }

  :deep(.el-button--danger.is-plain ) {
    color: var(--el-color-danger);
  }

  :deep(.tree) {

    .el-tree-node__content {
      height: 40px;
    }

    .el-tree-node {
      position: relative;
      padding-left: 16px;
    }

    .el-tree-node__children {
      padding-left: 16px;
    }

    .el-tree-node:last-child:before {
      height: 38px;
    }


    .el-tree > .el-tree-node:before {
      border-left: none;
    }

    .el-tree > .el-tree-node:after {
      border-top: none;
    }

    // 虚线竖线
    .el-tree-node .el-tree-node:before {
      content: "";
      left: -3px;
      position: absolute;
      right: auto;
      border-width: 1px;
      border-left: 1px dashed var(--el-color-primary);
      bottom: 0px;
      height: 100%;
      top: -26px;
      width: 1px;
    }

    // 修正虚线竖线结尾
    .el-tree-node {
      &:last-child {
        &:before {
          height: 43px;
        }
      }
    }

    // 虚线横线
    .el-tree-node .el-tree-node:after {
      content: "";
      left: -2px;
      position: absolute;
      right: auto;
      border-width: 1px;
      border-top: 1px dashed var(--el-color-primary);
      height: 20px;
      top: 17px;
      width: 18px;
    }

    .el-tree .el-tree-node__expand-icon.expanded {
      -webkit-transform: rotate(0deg);
      transform: rotate(0deg);
    }

    .el-tree-node__content > .el-tree-node__expand-icon {
      padding: 0;
    }
  }
}
</style>

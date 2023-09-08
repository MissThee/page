<template>
  <div class="analyze-search-bar">
    <div class="search-bar">
      <MainTitle title="筛选条件" line/>
      <date-selector ref="dateSelectorRef" class="search-bar__row"/>
      <div class="search-bar__row">
        <div class="search-item" v-for="item in searchOption" :key="item.prop">
          <div class="search-item__label">{{ item.label }}</div>
          <el-select v-model="searchData[item.prop]" size="small" clearable>
            <el-option v-for="optItem in item.data" :key="optItem.id" :value="optItem.id" :label="optItem.name"/>
          </el-select>
        </div>
        <div class="search-item">
          <el-button type="primary" size="small" @click="searchHandler">查询</el-button>
          <el-button type="primary" size="small" @click="resetHandler">重置</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import DateSelector from "../DateSelector/index.vue";
import MainTitle from "index/views/customerVoice/components/mainTitle/index.vue";

export default {
  name: "AnalyzeSearchBar",
  components: {MainTitle, DateSelector},
  data() {
    return {
      searchOption: [
        {prop: 'province', label: '省份', data: [{id: 1, name: 'zzz'}, {id: 2, name: 'ccc'}]},
        {prop: 'manageSystem', label: '管理体系', data: [{id: 1, name: 'zzz'}, {id: 2, name: 'ccc'}]},
        {prop: 'product', label: '产品', data: [{id: 1, name: 'zzz'}, {id: 2, name: 'ccc'}]},
        {prop: 'way', label: '渠道', data: [{id: 1, name: 'zzz'}, {id: 2, name: 'ccc'}]},
      ],
      searchData: {}
    }
  },
  methods: {
    searchHandler() {
      const timeParam = this.$refs.dateSelectorRef.getParam()
      this.$emit('search', {
        ...timeParam,
        ...this.searchData
      })
    },
    resetHandler() {
      this.$refs.dateSelectorRef.reset()
      this.searchData = {}
      const timeParam = this.$refs.dateSelectorRef.getParam()
      this.$emit('reset', timeParam)
    }
  }
}
</script>


<style scoped lang="scss">
.analyze-search-bar {
  position: relative;
  overflow: hidden;

  .search-bar {
    padding: 10px 10px 0 0;

    &__row {
      margin-left: 20px;
      padding: 10px 0;
      display: flex;
      align-items: center;

      .search-item {
        display: flex;
        align-items: center;
        margin-right: 10px;

        &__label {
          white-space: nowrap;

          &:after {
            content: ':';
            margin-right: 5px;
          }
        }
      }
    }

  }
}
</style>

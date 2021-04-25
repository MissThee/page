<template>
  <div style="margin:10px 10%;text-align: center">
    <div style="max-width: 1000px;display: inline-block;width: 100%">
      <mark-down-area :md-text="mdText"></mark-down-area>
      <pre ref="mdText" style="display: none">
# 主页
## 页面功能
+ 托管于github的静态页面
+ 使用github api读取仓库文件，生成树形列表
+ 其中.md文件可在线预览
+ 可跳转至相应文件网页
      </pre>
    </div>
  </div>
</template>
<script>
  import MarkDownArea from 'src/docviewer/views/common/MarkDownArea';
  import Global from 'src/docviewer/utils/global';

  export default {
    name: 'HomePage',
    components: {
      MarkDownArea
    },
    data() {
      return {
        mdText: '',
      };
    },
    created() {
      this.$nextTick(() => {
        this.mdText = this.$refs.mdText.innerHTML;
      });
    }
  };
</script>

<style scoped>
</style>

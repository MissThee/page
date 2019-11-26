<template>
  <div style="margin:10px 10%">
    <div v-if="isShowTree">
      <el-tree :data="treeData" default-expand-all node-key="id" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
    </div>
    <div style="text-align: center" v-else>
      <el-button type="info" disabled size="mini" plain @click="isShowTree=true" style="color:#555;cursor: default">当前文档：{{filePath}}</el-button>
      <el-button type="primary" size="mini" plain @click="isShowTree=true">返回</el-button>
      <el-button type="primary" size="mini" plain @click="switchEdit">编辑/预览</el-button>
      <mark-down-area ref="md" :file-path="filePath"></mark-down-area>
    </div>
  </div>
</template>
<script>
  import MarkDownArea from 'src/views/common/MarkDownArea';
  import MdApi from 'src/api/md-api';
  import Global from 'src/utils/global';

  export default {
    name: 'MarkdownDoc',
    components: {
      MarkDownArea
    },
    data() {
      return {
        isShowTree: true,
        filePath: '/text.md',
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        treeData: [],
      };
    },
    created() {
      this.requestTreeData(Global.GITHUB_API_HOST + '/repos/' + Global.USER + '/' + Global.REPOSITORY + '/contents'+Global.DOC_ROOT, this.treeData);
      console.log('treeData!!', this.treeData);
    },
    methods: {
      requestTreeData(url, treeData) {
        MdApi.getFileFromGithub({ url: url === undefined ? '' : url })
          .then(({ data }) => {
            console.log('请求结果', data);
            data.forEach((item) => {
              let node = item;
              if (item.type === 'dir') {
                node.children = [];
                this.requestTreeData(item.url, node.children);
              }
              treeData.push(node);
            });
          });
      },
      handleNodeClick(node) {
        if (!node.children) {
          if (node.name.substring(node.name.lastIndexOf('.')) === '.md') {
            this.isShowTree = false;
            this.filePath = '/' + node.path;
          }
        }
      },
      switchEdit() {
        this.$refs.md.switchEdit();
      }
    }
  };
</script>

<style scoped>
</style>

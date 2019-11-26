<template>
  <div style="margin:10px 10%">
    <div v-if="isShowTree">
      <el-tree :data="treeData" default-expand-all node-key="id" :props="defaultProps">
        <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{ node.label }}</span>
        <span>
          <el-button
            v-if="!data.children&&data.name.substring(data.name.lastIndexOf('.')) === '.md'"
            type="text"
            plain
            size="mini"
            @click="() => {
                previewHandler(data);
            }">
            预览
          </el-button>
          <el-button
            v-if="!data.children"
            type="text"
            size="mini"
            @click="() => {
               openWindowHandler(data.html_url);
            }">
            前往
          </el-button>

        </span>
      </span>
      </el-tree>
    </div>
    <div style="text-align: center" v-else>
      <el-button type="info" disabled size="mini" plain @click="isShowTree=true" style="color:#555;cursor: default">当前文档：{{fileName}}</el-button>
      <el-button type="primary" size="mini" plain @click="isShowTree=true">返回</el-button>
      <el-button type="primary" size="mini" plain @click="switchEdit">编辑/预览</el-button>
      <mark-down-area ref="md" :file-url="fileUrl"></mark-down-area>
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
        fileName: '',
        fileUrl: '',
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        treeData: [],
      };
    },
    created() {
      this.requestTreeData(Global.GITHUB_API_HOST + '/repos/' + Global.USER + '/' + Global.REPOSITORY + '/contents' + Global.DOC_ROOT, this.treeData);
    },
    methods: {
      requestTreeData(url, treeData) {
        MdApi.getFileFromGithub({ url: url === undefined ? '' : url })
          .then(({ data }) => {
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
      previewHandler(node) {
        if (!node.children) {
          if (node.name.substring(node.name.lastIndexOf('.')) === '.md') {
            this.isShowTree = false;
            this.fileName = node.path;
            this.fileUrl = node.download_url;
          }
        }
      },
      openWindowHandler(url){
        window.open(url)
      },
      switchEdit() {
        this.$refs.md.switchEdit();
      }
    }
  };
</script>

<style scoped>
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
</style>

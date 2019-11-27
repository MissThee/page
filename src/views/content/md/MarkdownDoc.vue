<template>
  <div style="margin:0 10%;">
    <div v-if="isShowTree">
      <el-input class="reduce-height-element" placeholder="输入关键字进行过滤" v-model="filterText"></el-input>
      <div ref="treeArea" style="overflow: scroll" :style="{height: tableAutoHeight+'px'}">
        <el-tree ref="fileTree" :filter-node-method="filterNode" :data="treeData" default-expand-all node-key="id" :props="defaultProps">
        <span class="custom-tree-node" slot-scope="{ node, data }">
          <span :style="{fontWeight:data.type==='dir'?'bold':''}"><i :class="fileIcon(data.type,data.name)"></i>{{ node.label }}</span>
          <span>
            <span title="预览" style="width: 2em;display: inline-block">
                <el-button
                  v-if="showPreviewButton(data)"
                  style="color:#67c23a;"
                  plain
                  size="mini"
                  @click="() => {previewHandler(data.download_url,data.name,data.path);}">
                <i class="el-icon-view"></i>
                </el-button>
            </span>
            <span title="下载" style="width: 2em;display: inline-block">
                <el-button
                  v-loading="node.loading"
                  v-if="data.download_url&&data.download_url!==''"
                  style="color:#e6a23c;"
                  plain
                  size="mini"
                  @click="() => {downloadFileHandler(data.download_url,data.name,node);}">
                  <i class="el-icon-download"></i>
                </el-button>
            </span>
            <span title="前往github查看" style="width: 2em;display: inline-block">
                <el-button
                  style="color:#409eff;"
                  plain
                  size="mini"
                  @click="() => {openWindowHandler(data.html_url);}">
                   <i class="el-icon-top-right"></i>
                </el-button>
            </span>
             <span title="原文件链接" style="width: 2em;display: inline-block">
                <el-button
                  style="color:#555555;"
                  plain
                  size="mini"
                  @click="() => {openWindowHandler(data.download_url);}">
                  <i class="el-icon-link"></i>
                </el-button>
            </span>
          </span>
        </span>
        </el-tree>
      </div>
      <div @click="scrollTreeToTop" v-if="isShowScrollTreeToTop" style="position: fixed;right: 30px;bottom: 160px;height: 50px;width: 50px;border: 1px solid #ccc;border-radius: 5px;text-align: center;vertical-align: middle;font-size: 10px;font-weight: bold;padding:8px;cursor: pointer">返回<br/>顶部
      </div>
      <el-dialog :close-on-click-modal="false" :visible.sync="isShowImagePreview" append-to-body title="图片预览">
        <img width="100%" :src="fileUrl" alt="图片预览">
      </el-dialog>
    </div>
    <div style="text-align: center" v-else>
      <div class="reduce-height-element">
        <div>
          <el-button type="warning" size="mini" plain @click="isShowTree=true" icon="el-icon-arrow-left">返回列表</el-button>
          <el-button type="primary" size="mini" plain @click="switchEdit" icon="el-icon-edit">编辑/预览</el-button>
        </div>
        <div>
          <el-button type="info" disabled size="mini" plain @click="isShowTree=true" style="color:#555;cursor: default">当前文档：{{decodeURI(fileName)}}</el-button>
        </div>
      </div>
      <mark-down-area :height="tableAutoHeight" ref="md" :file-url="fileUrl"></mark-down-area>

    </div>
  </div>
</template>
<script>
  import MarkDownArea from 'src/views/common/MarkDownArea';
  import MdApi from 'src/api/md-api';
  import Global from 'src/utils/global';
  import SimpleAutoHeightTable from 'src/mixin/SimpleAutoHeightTable';

  export default {
    name: 'MarkdownDoc',
    mixins: [SimpleAutoHeightTable],
    components: {
      MarkDownArea
    },
    data() {
      return {
        isShowTree: true,
        fileName: '',
        fileUrl: '',
        filterText: '',
        isShowScrollTreeToTop: false,
        isShowImagePreview: false,
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        treeData: [],
      };
    },
    created() {
      this.$nextTick(() => {
        this.$refs.treeArea.addEventListener('scroll', this.treeAreaScrollHandler);
      });
      this.requestTreeData(Global.GITHUB_API_HOST + '/repos/' + Global.USER + '/' + Global.REPOSITORY + '/contents' + Global.DOC_ROOT, this.treeData);
    },
    methods: {
      requestTreeData(url, treeData, nodeDeep) {
        nodeDeep = nodeDeep || 0;
        MdApi.getFileFromGithub({ url: url === undefined ? '' : url })
          .then(({ data }) => {
            data.forEach((item) => {
              let node = item;
              node.deep = nodeDeep++;
              if (item.type === 'dir') {
                node.children = [];
                this.requestTreeData(item.url, node.children, nodeDeep);
              }
              treeData.push(node);
            });
          });
      },
      showPreviewButton(data) {
        if (data.type === 'file') {
          if (data.name.lastIndexOf('.') > 0) {
            switch (data.name.substring(data.name.lastIndexOf('.') + 1)
              .toLowerCase()) {
              case 'md':
              case 'jpg':
              case 'png':
              case 'jpeg':
              case 'bmp':
              case 'gif':
                return true;
              default:
                return false;
            }
          }
        }
      },
      previewHandler(url, name, path) {
        if (name.lastIndexOf('.') > 0) {
          switch (name.substring(name.lastIndexOf('.') + 1)
            .toLowerCase()) {
            case 'md':
              this.isShowTree = false;
              this.fileName = path;
              this.fileUrl = url;
              this.initSize();
              break;
            case 'jpg':
            case 'png':
            case 'jpeg':
            case 'bmp':
            case 'gif':
              this.fileUrl = url;
              this.isShowImagePreview = true;
              break;
          }
        }
      },
      openWindowHandler(url) {
        window.open(url);
      },
      switchEdit() {
        this.$refs.md.switchEdit();
      },
      downloadFileHandler(url, fileName, node) {
        node.loading = true;
        const Http = new XMLHttpRequest();
        Http.responseType = 'arraybuffer';
        Http.open('GET', url);
        Http.send();
        Http.onreadystatechange = () => {
          try {
            if (Http.readyState === 4) {
              if (Http.status === 200) {
                const content = Http.response;
                const blob = new Blob([content]);
                if ('download' in document.createElement('a')) { // （非IE下载）
                  const elink = document.createElement('a');
                  elink.download = fileName;
                  elink.style.display = 'none';
                  elink.href = URL.createObjectURL(blob);
                  document.body.appendChild(elink);
                  elink.click();
                  URL.revokeObjectURL(elink.href); // （释放URL 对象）
                  document.body.removeChild(elink);
                } else { // （IE10+下载）
                  navigator.msSaveBlob(blob, fileName);
                }
              } else {
                console.log('下载出错');
              }
            }
          } catch (e) {
            console.log('下载出错', e);
          } finally {
            setTimeout(() => {
              node.loading = false;
            }, 2000);
          }
        };
      },
      fileIcon(type, name) {
        if (type === 'dir') {
          return { 'el-icon-folder': true };
        } else {
          return { '': true };
        }
      },
      scrollTreeToTop() {
        this.$refs.treeArea.scrollTop = 0;
      },
      filterNode(value, data) {
        if (!value) return true;
        return data.name.indexOf(value) !== -1;
      },
      treeAreaScrollHandler() {
        this.isShowScrollTreeToTop = this.$refs.treeArea.scrollTop > this.tableAutoHeight;
      }
    },
    watch: {
      filterText(val) {
        this.$refs.fileTree.filter(val);
      }
    },
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

  /*缩小按钮*/
  .el-button--mini, .el-button--mini.is-round {
    padding: 3px;
  }

  /*缩小加载动画*/
  /deep/ .el-loading-spinner .circular {
    margin-top: 10px;
    height: 22px;
    width: 22px;
    -webkit-animation: loading-rotate 2s linear infinite;
    animation: loading-rotate 2s linear infinite;
  }
</style>

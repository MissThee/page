<template>
  <div style="margin:0 10%;">
    <div v-show="isShowTree">
      <div class="reduce-height-element">
        <el-tag type="info" size="large" style="color:#555;font-weight: bolder">初始目录深度(0不限):
          <el-input-number size="mini" :min="0" :max="99999" label="" v-model="treeDeep"></el-input-number>
          <el-button type="primary" size="small" style="margin-left:10px" plain @click="initTreeData">加载列表</el-button>
        </el-tag>
        <div style="float: right">
          <el-tag type="info" size="large" @click="isShowTree=true" style="color:#555;font-weight: bolder">已设置目录:</el-tag>
          <el-tag type="info" size="large" @click="isShowTree=true" style="color:#555;font-weight: bolder">{{currentSettingValue.repository}}</el-tag>
          <el-tag type="info" size="large" @click="isShowTree=true" style="color:#555;font-weight: bolder">{{currentSettingValue.docRoot}}</el-tag>
        </div>
        <el-input class="reduce-height-element" placeholder="输入关键字进行过滤" v-model="filterText"></el-input>
      </div>
      <div ref="treeArea" style="overflow: scroll" :style="{height: tableAutoHeight+'px'}">
        <el-tree :default-expanded-keys="defaultExpandedKeys" :load="loadNode" lazy ref="fileTree" :filter-node-method="filterNode" :data="treeData" node-key="id" :props="defaultProps">
        <span class="custom-tree-node" slot-scope="{ node, data }">
          <span :style="{fontWeight:data.type==='dir'?'bold':''}"><i :class="fileIcon(data.type,data.name)"></i>{{ node.label }}</span>
          <span>
            <span title="预览" style="width: 2em;display: inline-block">
                <el-button
                  v-if="showPreviewButton(data)"
                  style="color:#67c23a;"
                  plain
                  size="mini"
                  @click="() => {previewHandler(data);}">
                <i class="el-icon-view"></i>
                </el-button>
            </span>
            <span title="下载" style="width: 2em;display: inline-block">
                <el-button
                  v-loading="node.loading"
                  v-if="data.download_url&&data.download_url.length>0"
                  style="color:#e6a23c;"
                  plain
                  size="mini"
                  @click="() => {downloadFileHandler(data.download_url,data.name,node);}">
                  <i class="el-icon-download"></i>
                </el-button>
            </span>
             <span title="原文件链接" style="width: 2em;display: inline-block">
                <el-button
                  style="color:#555555;"
                  v-if="data.download_url&&data.download_url.length>0"
                  plain
                  size="mini">
                  <a :href="data.download_url" target="_blank">
                    <i class="el-icon-link"></i>
                  </a>
                </el-button>
            </span>
            <span title="前往github查看" style="width: 2em;display: inline-block">
                <el-button
                  style="color:#409eff;"
                  plain
                  size="mini">
                   <a :href="data.html_url" target="_blank">
                    <i class="el-icon-top-right"></i>
                   </a>
                </el-button>
             </span>
          </span>
        </span>
        </el-tree>
      </div>
      <div @click="scrollTreeToTop" v-if="isShowScrollTreeToTop" style="position: fixed;right: 2%;bottom: 160px;border: 1px solid #ccc;border-radius: 5px;text-align: center;vertical-align: middle;font-size: 10px;font-weight: bold;padding:8px;cursor: pointer;color:#666666"><i
        class="el-icon-arrow-up"></i><br/>返<br/>回<br/>顶<br/>部
      </div>
      <el-dialog :close-on-click-modal="false" :visible.sync="isShowImagePreview" append-to-body title="图片预览">
        <img width="100%" :src="currentImagePreviewFile.download_url" alt="图片预览">
      </el-dialog>
    </div>
    <div v-if="!isShowTree" style="text-align: center">
      <div class="reduce-height-element">
        <div>
          <el-button type="warning" size="mini" plain @click="backToTreeHandler" icon="el-icon-arrow-left">返回列表</el-button>
          <el-button type="primary" size="mini" plain @click="switchEdit" icon="el-icon-edit">编辑/预览</el-button>
        </div>
        <div>
          <el-tag type="info" size="mini" @click="isShowTree=true" style="color:#555;font-weight: bolder">当前文档：{{decodeURI(currentMdEditorFile.path)}}</el-tag>
        </div>
      </div>
      <mark-down-area @save="preSaveMdFile" :height="tableAutoHeight" ref="md" :file-url="currentMdEditorFile.download_url"></mark-down-area>
      <el-dialog style="text-align: center" :close-on-click-modal="false" :visible.sync="isShowPreSaveMdFileDialog" append-to-body title="提交">
        <el-input placeholder="personal access token (保存在本地cookie)" v-model="token"></el-input>
        <el-button :loading="currentMdEditorFileSaveButtonLoading" style="margin-top: 10px" type="primary" plain size="small" @click="sendSaveMdFile">确定</el-button>
      </el-dialog>
    </div>
  </div>
</template>
<script>
  import MarkDownArea from 'src/views/common/MarkDownArea';
  import MdApi from 'src/api/md-api';
  import SimpleAutoHeightTable from 'src/mixin/SimpleAutoHeightTable';
  import Cookie from 'src/utils/cookies';
  import { mapGetters, mapActions } from 'vuex';

  export default {
    name: 'MarkdownDoc',
    mixins: [SimpleAutoHeightTable],
    components: {
      MarkDownArea
    },
    data() {
      return {
        currentSettingValue: {
          repository: '',
          docRoot: '',
        },
        currentMdEditorFileValue: '',
        isShowPreSaveMdFileDialog: false,
        token: '',
        isShowTree: true,
        currentMdEditorFile: {},
        currentMdEditorFileSaveButtonLoading: false,
        currentImagePreviewFile: {},

        filterText: '',
        treeDeep: 1,
        isShowScrollTreeToTop: false,
        isShowImagePreview: false,
        defaultExpandedKeys: [],
        defaultProps: {
          children: 'children',
          label: 'name',
          isLeaf: 'leaf'
        },
        treeData: [],
      };
    },
    created() {
      this.$nextTick(() => {
        this.$refs.treeArea.addEventListener('scroll', this.treeAreaScrollHandler);
      });
    },
    activated() {
      if (!Cookie.token.getTokenValue()) {
        this.$notify({
          type: 'error',
          title: '需要先设置授权信息',
          message: '先到“设置”里登录，或设置token'
        });
        this.$router.push('/setting');
        return;
      }
      if (this.currentSettingValue.repository !== Cookie.repository.getRepositoryValue() || this.currentSettingValue.docRoot !== Cookie.docRoot.getDocRootValue()) {
        this.currentSettingValue.repository = Cookie.repository.getRepositoryValue();
        this.currentSettingValue.docRoot = Cookie.docRoot.getDocRootValue();
        this.initTreeData();
      }
    },
    methods: {
      initTreeData() {
        this.treeData = [];
        this.defaultExpandedKeys = [];
        this.requestTreeData('https://api.github.com/repos/' + this.getUser.login + '/' + Cookie.repository.getRepositoryValue() + '/contents' + Cookie.docRoot.getDocRootValue(), this.treeData, undefined, this.treeDeep);
      },
      requestTreeData(url, treeData, nodeDeep, limitDeep) {
        nodeDeep = nodeDeep || 0;
        nodeDeep++;
        if (limitDeep !== 0 && limitDeep < nodeDeep) {
          return;
        }
        MdApi.getFileFromGithub({ url: url === undefined ? '' : url })
          .then(({ data }) => {
            data = data.sort(this.sortMethod);
            data.forEach((item) => {
              let node = item;
              node.deep = nodeDeep;//节点深度，树中由1开始
              node.leaf = item.type === 'file';
              node.id = item.path;
              if (item.type === 'dir') {
                if (limitDeep === 0 || nodeDeep < limitDeep) {
                  this.defaultExpandedKeys.push(node.id);
                }
                node.children = [];
                this.requestTreeData(item.url, node.children, nodeDeep, limitDeep);
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
      previewHandler(data) {
        if (data.name.lastIndexOf('.') > 0) {
          switch (data.name.substring(data.name.lastIndexOf('.') + 1)
            .toLowerCase()) {
            case 'md':
              this.isShowTree = false;
              this.currentMdEditorFile = data;
              this.initSize();
              break;
            case 'jpg':
            case 'png':
            case 'jpeg':
            case 'bmp':
            case 'gif':
              this.currentImagePreviewFile = data;
              this.isShowImagePreview = true;
              break;
          }
        }
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
            }, 1500);
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
      },
      loadNode(node, resolve) {
        if (node.data.deep < this.treeDeep || this.treeDeep === 0) {
          setTimeout(() => {
            return resolve(node.data.children);
          }, 500);
        } else {
          if (node.data.type === 'dir') {
            MdApi.getFileFromGithub({ url: node.data.url })
              .then((result) => {
                if (result && result.data && result.data instanceof Array) {
                  let data = result.data.sort(this.sortMethod);
                  let childrenTreeData = [];
                  data.forEach((item) => {
                    let node = item;
                    node.leaf = item.type === 'file';
                    childrenTreeData.push(node);
                  });
                  setTimeout(() => {
                    return resolve(childrenTreeData);
                  }, 500);
                }
              });
          } else {
            return resolve([]);
          }
        }
      },
      sortMethod(a, b) {
        let aValue = (a.type === 'dir' ? '1' : '0') + a.name;
        let bValue = (b.type === 'dir' ? '1' : '0') + b.name;
        for (let i = 0; i < aValue.length && i < bValue.length; i++) {
          if (aValue.charAt(i) !== bValue.charAt(i)) {
            return aValue.charAt(i) - bValue.charAt(i) > 0 ? -1 : 1;
          }
        }
        return 0;
      },
      preSaveMdFile(value) {
        let tokenInCookie = Cookie.token.getTokenValue();
        if (tokenInCookie) {
          this.token = tokenInCookie;
        }
        this.currentMdEditorFileValue = value;
        this.isShowPreSaveMdFileDialog = true;

      },
      sendSaveMdFile() {
        Cookie.token.setTokenValue(this.token);
        this.isShowPreSaveMdFileDialog = false;
        this.currentMdEditorFileSaveButtonLoading = true;
        MdApi.saveMdFile({
          token: this.token,
          url: this.currentMdEditorFile.url,
          sha: this.currentMdEditorFile.sha,
          content: Base64.toBase64(this.currentMdEditorFileValue),
        })
          .then((result) => {
            if (result.status === 200) {
              this.$notify({
                title: '保存成功',
                type: 'success'
              });
              //更新sha值
              MdApi.getFileFromGithub({ url: result.data.content.url })
                .then((result) => {
                  this.currentMdEditorFile.sha = result.data.sha;
                  setTimeout(() => {
                    this.currentMdEditorFileSaveButtonLoading = false;
                  }, 1000);
                });
            } else {
              this.$notify({
                title: '保存失败',
                type: 'error'
              });
            }
          })
          .finally(() => {
            setTimeout(() => {
              this.currentMdEditorFileSaveButtonLoading = false;
            }, 1000);
          });
      },
      backToTreeHandler() {
        this.isShowTree = true;
        this.initSize();
      },

    },
    computed: {
      ...mapGetters({
        contentHeight: 'getContentHeight',
        contentWidth: 'getContentWidth',
        getUser: 'getUser'
      }),
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
    margin-top: 11px;
    height: 20px;
    width: 20px;
    -webkit-animation: loading-rotate 2s linear infinite;
    animation: loading-rotate 2s linear infinite;
  }

  .tool-bar-label {
    font-weight: bolder;
    font-size: 14px;
    color: #555555;
  }
</style>

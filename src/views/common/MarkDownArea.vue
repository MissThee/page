<template>
  <div>
    <mavon-editor
      :style="{height:height===0?'auto':height+'px'}"
      :editable="editorOptions.editable"
      :subfield="editorOptions.subfield"
      :defaultOpen="editorOptions.defaultOpen"
      :placeholder="editorOptions.placeholder"
      :toolbarsFlag="editorOptions.toolbarsFlag"
      :shortCut="editorOptions.shortCut"
      :toolbars="toolbars"
      @save="save"
      v-model="mdText"/>
    <!--    <pre style="position: absolute;top:0;left:0;width: 100%;z-index: 0" ref="md" id="md">{{mdText}}</pre>-->
  </div>
</template>
<script>

  export default {
    name: 'MarkDownArea',
    props: {
      fileUrl: {
        type: String,
        default: '',
      },
      height:{
        type:Number,
        default:0,
      },
      editorOptions: {
        type: Object,
        default: () => {
          return {
            editable: false,
            subfield: false,
            defaultOpen: 'preview',
            placeholder: '',
            toolbarsFlag: false,
            shortCut: true,
          };
        }
      }
    },
    data() {
      return {
        mdText: '',
        toolbars: {
          bold: true, // 粗体
          italic: true, // 斜体
          header: true, // 标题
          underline: true, // 下划线
          strikethrough: true, // 中划线
          mark: true, // 标记
          superscript: true, // 上角标
          subscript: true, // 下角标
          quote: true, // 引用
          ol: true, // 有序列表
          ul: true, // 无序列表
          link: true, // 链接
          imagelink: true, // 图片链接
          code: true, // code
          table: true, // 表格
          fullscreen: true, // 全屏编辑
          readmodel: true, // 沉浸式阅读
          htmlcode: true, // 展示html源码
          help: true, // 帮助
          /* 1.3.5 */
          undo: true, // 上一步
          redo: true, // 下一步
          trash: true, // 清空
          save: true, // 保存（触发events中的save事件）
          /* 1.4.2 */
          navigation: true, // 导航目录
          /* 2.1.8 */
          alignleft: true, // 左对齐
          aligncenter: true, // 居中
          alignright: true, // 右对齐
          /* 2.2.1 */
          // subfield: true, // 单双栏模式
          // preview: true, // 预览
        }
      };
    },
    created() {
      this.initMd();
    },
    methods: {
      initMd() {
        const Http = new XMLHttpRequest();
        Http.open('GET', this.fileUrl);
        Http.send();
        Http.onreadystatechange = () => {
          if (Http.readyState === 4 && Http.status === 200) {
            this.mdText = Http.responseText;
          }
        };
      },
      switchEdit() {
        this.editorOptions.editable = !this.editorOptions.editable;
        this.editorOptions.toolbarsFlag = !this.editorOptions.toolbarsFlag;
        this.editorOptions.subfield = !this.editorOptions.subfield;
      },
      save(value){
        this.$emit('save',value)
      },
      copyToClipboard(text) {
        let textArea = document.createElement('textarea');
        textArea.style.position = 'fixed';
        textArea.style.top = '0';
        textArea.style.left = '0';
        textArea.style.width = '2em';
        textArea.style.height = '2em';
        textArea.style.padding = '0';
        textArea.style.border = 'none';
        textArea.style.outline = 'none';
        textArea.style.boxShadow = 'none';
        textArea.style.background = 'transparent';
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();

        try {
          let successful = document.execCommand('copy');
          this.$notify({
            title: successful ? '成功复制到剪贴板' : '该浏览器不支持点击复制到剪贴板',
            type: successful ? 'success' : 'warning',
            duration: 2000,
          });
        } catch (err) {
          this.$notify({
            title: '不支持点击复制到剪贴板',
            type: 'warning',
            duration: 2000,
          });
        }
        document.body.removeChild(textArea);
      }
    }
  };
</script>

<style scoped>
</style>

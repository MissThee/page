<template>
  <div>
    <mavon-editor
      :editable="editorOptions.editable"
      :subfield="editorOptions.subfield"
      :defaultOpen="editorOptions.defaultOpen"
      :placeholder="editorOptions.placeholder"
      :toolbarsFlag="editorOptions.toolbarsFlag"
      :shortCut="editorOptions.shortCut"
      :toolbars="toolbars"
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
      editorOptions: {
        type: Object,
        default: () => {
          return {
            editable: false,
            subfield: false,
            defaultOpen: 'preview',
            placeholder: '',
            toolbarsFlag: false,
            shortCut: false,
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
          // save: true, // 保存（触发events中的save事件）
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
      const Http = new XMLHttpRequest();
      Http.open('GET', this.fileUrl);

      Http.send();
      Http.onreadystatechange = () => {
        if (Http.readyState === 4 && Http.status === 200) {
          this.mdText = Http.responseText;
        }
      };
    },
    methods: {
      switchEdit() {
        this.editorOptions.editable = !this.editorOptions.editable;
        this.editorOptions.shortCut = !this.editorOptions.shortCut;
        this.editorOptions.toolbarsFlag = !this.editorOptions.toolbarsFlag;
        this.editorOptions.subfield = !this.editorOptions.subfield;
      }
    }
  };
</script>

<style scoped>
</style>

<style src="@wangeditor/editor/dist/css/style.css"></style>
<template>
  <div class="text-editor-editing">
    <!--        <Toolbar-->
    <!--          style="border-bottom: 1px solid #ccc;"-->
    <!--          :editor="editor"-->
    <!--          :defaultConfig="toolbarConfig"-->
    <!--          mode="simple"-->
    <!--        />-->
    <Editor
        class="editor-block"
        v-model="htmlNow"
        :defaultConfig="editorConfig"
        mode="simple"
        @onCreated="createdHandler"
        @onDestroyed="changeHandler()"
        @onChange="changeHandler"
    />
    <div class="editor-border"/>
  </div>
</template>

<script>
import {Editor, Toolbar} from '@wangeditor/editor-for-vue'
import EventBus, {EventBusKey} from "index/views/reportV2/tool/EventBus";

export default {
  name: "textEditorEditing",
  components: {Editor, Toolbar},
  props: {
    value: {
      type: String,
      default: () => ''
    },
  },
  data() {
    return {
      editor: null,
      htmlNow: '',
      toolbarConfig: {

        toolbarKeys: [
          'fontSize',

          'justifyLeft',
          'justifyRight',
          'justifyCenter',
          'justifyJustify',

          'bold',
          'italic',
          'underline',
          'through',

          'color',

          'bulletedList',
          'numberedList',
        ]
      },
      editorConfig: {
        maxLength: 2000,
        scroll: false,
        autoFocus: false,
        placeholder: ''
      },
    }
  },
  methods: {
    createdHandler(editor) {
      this.editor = Object.seal(editor) // 一定要用 Object.seal() ，否则会报错
    },
    changeHandler(editor) {
      EventBus.$emit(EventBusKey.editorChange, editor)
      if (editor) {
        this.$emit('input', editor.getText() ? editor.getHtml() : '')
      }
    }
  },
  beforeDestroy() {
    const editor = this.editor
    if (editor === null) return
    editor.destroy() // 组件销毁时，及时销毁编辑器
  },
  watch: {
    value: {
      handler() {
        this.htmlNow = this.value
      },
      immediate: true
    },
    // htmlNow() {
    //   this.$emit('input', this.htmlNow)
    // }
  }
}

</script>

<style lang="scss">

.text-editor-editing {
  min-width: 1em;
  display: inline-block;
  vertical-align: top;
  //box-shadow: 0 0 1PX 1PX #ff4d00 inset;
  border-radius: 8px;
  overflow: hidden;
  padding-left: 1PX;
  margin-left: -1PX;
  position: relative;

  .editor-block {
    min-height: 10px;
    overflow-y: hidden;
  }

  .editor-border {
    pointer-events: none;
    border: 1.5PX dashed #0094ff;
    border-radius: inherit;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }
}

// placeholder内容位置
.w-e-text-placeholder {
  top: 0;
  left: 0;
}

// 字数限制文字屏蔽
.w-e-max-length-info {
  display: none;
}

// 字内容样式
.w-e-scroll {
  font-size: inherit;
  position: relative;

  &, * {
    color: inherit;
    margin-top: 0 !important;
    margin-bottom: 0 !important;
    word-break: break-all;
    line-height: inherit !important;
    border: none !important;
    padding: 0 !important;
    font-weight: inherit !important;
  }

  strong {
    font-weight: bold !important;
  }

  p {
    margin: 0 !important;
  }

  span[style="margin-right: 0.5em;"] {
    margin-right: 0.3em !important;
  }
}


// 集中定义 css vars ，否则会被重复定义多次
:root, :host {
  // textarea - css vars
  --w-e-textarea-bg-color: transparent;
  --w-e-textarea-color: inherit;
  --w-e-textarea-border-color: #000;
  --w-e-textarea-slight-border-color: #e8e8e8;
  --w-e-textarea-slight-color: #d4d4d4;
  --w-e-textarea-slight-bg-color: #f5f2f0;
  --w-e-textarea-selected-border-color: #B4D5FF; // 选中的元素，如选中了分割线
  --w-e-textarea-handler-bg-color: #4290f7; // 工具，如图片拖拽按钮

  // toolbar - css vars
  --w-e-toolbar-color: #595959;
  --w-e-toolbar-bg-color: #fff;
  --w-e-toolbar-active-color: #333;
  --w-e-toolbar-active-bg-color: #f1f1f1;
  --w-e-toolbar-disabled-color: #999;
  --w-e-toolbar-border-color: #e8e8e8;

  // modal - css vars
  --w-e-modal-button-bg-color: #fafafa;
  --w-e-modal-button-border-color: #d9d9d9;
}
</style>


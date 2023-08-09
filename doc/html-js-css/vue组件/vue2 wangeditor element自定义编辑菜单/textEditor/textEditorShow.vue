<template>
  <div class="text-editor-show" v-html="value"/>
</template>
<script>

export default {
  name: "textEditorShow",
  props: {
    value: {
      type: String,
      default: () => ''
    },
  },
}

</script>

<style lang="scss">
.text-editor-show {
  * {
    word-break: break-all;
    line-height: inherit !important;
  }

  p {
    margin: 0 !important;
  }

  ul {
    list-style: none; //disc inside;
    li::before { //使用伪类插入符号
      content: "●";
      font-size: 0.58em;
      color: inherit;
      padding-right: 0.5em;
      vertical-align: top;
    }
  }

  ol {
    list-style: decimal inside;
  }
}


</style>


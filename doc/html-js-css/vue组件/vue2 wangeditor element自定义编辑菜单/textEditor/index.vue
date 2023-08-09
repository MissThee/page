<template>
  <textEditorEditing v-if="!readOnly && $store.getters.isEditing" v-model="value"/>
  <textEditorShow v-else :value="value"/>
</template>

<script>
import TextEditorEditing from "./textEditorEditing.vue";
import TextEditorShow from "./textEditorShow.vue";

export default {
  name: "textEditor",
  components: {TextEditorShow, TextEditorEditing},
  props: {
    value: {
      type: String,
      default: () => ''
    },
    readOnly: {
      type: Boolean,
      default: () => false
    }
  },
  watch: {
    value: {
      handler(newVal) {
        this.$emit('input', newVal)
      },
      immediate: true
    }
  }
}
</script>
<template>
  <div>
    <el-scrollbar class="tag-row">
      <div class="tag-row__content">
        <div class="tag-wrapper">
          <div v-for="(tag,index) in props.data" :key="tag.id" class="tag"
               :class="{
                    'tag--active': props.modelValue===(props.activeValueIsIndex ? index : tag.id),
                    'tag--busy':isBusy
                }"
               @click="tagClickHandler(tag,index)">
            <div class="text">{{ tag.name }}</div>
          </div>
        </div>
      </div>
      <div class="bg"/>
    </el-scrollbar>
  </div>
</template>

<script lang="ts">
export default {
  name: "TagSelector"
}
</script>
<script lang="ts" setup>

export interface TagData {
  id: number, //
  name: string, // 标签名
}

const props = withDefaults(defineProps<{
  data: TagData[],
  modelValue: number | null | undefined
  activeValueIsIndex?: boolean // 为true时：v-model绑定值使用序号。  默认false，绑定id
  isBusy?: boolean // true时，标签不可切换（不改变本身样式，改变鼠标指针为 wait）
}>(), {
  data: () => []
})

const emit = defineEmits(['select', 'update:modelValue'])
const tagClickHandler = (tag: TagData, index: number) => {
  if (props.isBusy) {
    return
  }
  emit('select', tag, index)
  if (props.activeValueIsIndex) {
    emit("update:modelValue", index)
  } else {
    emit("update:modelValue", tag.id)
  }
}


</script>

<style scoped lang="less">
.tag-row {
  background-color: white;
  text-align: left;
  border-radius: 4px;

  .bg {
    background-color: #F3F5FA;
    width: 100%;
    position: absolute;
    bottom: 0;
    height: 6px;
  }

  &__content {
    @tag-row-height: 60px;
    display: inline-block;
    text-align: left;
    height: @tag-row-height;
    white-space: nowrap;
    position: relative;

    .tag-wrapper {
      align-items: center;
      display: flex;
      white-space: nowrap;
      vertical-align: top;
      height: 100%;
      padding-left: 10px;

      .split {
        vertical-align: middle;
        display: inline-block;
        width: 1px;
        height: 40%;
        background: #D8D8D8;
        margin-right: 18px;
      }

      .tag {
        line-height: @tag-row-height;
        height: 100%;
        display: inline-block;
        text-align: center;
        padding: 0 27px;
        position: relative;
        cursor: pointer;
        transition: color 0.3s ease-in-out;
        font-size: 14px;
        font-family: PingFangSC-Medium, PingFang SC, "Microsoft YaHei", sans-serif;
        font-weight: 500;
        color: #666666;
        user-select: none;
        z-index: 1;
        margin-right: 18px;

        &:hover {
          color: var(--el-color-primary)
        }

        // 激活横线
        .text {
          position: relative;

          &:after {
            content: ' ';
            background-color: var(--el-color-primary);
            height: 2px;
            width: 0;
            position: absolute;
            left: 50%;
            bottom: 16px;
            transform: translateX(-50%);
            transition: width 0.3s ease-in-out;
            z-index: 1;
          }
        }

        // 激活背板
        &:before {
          content: ' ';
          left: 0;
          bottom: 0;
          position: absolute;
          height: @tag-row-height - 8;
          width: 100%;
          z-index: -1;
          background: linear-gradient(180deg, #E3EAFF 0%, #FFFFFF 100%);
          box-shadow: 0 -2px 4px -2px rgba(0, 0, 0, 0.1);
          border-radius: 4px 4px 0 0;
          opacity: 0;
          transition: opacity 0.3s ease-in-out;
        }

        &--active {
          color: var(--el-color-primary);
          font-weight: 600;
          font-family: PingFangSC-Medium, PingFang SC, SimHei, sans-serif;

          .text {
            &:after {
              content: ' ';
              width: 110%;
              opacity: 1;
              box-shadow: 0 -2px 4px 0 rgba(0, 0, 0, 0.1);
            }
          }

          &:before {
            opacity: 1;
          }
        }

        &--busy {
          cursor: wait;
        }

        &--disable {
          cursor: not-allowed;
        }
      }
    }
  }
}
</style>

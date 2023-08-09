<template>
  <div class="text-editor-tool">
    <div class="title">文字</div>
    <div class="tool-btn-wrapper">
      <!--   字号（不能用el-selector 或者 el-dropdown 因为点击这些组件会使编辑器失焦。需要用el-popover和el-button组合制作下拉）   -->
      <el-popover placement="bottom" trigger="hover" :disabled="!isEnabled || !isSelectedText" transition="none" popper-class="text-editor-custom-toolbar-popper">
        <template slot="reference">
          <el-button class="size-btn" :disabled="!isEnabled || !isSelectedText" title="选中文字后，可设置字号">
            <span class="size-btn__text">{{ fontOption.fontSize || '默认' }}</span>
            <i class="size-btn__icon el-icon-arrow-down"/>
          </el-button>
        </template>
        <el-button type="text" v-for="item in BtnSetting.fontSizeList" :key="item.key" class="popper-list-item" @click="()=>{fontOption.fontSize=item.key ;fontChangeHandler('size',item.key)}">{{ item.name }}</el-button>
      </el-popover>
      <!--   对齐方式  -->
      <el-checkbox-group class="align-btn" :disabled="!isEnabled" :value="[fontOption.align]" @input="e=>fontOption.align = Array.isArray(e) ? e.slice(-1)[0] || '': ''" @change="(e)=> fontChangeHandler('align',e)">
        <el-checkbox-button v-for="item in BtnSetting.alignList" :key="item.key" :label="item.key">
          <img :src="item.icon" :alt="item.key"/>
        </el-checkbox-button>
      </el-checkbox-group>
      <!--   样式  -->
      <el-checkbox-group class="style-btn" :disabled="!isEnabled||!isSelectedText" v-model="fontOption.fontStyle" @change="(e)=> fontChangeHandler('style',e)" title="选中文字后，可设置样式">
        <el-checkbox-button v-for="item in BtnSetting.styleList" :key="item.key" :label="item.key">
          <img :src="item.icon" :alt="item.key"/>
        </el-checkbox-button>
      </el-checkbox-group>
      <!--   字体颜色  -->
      <!--      <el-color-picker class="color-btn" popper-class="side-color-picker" v-model="fontOption.color" :predefine="BtnSetting.colorPreset" @change="(e)=> fontChangeHandler('color',e)"/>-->
      <el-popover placement="bottom" trigger="hover" :disabled="!isEnabled||!isSelectedText" transition="none" popper-class="text-editor-custom-toolbar-popper">
        <template slot="reference">
          <el-button class="color-btn" :disabled="!isEnabled||!isSelectedText" :title="!isSelectedText?'选中文字后，可设置文字颜色':(fontOption.color||'默认')">
            <div class="color-btn__content">
              <div class="color-btn__color" :class="{'color-btn__color--empty':!fontOption.color}" :style="{backgroundColor:fontOption.color}"/>
              <i class="color-btn__icon el-icon-arrow-down"/>
            </div>
          </el-button>
        </template>
        <div class="popper-row" v-for="(row,rowIndex) in BtnSetting.colorPreset" :key="rowIndex">
          <el-button type="text" v-for="item in row" :key="item" class="popper-row__item" @click="()=>{fontOption.color=item ;fontChangeHandler('color',item)}">
            <div class="color-rect" v-if="item" :style="{backgroundColor:item}" :title="item"/>
            <div class="color-rect color-rect--empty" v-else title="恢复默认"/>
          </el-button>
        </div>
      </el-popover>
      <!--   列表类型   -->
      <el-checkbox-group class="index-type-btn" :disabled="!isEnabled" :value="[fontOption.listType]" @input="e=>fontOption.listType = Array.isArray(e) ? e.slice(-1)[0] || '': ''" @change="(e)=> fontChangeHandler('listType',e)">
        <el-checkbox-button v-for="item in BtnSetting.listTypeList" :key="item.key" :label="item.key">
          <img :src="item.icon" :alt="item.key"/>
        </el-checkbox-button>
      </el-checkbox-group>
    </div>
    <!--    <el-button @click="getHtmlHandler">输出editor.getHtml()内容</el-button>-->
  </div>
</template>

<script>
import EventBus, {EventBusKey} from "index/views/reportV2/tool/EventBus";
import {SlateTransforms} from "@wangeditor/editor";
import * as BtnSetting from './btnSetting.js'
import {styleList} from "./btnSetting.js";

export default {
  name: "textEditorToolbar",
  components: {},
  data() {
    return {
      editorDetail: null,
      fontOption: {
        fontSize: '', //12px
        align: '',// center left right justify
        fontStyle: [], //bold italic underline through
        color: '', // #dddddd
        listType: '' // ol ul
      },
      // 按钮配置
      BtnSetting,
      isEnabled: false,
      isSelectedText: false,
    }
  },
  created() {
    EventBus.$on(EventBusKey.editorChange, (editor) => {
      this.editorDetail = editor
      // 是否有编辑器聚焦(编辑器聚焦则编辑按钮可用)
      this.isEnabled = this.editorDetail && this.editorDetail.selection
      // 是否选中了编辑器中文字
      this.isSelectedText = this.editorDetail && this.editorDetail.selection && JSON.stringify(this.editorDetail.selection.anchor) !== JSON.stringify(this.editorDetail.selection.focus)
      // 将wangEditor当前文字状态，转换为自定义按钮的绑定值
      if (editor && editor.selection && editor.selection.focus && editor.selection.focus.path) {
        const [rowIndex, columnIndex] = editor.selection.focus.path
        const targetRow = editor.children[rowIndex]
        const targetColumn = targetRow.children[columnIndex]
        this.fontOption.fontSize = targetColumn.fontSize || ''
        this.fontOption.align = Array.isArray(targetRow.textAlign) ? targetRow.textAlign[0] : ''
        this.fontOption.fontStyle = BtnSetting.styleList.map(e => targetColumn[e.key] ? e.key : '').filter(e => e)
        this.fontOption.color = targetColumn.color
        this.fontOption.listType = targetRow.type === 'list-item' ? (targetRow.ordered ? 'ol' : 'ul') : ''
      } else {
        this.fontOption.fontSize = '' //12px
        this.fontOption.align = ''// center left right justify
        this.fontOption.fontStyle = [] //bold italic underline through
        this.fontOption.color = '' // #dddddd
        this.fontOption.listType = '' //ol ul
      }
    })
  },
  methods: {
    getHtmlHandler() {
      console.log(this.editorDetail.getHtml())
    },
    fontChangeHandler(type, e) {
      if (this.editorDetail) {
        switch (type) {
          case'size':
            if (e) {
              this.editorDetail.addMark('fontSize', e)
            } else {
              this.editorDetail.removeMark('fontSize')
            }
            break;
          case'align':
            SlateTransforms.setNodes(this.editorDetail, {textAlign: e})
            break;
          case 'style':
            styleList.forEach(s => {
              if (e.includes(s.key)) {
                this.editorDetail.addMark(s.key, true)
              } else {
                this.editorDetail.removeMark(s.key)
              }
            })
            break;
          case'color':
            if (e) {
              this.editorDetail.addMark('color', e)
            } else {
              this.editorDetail.removeMark('color')
            }
            break;
          case'listType': {
            const propsTmp = {}
            if (e.includes('ol')) {
              propsTmp.type = 'list-item'
              propsTmp.ordered = true
            } else if (e.includes('ul')) {
              propsTmp.type = 'list-item'
              propsTmp.ordered = false
            } else {
              propsTmp.type = 'paragraph'
            }
            this.editorDetail.addMark('list-item', true)
            SlateTransforms.setNodes(this.editorDetail, propsTmp, {
              mode: 'highest' // 针对最高层级的节点
            })
            break;
          }
        }
        const currentSelectionNew = JSON.parse(JSON.stringify(this.editorDetail.selection))
        this.editorDetail.focus()
        this.editorDetail.select(currentSelectionNew)
      }
    }
  },
}
</script>


<style scoped lang="scss">
.text-editor-tool {

  .title {
    font-size: 16px;
    font-weight: 600;
    color: #000000;
  }

  .tool-btn-wrapper {
    margin-top: 21px;
    user-select: none;

    ::v-deep {
      * {
        transition: none !important;
      }
    }

    & > * {
      margin-right: 14px;
      margin-bottom: 14px;
      vertical-align: top;
      display: inline-block;
    }

    .size-btn {
      width: 80px;
      padding-left: 0;
      padding-right: 0;

      &__text {
        color: black;
        display: inline-block;
        margin-right: 10px;
        min-width: 40px;
      }

      &__icon {
        color: black;
        font-weight: bold;
      }


    }

    .align-btn {
      margin-right: 0;
    }

    .style-btn {

    }

    .color-btn {
      width: 80px;
      padding: 4px 10px;
      margin-right: 0;

      &__content {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      &__color {
        display: inline-block;
        width: 30px;
        height: 30px;
        position: relative;
        border-radius: 6px;
        box-shadow: 0 0 1PX 1PX #ccc inset;
        vertical-align: top;

        &--empty {
          $colorTmp: rgba(0, 0, 0, 0.2);
          $rectSize: 14px;
          background: linear-gradient(45deg, $colorTmp 25%, transparent 25%, transparent 75%, $colorTmp 75%, $colorTmp),
          linear-gradient(45deg, $colorTmp 25%, transparent 25%, transparent 75%, $colorTmp 75%, $colorTmp);
          background-size: $rectSize $rectSize;
          background-position: 0 0, calc($rectSize / 2) calc($rectSize / 2);
        }
      }

      &__icon {
        color: black;
        font-weight: bold;
      }
    }

    ::v-deep {
      .is-disabled {
        opacity: 0.7;
      }

      // 单选组按钮样式
      .el-radio-button__inner {
        padding: 0;
        min-width: 45px;
        min-height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      // 多选组按钮样式
      .el-checkbox-button__inner {
        padding: 0;
        min-width: 48px;
        min-height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: none;
      }

      // 颜色选择中间图标
      //.el-color-picker {
      //  &__trigger {
      //    width: 80px;
      //    position: relative;
      //    align-items: center !important;
      //  }
      //
      //  &__color {
      //    width: 30px;
      //  }
      //
      //  &__empty {
      //    display: none;
      //  }
      //
      //  &__icon {
      //    color: black;
      //    position: absolute !important;
      //    right: 0;
      //    left: 36px !important;
      //    transform: translateY(-50%);
      //    width: 50%;
      //    display: block !important;
      //    font-size: 14px;
      //    font-weight: bold;
      //  }
      //}

    }
  }
}

</style>
<style lang="scss">
.text-editor-custom-toolbar-popper {
  min-width: 0 !important;
  padding: 0;

  .popper-list-item {
    padding: 8px 15px;
    cursor: pointer;
    display: block;
    margin: 0;
    color: inherit;

    &:hover {
      color: $--color-primary;
      background-color: $--select-option-hover-background;
    }
  }

  .popper-row {
    padding: 5px 15px;
    display: block;
    margin: 0;
    color: inherit;

    &__item {
      cursor: pointer;
      padding: 0;
      display: inline-block;
      vertical-align: top;
    }
  }

  .color-rect {
    height: 20px;
    width: 20px;
    display: inline-block;
    vertical-align: top;
    box-shadow: 0 0 1PX 1PX #ccc inset;
    border-radius: 6px;
    overflow: hidden;
    position: relative;

    &--empty {
      &:after {
        content: '';
        position: absolute;
        display: block;
        width: 150%;
        height: 2px;
        top: 50%;
        left: 50%;
        background-color: red;
        transform: translate(-50%, -50%) rotate(45deg);
        transform-origin: 50% 50%;
      }
    }
  }
}
</style>
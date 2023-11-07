<template>
  <div class="service-detail" :class="{ 'service-detail--home': markerDetail.order_no ==='-'}" v-show="markerDetail.order_no">
    <div v-if="markerDetail.order_no ==='-' ">
      <div @click="addressClickHandler('home')" class="address">{{ markerDetail.engineer_name }} 的家</div>
      <el-button type="text" @click="closeHandler" class="close_btn">ⅹ</el-button>
    </div>
    <div v-else>
      <div class="tab">
        <div :class="{'tab_item':true, 'tab_item-active': index === tab_active}"
             v-for="(item, index) in tabs"
             :key="index"
             @click="tab_active = index">{{ item }}
        </div>
      </div>
      <div class="title">
        <div class="order_name">
          <span class="tips" v-if="markerDetail.is_mars">星</span>
          <span class="tips" :class="{ 'is_edited': markerDetail.is_edited}" v-if="markerDetail.is_mars_appoint">定</span>
          <span class="tips self" :class="{ 'is_edited': markerDetail.is_edited}" v-if="markerDetail.is_xpest_self">本</span>
          {{ markerDetail.order_no }}
        </div>
        <el-button type="text" @click="closeHandler" class="close_btn" icon="Close"/>
      </div>
      <div class="detail_content" v-if="tab_active === 0" ref="detailContentRef">
        <div v-for="(item, index) in markerDetail.children" :key="index">
          <div class="engineer">
            <div>
              <span :class="{'tips': true, 'tips_top': index == 0}">{{ index === 0 ? '主' : '协' }}</span>{{ item['label'] }}
            </div>
            <div>
              <span class="label">通勤时长：</span>{{ item['time_span'] }}
            </div>
          </div>
          <div class="engineer_eid">
            <span class="label">工程师工号:</span> {{ item['identity_card_no'] }}
          </div>
        </div>
        <p style="display: flex;white-space: nowrap;align-items: center">
          <span class="label">时间：</span>
          <span v-if="isReadOnly">{{ markerDetail.appointment_time }}</span>
          <template v-else>
            <span style="margin-right: 5px">{{ markerDetail.appointment_time?.split(' ')[0] }}</span>
            <el-time-picker style="width: 95px;height:28px" :clearable="false" :disabled="isDetail"
                            :modelValue="markerDetail.appointment_time?new Date(markerDetail.appointment_time):new Date()"
                            @update:modelValue="(val)=>{
                              if (markerDetail.appointment_time) {
                                  markerDetail.appointment_time = markerDetail.appointment_time.split(' ')[0] + ' ' + Moment(val).format('HH:mm:ss')
                               }
                            }"
                            @change="orderDateChangeHandler"/>
          </template>
        </p>
        <p><span class="label">原始时间：</span>{{ markerDetail.ago_time }}</p>
        <p><span class="label">经纬度：</span>{{ markerDetail.lng }}, {{ markerDetail.lat }}</p>
        <p><span class="label">预估服务人数：</span>{{ markerDetail.service_pcount }}</p>
        <p><span class="label">作业面积：</span>{{ markerDetail.area_size }}</p>
        <p><span class="label">靶标：</span>{{ markerDetail.products }}</p>
        <p><span class="label">服务次数：</span>{{ markerDetail.service_times }}</p>
        <p @click="addressClickHandler()"><span class="label address" style="cursor: pointer">地址：</span>{{ markerDetail.address }}</p>
        <p><span class="label">订单备注：</span>{{ markerDetail.order_remark }}</p>
        <p><span class="label">服务单备注：</span>{{ markerDetail.onsite_remark }}</p>
        <p><span class="label">上次主工程师：</span>{{ markerDetail.last_engineer }}</p>
      </div>
      <div v-else class="detail_content-log" :style="{ 'height': `${contentHeight}px`}">
        <div v-if="markerDetail.modification_record.length">
          <div class="engineers"
               v-for="(item, index) in markerDetail.modification_record"
               :key="index">
            <div class="date">{{ item['updated_at'] }}</div>
            <div v-if="item['modification_type'] === 'time'" class="content-row">
              <div class="engineers_item engineers_item-time">
                <div>{{ item['original_time'].split(' ')[0] }}</div>
                <div>{{ item['original_time'].split(' ')[1] }}</div>
              </div>
              <img class="arrow" :src="Assets.arrow" alt=""/>
              <div class="engineers_item engineers_item-time">
                <div>{{ item['modification_time'].split(' ')[0] }}</div>
                <div>{{ item['modification_time'].split(' ')[1] }}</div>
              </div>
            </div>
            <div v-else class="content-row">
              <div class="engineers_item">
                <div class="name" v-if="!item['original_info']['length']">
                  <span :class="['icon', 'icon_null']">空</span>
                </div>
                <div v-for="(item_c, index_c) in item['original_info']" :key="index_c" v-else>
                  <div class="name">
                    <span :class="['icon', item_c['engineer_identity'] === '协' ? 'icon_xie' : '']">{{ item_c['engineer_identity'] === '协助' ? '协' : item_c['engineer_identity'] === '' ? '空' : item_c['engineer_identity'] }}</span>{{ item_c['engineer_name'] }}
                  </div>
                  <div class="number">
                    <span class="label">工程师工号：</span>{{ item_c['identity_card_no'] }}
                  </div>
                </div>
              </div>
              <img class="arrow" :src="Assets.arrow" alt=""/>
              <div class="engineers_item">
                <div class="name" v-if="!item['modification_info']['length']">
                  <span :class="['icon', 'icon_null']">空</span>
                </div>
                <div v-for="(item_c, index_c) in item['modification_info']" :key="index_c" v-else>
                  <div class="name">
                    <span :class="['icon', item_c['engineer_identity'] === '协' ? 'icon_xie' : '']">{{ item_c['engineer_identity'] === '协助' ? '协' : item_c['engineer_identity'] === '' ? '空' : item_c['engineer_identity'] }}</span>{{ item_c['engineer_name'] }}
                  </div>
                  <div class="number">
                    <span class="label">工程师工号：</span>{{ item_c['identity_card_no'] }}
                  </div>
                </div>
              </div>
            </div>
            <div class="reason">{{ item['reason'] }}</div>
          </div>
        </div>
        <div v-else style="text-align:center; padding: 20px">暂无数据</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: "serviceDetail"
}
</script>

<script setup lang="ts">
import * as Assets from './assets'
import Moment from "moment/moment";
import {ref, withDefaults, defineProps, watch, defineEmits} from "vue";

const props = withDefaults(defineProps<{
  isReadOnly?: boolean,
  data: Record<string, any>,
  isDetail?: Boolean
}>(), {
  data: () => ({}),
})

const markerDetail = ref<Record<string, any>>({})
watch(() => props.data, () => {
  markerDetail.value = JSON.parse(JSON.stringify(props.data))
}, {immediate: true, deep: true})

const contentHeight = ref(0)
const detailContentRef = ref()
watch(() => markerDetail.value.order_no, () => {
  if (tab_active.value === 0 && markerDetail.value.order_no) {
    setTimeout(() => {
      contentHeight.value = detailContentRef.value?.clientHeight
    })
  }
})
const addressClickHandler = (type?: string) => {
  emits('addressClick', type)
}
const closeHandler = () => {
  emits('close')
}
const orderDateChangeHandler = () => {
  emits('orderDateChange', markerDetail.value.appointment_time)
}
const emits = defineEmits(['addressClick', 'close', 'orderDateChange'])
const tabs = ['服务单详情', '修改记录']
let tab_active = ref(0)

</script>

<style scoped lang="scss">
.service-detail {
  position: absolute;
  top: 0;
  right: 0;
  font-size: 12px;
  width: 320px;
  background: #FFFFFF;
  box-shadow: 0px 2px 8px 0px rgba(47, 53, 71, 0.16);
  border-radius: 2px;
  z-index: 99;

  // min-height: 492px;
  p {
    margin: 0 0 8px 0;
  }

  .order_name {
    color: #333333;
    font-weight: 600;

    .tips {
      width: 16px;
      height: 16px;
      text-align: center;
      border-radius: 2px;
      background-color: #FFB400;
      margin-right: 5px;
      display: inline-block;
      line-height: 16px;

      &.is_edited {
        background-color: #ccc;
      }
    }

    .self {
      background-color: #5682FF;
      color: #fff;

      &.is_edited {
        background-color: #ccc;
      }
    }
  }

  .label {
    color: #999999;
  }

  .engineer {
    display: flex;
    justify-content: space-between;
    justify-items: center;

    .tips {
      display: inline-block;
      width: 16px;
      height: 16px;
      background: #33DFA0;
      border-radius: 2px;
      color: #fff;
      text-align: center;
      margin-right: 4px;
      line-height: 16px;
    }

    .tips_top {
      background: #5682FF !important;
    }
  }

  .address {
    cursor: pointer;
  }

  .engineer_eid {
    margin: 8px 0px;
  }

  :deep(.el-input__inner) {
    height: 24px;
    font-size: 12px;
  }

  .close_btn {
    position: absolute;
    right: 12px;
    top: 35px;
    color: #3D3D3D !important;
    font-size: 20px;
    padding: 0;
  }

  .title {
    padding: 0 12px;
  }

  .tab {
    display: flex;
    justify-content: center;
    justify-items: center;
    text-align: center;
    font-size: 16px;
    color: #999999;
    margin-bottom: 12px;
    cursor: pointer;

    .tab_item {
      height: 40px;
      line-height: 40px;
      width: 160px;
    }

    .tab_item-active {
      color: #000000;
      font-weight: 600;
      position: relative;

      &::after {
        position: absolute;
        bottom: 0;
        left: 0;
        content: '';
        width: 160px;
        height: 2px;
        background: #5682FF;
        box-shadow: 0px 2px 8px 0px rgba(47, 53, 71, 0.16);
      }
    }
  }

  .detail_content {
    padding: 4px 12px 12px 12px
  }

  .detail_content-log {
    overflow: auto;

    .date {
      width: 150px;
      height: 24px;
      line-height: 24px;
      text-align: center;
      background: #E2EEF7;
      box-shadow: 0px 2px 8px 0px rgba(47, 53, 71, 0.16);
      border-radius: 2px;
      color: #5682FF;
      font-size: 12px;
      font-weight: 400;
      margin-bottom: 4px;
    }

    .engineers {
      border-bottom: 1px solid #F5F5F5;
      padding: 8px 12px;

      .content-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      .arrow {
        width: 40px;
      }

      &_item {
        display: inline-block;
        width: 50%;
        vertical-align: top;

        .name {
          font-weight: 600;

          .icon {
            width: 16px;
            height: 16px;
            line-height: 16px;
            background: #5682FF;
            box-shadow: 0px 2px 8px 0px rgba(47, 53, 71, 0.16);
            border-radius: 2px;
            display: inline-block;
            color: #fff;
            text-align: center;
            margin-right: 4px;
          }

          .icon_null {
            background: #999999
          }

          .icon_xie {
            background: #33DFA0;
          }
        }

        .number {
          margin: 8px 0px;
        }
      }

      &_item-1 {
        padding-left: 27px
      }

      &_item-time {
        line-height: 22px;
      }
    }
  }

  .time {
    margin-top: 32px;

    .time_item {
      display: flex;
      justify-content: space-between;
      justify-items: center;
      margin-bottom: 8px;
    }
  }

  &--home {
    .address {
      height: 30px;
      line-height: 30px;
      padding: 0 5px;
    }

    .close_btn {
      top: -7px;
    }
  }
}


</style>
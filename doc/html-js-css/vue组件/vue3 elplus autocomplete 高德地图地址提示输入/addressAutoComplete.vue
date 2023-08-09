<template>
	<el-autocomplete
		class="address-auto-complete"
		v-model="placeData.value"
		:fetch-suggestions="cityAreaAutoSearch"
		:placeholder="props.placeholder||'请输入'"
		@select="cityAreaCompleteSelectHandler"
		@blur="cityAreaCompleteBlurHandler"
		@change="cityAreaCompleteChangeHandler"
		:type="autoSize?'input':'textarea'"
		:autoSize="autoSize"
	/>
</template>

<script lang="ts" setup>
import axios, {AxiosResponse} from "axios";

export interface AreaItem {
	value: string,
	lng?: number,
	lat?: number
}
interface AMapSearchResponse extends AxiosResponse {
	data: {
		status: string
		info: string,
		tips: {
			id: string,
			name: string,
			district: string,
			address: string | [],
			location: string | []
		}[]
	}
}
// 地址补全
import { ref, defineProps, defineEmits, PropType, watch } from "vue";

const props = defineProps({
	searchCity: String,
	placeholder:String,
	modelValue: Object as PropType<AreaItem>,
	autoSize: Boolean
});

const placeData = ref<AreaItem>({ value: "" });

watch(() => props.modelValue, (newVal) => {
	placeData.value = newVal?.value ? JSON.parse(JSON.stringify(newVal)) : { value: "" };
}, { deep: true, immediate: true });

let cityAreaSelectedItem: AreaItem | undefined = undefined; // 当前选中的地址项
let cityAreaFirstItem: AreaItem | undefined = undefined; // 当前提示列表第一项

const cityAreaAutoSearch = (queryString: string, cb: any) => {
	if (!queryString.trim()) {
		cityAreaFirstItem = undefined;
		cb([]);
	} else {
		axios.get(`https://restapi.amap.com/v3/assistant/inputtips`, {params: {
				key: (window as any)._AMapWebServiceKey,
				city: props.searchCity || "全国",
				keywords: queryString.trim(),
			}}).then((res: AMapSearchResponse) => {
			if (res.data?.status === '1') {
				const resultList = res.data.tips
					.filter(e => typeof e.location === 'string' && !Number.isNaN(Number(e.location.split(',')[0])) && !Number.isNaN(Number(e.location.split(',')[1])))// 过滤掉没有经纬度的
					.filter(e => typeof e.address === 'string')
					.map(e => {
						// 将描述和名字中间重复的文字剔除，构建选项列表
						let districtCutIndex = null;
						for (let i = Math.min(e.district.length, e.name.length); i > 0; i--) {
							const suffixText = e.name.substring(0, i);
							if (e.district.endsWith(suffixText)) {
								districtCutIndex = i;
							}
						}
						// console.log(e.district, e.name);
						const valueTmp = districtCutIndex === null ? (e.district + e.name) : (e.district + e.name.substring(districtCutIndex));
						return {
							id: e.id,
							value: valueTmp,
							lng: Number((e.location as string).split(',')[0]),
							lat: Number((e.location as string).split(',')[1]),
						};
					});
				cityAreaFirstItem = resultList[0];
				cb(resultList);
			} else {
				cityAreaFirstItem = undefined;
				cb([])
				console.error('高德地图查询失败 ' + res.data?.info)
			}
		})
	}
};
const emit = defineEmits(["update:modelValue"]);
const cityAreaCompleteSelectHandler = (item: AreaItem) => {
	// 选中提示项时，记录当前选中项，给表单内容赋值
	cityAreaSelectedItem = item;
	placeData.value = cityAreaSelectedItem ? JSON.parse(JSON.stringify(cityAreaSelectedItem)) : { value: "" };
	emit("update:modelValue", placeData.value?.value ? placeData.value : undefined);
};
const cityAreaCompleteBlurHandler = () => {
	// 未选中 失去焦点 自动选择第一个
	if (!cityAreaSelectedItem) {
		cityAreaSelectedItem = cityAreaFirstItem;
	}
	placeData.value = cityAreaSelectedItem ? JSON.parse(JSON.stringify(cityAreaSelectedItem)) : { value: "" };
	emit("update:modelValue", placeData.value?.value ? placeData.value : undefined);
};
const cityAreaCompleteChangeHandler = () => {
	cityAreaSelectedItem = undefined;
};
</script>

<style scoped>

</style>
